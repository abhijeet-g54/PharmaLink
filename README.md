# PharmaLink



PharmaLink is a full-stack, microservices-based pharmacy intelligence and vendor management system. It connects users searching for medicines with pharmacies and provides vendors with a dedicated dashboard to manage their inventory.







## Overview



The system has two main user flows:



### 1. User Dashboard

- Search medicines across multiple pharmacies

- View price, stock, manufacturer, and dosage information

- Compare medicines

- Filter results by price, availability, and manufacturer

- View nearby connected pharmacies



### 2. Vendor Dashboard

- Login via IBM App ID

- Automatic pharmacy registration on first login

- Add, update, and delete medicines

- Manage inventory linked to a specific pharmacy (`pharmacyId`)

- Secure vendor-scoped data access







## Architecture



### Frontend

- React (Vite)

- TailwindCSS

- Component-based UI

- Two routes:

&nbsp; - `/` → User dashboard

&nbsp; - `/vendor` → Vendor dashboard



### Backend (Microservices)

- Vendor Service (Authentication + pharmacy management)

- Inventory Service (Medicine CRUD with Cloudant)

- Search Service (Aggregates data across pharmacies)

- Rcommendation Service(Uses IBM Watsonx.ai)



### Database

- IBM Cloudant

&nbsp; - `pharmacies` database

&nbsp; - `medicines` database

- Medicines are linked to pharmacies using `pharmacyId`







## Authentication Flow (Vendor)



1. User clicks **Vendor Login**

2. Redirects to IBM App ID login page

3. After login, App ID returns authorization code

4. Backend exchanges code for access token

5. User email is extracted from token

6. Pharmacy is created automatically if not already present

7. Vendor is redirected to:/vendor?token=<access_token>





## Data Models



### Pharmacy



```json

{

"_id": "1",

"name": "Apollo Pharmacy",

"address": "Connaught Place, Delhi",

"email": "abc@example.com",

"phone": "011-23411001"

}

```

## API Endpoints



### Vendor Service

| Method | Endpoint                 | Description                           |
|--|--||
| GET    | `/login`                 | Redirect to IBM App ID login          |
| GET    | `/callback`              | OAuth callback + pharmacy creation    |
| GET    | `/vendor/inventory`      | Get medicines for logged-in vendor pharmacy |
| POST   | `/vendor/medicine`       | Add medicine to pharmacy inventory    |
| DELETE | `/vendor/medicine/:id`   | Delete medicine from inventory        |







### Inventory Service

- Handles all Cloudant operations for medicines

- Performs CRUD operations on `medicines` database

- Ensures strict scoping using `pharmacyId` for multi-tenant isolation

- Used internally by vendor and search services







### Search Service

- Aggregates medicines across all pharmacies

- Provides unified search results for users

- Returns:

&nbsp; - Search results

&nbsp; - Recommendations

&nbsp; - Trending medicines

&nbsp; - Total connected pharmacies







## Environment Variables



All environment variables are stored in the **root `.env` file** and shared across services via Docker Compose.



```env

# Cloudant

CLOUDANT_URL=

CLOUDANT_USERNAME=

CLOUDANT_PASSWORD=



# IBM App ID

APPID_ISSUER=

APPID_CLIENT_ID=

APPID_CLIENT_SECRET=

APPID_JWKS_URI=

APPID_REDIRECT_URI=



# Ports

PORT=5004



# Watson

WATSONX_API_KEY=

WATSONX_URL=

WATSONX_PROJECT_ID=

```

# Running Locally



The entire system runs using Docker Compose.



## Start All Services



```bash

docker-compose up --build

```

## Services Started



This will start:



- **Frontend (User + Vendor UI)**

- **Vendor Service**

- **Inventory Service**

- **Search Service**

- **Recommendation Service**

- **Analytics Service**



### Frontend Routes



#### User Application

- `/` → Medicine search dashboard (public user view)



#### Vendor Application

- `/vendor` → Vendor inventory dashboard  

- `/vendor?token=...` → Authenticated vendor session (via App ID redirect)



## Key Design Decisions



- Single root `.env` file shared across all services via Docker Compose

- Fully containerized microservices architecture

- Vendor isolation is enforced using `pharmacyId`

- IBM App ID handles authentication (no custom auth system)

- Cloudant used as primary NoSQL database

- Services communicate over internal Docker network

- Frontend supports both user and vendor workflows in one project



## Current Status



- User dashboard: Completed

- Vendor portal: Completed

- Authentication flow (App ID): Working

- Inventory CRUD: Working

- Docker Compose orchestration: Working

- End-to-end integration: Functional locally



## Future Improvements



- Order and checkout system for users

- Prescription validation workflow

- Production cloud deployment

- Real-time inventory updates

- Analytics dashboard for vendors (sales + stock insights)



