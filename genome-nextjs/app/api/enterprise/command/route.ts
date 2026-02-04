import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateJSON } from '@/lib/together'
import { supabaseAdmin } from '@/lib/supabase'

interface CompanyProfile {
  companyName: string
  industry: string
  companyType: string
  description: string
  products: string[]
  customerSegments: string[]
  annualRevenue: string
  employeeCount: string
  operationalCosts: string
  marketingBudget: string
  salesBudget: string
  goals: string[]
  challenges: string[]
  competitors: string[]
  riskTolerance: 'low' | 'medium' | 'high'
}

const buildOrchestrationPrompt = (profile: CompanyProfile | null, agents: string[]) => {
  const companyContext = profile ? `
COMPANY CONTEXT:
- Company: ${profile.companyName || 'Enterprise Company'}
- Industry: ${profile.industry}
- Type: ${profile.companyType || 'Not specified'}
- Description: ${profile.description || 'Not provided'}
- Products/Services: ${profile.products.length > 0 ? profile.products.join(', ') : 'Not specified'}
- Customer Segments: ${profile.customerSegments.length > 0 ? profile.customerSegments.join(', ') : 'Not specified'}
- Annual Revenue: ${profile.annualRevenue || 'Not disclosed'}
- Employee Count: ${profile.employeeCount || 'Not specified'}
- Operational Costs: ${profile.operationalCosts || 'Not specified'}
- Marketing Budget: ${profile.marketingBudget || 'Not specified'}
- Sales Budget: ${profile.salesBudget || 'Not specified'}
- Business Goals: ${profile.goals.length > 0 ? profile.goals.join('; ') : 'Not specified'}
- Current Challenges: ${profile.challenges.length > 0 ? profile.challenges.join('; ') : 'Not specified'}
- Competitors: ${profile.competitors.length > 0 ? profile.competitors.join(', ') : 'Not specified'}
- Risk Tolerance: ${profile.riskTolerance.toUpperCase()}
` : `
COMPANY CONTEXT:
No company profile configured. Generate generic enterprise responses.
`

  const agentInstructions = `
ACTIVE AGENTS (only generate responses for these):
${agents.map(a => `- ${a}`).join('\n')}

Agent definitions:
- sales: Sales Agent - Pipeline, leads, pricing, sales enablement
- marketing: Marketing Agent - Campaigns, messaging, channels, attribution
- finance: Finance Agent - Budgets, forecasts, ROI, scenarios
- operations: Operations Agent - Processes, SLAs, capacity, workflows
- support: Customer Support Agent - Tickets, complaints, churn, CX
- hr: HR Agent - Hiring, workforce, performance, compliance
`

  return `You are a CEO Orchestration AI for an enterprise. You receive strategic prompts from the CEO and coordinate responses from functional agents.

${companyContext}

${agentInstructions}

Given the CEO's strategic objective, generate THREE strategy options (Conservative/Safe, Balanced, Aggressive) and a comprehensive enterprise response.

STEP 1: Parse the CEO's objective into structured goals:
- Target KPI (what metric to improve)
- Target Value (specific number/percentage)
- Constraints (limitations or conditions)
- Timeframe (when to achieve)
- Risk tolerance level

STEP 2: Generate THREE strategy approaches:
1. CONSERVATIVE (Safe): Lower risk, slower timeline, more certain outcomes
2. BALANCED: Moderate risk, reasonable timeline, good expected outcomes
3. AGGRESSIVE: Higher risk, faster timeline, potentially higher rewards

STEP 3: For the SELECTED strategy (based on company's risk tolerance), provide detailed agent plans.

Each agent response should include:
- plan: Specific execution plan (2-3 sentences) tailored to company context
- kpis: 3 measurable KPIs with specific targets
- budget: Budget allocation/impact with dollar figures
- risks: 1-2 key risks specific to this strategy
- dependencies: 1-2 cross-functional dependencies

Return JSON in this exact format:
{
  "parsedObjective": {
    "targetKPI": "Metric name",
    "targetValue": "8% improvement",
    "constraints": ["Constraint 1", "Constraint 2"],
    "timeframe": "Q1 2024",
    "riskLevel": "medium"
  },
  "strategyOptions": [
    {
      "type": "conservative",
      "name": "Safe Approach",
      "summary": "Brief description of conservative strategy...",
      "expectedOutcome": "5% improvement",
      "timeline": "9 months",
      "budgetRange": "$2M - $3M",
      "riskLevel": "Low",
      "confidence": "90%"
    },
    {
      "type": "balanced",
      "name": "Balanced Approach",
      "summary": "Brief description of balanced strategy...",
      "expectedOutcome": "8% improvement",
      "timeline": "6 months",
      "budgetRange": "$4M - $6M",
      "riskLevel": "Medium",
      "confidence": "75%"
    },
    {
      "type": "aggressive",
      "name": "Growth Push",
      "summary": "Brief description of aggressive strategy...",
      "expectedOutcome": "12% improvement",
      "timeline": "4 months",
      "budgetRange": "$8M - $12M",
      "riskLevel": "High",
      "confidence": "55%"
    }
  ],
  "selectedStrategy": "balanced",
  "strategicSummary": "Overall strategic approach based on company context and selected strategy...",
  "tradeOffs": ["Trade-off 1", "Trade-off 2", "Trade-off 3"],
  "agents": [
    {
      "agent": "sales",
      "status": "complete",
      "plan": "Specific sales plan tailored to company...",
      "kpis": ["KPI 1 with target", "KPI 2 with target", "KPI 3 with target"],
      "budget": "$X allocation",
      "risks": ["Risk 1"],
      "dependencies": ["Depends on marketing"]
    }
  ],
  "totalBudgetImpact": "$X.XM",
  "headcountImpact": "+X FTEs",
  "timeline": "X months",
  "overallRisks": ["Enterprise risk 1", "Enterprise risk 2", "Enterprise risk 3"],
  "measurementPlan": ["KPI 1", "KPI 2", "KPI 3", "KPI 4", "KPI 5", "KPI 6"],
  "executionPhases": [
    {
      "phase": 1,
      "name": "Foundation",
      "duration": "Month 1-2",
      "activities": ["Activity 1", "Activity 2"],
      "milestones": ["Milestone 1"]
    },
    {
      "phase": 2,
      "name": "Execution",
      "duration": "Month 3-4",
      "activities": ["Activity 1", "Activity 2"],
      "milestones": ["Milestone 1"]
    },
    {
      "phase": 3,
      "name": "Optimization",
      "duration": "Month 5-6",
      "activities": ["Activity 1", "Activity 2"],
      "milestones": ["Milestone 1"]
    }
  ],
  "approvalItems": [
    {
      "id": "budget",
      "title": "Budget Approval",
      "description": "Approve total budget of $X.XM",
      "department": "Finance",
      "priority": "high"
    },
    {
      "id": "hiring",
      "title": "Hiring Authorization",
      "description": "Authorize hiring of X new FTEs",
      "department": "HR",
      "priority": "medium"
    }
  ]
}`
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, agents = ['sales', 'marketing', 'finance', 'operations', 'support', 'hr'] } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Strategic prompt is required' },
        { status: 400 }
      )
    }

    // Fetch company profile
    let profile: CompanyProfile | null = null
    try {
      const { data } = await supabaseAdmin
        .from('company_profiles')
        .select('profile_data')
        .eq('user_id', userId)
        .single()

      if (data?.profile_data) {
        profile = data.profile_data as CompanyProfile
      }
    } catch (e) {
      console.log('No company profile found, using defaults')
    }

    const orchestrationPrompt = buildOrchestrationPrompt(profile, agents)

    const fullPrompt = `${orchestrationPrompt}

CEO STRATEGIC OBJECTIVE:
"${prompt}"

IMPORTANT:
- Only generate agent responses for the ACTIVE AGENTS listed above
- Base all recommendations on the COMPANY CONTEXT provided
- If company risk tolerance is "low", select conservative strategy
- If company risk tolerance is "high", select aggressive strategy
- Otherwise, select balanced strategy
- Make budget figures realistic based on company's disclosed budgets
- Ensure all KPIs are specific and measurable
- Include the parsedObjective, strategyOptions, executionPhases, and approvalItems in your response

Generate the comprehensive enterprise response JSON.`

    const response = await generateJSON(fullPrompt)

    // Filter agents to only include selected ones
    if (response.agents) {
      response.agents = response.agents.filter((agent: { agent: string }) =>
        agents.includes(agent.agent)
      )
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Enterprise command error:', error)
    return NextResponse.json(
      { error: 'Failed to process enterprise command' },
      { status: 500 }
    )
  }
}
