# ProblemFinder AI

Ready-to-deploy public website version.

## Why This Version Exists

Do not put your Gemini or Anthropic API key inside frontend HTML. Visitors can inspect browser code and steal it.

This version keeps the key on the server:

- `index.html` is the public website.
- `api/research.js` is a private serverless API route.
- `GEMINI_API_KEY` is stored as a hosting environment variable.

## Deploy On Vercel

1. Upload or push this `problemfinder-web` folder to a GitHub repository.
2. Import the project in Vercel.
3. Add an environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: your Google AI Studio API key
4. Deploy.

Optional environment variable:

- `GEMINI_MODEL=gemini-2.5-flash`

## Local Testing

Install Vercel CLI:

```bash
npm install -g vercel
```

Create `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
```

Run:

```bash
npm run dev
```

Then open the local URL Vercel prints.
