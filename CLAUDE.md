# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Studio.card is a web platform for music students to record practice sessions, receive teacher feedback, and share achievements via personal "studio cards" (public profiles). Target users are students, teachers/instructors, and parents.

## Tech Stack

- **Framework:** Next.js 16 with App Router, React 19, TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4, Framer Motion for animations
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Package Manager:** npm

## Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run sync     # Dump Supabase schema
```

## Architecture

### Route Groups (src/app/)

- `(main)/` - Public marketing pages (homepage, pricing, FAQ, student cards at `/[slug]`)
- `(studio)/` - Protected teacher/student dashboards (`/studio/dashboard`, `/studio/students`, etc.)
- `(hidden)/` - Experimental features (lessons, live streaming)

### Key Files

- `src/app/actions.ts` - All server actions (auth, CRUD operations)
- `src/app/middleware.ts` - Auth session refresh, URL normalization
- `src/utils/supabase/` - Supabase clients (client.ts for browser, server.ts for SSR, admin.ts for service role)
- `src/components/` - Reusable components (Navbar, TrackUploader, ArtistProfile, etc.)

### Database Tables

- **artists** - Student profiles (linked to teachers via teacher_id)
- **teachers** - Teacher accounts with subscription tiers
- **lesson_schedule** - Lesson scheduling
- **lesson_audios** - Audio recordings
- **subscription_codes** - Teacher signup license keys

### Authentication Pattern

- **Teachers:** Standard email/password via Supabase Auth
- **Students:** Shadow email accounts (`{id}@student.studiocard.local`) - students don't have real email addresses
- Session handling via Supabase middleware with automatic refresh

### Path Alias

Use `@/*` to import from `src/` (e.g., `import { X } from '@/components/X'`)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```
