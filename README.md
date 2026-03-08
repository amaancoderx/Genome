# Genome AI - Enterprise Marketing Intelligence Platform

Genome AI is an AI-powered **Enterprise Marketing Intelligence Platform** that helps businesses make strategic decisions using AI agents, competitive ad intelligence, and brand analysis.

The platform provides a centralized **AI command center for marketing, operations, and growth strategy**, powered by modern cloud infrastructure and advanced AI models.

This project was built for an **AWS Hackathon**, integrating AWS cloud services while preserving the existing Next.js architecture.

---

# Team

**Team Name:** Code Rebels

---

# Platform Overview

Genome AI enables organizations to:

• Analyze competitor advertising strategies  
• Generate AI-powered marketing insights  
• Manage enterprise strategies with AI agents  
• Generate professional intelligence reports  
• Build data-driven brand positioning strategies  

The platform acts as a **strategic operating system for marketing teams**.

---

# Core Features

## Enterprise Command Center (CORE)

Execute strategic decisions with **6 specialized AI agents**:

• **Sales Agent** – Revenue optimization and sales strategy  
• **Marketing Agent** – Campaign planning and brand positioning  
• **Finance Agent** – Budget allocation and ROI analysis  
• **Operations Agent** – Process optimization and efficiency  
• **Support Agent** – Customer experience insights  
• **HR Agent** – Talent strategy and organizational growth  

Each agent generates **structured recommendations, tasks, and insights**.

---

## Ad Intelligence Agent

AI-powered **competitive ad analysis engine**.

Capabilities include:

• Competitor Ad Analysis  
• Instagram Creative Intelligence  
• Design Pattern Recognition  
• Color Psychology Analysis  
• Typography Trend Insights  
• Market Gap Detection  
• AI Generated Ad Concepts  
• Performance Predictions (CTR, Engagement)  
• A/B Testing Recommendations  
• PDF Intelligence Reports  

---

## AI-Guided Company Profile

Users can create a **company profile with AI assistance**, enabling the platform to provide **personalized strategic recommendations**.

---

## Brand Genome Analysis

Analyze the **DNA of a brand** including:

• Brand positioning  
• Messaging structure  
• Competitor landscape  
• Market differentiation  

---

## Strategy Task Management

Track and manage tasks created by AI strategies:

• Task status tracking  
• Progress monitoring  
• Strategy execution pipelines  

---

## AI Brand Assistant

Conversational AI assistant for:

• Marketing advice  
• Campaign ideas  
• Content strategy  
• Brand messaging  

---

## Approval Workflows

Strategic recommendations require **user confirmation before execution** to ensure human oversight.

---

# AWS Cloud Architecture

To support **enterprise scalability and hackathon requirements**, Genome AI integrates AWS services.

The architecture separates **frontend, API, AI processing, and storage**.

```
                +----------------------+
                |   AWS Amplify       |
                |  (Next.js Frontend) |
                +----------+-----------+
                           |
                           |
                           v
                +----------------------+
                |   API Gateway        |
                |  REST API Layer      |
                +----------+-----------+
                           |
                           |
                           v
                 +--------------------+
                 |   AWS Lambda       |
                 | AI Processing      |
                 | Strategy Agents    |
                 | Report Generation  |
                 +----------+---------+
                            |
        +-------------------+-------------------+
        |                   |                   |
        v                   v                   v
+-------------+    +----------------+    +--------------+
|  OpenAI API |    | Amazon Bedrock |    |  DynamoDB    |
| GPT-4o      |    | Claude 3       |    | Strategy DB  |
+-------------+    +----------------+    +--------------+

                            |
                            v

                    +----------------+
                    | Amazon S3      |
                    | PDF Reports    |
                    | AI Assets      |
                    +----------------+
```

---

# AWS Services Used

| Service | Purpose |
|------|------|
| AWS Amplify | Deploy Next.js frontend |
| AWS Lambda | Serverless backend AI processing |
| API Gateway | REST API for Lambda |
| Amazon S3 | Store generated reports and assets |
| DynamoDB | Optional strategy/task database |
| Amazon Bedrock | Optional Claude 3 AI reasoning |

---

# Tech Stack

Frontend

• Next.js 16 (App Router)  
• TypeScript  
• Tailwind CSS  
• shadcn/ui  

Authentication

• Clerk

Database

• Supabase (primary)  
• DynamoDB (optional AWS storage)

AI

• OpenAI GPT-4o  
• DALL-E 3  
• Amazon Bedrock Claude 3 (optional)

Reports

• jsPDF

Cloud

• AWS Amplify  
• AWS Lambda  
• Amazon API Gateway  
• Amazon S3  

Deployment

• Vercel (legacy option)  
• AWS Amplify (AWS hackathon deployment)

---

# Project Structure

```
Genome/
│
├── genome-nextjs
│   ├── app
│   │   ├── (dashboard)
│   │   │   ├── dashboard
│   │   │   │   ├── ad-intelligence
│   │   │   │   ├── enterprise
│   │   │   │   ├── chat
│   │   │   │   ├── genome
│   │   │   │   └── settings
│   │   │   └── layout.tsx
│   │
│   ├── api
│   │   ├── ad-intelligence
│   │   ├── enterprise
│   │   ├── chat
│   │   └── genome
│   │
│   ├── components
│   │   └── ui
│   │
│   └── lib
│       ├── ad-intelligence-pdf.ts
│       ├── meta-ad-library.ts
│       ├── together.ts
│       └── utils.ts
│
├── aws
│   └── lambda
│       ├── ad-intelligence
│       │   └── handler.ts
│       ├── ai-agents
│       │   └── handler.ts
│       └── report-generator
│           └── handler.ts
│
└── README.md
```

---

# Environment Variables

Create `.env.local`

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

GOOGLE_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=

META_AD_LIBRARY_TOKEN=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

S3_REPORT_BUCKET=

API_GATEWAY_URL=

BEDROCK_MODEL_ID=anthropic.claude-3-sonnet
```

---

# Example Lambda Functions

## Ad Intelligence Lambda

```ts
import { APIGatewayProxyHandler } from "aws-lambda"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const handler: APIGatewayProxyHandler = async (event) => {

  const body = JSON.parse(event.body || "{}")
  const { brand, competitor } = body

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Analyze advertising strategy between ${brand} and ${competitor}`
      }
    ]
  })

  return {
    statusCode: 200,
    body: JSON.stringify(response.choices[0].message)
  }
}
```

---

## AI Agent Reasoning Lambda

```ts
import { APIGatewayProxyHandler } from "aws-lambda"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const handler: APIGatewayProxyHandler = async (event) => {

  const { agent, task } = JSON.parse(event.body || "{}")

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are the ${agent} agent in an enterprise strategy system`
      },
      {
        role: "user",
        content: task
      }
    ]
  })

  return {
    statusCode: 200,
    body: JSON.stringify(result.choices[0].message)
  }
}
```

---

## PDF Report Generation Lambda

```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import jsPDF from "jspdf"

const s3 = new S3Client({ region: process.env.AWS_REGION })

export const handler = async (event:any) => {

  const { report } = JSON.parse(event.body)

  const pdf = new jsPDF()
  pdf.text(report, 10, 10)

  const buffer = Buffer.from(pdf.output("arraybuffer"))

  const key = `reports/report-${Date.now()}.pdf`

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_REPORT_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf"
  }))

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: `https://${process.env.S3_REPORT_BUCKET}.s3.amazonaws.com/${key}`
    })
  }
}
```

---

# Frontend API Call Example

```ts
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ad-intelligence`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }
)

const result = await response.json()
```

---

# Deployment

## Deploy Frontend (AWS Amplify)

1. Open AWS Amplify
2. Connect GitHub repository
3. Select branch
4. Build settings

```
npm install
npm run build
```

5. Deploy

---

## Deploy Lambda

```
cd aws/lambda/ad-intelligence
npm install
zip -r function.zip .
aws lambda create-function ...
```

---

## Setup API Gateway

1 Create REST API  
2 Create route

```
POST /ad-intelligence
```

3 Connect Lambda

---

## Setup S3

Create bucket:

```
genome-ai-reports
```

Enable:

• public read access  
• versioning (optional)

---

# Security

• Clerk authentication  
• Secure API routes  
• AWS IAM policies for Lambda + S3  
• Environment variable protection

---

# Future Improvements

• Real-time analytics dashboard  
• Multi-agent orchestration  
• Vector search for marketing insights  
• Full AWS Bedrock integration  
• Automated campaign generation  

---

# License

MIT License

---

# Built With

Next.js  
AWS  
OpenAI  
Supabase  

---

# Created by

**Team Code Rebels**

AI-Powered Enterprise Marketing Intelligence
