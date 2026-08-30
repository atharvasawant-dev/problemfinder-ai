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

## Overview

problemfinder-ai is a HTML repository focused on practical, maintainable project work.

## Setup

```bash
npm install
```


## Tech Stack

- Primary language: HTML
- Node.js package scripts and dependency management

## Usage

Use the repository-specific entry point documented in the source files.


## Architecture

The repository should keep implementation files, documentation, examples, and validation scripts in predictable locations.

## Validation

Run the repository-specific validation steps before merging changes.

## Maintenance

Last documentation review: 2026-08-13. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-18. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-20. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-21. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-22. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-23. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-24. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-25. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-26. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-27. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-28. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-29. Keep this README aligned with the current setup, usage, and repository structure.

## Maintenance

Last documentation review: 2026-08-30. Keep this README aligned with the current setup, usage, and repository structure.
