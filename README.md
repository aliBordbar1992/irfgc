# IRFGC Platform

A scalable, community-driven platform for the Iranian Fighting Game Community with centralized infrastructure and game-specific subdomains.

## 🎯 Project Overview

IRFGC (Iranian Fighting Game Community) Platform aims to unite Iran's FGC with:
- **Centralized Infrastructure**: One platform serving all fighting game communities
- **Game-Specific Subdomains**: Dedicated spaces for each game (mk.irfgc.ir, sf.irfgc.ir, etc.)
- **Tournament Management**: Event creation, registration, and tracking
- **Matchmaking System**: LFG (Looking for Game) functionality
- **Community Features**: News, forums, and discussions
- **Admin Tools**: Content management without coding

## 🏗️ Architecture

### Monorepo Structure
```
irfgc/
├── apps/
│   └── web/                 # Next.js frontend application
├── cms/
│   └── strapi/             # Headless CMS (Strapi)
└── src/
    ├── features/           # Feature-driven modules
    │   ├── auth/          # Authentication & authorization
    │   ├── events/        # Tournament & event management
    │   ├── news/          # News & articles
    │   ├── matchmaking/   # LFG system
    │   ├── forum/         # Community discussions
    │   ├── dashboard/     # Admin & moderator panels
    │   └── games/         # Game routing & context
    ├── components/        # Shared UI components
    ├── lib/              # Utilities & helpers
    ├── types/            # TypeScript type definitions
    └── hooks/            # Custom React hooks
```

### Technology Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **CMS**: Strapi (Headless CMS)
- **State Management**: Jotai
- **Forms**: React Hook Form + Zod validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd irfgc
   ```

2. **Install dependencies**
   ```bash
   cd apps/web
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env.local` file in `apps/web/` with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/irfgc_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Strapi CMS
STRAPI_URL="http://localhost:1337"
STRAPI_API_TOKEN="your-strapi-api-token"

# Game Configuration
SUPPORTED_GAMES="mk,sf,tk,gg,bb,uni"
DEFAULT_GAME="mk"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Discord Integration
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
DISCORD_WEBHOOK_URL="your-discord-webhook-url"

# Deployment
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"
```

## 🎮 Supported Games

The platform supports the following fighting games:
- **MK** - Mortal Kombat
- **SF** - Street Fighter  
- **TK** - Tekken
- **GG** - Guilty Gear
- **BB** - BlazBlue
- **UNI** - Under Night In-Birth

## 🌐 Subdomain Routing

The platform uses wildcard subdomains for game-specific communities:
- `irfgc.ir` - Main hub with game selection
- `mk.irfgc.ir` - Mortal Kombat community
- `sf.irfgc.ir` - Street Fighter community
- `tk.irfgc.ir` - Tekken community
- etc.

## 👥 User Roles

- **Player**: View events, post in LFG, read news, comment in forums
- **Moderator**: Moderate forums, review reports, manage content
- **Admin**: Manage events, users, content across all games

## 🏗️ Development Guidelines

### Code Organization
- Follow **Domain-Driven Design (DDD)** principles
- Use **SOLID** principles for clean, maintainable code
- Organize code by features rather than technical concerns
- Each feature contains its own components, API routes, and hooks

### File Naming Conventions
- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for functions and variables

### TypeScript
- Define types in `src/types/`
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use shadcn/ui components for consistency

## 📋 Feature Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Project setup and monorepo structure
- [x] Next.js app with TypeScript and Tailwind
- [x] Game context and subdomain routing
- [x] Basic UI components and layouts

### Phase 2: Authentication & User Management ✅
- [x] NextAuth.js setup with credentials provider
- [x] User registration and login
- [x] Role-based access control
- [x] User profiles and settings

### Phase 3: Core Features ✅
- [x] Events system (tournaments, casual events)
- [x] News and articles management
- [x] LFG (Looking for Game) system
- [x] Forum with basic moderation

### Phase 4: Admin Dashboard
- [ ] Admin panel for content management
- [ ] User management interface
- [ ] Event creation and management
- [ ] Analytics and reporting

### Phase 5: CMS Integration
- [ ] Strapi CMS setup
- [ ] Content API integration
- [ ] Admin content management
- [ ] Media management

### Phase 6: Advanced Features
- [ ] Discord integration
- [ ] Email notifications
- [ ] Real-time chat
- [ ] Tournament brackets and results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Iranian Fighting Game Community
- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and supporters

---

Built with ❤️ for Iran's FGC 