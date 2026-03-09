# replit.md

## Overview

This is a video downloader web application that allows users to paste video URLs from various platforms (YouTube, TikTok, etc.), resolve them to direct download links using an external API, and batch download multiple videos as a ZIP file. The app features a modern dark-themed UI with progressive loading states and download history tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and list animations
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **External Integration**: Proxies video resolution through batgpt.vercel.app API
- **File Handling**: Archiver library for creating ZIP downloads

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM (Vercel Postgres for production)
- **Schema**: Single `downloads` table tracking resolution history (originalUrl, title, videoUrl, source, createdAt)
- **Migrations**: Managed via drizzle-kit push command
- **Environment Variables Required**:
  - `DATABASE_URL`: PostgreSQL connection string (automatically provided by Vercel Postgres)

### Key API Endpoints
- `POST /api/resolve` - Resolves a video URL to direct download link via external API
- `POST /api/batch/zip` - Creates a ZIP archive of multiple videos for download
- `GET /api/history` - Retrieves recent download history

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components (shadcn + custom)
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities and query client
│       └── pages/        # Route components
├── server/           # Express backend
│   ├── routes.ts     # API endpoint handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Drizzle connection
└── shared/           # Shared types and schemas
    ├── schema.ts     # Drizzle schema + Zod validators
    └── routes.ts     # API contract definitions
```

## External Dependencies

### Third-Party Services
- **Video Resolution API**: batgpt.vercel.app/api/alldl - External service that resolves video URLs from various platforms to direct download links

### Database
- **Vercel Postgres**: PostgreSQL serverless database integrated with Vercel. The `DATABASE_URL` environment variable is automatically provided when you provision Vercel Postgres in your Vercel project.

### Key Libraries
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect
- **Axios**: HTTP client for external API calls (15s timeout configured)
- **Archiver**: ZIP file creation for batch downloads
- **Zod**: Runtime validation for API requests/responses
- **shadcn/ui**: Pre-built accessible UI components based on Radix primitives