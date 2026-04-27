# IronHaul Heavy Cargo Portal

IronHaul is a Next.js 16 application for heavy cargo operations. It includes a complete authentication flow, a protected shipment dashboard, a real CRUD backed by Prisma ORM, status tracking, client notifications, and downloadable shipment receipt PDFs.

## Stack

- Next.js 16 with the App Router and Route Handlers
- React 19
- Prisma ORM
- PostgreSQL
- Tailwind CSS 4
- JWT access and refresh tokens
- `pdf-lib` for server-generated shipment receipts

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database

## Installation

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your own database connection string and token secrets:

```bash
DATABASE_URL="your_postgres_connection_string"
ACCESS_SECRET="your_access_token_secret"
REFRESH_SECRET="your_refresh_token_secret"
```

4. Generate the Prisma client from the ORM schema:

```bash
npm run db:generate
```

5. Sync the database directly from `prisma/schema.prisma`:

```bash
npm run db:push
```

6. Start the development server:

```bash
npm run dev
```

7. Open the app:

```text
http://localhost:3000
```

## Available scripts

- `npm run dev`: starts the Next.js development server
- `npm run build`: builds the application
- `npm run start`: starts the production server
- `npm run lint`: runs ESLint
- `npm run db:generate`: generates the Prisma client from the schema
- `npm run db:push`: applies the Prisma schema directly to the database
- `npm run db:studio`: opens Prisma Studio

## ORM workflow

This project is schema first.

The source of truth is:

- [prisma/schema.prisma](/home/cohorte5/Documentos/mati/next-auth-repo/prisma/schema.prisma:1)

The recommended database workflow is:

1. Edit the Prisma schema
2. Run `npm run db:generate`
3. Run `npm run db:push`

This keeps the project aligned with the ORM instead of relying on handwritten SQL migration files.

## Environment variables

- `DATABASE_URL`: PostgreSQL connection string used by Prisma
- `ACCESS_SECRET`: secret used to sign short-lived access tokens
- `REFRESH_SECRET`: secret used to sign refresh tokens

## Project structure

- `src/app`: Next.js routes, layouts, and API handlers
- `src/components/auth`: login and register UI
- `src/components/dashboard`: modular dashboard UI, hook, helpers, and receipt download logic
- `src/core`: core entities and repository contracts
- `src/lib`: infrastructure code such as Prisma, JWT helpers, repository implementations, and PDF generation
- `src/services`: business logic and use cases
- `src/types`: shared TypeScript types used by the UI and services

## Authentication flow

### Front end

- [src/components/auth/RegisterForm.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/auth/RegisterForm.tsx:1)
  Creates the account through `/api/auth/register`, then automatically signs the user in through `/api/auth/login`.

- [src/components/auth/LoginForm.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/auth/LoginForm.tsx:1)
  Sends credentials to `/api/auth/login`, stores the signed-in user snapshot and access token in `localStorage`, then redirects to `/dashboard`.

- [src/components/auth/AuthShell.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/auth/AuthShell.tsx:1)
  Shared visual shell for both auth screens.

### API routes

- [src/app/api/auth/register/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/auth/register/route.ts:1)
  Normalizes email and password, validates required fields, and delegates account creation to the auth service.

- [src/app/api/auth/login/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/auth/login/route.ts:1)
  Validates credentials, returns the access token in JSON, and stores the refresh token in an HTTP-only cookie.

- [src/app/api/auth/logout/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/auth/logout/route.ts:1)
  Clears the refresh token cookie.

- [src/app/api/auth/refresh/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/auth/refresh/route.ts:1)
  Reads the refresh token cookie and returns a new access token.

### Auth services

- [src/services/registerUser.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/registerUser.ts:1)
  Checks whether the email already exists, hashes the password, and creates the user with Prisma.

- [src/services/loginUser.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/loginUser.ts:1)
  Loads the user from Prisma, verifies the password hash, and returns both tokens plus a safe user payload.

### Token protection

- [src/proxy.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/proxy.ts:1)
  Protects `/api/shipments` and other private routes. It validates the `Authorization` bearer token and injects `x-user-id` and `x-user-role` into the request headers for downstream handlers.

## Dashboard flow

### Entry route

- [src/app/(dashboard)/dashboard/page.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/(dashboard)/dashboard/page.tsx:1)
  Renders the main dashboard component.

### Main composition

- [src/components/dashboard/ShippingDashboard.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/ShippingDashboard.tsx:1)
  Small composition component that wires together all dashboard sections.

### Dashboard state and behavior

- [src/components/dashboard/useShippingDashboard.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/useShippingDashboard.ts:1)
  This is the main dashboard hook. It:
  - reads the local session snapshot
  - loads the protected shipment payload
  - filters shipments
  - creates and updates shipments
  - changes shipment statuses
  - deletes shipments
  - downloads the receipt PDF
  - redirects to login if the access token is missing or expired

### Dashboard UI modules

- [DashboardHero.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/DashboardHero.tsx:1)
  Displays the main header, KPI cards, and sign-out action.

- [ShipmentFormSection.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/ShipmentFormSection.tsx:1)
  Handles shipment creation and full record updates.

- [ShipmentBoardSection.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/ShipmentBoardSection.tsx:1)
  Displays the CRUD list, search, filters, status selector, and delete/edit/select actions.

- [TrackingSection.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/TrackingSection.tsx:1)
  Shows the lightweight live status stream.

- [NotificationsSection.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/NotificationsSection.tsx:1)
  Shows client notification history generated from backend status changes.

- [ReceiptSection.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/ReceiptSection.tsx:1)
  Displays the selected shipment summary and the button that downloads the PDF.

- [ActivitySection.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/ActivitySection.tsx:1)
  Displays the operations feed created by shipment events.

- [DashboardLoadingState.tsx](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/DashboardLoadingState.tsx:1)
  Shared loading screen shown while the dashboard session is being restored.

### Dashboard helpers

- [dashboard.constants.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/dashboard.constants.ts:1)
  Shared storage keys, default form values, refresh interval, and filters.

- [dashboard.types.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/dashboard.types.ts:1)
  Local dashboard-specific types.

- [dashboard.utils.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/dashboard.utils.ts:1)
  Shared formatting and styling helpers.

## Shipment backend flow

### Protected API routes

- [src/app/api/shipments/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/shipments/route.ts:1)
  `GET` returns the full dashboard payload.
  `POST` creates a shipment.

- [src/app/api/shipments/[id]/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/shipments/[id]/route.ts:1)
  `GET` returns one shipment.
  `PUT` updates a full shipment record.
  `DELETE` removes the shipment.

- [src/app/api/shipments/[id]/status/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/shipments/[id]/status/route.ts:1)
  `PATCH` updates only the shipment status.

- [src/app/api/shipments/[id]/receipt/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/shipments/[id]/receipt/route.ts:1)
  `GET` creates and returns a real PDF receipt for the selected shipment.

### Use cases

- [CreateShipment.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/use-cases/CreateShipment.ts:1)
  Validates the payload, generates a shipment reference, creates the shipment, and writes initial activity.

- [GetShipmentDashboard.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/use-cases/GetShipmentDashboard.ts:1)
  Loads shipments, activity, notifications, and summary for the authenticated user.

- [UpdateShipment.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/use-cases/UpdateShipment.ts:1)
  Updates the shipment and creates activity and notifications if the status changed.

- [UpdateShipmentStatus.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/use-cases/UpdateShipmentStatus.ts:1)
  Dedicated status update flow used by the tracking controls in the dashboard.

- [DeleteShipment.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/use-cases/DeleteShipment.ts:1)
  Removes the shipment for its owner.

- [shipmentUtils.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/services/use-cases/shipmentUtils.ts:1)
  Shared validation, normalization, summary, and message builders used by shipment use cases.

### Repository and database

- [src/core/repositories/IShipmentRepository.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/core/repositories/IShipmentRepository.ts:1)
  Repository contract used by the shipment use cases.

- [src/lib/repositories/PrismaShipmentRepository.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/lib/repositories/PrismaShipmentRepository.ts:1)
  Prisma implementation of the shipment repository.

- [src/lib/db.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/lib/db.ts:1)
  Prisma client setup with pg adapter and development-safe singleton reuse.

## PDF generation flow

- [src/components/dashboard/dashboard-receipt.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/components/dashboard/dashboard-receipt.ts:1)
  Sends the authenticated browser request that downloads the PDF.

- [src/lib/pdf/buildShipmentReceiptPdf.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/lib/pdf/buildShipmentReceiptPdf.ts:1)
  Builds the actual PDF bytes on the server using `pdf-lib`.

- [src/app/api/shipments/[id]/receipt/route.ts](/home/cohorte5/Documentos/mati/next-auth-repo/src/app/api/shipments/[id]/receipt/route.ts:1)
  Reads the authenticated shipment, creates the PDF, and returns it as `application/pdf`.

## Data model

The Prisma schema defines:

- `User`: authenticated dashboard owner
- `Agent`: existing project entity from the original codebase
- `Shipment`: main heavy cargo record
- `ShipmentEvent`: activity feed entries
- `ClientNotification`: notification history shown in the dashboard

## Important implementation notes

- The dashboard stores a small user snapshot and access token in `localStorage` for the client shell.
- Real authorization still happens through JWT validation in `proxy.ts`.
- The shipment CRUD is fully backed by Prisma ORM.
- The receipt is now a real downloadable PDF file, not only a browser print preview.
- The project is organized so auth, API, business rules, repository logic, and UI are separated into clear layers.
# PackagementManager
