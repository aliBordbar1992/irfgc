# CMS Integration Setup Guide

This guide will help you set up the Strapi CMS integration for the IRFGC platform.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (recommended) or SQLite for development
- IRFGC platform already set up and running

## Step 1: Install Strapi Dependencies

```bash
cd cms/strapi
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `cms/strapi` directory:

```env
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=irfgc_cms
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

# For SQLite (development only)
# DATABASE_CLIENT=sqlite
# DATABASE_FILENAME=.tmp/data.db

# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
ENCRYPTION_KEY=your-encryption-key

# JWT Configuration
JWT_SECRET=your-jwt-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## Step 3: Start Strapi Development Server

```bash
cd cms/strapi
npm run develop
```

This will:
- Start the Strapi server on `http://localhost:1337`
- Open the admin panel setup in your browser
- Create the database tables

## Step 4: Create Admin Account

1. Open `http://localhost:1337/admin` in your browser
2. Fill in the admin account details:
   - First Name: Admin
   - Last Name: User
   - Email: admin@irfgc.ir
   - Password: (choose a strong password)
3. Click "Create account"

## Step 5: Generate API Token

1. In the Strapi admin panel, go to **Settings** > **API Tokens**
2. Click **Create new API Token**
3. Fill in the details:
   - Name: IRFGC Platform Token
   - Description: API token for IRFGC platform integration
   - Token duration: Unlimited
   - Token type: Full access
4. Click **Save**
5. Copy the generated token

## Step 6: Configure Main Application

Add the following environment variables to your main application's `.env.local`:

```env
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-generated-api-token-here
```

## Step 7: Initialize Sample Data

Run the setup script to create sample data:

```bash
cd cms/strapi
node scripts/setup-cms.js
```

This will create:
- Sample games (MK, SF, TK, GG, BB, UNI)
- Sample events
- Sample news posts

## Step 8: Test the Integration

1. Start your main application:
   ```bash
   cd apps/web
   npm run dev
   ```

2. Access the CMS integration:
   - Go to `http://localhost:3000/dashboard`
   - Sign in as an admin user
   - Click on **CMS** in the sidebar
   - Test creating, editing, and deleting content

## Step 9: Content Types Overview

The CMS includes the following content types:

### Games
- **slug**: Unique identifier (mk, sf, tk, etc.)
- **name**: Short name (MK, SF, TK)
- **fullName**: Full name (Mortal Kombat, Street Fighter)
- **description**: Game description
- **imageUrl**: Game image URL
- **isActive**: Whether the game is active
- **discordUrl**: Discord server URL

### Events
- **title**: Event title
- **description**: Rich text description
- **game**: Related game
- **type**: Tournament, Casual, Online, Offline
- **status**: Upcoming, Ongoing, Completed, Cancelled
- **startDate**: Event start date
- **endDate**: Event end date
- **location**: Physical location
- **onlineUrl**: Online event URL
- **maxParticipants**: Maximum participants
- **currentParticipants**: Current participants
- **registrationDeadline**: Registration deadline
- **featured**: Whether the event is featured
- **prizePool**: Prize pool amount
- **rules**: Event rules (rich text)
- **bracket**: Tournament bracket (JSON)

### News Posts
- **title**: News title
- **content**: Rich text content
- **excerpt**: Brief summary
- **game**: Related game
- **featuredImage**: Featured image
- **tags**: Tags (JSON)
- **category**: Announcement, Tournament, Community, Game Update, General
- **featured**: Whether the news is featured
- **allowComments**: Whether comments are allowed
- **seoTitle**: SEO title
- **seoDescription**: SEO description

## Step 10: API Endpoints

The CMS integration provides the following API endpoints:

### Events
- `GET /api/cms/events` - List events
- `POST /api/cms/events` - Create event
- `PUT /api/cms/events/[id]` - Update event
- `DELETE /api/cms/events/[id]` - Delete event

### News Posts
- `GET /api/cms/news` - List news posts
- `POST /api/cms/news` - Create news post
- `PUT /api/cms/news/[id]` - Update news post
- `DELETE /api/cms/news/[id]` - Delete news post

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your database credentials
   - Ensure the database exists
   - For PostgreSQL, make sure the database is running

2. **CORS Error**
   - Update the `CORS_ORIGIN` in Strapi's `.env`
   - Make sure the main app URL is included

3. **API Token Issues**
   - Regenerate the API token if needed
   - Check that the token has the correct permissions
   - Verify the token is correctly set in the main app's environment

4. **Content Types Not Found**
   - Restart Strapi after creating content types
   - Check that the content type schemas are correctly defined

### Development Tips

1. **Hot Reload**: Strapi supports hot reloading during development
2. **Database Reset**: Use `npm run strapi strapi:deploy` to reset the database
3. **Logs**: Check Strapi logs in the terminal for detailed error messages
4. **Admin Panel**: Use the admin panel to manually create and manage content

## Production Deployment

For production deployment:

1. **Build Strapi**:
   ```bash
   cd cms/strapi
   npm run build
   npm run start
   ```

2. **Environment Variables**: Update all environment variables for production
3. **Database**: Use a production PostgreSQL database
4. **SSL**: Enable SSL for database connections
5. **CORS**: Update CORS origins for production domains
6. **API Tokens**: Generate new API tokens for production

## Next Steps

After completing the CMS setup:

1. **Customize Content Types**: Add more fields as needed
2. **Media Management**: Set up media uploads and CDN
3. **Workflows**: Configure content publishing workflows
4. **Permissions**: Set up role-based permissions
5. **API Documentation**: Generate API documentation
6. **Monitoring**: Set up monitoring and logging

## Support

If you encounter issues:

1. Check the Strapi documentation: https://docs.strapi.io/
2. Review the IRFGC platform logs
3. Check the Strapi admin panel for error messages
4. Verify all environment variables are correctly set 