# IRFGC Platform

A community-driven platform for the Iranian Fighting Game Community, built with Next.js, Prisma, and PostgreSQL.

## Project Overview

IRFGC is a comprehensive platform that supports multiple fighting games with game-specific subdomains, featuring tournaments, matchmaking (LFG), news, forums, and admin tools.

## Tech Stack

- **Frontend:** Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **UI Components:** Radix UI primitives with custom styling
- **Charts:** Recharts for analytics

## Development Phases

### ✅ Phase 1: Core Infrastructure
- [x] Next.js project setup with TypeScript
- [x] Prisma ORM with PostgreSQL
- [x] Database schema design
- [x] Basic UI components (Button, Card, Input, etc.)
- [x] Game context and routing system

### ✅ Phase 2: Authentication System
- [x] NextAuth.js integration
- [x] User registration and login
- [x] Role-based access control (Player, Moderator, Admin)
- [x] User menu with role-based navigation
- [x] Main navigation component

### ✅ Phase 3: Community Features
- [x] Events system (CRUD operations)
- [x] News management
- [x] LFG (Looking for Group) system
- [x] Forum with threads and replies
- [x] API routes with validation
- [x] Frontend components for all features

### ✅ Phase 4: Admin Dashboard & Moderation
- [x] Enhanced admin dashboard with analytics
- [x] User management system
- [x] Content moderation system
- [x] Report management
- [x] Role-based access control for admin features
- [x] Moderation API routes for forum and LFG posts

### 🚧 Phase 5: Advanced Features (In Progress)
- [ ] Strapi CMS integration
- [ ] Real-time chat system
- [ ] Discord integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Performance optimizations

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd irfgc/apps/web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your database connection and NextAuth configuration.

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Admin dashboard
│   │   └── [gameSlug]/        # Game-specific pages
│   ├── components/            # Reusable UI components
│   ├── features/              # Feature-specific components
│   ├── lib/                   # Utilities and configurations
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

## Features

### For Players
- Browse and register for tournaments
- Find players for casual matches (LFG)
- Read community news
- Participate in forum discussions
- Game-specific subdomains

### For Moderators
- Content moderation tools
- User management
- Report handling
- Forum and LFG post management

### For Admins
- Full platform management
- User role management
- Analytics and statistics
- System configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
