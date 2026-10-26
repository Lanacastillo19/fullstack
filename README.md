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
- **Deployment:** Vercel

---

## Environment Configuration
Make sure your `.env` file points to the deployed backend server:

```env
VITE_API_URL=[https://backend-21o5.vercel.app/api](https://backend-21o5.vercel.app/api)