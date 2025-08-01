# Poké Playbook 🐾

A modern, full-stack Pokédex application with team management features built using TypeScript, React, and NestJS.

## 🌟 Features

- **Interactive Pokédex**: Browse and search through all Pokémon with detailed information, stats, and evolution chains
- **Team Management**: Create, edit, and manage your Pokémon teams with up to 6 Pokémon per team
- **User Authentication**: Secure user registration and login with Supabase authentication
- **Advanced Filtering**: Filter Pokémon by type, generation, and other criteria
- **Responsive Design**: Optimized for desktop and mobile devices with Tailwind CSS and DaisyUI
- **Real-time Updates**: Live data synchronization for team management
- **Type Safety**: End-to-end TypeScript coverage with Zod validation

## 🏗️ Architecture

This project is built as a Turborepo monorepo with the following structure:

### Apps
- **`apps/web`**: React frontend using Vite, TanStack Router, TanStack Query, and Supabase auth
- **`apps/api`**: NestJS backend API with Swagger documentation

### Packages
- **`packages/api-client`**: TypeScript client for the API, auto-generated from OpenAPI spec
- **`packages/pokeapi-client`**: Custom client for PokeAPI, generated from OpenAPI spec
- **`packages/database`**: Shared database logic, schema, and types
- **`packages/libs`**: Shared utilities and helper functions
- **`packages/eslint-config`**: Shared ESLint configurations
- **`packages/typescript-config`**: Shared TypeScript configurations

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 10

### Installation

1. Clone the repository:
```bash
git clone https://github.com/seanyasno/poké-playbook.git
cd poké-playbook
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - For full functionality with authentication, you'll need Supabase credentials
   - The app gracefully handles missing configuration by showing setup instructions
   - See the Authentication section below for detailed setup

4. Start the development servers:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3100
- API Documentation: http://localhost:3100/api-json

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start all apps in development mode
npm run build        # Build all apps for production
npm run lint         # Lint all code
npm run format       # Format all files with Prettier

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode

# Docker
npm run docker:build # Build Docker containers
npm run docker:up    # Start containers
npm run docker:down  # Stop containers
```

### Working with Individual Apps

```bash
# Web app only
turbo dev --filter=web
turbo build --filter=web
cd apps/web && npm run test

# API only
turbo dev --filter=api
turbo build --filter=api
cd apps/api && npm run test
```

## 🔐 Authentication Setup

The application uses Supabase for authentication. To enable full functionality:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Create a `.env` file in `apps/web/`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these credentials, the app will show setup instructions and operate in a limited mode.

## 🧪 Testing

### Frontend Testing
```bash
cd apps/web
npm run test         # Unit tests with Vitest
npm run test:watch   # Watch mode
npm run e2e          # Cypress E2E tests (headless)
npm run e2e:open     # Cypress E2E tests (interactive)
```

### Backend Testing
```bash
cd apps/api
npm run test         # Unit tests with Jest
npm run test:watch   # Watch mode
npm run test:e2e     # End-to-end tests
```

## 📚 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TanStack Router** for file-based routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** with DaisyUI components
- **Cypress** for E2E testing
- **Vitest** for unit testing

### Backend
- **NestJS** with TypeScript
- **Swagger/OpenAPI** for API documentation
- **Passport JWT** for authentication
- **Class Validator** and **Zod** for validation
- **Jest** for testing

### Tools & Infrastructure
- **Turborepo** for monorepo management
- **TypeScript** in strict mode
- **ESLint** and **Prettier** for code quality
- **Husky** and **lint-staged** for pre-commit hooks
- **Docker** support included

## 🎨 Code Generation

The project uses OpenAPI for type-safe API communication:

```bash
# Generate API client (run API server first)
cd apps/api && npm run codegen
```

This generates TypeScript types and client code from the NestJS Swagger documentation.

## 🐳 Docker Support

Build and run with Docker:

```bash
npm run docker:build
npm run docker:up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and ensure tests pass
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing comprehensive Pokémon data
- [Supabase](https://supabase.com/) for authentication and backend services
- The amazing open-source community for the tools and libraries used in this project

---

Built with ❤️ by [Sean Yasno](https://seanyasno.com)
EOF < /dev/null