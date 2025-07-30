# RP0 Banking Platform - UI

RP0 Banking UI is a modern, feature-rich web interface for a comprehensive digital banking platform. Built with Angular 17.3, this frontend enables users to securely manage their banking needs, including customer profiles, account operations, and transaction history, all through an intuitive and responsive user experience.

## Overview

This application serves as the frontend for the RP0 Banking System, providing:
- **Secure authentication** to protect user data and restrict access to authorized users only.
- **Customer management** for viewing and editing customer information.
- **Account management** supporting multiple account types, account creation, and closure.
- **Transaction handling** for deposits, withdrawals, transfers, and detailed transaction history.
- **Modern UI/UX** leveraging PrimeNG and TailwindCSS for a seamless, responsive experience across devices.
- **Extensible architecture** designed for scalability and easy integration with backend services.

## Features

- **Authentication** – Secure login, signup, and session management
- **Customer Management** – View, edit, and manage customer profiles
- **Account Management** – Open, close, and manage various account types
- **Transaction Handling** – Initiate, process, and review transaction history
- **Responsive UI** – Adaptive design using PrimeNG and TailwindCSS
- **Theming** – Light and dark mode support with customizable themes
- **Dockerized Deployment** – Easy setup for local development and production

## Technology Stack

- **Angular 17.3** – Frontend framework
- **PrimeNG 17.18.0** – UI component library
- **TailwindCSS 3.4.4** – Utility-first CSS framework
- **SASS 1.77.4** – CSS preprocessor
- **RxJS 7.8.0** – Reactive programming

## Backend API

This frontend is designed to work seamlessly with the **RP0 Banking API**, which provides all server-side business logic, data persistence, and RESTful endpoints for banking operations. For more details on backend setup and API documentation, visit the [RP0 Banking Backend GitHub repository](https://github.com/devinabreu10/rp0-bankapp-backend).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/devinabreu10/rp0-bankapp-ui.git
   cd rp0-bankapp-ui
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```bash
   npm start
   ```
4. Navigate to `http://localhost:4200/` in your browser

### Docker

The application can also be run using Docker:

```bash
# Build and run using docker-compose
docker-compose up -d
```

## Project Structure

- `/src/app/core` – Core functionality (auth services, guards)
- `/src/app/features` – Feature modules (customers, accounts, transactions)
- `/src/app/shared` – Shared components, utilities, and models

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployment

The application includes Docker configuration for easy deployment:

- `Dockerfile` – Container build instructions
- `docker-compose.yml` – Multi-container configuration
- `nginx.conf` – Nginx web server configuration for production deployment

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
