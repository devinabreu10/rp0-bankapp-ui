# RP0 Banking Application - UI

A modern banking application UI built with Angular 17.3 that provides a comprehensive interface for banking operations including customer management, account management, and transaction handling.

## Overview

This application serves as the frontend for a banking system that allows users to manage their accounts and transactions through a secure and intuitive interface. The application features authentication, ensuring that only authorized users can access banking operations.

## Features

- **Authentication** - Secure login and signup functionality
- **Customer Management** - View and manage customer information
- **Account Management** - Manage different types of accounts
- **Transaction Handling** - Process and view transaction history
- **Responsive UI** - Modern interface built with PrimeNG and TailwindCSS

## Technology Stack

- **Angular 17.3** - Frontend framework
- **PrimeNG 17.18.0** - UI Component library
- **TailwindCSS 3.4.4** - Utility-first CSS framework
- **SASS 1.77.4** - CSS preprocessor
- **RxJS 7.8.0** - Reactive Extensions Library for JavaScript

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

- `/src/app/core` - Core functionality (auth services, guards)
- `/src/app/features` - Feature modules (customers, accounts, transactions)
- `/src/app/shared` - Shared components, utilities, and models

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployment

The application includes Docker configuration for easy deployment:

- `Dockerfile` - Container build instructions
- `docker-compose.yml` - Multi-container configuration
- `nginx.conf` - Nginx web server configuration for production deployment

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
