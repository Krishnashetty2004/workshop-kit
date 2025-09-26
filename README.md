# WorkshopKit - Next.js & Express Migration

This project has been migrated from Vite to Next.js with an Express.js backend server.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenRouter API Configuration
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Express Server Configuration
   PORT=3001
   ```

3. **Run the development servers:**
   ```bash
   # Run both Next.js and Express servers concurrently
   npm run dev:full
   
   # Or run them separately:
   # Next.js frontend (port 3000)
   npm run dev
   
   # Express backend (port 3001)
   npm run server
   ```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── workshop/      # Workshop-related endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
├── server/               # Express.js backend
│   └── index.js          # Express server
├── services/             # API services
├── types/               # TypeScript type definitions
└── next.config.js       # Next.js configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js application
- `npm run start` - Start Next.js production server
- `npm run server` - Start Express backend server
- `npm run dev:full` - Run both servers concurrently
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🌟 Features

- **Next.js 14** with App Router
- **Express.js** backend server
- **TypeScript** support
- **Tailwind CSS** for styling
- **AI-powered workshop generation** via OpenRouter API
- **Responsive design**
- **Component-based architecture**

## 🔌 API Endpoints

### Next.js API Routes
- `POST /api/workshop/generate` - Generate workshop with AI

### Express Backend Routes
- `GET /api/health` - Health check
- `GET /api/workshops` - List workshops
- `GET /api/workshops/:id` - Get workshop details
- `POST /api/workshops/:id/publish` - Publish workshop
- `GET /api/workshops/:id/attendees` - Get workshop attendees
- `POST /api/workshops/:id/register` - Register for workshop
- `GET /api/analytics/overview` - Get analytics data

## 🎨 Styling

The project uses Tailwind CSS with a custom configuration optimized for Next.js. The styling includes:
- Responsive design
- Custom color schemes
- Component-based styling
- Dark/light mode support

## 🚀 Deployment

### Vercel (Recommended for Next.js)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Custom Server
1. Build the application: `npm run build`
2. Start the production server: `npm run start`
3. Run Express server: `npm run server`

## 🔧 Configuration

### Next.js Configuration
- App Router enabled
- Image optimization
- Environment variables
- TypeScript support

### Express Configuration
- CORS enabled
- JSON parsing
- Static file serving
- Error handling

## 📝 Migration Notes

This project was migrated from Vite to Next.js with the following changes:

1. **File Structure**: Moved from `src/` to `app/` directory structure
2. **Routing**: Changed from client-side routing to Next.js App Router
3. **API Routes**: Moved API logic to Next.js API routes and Express backend
4. **Styling**: Updated Tailwind configuration for Next.js
5. **Build Process**: Changed from Vite to Next.js build system
6. **Environment Variables**: Updated for Next.js environment handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
# workshop-kit
