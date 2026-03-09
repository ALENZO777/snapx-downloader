# SnapX Downloader

Download videos from YouTube, TikTok, Instagram, and 8+ other platforms with ease. Fast, secure, and free video downloader supporting 11+ social media platforms.

## 🚀 Features

- **Multi-Platform Support**: Download from 11 popular platforms
  - 🎥 YouTube (Shorts only, max 360p)
  - 🎵 TikTok
  - 📸 Instagram (Reels only)
  - 👥 Facebook (Reels only)
  - 🐦 Twitter/X
  - 📱 Reddit
  - 👻 Snapchat
  - 🎧 SoundCloud
  - 🎭 Douyin
  - 🎬 SnackVideo
  - ✂️ CapCut

- **Batch Downloads**: Download multiple videos at once and get them in a ZIP file
- **Modern UI**: Beautiful, responsive interface with glassmorphism and smooth animations
- **Fast & Secure**: Direct processing without storing your content
- **Privacy First**: No data collection, everything processed on-the-fly
- **Download History**: Track your recent downloads during the session

## ⚠️ Important Limitations

- **YouTube**: Shorts only, maximum 360p resolution due to API constraints
- **Instagram & Facebook**: Reels only (no posts with images or carousels)
- **Content Type**: Short-form videos (Reels, Shorts, TikToks) only
- **Copyright**: Users are responsible for ensuring they have rights to download content

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Library**: Radix UI + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Drizzle ORM)
- **Build Tool**: Vite
- **Animations**: Framer Motion

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (optional for download history)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Universal-Video-Saver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/snapx
   NODE_ENV=development
   SESSION_SECRET=your-secret-key-here
   ```

4. **Initialize database (optional)**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL` (if using database)
     - `SESSION_SECRET`
   - Click "Deploy"

3. **Domain Setup**
   - Go to Settings → Domains
   - Add your custom domain

### Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Initialize Railway project**
   ```bash
   railway login
   railway init
   ```

3. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Render

1. **Create account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect your GitHub repo
   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **Add PostgreSQL**
   - Create new PostgreSQL instance
   - Copy connection string to environment variables

4. **Environment Variables**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Random secret key
   - `NODE_ENV`: `production`

## 🧪 Build & Production

### Build for production
```bash
npm run build
```

This creates an optimized bundle in the `dist` directory.

### Run production build
```bash
npm start
```

### Type checking
```bash
npm run check
```

## 📁 Project Structure

```
Universal-Video-Saver/
├── client/              # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
│   └── index.html
├── server/              # Backend Express app
│   ├── db.ts           # Database configuration
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data persistence
├── shared/              # Shared types & schemas
│   ├── routes.ts       # API contracts
│   └── schema.ts       # Zod schemas
└── package.json
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Optional* |
| `SESSION_SECRET` | Secret key for session encryption | Yes |
| `NODE_ENV` | Environment (`development` or `production`) | Yes |

*Database is optional but recommended for download history feature

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ⚖️ Legal Disclaimer

This tool is for downloading videos you have permission to download. Users are responsible for:
- Ensuring they have the right to download and use the content
- Respecting copyright laws and intellectual property rights
- Following the terms of service of each platform

The developers are not responsible for any misuse of this tool.

## 🐛 Issues & Support

If you encounter any issues or have questions:
1. Check existing [GitHub Issues](your-repo/issues)
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- Video processing powered by external APIs
- Built with modern web technologies
- UI components from Radix UI and shadcn/ui

---

Made with ❤️ by SnapX Team
