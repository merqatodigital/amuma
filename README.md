# AMUMA — Barefoot Boutique Resorts

A circle of intimate boutique retreats in the hidden corners of the Philippines and Southeast Asia.

**Live app**: https://amumapalawan.vercel.app/

## Tech Stack

- TanStack Start (React SSR) + Vite
- Tailwind CSS + shadcn/ui
- Supabase (auth, database, storage)
- Deployed on Vercel

## Development

```sh
git clone <this-repository-url>
cd amuma
bun install
bun run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
