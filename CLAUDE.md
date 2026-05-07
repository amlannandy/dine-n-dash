# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all apps in parallel
pnpm dev

# Run individual apps
pnpm dev:api        # NestJS API on :3000
pnpm dev:partner    # Partner portal on :5173
pnpm dev:client     # Customer app on :5174
pnpm dev:admin      # Admin dashboard on :5175

# Build / type-check all
pnpm build
pnpm type-check

# Scoped commands (replace `api` with partner/client/admin as needed)
pnpm --filter api dev
pnpm --filter api type-check
pnpm --filter api lint
```

Before starting the API, copy `apps/api/.env.example` to `apps/api/.env` and fill in PostgreSQL credentials. Start the database with `docker compose up -d`.

## Architecture

### Workspace layout

```
apps/api        NestJS backend
apps/partner    React — restaurant owner portal
apps/client     React — customer QR-scan → order → bill flow
apps/admin      React — approve restaurants, manage subscriptions
packages/types  Shared TypeScript types (no build step required in dev)
```

### Shared types (`packages/types`)

All domain types live here and are consumed by every app as `@dine-n-dash/types`. The package contains only TypeScript types and interfaces — no JavaScript output is produced. It is resolved directly from source in every app via a `paths` alias in the API's `tsconfig.json` and a `resolve.alias` in each Vite config. No build step is ever needed.

When adding a new domain concept, define the type here first, then implement on both sides. Never duplicate type definitions across apps.

### Key domain flows

1. **Partner onboarding**: register → admin approves (status: `'pending' → 'approved'`) → partner uploads menu and creates tables (each table gets a QR code generated server-side via `qrcode`)
2. **Customer ordering**: scan QR → assigned to table session → browse menu → place order → poll/receive order status updates → view bill → pay
3. **Admin**: lists all restaurants, toggles approval/suspension, views subscription payments

---

## TypeScript

### Strictness

All packages use `strict: true`. Never use `any` — use `unknown` and narrow it, or define the type properly. Avoid non-null assertions (`!`); use `??`, optional chaining, or an explicit guard instead.

```ts
// bad
const name = (user as any).name;
const id = user!.id;

// good
const id = user?.id ?? throwError('user is required');
```

### Union types

All domain status and role fields use string literal unions (e.g. `UserRole`, `OrderStatus`). Never use TypeScript enums — unions have no JS output, produce cleaner compiled code, and are directly assignable from API responses without casting.

```ts
// good
const role: UserRole = 'admin';
if (restaurant.status === 'approved') { ... }

// bad — do not use enums
enum UserRole { ADMIN = 'admin' }
```

### Type narrowing over casting

Use type guards or discriminated unions rather than `as` casts. The order status flow (`OrderStatus`) is a state machine — model transitions with discriminated unions when you need to enforce which fields are present per status.

```ts
function isApproved(r: Restaurant): r is Restaurant & { status: 'approved' } {
  return r.status === 'approved';
}
```

### Dates and money

- Dates are **ISO 8601 strings** in shared types and API responses. TypeORM entities use `Date`; transform at the service boundary before returning.
- Monetary values are stored and transmitted as **integers in the smallest currency unit** (paise for INR, cents for USD). Never use floats for money.

### `satisfies`

Use the `satisfies` operator when constructing objects that must conform to an interface but where you also want TypeScript to infer the narrowest type:

```ts
const plan = {
  basic: { maxTables: 5, price: 49900 },
  pro:   { maxTables: 20, price: 99900 },
} satisfies Record<SubscriptionPlan, { maxTables: number; price: number }>;
```

---

## NestJS (`apps/api`)

### Module structure

Each feature lives in its own directory under `src/` and owns all of its layer files:

```
src/restaurants/
  restaurants.module.ts
  restaurants.controller.ts
  restaurants.service.ts
  restaurant.entity.ts
  dto/
    create-restaurant.dto.ts
    update-restaurant.dto.ts
    restaurant-response.dto.ts
```

Register feature modules in `AppModule`. Never import a service from another module directly — go through that module's exports.

### DTOs vs shared types

Use shared types from `@dine-n-dash/types` only for **response shapes** that the frontend also consumes. Request bodies must use dedicated DTO classes decorated with `class-validator` so the global `ValidationPipe` enforces them. Never return a TypeORM entity directly from a controller — map it to a response DTO or the shared interface first.

```ts
async findOne(@Param('id') id: string): Promise<Restaurant> {
  return this.restaurantsService.findOne(id); // service maps entity → interface
}
```

### Controllers are thin

Controllers handle routing, extract params/body, call one service method, and return. All business logic belongs in the service. Guards and interceptors handle cross-cutting concerns.

### Authentication & authorization

- `JwtAuthGuard` protects endpoints that require a logged-in user
- `RolesGuard` + `@Roles('partner')` enforce role-based access
- Apply guards at the controller class level when all routes share the same requirement; apply at the method level for mixed-access controllers

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('partner')
@Controller('restaurants')
export class RestaurantsController {}
```

### Database

Inject repositories via `@InjectRepository(Entity)`. Keep raw query logic inside the service or a dedicated repository class — never in a controller. Use TypeORM query builder for complex queries rather than chaining find options.

### Config and environment

Access env vars through `ConfigService` injection, never `process.env` in feature code.

```ts
constructor(private config: ConfigService) {}
const secret = this.config.get<string>('JWT_SECRET');
```

### Error handling

Throw NestJS built-in HTTP exceptions (`NotFoundException`, `ForbiddenException`, `ConflictException`, etc.) from the service layer. Never throw generic `Error` objects for expected failure cases.

### Swagger

Annotate every controller method with `@ApiOperation({ summary: '...' })` and `@ApiResponse` decorators. Use `@ApiBearerAuth()` on protected controllers. Docs are served at `/api/docs`.

---

## React (partner / client / admin)

### Folder structure

Each app follows:

```
src/
  pages/       Route-level components (one file per route)
  components/  Reusable UI pieces with no routing or data-fetching logic
  hooks/       Custom hooks — all data fetching and side-effect logic lives here
  api/         Axios call functions, one file per domain (e.g. orders.ts, menu.ts)
  context/     React context — only for auth state and global session
```

### Data fetching

Never call the API directly from a component. Always go through a custom hook in `src/hooks/`. The hook owns loading/error state and the data shape that the page renders.

```ts
export function useMenu(restaurantId: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ...
  return { items, loading, error };
}
```

### API client

Create a shared Axios instance at `src/api/axios.ts` per app with:
- `baseURL` of `/api`
- A request interceptor that attaches the JWT `Authorization` header from stored tokens
- A response interceptor that handles 401 by triggering a token refresh or redirecting to login

All domain API files import from this instance, not from `axios` directly.

### Route protection

Wrap protected routes in a `<ProtectedRoute>` component that reads from auth context and redirects to `/login` if the user is not authenticated. Preserve the intended path in `state` so login can return the user after success.

### Forms

Use controlled inputs. Keep form state local to the page/component with `useState` or `useReducer`. Only lift state to context when two unrelated branches of the tree need the same value.

### TypeScript in components

Type all props explicitly. Use the shared types from `@dine-n-dash/types` directly for data shapes; don't re-declare them locally.

```ts
interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}
```

### Route params

Always type `useParams()` and treat values as potentially undefined:

```ts
const { tableId } = useParams<{ tableId: string }>();
```

---

## Deployment

### Infrastructure

| Service | Platform | Trigger |
|---------|----------|---------|
| API (`apps/api`) | Railway (Docker) | Push to `main` |
| Partner app | Vercel (static) | Push to `main` |
| Client app | Vercel (static) | Push to `main` |
| Admin app | Vercel (static) | Push to `main` |
| PostgreSQL | Railway managed | — |

### GitHub Actions workflows

- **`ci.yml`** — runs on every push and PR to `main`: type-checks and builds all packages
- **`deploy.yml`** — runs on push to `main`: builds all frontends once, then deploys API to Railway and each frontend to Vercel in parallel

### Required GitHub secrets and variables

Add these in **Settings → Secrets and variables → Actions**:

| Name | Kind | How to get |
|------|------|------------|
| `RAILWAY_TOKEN` | Secret | Railway dashboard → Account → Tokens |
| `RAILWAY_SERVICE_ID` | Variable | Railway project → Service → Settings → Service ID |
| `VERCEL_TOKEN` | Secret | Vercel dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Secret | `vercel whoami --json` or Vercel team settings |
| `VERCEL_PROJECT_ID_PARTNER` | Secret | Vercel project settings → Project ID |
| `VERCEL_PROJECT_ID_CLIENT` | Secret | Vercel project settings → Project ID |
| `VERCEL_PROJECT_ID_ADMIN` | Secret | Vercel project settings → Project ID |

### Vercel project setup (one-time per frontend)

Each frontend needs its own Vercel project configured as a static site:
- Framework: **Other**
- Build command: *(empty — GitHub Actions builds it)*
- Output directory: `.`

### Railway project setup (one-time)

Connect the GitHub repo in the Railway dashboard. Railway will use the `Dockerfile` at the repo root to build the API service. Set all env vars from `apps/api/.env.example` in the Railway service's environment settings.
