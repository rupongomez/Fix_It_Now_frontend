# FixItNow — API Integration Map

This document maps the frontend components/pages of the **FixItNow** Next.js frontend to the backend API endpoints they consume. All requests are made from Server Actions using the `BACKEND_API_URL` environment variable. Authenticated requests pass the `accessToken` (JWT) stored in an httpOnly cookie via the `Authorization` header.

---

## 🧭 Base URL

```
BACKEND_API_URL=https://<your-backend-domain>
```

---

## 🔐 Authentication

| Frontend Component                    | Action / Service                                     | Method | Endpoint                  | Auth   |
| ------------------------------------- | ---------------------------------------------------- | ------ | ------------------------- | ------ |
| `/auth/login` — `LoginForm.tsx`       | `LoginAction` (`_auth/authActions.ts`)               | `POST` | `/api/auth/login`         | No     |
| `/auth/register` — `RegisterForm.tsx` | `RegisterAction` (`_auth/authActions.ts`)            | `POST` | `/api/users/register`     | No     |
| Token refresh (middleware)            | `getNewAccessToken` (`service/getNewAccessToken.ts`) | `POST` | `/api/auth/refresh-token` | Cookie |
| Global layout / Navbar / Sidebar      | `getMe` (`service/getMe.ts`)                         | `GET`  | `/api/users/me`           | Bearer |

---

## 🏠 Public — Services & Technicians

| Frontend Component                    | Action                                                    | Method | Endpoint                    | Auth   |
| ------------------------------------- | --------------------------------------------------------- | ------ | --------------------------- | ------ |
| `/` Home (featured grid)              | (static demo data)                                        | –      | –                           | No     |
| `/services` — `ServiceGrid.tsx`       | `getServices` (`serverActions.ts`)                        | `GET`  | `/api/services`             | No     |
| `/services/details/[id]`              | `getServiceDetails` (`serviceDetailsAction.ts`)           | `GET`  | `/api/services/details/:id` | Bearer |
| `/technicians` — `TechnicianGrid.tsx` | `getTechnicians` (`serverActions.ts`)                     | `GET`  | `/api/technician`           | No     |
| `/technicians/offered-services/[id]`  | `getServicesOfferedByThisTechnician` (`serverActions.ts`) | `GET`  | `/api/services/:userId`     | No     |

---

## 📅 Availability

| Frontend Component               | Action                                            | Method | Endpoint                          | Auth   |
| -------------------------------- | ------------------------------------------------- | ------ | --------------------------------- | ------ |
| `BookingModal.tsx` (slot picker) | `getAvailability` (`_actions/getAvailability.ts`) | `GET`  | `/api/availability/:technicianId` | No     |
| Technician Availability page     | `getAvailability` (`availabilityActions.ts`)      | `GET`  | `/api/availability/:technicianId` | No     |
| Technician Availability page     | `createAvailability` (`availabilityActions.ts`)   | `POST` | `/api/availability`               | Bearer |

---

## 📦 Bookings

| Frontend Component                                       | Action                                                               | Method  | Endpoint                         | Auth   |
| -------------------------------------------------------- | -------------------------------------------------------------------- | ------- | -------------------------------- | ------ |
| `BookingModal.tsx` (submit)                              | `makeBookingRequest` (`bookingAction.ts`)                            | `POST`  | `/api/booking`                   | Bearer |
| `/services/check-out/[id]`                               | `getBookingDetails` (`bookingAction.ts`)                             | `GET`   | `/api/booking/details/:id`       | Bearer |
| Customer Dashboard / Bookings                            | `getLoggedInCustomersBookings` (`customerBookingActions.ts`)         | `GET`   | `/api/booking`                   | Bearer |
| Customer Booking Cancel                                  | `cancelBooking` (`cancelBooking.ts`)                                 | `PATCH` | `/api/booking/update-status/:id` | Bearer |
| Technician Bookings                                      | `getBookingsForTechnician` (`bookingDetailsForTechnician.ts`)        | `GET`   | `/api/technician/bookings`       | Bearer |
| Technician status update (Accept/Decline/Start/Complete) | `updateBookingStatusByTechnician` (`bookingDetailsForTechnician.ts`) | `PATCH` | `/api/technician/booking/:id`    | Bearer |

---

## 💳 Payments

| Frontend Component                       | Action                                                           | Method | Endpoint                 | Auth   |
| ---------------------------------------- | ---------------------------------------------------------------- | ------ | ------------------------ | ------ |
| Pay Now / Checkout — `checkoutService`   | `checkoutService` (`checkoutAction.ts`)                          | `POST` | `/api/payments/checkout` | Bearer |
| Existing booking check (service details) | `getLoggedInCustomersBooking` (`getLoggedinCustomersBooking.ts`) | `GET`  | `/api/payments/checkout` | Bearer |
| Customer Dashboard payment lookup        | `getPaymentHistoryForCustomer` (`checkoutAction.ts`)             | `GET`  | `/api/booking`           | Bearer |
| `/dashboard/customer/payment-history`    | `getAllPaymentHistoryForCustomer` (`checkoutAction.ts`)          | `GET`  | `/api/payments/history`  | Bearer |
| `/paid` (success/cancel)                 | (reads `?success=true\|false` URL param)                         | –      | –                        | –      |

---

## ⭐ Reviews

| Frontend Component                 | Action                                       | Method | Endpoint                  | Auth   |
| ---------------------------------- | -------------------------------------------- | ------ | ------------------------- | ------ |
| `ReviewModal.tsx` (submit)         | `submitReview` (`reviewActions.ts`)          | `POST` | `/api/reviews`            | Bearer |
| `ReviewModal.tsx` (check existing) | `getReviewsForCustomer` (`reviewActions.ts`) | `GET`  | `/api/reviews/:bookingId` | No     |

---

## 🛠️ Technician Profile

| Frontend Component            | Action                                                    | Method | Endpoint                         | Auth   |
| ----------------------------- | --------------------------------------------------------- | ------ | -------------------------------- | ------ |
| Technician Profile page       | `getTechnicianProfileById` (`technicianProfileAction.ts`) | `GET`  | `/api/technician/profile/:id`    | Bearer |
| `EditProfileModal.tsx` (save) | `updateTechnicianProfile` (`technicianProfileAction.ts`)  | `PUT`  | `/api/technician/update-profile` | Bearer |

---

## 🛡️ Admin

| Frontend Component                       | Action                                 | Method  | Endpoint                                    | Auth   |
| ---------------------------------------- | -------------------------------------- | ------- | ------------------------------------------- | ------ |
| Admin Dashboard (stats)                  | `getAllBookings` (`adminActions.ts`)   | `GET`   | `/api/admin/bookings`                       | Bearer |
| Admin Dashboard (user count)             | `getAllUsers` (`adminActions.ts`)      | `GET`   | `/api/admin/users`                          | Bearer |
| `UseresTable.tsx` (list/search/paginate) | `getAllUsers` (`adminActions.ts`)      | `GET`   | `/api/admin/users?searchTerm=&page=&limit=` | Bearer |
| `UseresTable.tsx` (Ban/Unban)            | `updateUserStatus` (`adminActions.ts`) | `PATCH` | `/api/admin/users/:id`                      | Bearer |
| `/dashboard/admin/categories`            | `getCategories` (`adminActions.ts`)    | `GET`   | `/api/admin/categories`                     | Bearer |
| `/dashboard/admin/categories` (create)   | `createCategory` (`adminActions.ts`)   | `POST`  | `/api/admin/categories`                     | Bearer |

---

## 🔁 Route Protection (Middleware)

File: `proxy.ts` (Next.js Middleware)

- Auth routes: `/login`, `/register` (redirect logged-in users to their dashboard by role)
- Protected routes: `/profile`, `/dashboard`, `/bookings`, `/payments` (redirect to `/login` if no token)
- Role-based access control:
  - `/dashboard/admin` → `ADMIN` only
  - `/dashboard/technician` → `TECHNICIAN` only
  - `/dashboard/customer` → `CUSTOMER` only
- Silent token refresh: if `accessToken` is expired but `refreshToken` is valid, a new access token is fetched and set as a cookie.

---

## 🔑 Environment Variables

| Variable             | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `BACKEND_API_URL`    | Base URL of the backend API                |
| `JWT_ACCESS_SECRET`  | Secret to verify access JWTs (middleware)  |
| `JWT_REFRESH_SECRET` | Secret to verify refresh JWTs (middleware) |
