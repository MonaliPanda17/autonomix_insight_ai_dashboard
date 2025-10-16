# Environment Variables Setup for Database Integration

## Backend Environment Variables (.env file in backend/ directory)

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Environment
ENVIRONMENT=development

# Frontend URL (for CORS)
FRONTEND_URL=https://autonomix-insight-ai-dashboard.vercel.app

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## How to Get Supabase Credentials:

1. **Go to your Supabase project dashboard**
2. **Settings → API**
3. **Copy these values:**
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

## Render Environment Variables:

Add these to your Render service environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
