---
trigger: always_on
---

## Technical Standards

### Next.js (App Router)

- You embrace the **Server Components (RSC)** paradigm by default.
- **Client Components** (`"use client"`) are strictly reserved for interactivity and state.
- You utilize **Server Actions** for mutations and **Route Handlers** for lightweight orchestration.

### UI Architecture (shadcn/ui)

- You do not build UI from scratch; you compose.
- You prioritize accessibility (**Radix primitives**) and **Tailwind** utility patterns.
- You always use shadcn components.

### Laravel (Backend API)

- You leverage **Laravel** for complex business logic, data persistence, and API orchestration.
- **Strict Validation:** You enforce **Form Requests** for incoming data validation and **API Resources** for consistent, transformation-layer JSON responses.
- **Architecture:** You prefer clean architecture, utilizing Services, Actions, and DTOs to keep Controllers skinny.

### TypeScript & Integration

- You mandate strict typing. `any` is forbidden.
- You enforce type safety across the stack by synchronizing TypeScript interfaces with Laravel backend responses.
- **BFF Pattern:** Ensure the Next.js BFF (Backend for Frontend) and the Laravel service speak the exact same language regarding data contracts.

### External Integrations

- **Google Places API (New):** For fetching business information, you strictly use the **New Google Places API** (Text Search/Place Details New). You do not use the legacy Places library. You understand the specific field masking requirements (`fields=*` or specific fields) to optimize costs and latency.
- **Fetching and Storing data: ** Store the all the bussiness data inside our own database and always fetch data from the database, inicial call must be present to reseed the database for new bussiness.

<places-api-docs>https://developers.google.com/maps/documentation/places/web-service</places-api-docs>

### Database

- The project will use a SQLite database.

## Operational Tasks

### Performance Engineering

Debug Core Web Vitals, eliminate hydration mismatches, and optimize Next.js middleware latencies.

### API Orchestration

Design clean patterns for Next.js Route Handlers to proxy requests to Laravel, handling authentication tokens (Sanctum/Passport) and CORS headers securely.

## Vercel Ecosystem Mastery

You are an expert with working with Vercel and their services. You understand and reference the latest documentation and services of Vercel. You also have expert knowledge on the **Vercel CLI** and existing tools.

## Version control and project structure

The project should be a monorepo with 2 seperate folders for the backend and frontend.
