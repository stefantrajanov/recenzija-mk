# Recenzija.mk

**Recenzija.mk** is a modern full-stack web application designed for discovering and reviewing local businesses in Macedonia. The platform aggregates rich data from the Google Places API and provides a seamless, internationalized user experience for searching, filtering, and leaving reviews.

The project is structured as a monorepo consisting of a sleek **Next.js** frontend and a robust **Laravel 12** backend API.

---

## Tech Stack

### Frontend

- **Framework**: Next.js (App Router, Turbopack enabled)
- **Styling**: Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/) components
- **Internationalization**: `next-intl` (English `en` & Macedonian `mk`)
- **Data Fetching**: Native `fetch` utilizing Next.js Server Components and caching

### Backend

- **Framework**: Laravel 12
- **Database**: SQLite (Zero configuration needed)
- **External API**: Google Places API (New)

---

## Project Structure

- `/frontend` — The Next.js client application
- `/backend` — The Laravel REST API and database seeding logic

---

## Features

- **Search & Filtering**: Effortlessly browse businesses by name, category, or rating.
- **Pagination**: Navigate cleanly through hundreds of businesses.
- **Google Places Integration**: The database is seeded intelligently with rich datasets from Google Places, importing realistic businesses including photos, locations, and descriptions.
- **Dynamic Review System**: Users can leave 1-5 star ratings and comments. Submissions instantly recalculate business averages and update the UI in real-time.
- **Fully Localized**: Seamlessly switch between English (EN) and Macedonian (MK) with URL-based routing (`/en` vs `/mk`).
- **Modern UI**: Polished, responsive design leveraging Tailwind CSS and Radix UI primitives.

---

## Backend API Endpoints

### Businesses

- `GET /api/businesses`
  - Fetches a paginated list of businesses.
  - **Query Params**: `q` (search string), `category` (category slug), `sort` (rating|reviews|name), `page`, `per_page`.
- `GET /api/businesses/{id}`
  - Fetches detailed information for a specific business.
- `GET /api/businesses/nearby`
  - Fetches businesses near specific geographic coordinates (`lat`, `lng`, `radius`).

### Categories

- `GET /api/categories`
  - Returns a list of all defined categories.
- `GET /api/categories/{slug}`
  - Returns metadata for a specific category.

### Reviews

- `GET /api/businesses/{id}/reviews`
  - Returns all reviews submitted for a target business.
- `POST /api/businesses/{id}/reviews`
  - Submits a new review. Triggers auto-recalculation of the business's overall rating.
  - **Required JSON Body**: `author_name` (string), `rating` (1-5), `comment` (string).

---

## Frontend Pages

- **Home (`/`)**: Showcases quick category navigation links and highlights "Top Rated" businesses.
- **Explore (`/explore`)**: A comprehensive directory of all businesses. Includes a search bar, category dropdowns, sorting options, and full pagination handling.
- **Category View (`/category/[slug]`)**: Dedicated landing pages for browsing businesses belonging exclusively to a chosen category.
- **Business Details (`/business/[id]`)**: Deep-dive into a specific business. Showcases hero imagery loaded directly from Google Places, operating statuses, user reviews, and an interactive review submission form.
