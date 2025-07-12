# IRFGC Platform Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env.local` file in the `apps/web/` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/irfgc_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Game Configuration
SUPPORTED_GAMES="mk,sf,tk,gg,bb,uni"
DEFAULT_GAME="mk"
```

### 3. Set up Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Demo Credentials

After seeding the database, you can use these demo accounts:

- **Admin**: admin@irfgc.ir / admin123
- **Moderator**: moderator@irfgc.ir / mod123
- **Player**: player@irfgc.ir / player123

## Features Implemented

### ✅ Authentication & User Management
- User registration and login
- Role-based access control (Player, Moderator, Admin)
- User profiles and settings
- Session management

### ✅ Events System
- Create and manage events (tournaments, casual, online, offline)
- Event registration system
- Event status management
- Participant tracking

### ✅ Game-Specific Routing
- Dynamic game context
- Game-specific pages and navigation
- Subdomain support (planned)

### ✅ UI Components
- Modern, responsive design with Tailwind CSS
- shadcn/ui components
- User menu with role-based navigation
- Event cards and forms

## Next Steps

1. **News System**: Implement news articles and announcements
2. **LFG System**: Looking for Game matchmaking
3. **Forum**: Community discussions and moderation
4. **Admin Dashboard**: Enhanced admin tools
5. **CMS Integration**: Strapi headless CMS setup

## Development Guidelines

- Follow Domain-Driven Design (DDD) principles
- Use SOLID principles for clean, maintainable code
- Organize code by features rather than technical concerns
- Use TypeScript for type safety
- Follow the established file naming conventions 