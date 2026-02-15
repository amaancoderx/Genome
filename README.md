# Genome AI - Enterprise Marketing Intelligence Platform

An AI-powered enterprise command center for strategic decision-making, brand intelligence, and ad optimization.

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

### Ad Intelligence Agent (NEW)
AI-powered competitive ad analysis and creative strategy engine:
- **Competitor Ad Analysis** - Deep analysis of real competitor advertising strategies
- **Instagram Creative Intelligence** - Design patterns, color psychology, typography trends
- **Strategic Positioning & Gap Analysis** - Identify untapped market opportunities
- **Creative Ad Concepts** - AI-generated ad image references with style and platform recommendations
- **Performance Predictions & KPIs** - CTR estimates, engagement projections, A/B test recommendations
- **PDF Report Export** - Downloadable professional intelligence reports with embedded creative references

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
- **AI:** OpenAI GPT-4o (reports) + DALL-E 3 (creative references)
- **Styling:** Tailwind CSS with @tailwindcss/typography
- **UI Components:** shadcn/ui
- **PDF Generation:** jsPDF

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
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_google_cse_id
META_AD_LIBRARY_TOKEN=your_meta_token (optional)
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
│   │   │   ├── ad-intelligence/   # Ad Intelligence Agent
│   │   │   ├── enterprise/        # Enterprise Command Center
│   │   │   ├── chat/              # AI Chat Assistant
│   │   │   ├── genome/            # Brand Genome Analysis
│   │   │   └── settings/          # User Settings
│   │   └── layout.tsx             # Dashboard layout with sidebar
│   ├── api/
│   │   ├── ad-intelligence/       # Ad Intelligence API routes
│   │   ├── enterprise/            # Enterprise API routes
│   │   ├── chat/                  # Chat API routes
│   │   ├── genome/                # Genome analysis routes
│   │   └── stats/                 # Statistics API
│   └── page.tsx                   # Landing page
├── components/
│   └── ui/                        # Reusable UI components
└── lib/
    ├── ad-intelligence-pdf.ts     # PDF report generator
    ├── meta-ad-library.ts         # Meta Ad Library & Google Search integration
    ├── together.ts                # OpenAI/DALL-E utilities
    └── utils.ts                   # Utility functions
```

## License

MIT License

---

Built with by **Code Rebels**
