# Application Specification: Business Review Platform

## 1. Project Overview
A responsive web application that serves as a business discovery and review platform. The application aggregates business data via the Google Places API and stores it in a database. It also enriches it with a user-generated review system.

## 2. Functional Requirements

### 2.1 Search & Discovery
* **Search Criteria:** Users must be able to search for businesses by:
    * Business Name
    * Category (e.g., Restaurant, Cafe, Service)
    * Location (Geo-coordinates or City/Neighborhood)
* **Sorting Logic:** Results must be sortable by:
    * **Rating:** (Highest to Lowest)
    * **Distance:** (Proximity to user location)
    * **Price Level:** (If available from API)

### 2.2 Review System
* **Rating:** 1-5 star rating system.
* **Comments:** Text-based feedback attached to ratings.
* **Persistence:** Reviews are stored in the application database and associated with the Google Place ID.

### 2.3 Data Integration
* **Source of Truth:** Google Places API (New) is used to fetch business metadata (Name, Address, Price Level, Categories), this data is fetched and stored in a database. (only once or manually in the future to add new businesses)
* **Hybrid Data Model:**
    * *External Data:* Business details are fetched from the Google Places API and stored in the database. The data is never fetched directly from the API.
    * *Internal Data:* User reviews and ratings linked to the external `place_id`.

## 3. UI/UX Guidelines
* **Design Philosophy:** Minimalist, "Clean" aesthetic.
* **Components:** Modern UI library (shadcn/ui, Tailwind CSS) to ensure consistency.
* **Responsiveness:** Mobile-first design pattern ensuring full functionality on all device sizes.
* **Performance:** UI should handle loading states gracefully while fetching external API data.

## 4. Authentication & Authorization
* **Authentication:** Users must be authenticated to leave reviews.
* **Authorization:** Users must be authorized to leave reviews.
* **Implementation:** Authentication must not be complicated for this application, the most simplest approach possible must be implemented.