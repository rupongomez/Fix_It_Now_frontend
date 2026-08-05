# FixItNow — Frontend

FixItNow is a modern, responsive Next.js frontend for a home services marketplace. Customers can browse services and technicians, book qualified professionals for specific time slots, pay online, track their bookings, and leave reviews. Technicians can manage their profile, availability, and incoming bookings. Admins can moderate the platform through a comprehensive dashboard.

This project is built with the Next.js App Router and TypeScript, and consumes a backend REST API. It is a frontend-only application.

---

## Tech Stack

| Layer              | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Framework          | Next.js (App Router)                                         |
| Language           | TypeScript                                                   |
| Styling            | Tailwind CSS with shadcn/ui components                       |
| Forms & Validation | react-hook-form, zod                                         |
| Data Fetching      | Native fetch with Next.js Server/Client Components           |
| Notifications      | sonner (toast)                                               |
| Charts             | recharts                                                     |
| Auth               | Custom JWT middleware with silent token refresh              |
| Payments           | Stripe Checkout (redirect via backend-generated payment URL) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A running backend API (your own from a previous assignment)

### Environment Variables

Create a `.env` file in the project root with the following:

```env
BACKEND_API_URL=https://your-backend-api.com
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

### Run the development server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available scripts

```bash
npm run dev        # Start the development server
npm run build      # Build the application for production
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
npm run format     # Format the codebase with Prettier
```

---

## Project Structure

```
app/
  (authGroup)/          # Login and registration
  (publicGroup)/        # Public pages (home, services, technicians, checkout, payment)
  (dashboardGroup)/     # Role-based dashboards (customer, technician, admin)
  layout.tsx            # Root layout with navbar and toast provider
  not-found.tsx         # 404 page
components/
  ui/                   # shadcn/ui components
  shared/               # Navbar and Footer
lib/
  types/                # Shared TypeScript types
service/
  getMe.ts              # Fetch current authenticated user
  getNewAccessToken.ts  # Refresh access token
  logout.ts             # Logout
  utils/jwt.ts          # JWT verification utilities
proxy.ts                # Next.js middleware (auth + role protection)
```

---

## Routes

### Public Routes

| Route                                | Description                                                       |
| ------------------------------------ | ----------------------------------------------------------------- |
| `/`                                  | Home page with hero, featured services, and top-rated technicians |
| `/services`                          | Browse and filter the full list of services                       |
| `/services/details/[id]`             | Service detail page with booking CTA                              |
| `/services/check-out/[id]`           | Checkout page for a booking (payment initiation)                  |
| `/technicians`                       | Browse and filter technicians                                     |
| `/technicians/offered-services/[id]` | Services offered by a specific technician (profile view)          |
| `/paid`                              | Payment outcome page (success / cancel based on URL params)       |
| `/profile`                           | Authenticated user profile                                        |
| `/login`                             | Login form                                                        |
| `/register`                          | Registration form with role selection                             |

### Customer Dashboard

| Route                                 | Description                                                    |
| ------------------------------------- | -------------------------------------------------------------- |
| `/dashboard/customer`                 | Customer overview with booking history and stats               |
| `/dashboard/customer/bookings`        | Booking history with status badges, cancel, and review actions |
| `/dashboard/customer/payment-history` | Payment history table                                          |

### Technician Dashboard

| Route                                 | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `/dashboard/technician`               | Overview with earnings, upcoming jobs, and pending requests  |
| `/dashboard/technician/availability`  | Interactive availability scheduler                           |
| `/dashboard/technician/bookings/[id]` | Manage a specific booking (accept, decline, start, complete) |
| `/dashboard/technician/profile/[id]`  | View and edit technician profile and services                |

### Admin Dashboard

| Route                         | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| `/dashboard/admin`            | Global platform overview (users, bookings, revenue) |
| `/dashboard/admin/categories` | View and create service categories                  |
| `/dashboard/admin`            | User management (search, pagination, ban/unban)     |

---

## Features

### Public

- Responsive service grid and technician grid with ratings, prices, and availability.
- Advanced filters for location, service type, rating, price range, and sorting, with a debounced search bar.
- Technician profile pages with bio, skills, reviews, and availability.
- Loading skeletons and graceful error states with retry actions.

### Customer

- Registration with role selection and login with validation.
- Booking flow with an interactive time-slot picker showing available and booked slots.
- Payment checkout that redirects to Stripe Checkout, with dedicated success and cancel pages.
- Customer dashboard with booking history, status badges, cancel booking, payment history, and review submission.

### Technician

- Protected dashboard with earnings, upcoming jobs, and pending requests.
- Profile and services editing (bio, experience, hourly rate, location, skills).
- Interactive availability scheduler to set working hours and block slots.
- Booking management with accept, decline, start, and complete actions.

### Admin

- Global platform health overview.
- User management table with search, pagination, and ban/unban actions.
- Service category management (view and create).

---

## Authentication & Route Protection

The application uses a custom JWT middleware (`proxy.ts`). It verifies the access token, silently refreshes it via the refresh token when expired, and enforces role-based access:

- Only customers can access `/dashboard/customer/*`.
- Only technicians can access `/dashboard/technician/*`.
- Only admins can access `/dashboard/admin/*`.
- Unauthenticated users are redirected to `/login`.
- Already-authenticated users are redirected away from `/login` and `/register` to their role-specific dashboard.

---

## Booking Status

| Status      | Meaning                                         |
| ----------- | ----------------------------------------------- |
| REQUESTED   | Booking created, awaiting technician acceptance |
| ACCEPTED    | Accepted by technician, customer can pay        |
| DECLINED    | Declined by technician                          |
| PAID        | Paid, technician can start the job              |
| IN_PROGRESS | Job in progress                                 |
| COMPLETED   | Job completed, customer can leave a review      |
| CANCELLED   | Booking cancelled                               |

---

## API Integration

This frontend consumes the backend REST API. The complete mapping of frontend components and server actions to backend endpoints is documented in `API_INTEGRATION.md`.

---

## License

This project is for educational purposes as part of an assignment.
