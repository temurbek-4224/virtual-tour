# 🌍 Virtual Travel Platform

A premium, production-ready multilingual virtual travel web application built as a graduation project. Explore famous places around the world — with special focus on Uzbekistan's legendary Silk Road cities — through beautiful images, immersive virtual tours, embedded maps, and rich cultural descriptions.

## ✨ Features

- **Premium Dark Navy Design** — Travel-tech aesthetic with glassmorphism effects
- **Multilingual** — Full support for English, Russian, and Uzbek
- **Virtual Tours** — Embedded YouTube virtual tour videos
- **Interactive Maps** — Google Maps embeds for each place
- **Image Galleries** — Beautiful multi-image galleries per destination
- **Google OAuth** — Secure sign-in with Google account
- **Role-Based Access** — USER and ADMIN roles
- **Admin Panel** — Full CRUD for countries, cities, and places
- **Responsive** — Works beautifully on mobile, tablet, and desktop

## 🗺 Pre-loaded Destinations

### 🇺🇿 Uzbekistan
- **Samarkand** — Registan Square, Gur-e-Amir Mausoleum, Shah-i-Zinda
- **Bukhara** — Kalon Minaret & Mosque, Ark Fortress
- **Khiva** — Itchan Kala (Walled City)
- **Tashkent** — Chorsu Bazaar

### 🇮🇹 Italy
- **Rome** — Colosseum, Vatican City, Trevi Fountain

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js v4 (Google OAuth) |
| i18n | next-intl v3 |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud, e.g., Supabase, Neon)
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone <repo-url>
cd virtual-travel-platform
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/virtual_travel_db"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# From Google Cloud Console
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Your Google email — will be auto-promoted to ADMIN on first login
ADMIN_EMAIL="your-email@gmail.com"
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized Redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** to `.env`

### 4. Set Up the Database

```bash
# Run migrations (creates tables)
npm run db:migrate

# Or use push for development (no migration files)
npm run db:push
```

### 5. Seed Demo Data

```bash
npm run db:seed
```

This seeds:
- Uzbekistan with Samarkand, Bukhara, Khiva, and Tashkent
- Italy with Rome
- Famous places under each city with descriptions, images, and videos
- Sets your `ADMIN_EMAIL` user to ADMIN role

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 👑 Admin Access

### How Admin Access Works

1. **Sign in with Google** using the email you set as `ADMIN_EMAIL` in `.env`
2. The system automatically promotes this email to ADMIN role:
   - On first login (via `events.createUser` in NextAuth)
   - When running `npm run db:seed`
3. Admins see an **Admin Panel** link in the navbar
4. Admin panel is at `/en/admin` (or `/ru/admin`, `/uz/admin`)

### Promoting Additional Admins

In the admin panel → **Users** page → click **Make Admin** next to any user.

Or directly via the API:
```bash
# Using prisma studio
npm run db:studio
# Then update the user's role field to ADMIN
```

### Admin Panel Features

| Section | Actions |
|---------|---------|
| Dashboard | Stats overview, recent users |
| Users | View all, promote/demote to admin |
| Countries | Add, Edit, Delete (with translations) |
| Cities | Add, Edit, Delete (with translations) |
| Places | Add, Edit, Delete (with translations) |

## 🌐 Multilingual (i18n)

The app supports **English**, **Russian**, and **Uzbek**.

- **UI labels** are in `messages/en.json`, `messages/ru.json`, `messages/uz.json`
- **Content translations** are stored in the database per locale (PlaceTranslation, CityTranslation, CountryTranslation)
- The **language switcher** in the navbar switches all UI text and content instantly

### URL Structure

```
/en/destinations          → English
/ru/destinations          → Russian
/uz/destinations          → Uzbek
/en/countries/uzbekistan/samarkand/registan-square-samarkand
```

## 📁 Project Structure

```
virtual-travel-platform/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API
│   │   └── admin/                   # Admin CRUD APIs
│   └── [locale]/                    # Locale-based routing
│       ├── page.tsx                 # Home page
│       ├── destinations/            # All destinations
│       ├── countries/               # Country → City → Place
│       └── admin/                   # Admin panel
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── admin/                       # Admin-specific components
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── language-switcher.tsx
├── i18n/
│   ├── routing.ts                   # Locale definitions
│   ├── request.ts                   # Server-side i18n
│   └── navigation.ts                # i18n navigation helpers
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   └── auth.ts                      # NextAuth configuration
├── messages/
│   ├── en.json                      # English translations
│   ├── ru.json                      # Russian translations
│   └── uz.json                      # Uzbek translations
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Seed script
├── middleware.ts                    # Route protection + locale routing
└── .env.example                     # Environment variables template
```

## 🗄 Database Schema

```
User          → has Accounts, Sessions
Country       → has Cities, CountryTranslations
City          → belongs to Country, has Places, CityTranslations
Place         → belongs to City, has PlaceTranslations, PlaceImages, PlaceVideos
PlaceTranslation → locale + title + short/full description
PlaceImage    → URL + caption + sort order
PlaceVideo    → YouTube video ID + title
```

## 🔒 Security

- All admin API routes check for ADMIN role via NextAuth session
- Middleware protects `/admin` routes before rendering
- Google OAuth is the only authentication method (no password vulnerabilities)
- Sessions stored as signed JWT tokens
- CSRF protection via NextAuth built-in mechanisms

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to DB (no migration files)
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio (GUI)
npm run db:reset     # Reset DB and reseed
```

## 🌟 Graduation Project Notes

This project demonstrates:
- **Full-Stack Architecture** — API routes + server components + client components
- **Internationalization** — Three-language support with proper routing
- **Authentication & Authorization** — OAuth + role-based access
- **Database Design** — Normalized schema with proper relations
- **Modern React Patterns** — Server components, data fetching, suspense
- **Production-Ready Code** — Error handling, type safety, proper structure

---

Made with ❤️ for a graduation project in full-stack web development.
