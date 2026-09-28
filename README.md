# HanielStores Authentication UI

This is my React authentication UI assignment for SmartHub IT Center.

The project contains the main authentication pages:

* Login
* Register
* Forgot Password
* OTP Verification
* Reset Password
* Dashboard
* 404 Page

## Technologies Used

* React
* React Router
* Bootstrap
* CSS
* Vite

## Running the Project

First install the dependencies:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Build

To create a production build:

```bash
npm run build
```

You can also check the build locally with:

```bash
npm run preview
```

## Backend

This project is connected to a real API. `src/services/authService.js` sends actual requests to the endpoints below — nothing is simulated anymore.

Before running the project, create a `.env` file in the root (copy `.env.example`) and set the API URL:

```text
VITE_API_BASE_URL=https://task-79s6.onrender.com
```

Endpoints used:

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/forgot-password`
* `POST /api/auth/verify-email`
* `POST /api/auth/reset-password`

These are `POST` endpoints, so visiting them directly in a browser tab will show an "Endpoint does not exist" error — that's expected, not a bug. To test one manually, send a `POST` request with a JSON body using Postman (or similar), for example:

```text
POST https://task-79s6.onrender.com/api/auth/forgot-password
Body (JSON): { "email": "you@example.com" }
```

## Known issue

The forgot-password flow currently does not deliver the reset email, even though the API responds with success and a `resetToken`. This is a backend/email-delivery issue, not something the frontend code controls.
