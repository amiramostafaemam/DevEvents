# 🎯 DevEvent - Developer Events Management Platform

<div align="center">

![DevEvent Banner](https://raw.githubusercontent.com/amiramostafaemam/DevEvents/main/public/assets/images/banner.png)

**A modern, full-stack event management platform built for the developer community**

[Live Demo](https://deveventsplatform.vercel.app) • [Report Bug](https://github.com/amiramostafaemam/DevEvents/issues) • [Request Feature](https://github.com/amiramostafaemam/DevEvents/issues)

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🚀 About The Project

**DevEvent** is a comprehensive event management platform designed specifically for the developer community. It solves the problem of fragmented event discovery by providing a centralized hub where developers can discover, create, and book spots for tech events including hackathons, meetups, conferences, and workshops.

### 🎯 The Problem

- Developers waste hours searching for relevant tech events across multiple platforms
- Event organizers struggle with complex management systems
- No centralized platform exists for developer-specific events
- Lack of quality control leads to spam and low-quality event listings

### ✅ The Solution

DevEvent provides:
- **Single Platform**: All developer events in one place
- **Smart Discovery**: Find events based on location, date, and interests
- **Easy Management**: Simple event creation and booking system
- **Quality Control**: Admin moderation ensures high-quality content
- **Real-time Analytics**: Track engagement and bookings

---

## ✨ Features

### 🌐 User Features

- **📅 Event Discovery**
  - Browse all upcoming developer events
  - Filter by location, date, and event type
  - Search functionality for quick access
  - Featured events carousel on homepage

- **✍️ Event Creation**
  - Comprehensive event creation form with validation
  - Image upload with automatic compression (80% size reduction)
  - Date and time pickers with timezone support
  - Event mode selection (Online/Offline/Hybrid)
  - Tag system for categorization
  - Agenda/timeline builder
  - Target audience specification
  - Organizer information section

- **📄 Event Details**
  - Rich event information display
  - Event banner with optimized images
  - Detailed description and overview
  - Event metadata (date, time, location, mode)
  - Agenda timeline visualization
  - Organizer contact information
  - Similar events recommendations
  - Real-time booking counts

- **🎫 Registration System**
  - One-click event booking
  - Email-based registration (no account required)
  - Duplicate booking prevention
  - Real-time booking confirmations
  - Social proof display ("X people booked")

### 👨‍💼 Admin Features

- **📊 Statistics Dashboard**
  - Total events count
  - Active (upcoming) events
  - Past events analytics
  - Total bookings across all events
  - Real-time metrics updates

- **✅ Content Moderation**
  - View all pending event submissions
  - Preview event details before approval
  - One-click approve/reject workflow
  - Real-time UI updates after actions
  - Dual-collection architecture (PendingEvent → Event)

- **🗂️ Event Management**
  - Comprehensive event management table
  - Search by title or location
  - Pagination (7 events per page)
  - Event thumbnails and quick info
  - Booking counts per event
  - Status indicators (Active/Past)
  - Full CRUD operations (Create, Edit, Delete)
  - Cascade deletion (removes associated bookings)

- **🔒 Secure Authentication**
  - Cookie-based admin authentication
  - Hidden access (triple-click logo to reveal)
  - 7-day session management
  - HTTP-only secure cookies

### ⚡ Technical Features

- **Performance Optimization**
  - Route-level caching with Next.js cacheLife
  - Image optimization pipeline (Cloudinary + Next.js)
  - Database query optimization with indexes
  - Progressive loading with Suspense
  - Code splitting and tree shaking

- **Data Validation**
  - Client-side validation with Zod schemas
  - Server-side validation with Mongoose
  - React Hook Form integration
  - Real-time error feedback

- **Analytics Integration**
  - PostHog analytics for user tracking
  - Event interaction monitoring
  - Booking conversion tracking
  - User behavior insights

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[Zod](https://zod.dev/)** - Schema validation
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API
- **[Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)** - Server mutations
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM

### Services
- **[Cloudinary](https://cloudinary.com/)** - Image hosting and optimization
- **[PostHog](https://posthog.com/)** - Product analytics

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vercel** - Deployment platform

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **MongoDB** database (local or Atlas)
- **Cloudinary** account
- **PostHog** account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amiramostafaemam/DevEvents.git
   cd DevEvents
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Admin Access
   ADMIN_ACCESS_CODE=your_secure_admin_code

   # PostHog (Optional)
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🗄️ Database Setup

The application will automatically create the necessary collections on first run. No manual setup required!

**Collections:**
- `events` - Approved events
- `pendingevents` - Events awaiting approval
- `bookings` - Event registrations

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ Yes |
| `ADMIN_ACCESS_CODE` | Admin authentication code | ✅ Yes |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key | ❌ Optional |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL | ❌ Optional |
| `NEXT_PUBLIC_APP_URL` | Application base URL | ✅ Yes |

---

## 📁 Project Structure

```
DevEvents/
├── app/                          # Next.js App Router
│   ├── (root)/                  # Root layout group
│   │   ├── page.tsx            # Homepage
│   │   └── layout.tsx          # Root layout
│   ├── admin/                   # Admin routes
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── events/             # Event management
│   │   └── pending/            # Pending events
│   ├── api/                     # API routes
│   │   ├── events/             # Event CRUD endpoints
│   │   ├── bookings/           # Booking endpoints
│   │   └── admin/              # Admin endpoints
│   ├── events/                  # Public event pages
│   │   ├── [slug]/             # Event detail page
│   │   └── create/             # Event creation
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # React components
│   ├── admin/                  # Admin components
│   │   ├── StatsCard.tsx
│   │   ├── EventsTable.tsx
│   │   └── PendingEvents.tsx
│   ├── shared/                 # Shared components
│   │   ├── EventCard.tsx
│   │   ├── BookingForm.tsx
│   │   └── Navbar.tsx
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       └── ...
├── database/                    # Database models
│   ├── models/
│   │   ├── event.model.ts
│   │   ├── pendingEvent.model.ts
│   │   └── booking.model.ts
│   └── index.ts                # Database connection
├── lib/                         # Utilities
│   ├── actions/                # Server actions
│   │   ├── event.actions.ts
│   │   ├── admin.actions.ts
│   │   └── booking.actions.ts
│   ├── validation.ts           # Zod schemas
│   ├── utils.ts                # Helper functions
│   └── constants.ts            # Constants
├── types/                       # TypeScript types
│   └── index.d.ts
├── public/                      # Static assets
│   ├── assets/
│   │   ├── images/
│   │   │   └── banner.png      # README banner
│   │   └── screenshots/        # Project screenshots
│   │       ├── homepage.png
│   │       ├── create-event.png
│   │       ├── event-details.png
│   │       ├── admin-dashboard.png
│   │       └── not-found.png
│   └── favicon.ico
├── .env.local                   # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## 🔌 API Routes

### Events

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all approved events | ❌ No |
| GET | `/api/events/[id]` | Get single event by ID | ❌ No |
| POST | `/api/events` | Create new event (pending) | ❌ No |
| PUT | `/api/events/[id]` | Update event | ✅ Yes (Admin) |
| DELETE | `/api/events/[id]` | Delete event | ✅ Yes (Admin) |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create booking | ❌ No |
| GET | `/api/bookings/[eventId]` | Get event bookings | ✅ Yes (Admin) |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/pending` | Get pending events | ✅ Yes |
| POST | `/api/admin/approve/[id]` | Approve event | ✅ Yes |
| DELETE | `/api/admin/reject/[id]` | Reject event | ✅ Yes |
| GET | `/api/admin/stats` | Get statistics | ✅ Yes |

---

## 📸 Screenshots

### Homepage
![Homepage](https://raw.githubusercontent.com/amiramostafaemam/DevEvents/main/public/assets/screenshots/homepage.png)

### Event Creation Form
![Event Creation](https://raw.githubusercontent.com/amiramostafaemam/DevEvents/main/public/assets/screenshots/create-event.png)

### Event Details Page
![Event Details](https://raw.githubusercontent.com/amiramostafaemam/DevEvents/main/public/assets/screenshots/event-details.png)

### Admin Dashboard
![Admin Dashboard](https://raw.githubusercontent.com/amiramostafaemam/DevEvents/main/public/assets/screenshots/admin-dashboard.png)

### 404 Not Found Page
![Not Found](https://raw.githubusercontent.com/amiramostafaemam/DevEvents/main/public/assets/screenshots/not-found.png)

---

## 🎨 Key Features Explained

### 🖼️ Image Optimization Pipeline

1. **Client-Side Compression**: Images compressed using Canvas API before upload (80% size reduction)
2. **Cloudinary Upload**: Compressed images uploaded to Cloudinary
3. **Automatic Transformation**: Cloudinary applies format optimization (WebP/AVIF)
4. **CDN Delivery**: Images served via global CDN for fast loading
5. **Next.js Optimization**: Next.js Image component provides responsive images

### 🔄 Content Moderation Workflow

1. User submits event via creation form
2. Event stored in `PendingEvent` collection
3. Admin views pending events in dashboard
4. Admin previews event details
5. Admin approves → Event migrated to `Event` collection
6. Admin rejects → Event deleted from `PendingEvent`
7. Real-time UI updates after action

### 📊 Booking System

- **One-Click Registration**: Users book with just email
- **Duplicate Prevention**: Compound unique index (email + eventId)
- **Real-Time Counts**: Booking counts updated instantly
- **Cascade Deletion**: Bookings deleted when event is removed
- **Email Validation**: Client and server-side validation

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Click "Deploy"

3. **Configure Environment**
   - Add all environment variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

### Alternative Deployment Options

- **Netlify**: Follow [Next.js on Netlify guide](https://docs.netlify.com/integrations/frameworks/next-js/)
- **Railway**: One-click deployment with [Railway](https://railway.app/)
- **Docker**: Build and deploy with Docker containers

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Amira Mostafa - [@amiramostafaemam](https://github.com/amiramostafaemam)

Project Link: [https://github.com/amiramostafaemam/DevEvents](https://github.com/amiramostafaemam/DevEvents)

Live Demo: [https://deveventsplatform.vercel.app](https://deveventsplatform.vercel.app)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)

---

## 📈 Roadmap

- [ ] User authentication system
- [ ] Email notifications for bookings
- [ ] Advanced search and filtering
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Social sharing features
- [ ] Event categories and tags filtering
- [ ] Multi-language support
- [ ] Event ratings and reviews
- [ ] Organizer profiles
- [ ] Event analytics dashboard

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Amira Mostafa](https://github.com/amiramostafaemam)

[Back to Top](#-devevent---developer-events-management-platform)

</div>
