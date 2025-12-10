# Lendsqr Frontend Engineering Assessment

This is my solution for the Lendsqr Frontend Engineering Assessment - a user management dashboard application built with React, TypeScript, and SCSS. The application demonstrates proficiency in frontend development, visual fidelity, code quality, and best practices.

## Table of contents

-   [Overview](#overview)
    -   [The challenge](#the-challenge)
    -   [Screenshot](#screenshot)
    -   [Links](#links)
    -   [Built with](#built-with)
-   [Getting Started](#getting-started)


## Overview

### The challenge

This assessment required building a complete user management dashboard application based on the provided Figma design. The requirements included:

#### Pages to Build

-   **Login Page**: Authentication page with form validation
-   **Dashboard Page**: Main dashboard displaying users in a table format with summary statistics
-   **User Details Page**: Comprehensive view of individual user information



### Screenshot

![](./screenshot.png)


### Links

-   Solution URL: [https://github.com/ellacmd/lendsqr-fe-test](https://github.com/ellacmd/lendsqr-fe-test)
-   Live Site URL: [https://lendsqr-assessment-gilt.vercel.app/](https://lendsqr-assessment-gilt.vercel.app/)
-   Figma Design: [Figma Design Link](https://www.figma.com/design/ZKILoCoIoy1IESdBpq3GNC/Lendsqr-Frontend-Engineering-Assessment?node-id=5530-0&p=f&t=niNeMuVwwCm1H4L0-0)
- Loom: [https://www.loom.com/share/144652385c94417097e6aff1e93486a5](https://www.loom.com/share/144652385c94417097e6aff1e93486a5)



#### Core Technologies

-   **React 19.2.0** - JavaScript library for building user interfaces
-   **TypeScript** - Compulsory language for type safety and better developer experience
-   **Vite 7.2.4** - Next-generation frontend build tool for fast development
-   **React Router DOM 7.10.0** - For client-side routing and navigation
-   **Sass/SCSS** - Required CSS preprocessor for styling (as per assessment requirements)

#### Development Tools

-   **Vitest** - Fast unit test framework
-   **Testing Library** - For component testing with positive and negative scenarios
-   **ESLint** - Code linting and quality assurance

#### Data & API Tools

-   **[npoint.io](https://www.npoint.io/)** - Mock API service for hosting the 500 user records
-   **[Tonic Fabricate](https://www.tonic.ai/products/fabricate)** - AI-powered synthetic data generation tool used to create realistic user data





## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [https://github.com/ellacmd/lendsqr-fe-test.git]
cd lendsqr-fe-test
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint
-   `npm run test` - Run tests
-   `npm run test:ui` - Run tests with UI
-   `npm run test:coverage` - Run tests with coverage report

### Project Structure

```
src/
├── api/              # API integration (users.api.ts)
├── assets/           # Images, icons, fonts
├── components/       # Reusable components
│   ├── common/       # Shared components (Spinner, etc.)
│   └── dashboard/    # Dashboard-specific components
│       ├── actions-dropdown/
│       ├── empty-state/
│       ├── filter-dropdown/
│       ├── pagination/
│       ├── summary-card/
│       ├── user-status/
│       └── user-table/
├── layouts/          # Layout components
│   ├── header/
│   ├── main-layout/
│   └── sidebar/
├── pages/            # Page components
│   ├── dashboard/
│   ├── login/
│   └── user-details/
├── styles/           # Global styles and variables
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (storage.ts)
└── test/             # Test setup and utilities
```

### API Configuration

The application uses [npoint.io](https://www.npoint.io/) for the mock API. The API endpoint is configured in `src/api/users.api.ts`:

```typescript
const API_URL = 'https://api.npoint.io/4bd9188d63a90399d13e';
```

The API returns 500 user records that are mapped to the application's user profile structure.


