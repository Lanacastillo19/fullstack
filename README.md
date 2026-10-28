[![CI](https://github.com/Lanacastillo19/fullstack/actions/workflows/ci.yml/badge.svg)](https://github.com/Lanacastillo19/fullstack/actions/workflows/ci.yml)

# Course Management - Frontend

A React application built with TypeScript and Vite that connects to a deployed REST API for managing course and subject data.

## Deployment Links
- **Live Frontend:** https://fullstack-hgto.vercel.app
- **Live Backend API:** https://backend-21o5.vercel.app

---

## Features
- **User Authentication:** Login and register forms that securely receive and store JWT bearer tokens.
- **Data Management:** Performs `GET`, `POST`, and `PUT` operations to display and update course items directly from the backend.
- **Responsive UI:** Clean view built with Vite and modern React components.

---

## Tech Stack
- **Framework:** React + Vite
- **Language:** TypeScript
- **Testing:** Vitest + Testing Library
- **CI:** GitHub Actions
- **Deployment:** Vercel

---

## Environment Configuration
Make sure your `.env` file points to the deployed backend server:

```env
VITE_API_URL=https://backend-21o5.vercel.app/api
```

---

## Running Tests
```bash
npm test
```

The suite has three test files:
- `CourseCard` component test: checks the text that changes with the `variant` prop.
- `useToggle` hook test: checks the starting value and that toggling flips it.
- `TaskCoachPage` form test: checks the schema's error message and that no request is sent for a too-short task.

GitHub Actions runs `npm ci`, a type check and the tests on every push.