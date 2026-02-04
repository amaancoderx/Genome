# Genome AI - Enterprise Marketing Intelligence Platform

An AI-powered enterprise command center for strategic decision-making and brand intelligence.

## Team

**Team Name:** Code Rebels

## Features

### Enterprise Command Center (CORE)
Execute strategic decisions with 6 specialized AI agents:
- **Sales Agent** - Revenue optimization and sales strategy
- **Marketing Agent** - Campaign planning and brand positioning
- **Finance Agent** - Budget allocation and ROI analysis
- **Operations Agent** - Process optimization and efficiency
- **Support Agent** - Customer experience and satisfaction
- **HR Agent** - Talent management and culture development

### AI-Guided Company Profile
Set up your company profile with AI assistance for personalized strategic recommendations.

### Brand Genome Analysis
Analyze your brand DNA and get strategic insights based on your company's unique characteristics.

### Strategy Task Management
Track and manage tasks from executed strategies with progress monitoring.

### AI Brand Assistant
Get instant marketing advice and content ideas through conversational AI.

### Approval Workflows
Review and approve strategic recommendations before execution with confirmation dialogs.

## Tech Stack

- **Framework:** Next.js 16.1.6 with App Router
- **Language:** TypeScript
- **Authentication:** Clerk (@clerk/nextjs v6.37.1)
- **Database:** Supabase
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/genome.git
cd genome
```

2. Install dependencies:
```bash
cd genome-nextjs
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3003](http://localhost:3003) in your browser.

## Project Structure

```
genome-nextjs/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── enterprise/      # Enterprise Command Center
│   │   │   ├── chat/            # AI Chat Assistant
│   │   │   ├── genome/          # Brand Genome Analysis
│   │   │   └── settings/        # User Settings
│   │   └── layout.tsx           # Dashboard layout with sidebar
│   ├── api/
│   │   ├── enterprise/          # Enterprise API routes
│   │   ├── chat/                # Chat API routes
│   │   ├── genome/              # Genome analysis routes
│   │   └── stats/               # Statistics API
│   └── page.tsx                 # Landing page
├── components/
│   └── ui/                      # Reusable UI components
└── lib/
    └── utils.ts                 # Utility functions
```

## License

MIT License

---

Built with by **Code Rebels**
