import { jsPDF } from 'jspdf'

interface GenomeReportData {
  brandInput: string
  brandDna: {
    personality: { tone: string; values: string[]; archetype: string }
    positioning: { market_position: string; uvp: string; differentiation: string }
    audience: { demographics: string; psychographics: string; pain_points: string[] }
    visual: { colors: string[]; design_language: string; aesthetics: string }
    messaging: { key_messages: string[]; style: string; emotional_appeal: string }
  }
  competitors: {
    competitors: Array<{ name: string; weakness: string; market_share: string }>
    market_gaps: string[]
    opportunities: string[]
    competitive_advantages: string[]
  }
  growthRoadmap: Record<string, unknown>
  contentStrategy: Record<string, unknown>
}

export function generateGenomeReportPDF(data: GenomeReportData): Blob {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Colors
  const primaryColor = [14, 165, 233] as [number, number, number] // genome-500
  const textColor = [30, 41, 59] as [number, number, number] // slate-800

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFontSize(24)
    doc.setTextColor(...primaryColor)
    doc.text(text, pageWidth / 2, y, { align: 'center' })
    y += 15
  }

  const addSectionTitle = (text: string) => {
    if (y > 250) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(16)
    doc.setTextColor(...primaryColor)
    doc.text(text, 20, y)
    y += 10
  }

  const addText = (text: string, indent = 20) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(11)
    doc.setTextColor(...textColor)
    const lines = doc.splitTextToSize(text, pageWidth - 40)
    doc.text(lines, indent, y)
    y += lines.length * 6
  }

  const addBulletPoint = (text: string) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(11)
    doc.setTextColor(...textColor)
    const lines = doc.splitTextToSize(`• ${text}`, pageWidth - 50)
    doc.text(lines, 25, y)
    y += lines.length * 6
  }

  // Header
  addTitle('Genome Brand Analysis Report')

  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139)
  doc.text(data.brandInput, pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setFontSize(10)
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, y, { align: 'center' })
  y += 20

  // Brand DNA Section
  addSectionTitle('1. Brand DNA')
  y += 5

  addText(`Tone: ${data.brandDna.personality.tone}`)
  addText(`Archetype: ${data.brandDna.personality.archetype}`)
  addText(`Values: ${data.brandDna.personality.values.join(', ')}`)
  y += 5

  addText(`Market Position: ${data.brandDna.positioning.market_position}`)
  addText(`Unique Value Proposition: ${data.brandDna.positioning.uvp}`)
  y += 10

  // Audience Section
  addSectionTitle('2. Target Audience')
  y += 5

  addText(`Demographics: ${data.brandDna.audience.demographics}`)
  addText(`Psychographics: ${data.brandDna.audience.psychographics}`)
  y += 3
  addText('Pain Points:')
  data.brandDna.audience.pain_points.forEach((point) => {
    addBulletPoint(point)
  })
  y += 10

  // Competitors Section
  addSectionTitle('3. Competitor Intelligence')
  y += 5

  data.competitors.competitors.slice(0, 5).forEach((comp) => {
    addText(`${comp.name}`)
    addBulletPoint(`Weakness: ${comp.weakness}`)
  })
  y += 5

  addText('Market Opportunities:')
  data.competitors.opportunities.forEach((opp) => {
    addBulletPoint(opp)
  })
  y += 10

  // Growth Roadmap Section
  addSectionTitle('4. Growth Roadmap')
  y += 5

  const roadmap = data.growthRoadmap as Record<string, unknown>

  // Handle month_1
  if (roadmap.month_1) {
    const month1 = roadmap.month_1 as { title?: string; priorities?: string[] }
    addText(`Month 1 - ${month1.title || 'Quick Wins'}:`)
    if (month1.priorities && Array.isArray(month1.priorities)) {
      month1.priorities.forEach((p: string) => addBulletPoint(p))
    }
    y += 3
  }

  // Handle month_2
  if (roadmap.month_2) {
    const month2 = roadmap.month_2 as { title?: string; priorities?: string[] }
    addText(`Month 2 - ${month2.title || 'Momentum Building'}:`)
    if (month2.priorities && Array.isArray(month2.priorities)) {
      month2.priorities.forEach((p: string) => addBulletPoint(p))
    }
    y += 3
  }

  // Handle month_3
  if (roadmap.month_3) {
    const month3 = roadmap.month_3 as { title?: string; priorities?: string[] }
    addText(`Month 3 - ${month3.title || 'Scaling'}:`)
    if (month3.priorities && Array.isArray(month3.priorities)) {
      month3.priorities.forEach((p: string) => addBulletPoint(p))
    }
    y += 3
  }

  // Handle key metrics
  if (roadmap.key_metrics && Array.isArray(roadmap.key_metrics)) {
    addText('Key Metrics:')
    ;(roadmap.key_metrics as string[]).forEach((m: string) => addBulletPoint(m))
    y += 3
  }
  y += 7

  // Content Strategy Section
  addSectionTitle('5. Content Strategy')
  y += 5

  const strategy = data.contentStrategy as Record<string, unknown>

  // Handle content pillars
  if (strategy.content_pillars && Array.isArray(strategy.content_pillars)) {
    addText('Content Pillars:')
    const pillars = strategy.content_pillars as Array<{ name: string; description: string }>
    pillars.forEach((pillar) => {
      if (pillar.name) {
        addText(`${pillar.name}`, 25)
        if (pillar.description) {
          addBulletPoint(pillar.description)
        }
      }
    })
    y += 3
  }

  // Handle content formats
  if (strategy.content_formats && Array.isArray(strategy.content_formats)) {
    addText('Content Formats:')
    ;(strategy.content_formats as string[]).forEach((f: string) => addBulletPoint(f))
    y += 3
  }

  // Handle posting frequency
  if (strategy.posting_frequency) {
    addText('Posting Frequency:')
    const freq = strategy.posting_frequency as Record<string, string>
    Object.entries(freq).forEach(([platform, frequency]) => {
      addBulletPoint(`${platform}: ${frequency}`)
    })
    y += 3
  }

  // Handle platform strategies
  if (strategy.platform_strategies && Array.isArray(strategy.platform_strategies)) {
    addText('Platform Strategies:')
    const platforms = strategy.platform_strategies as Array<{ platform: string; strategy: string }>
    platforms.forEach((p) => {
      if (p.platform && p.strategy) {
        addBulletPoint(`${p.platform}: ${p.strategy}`)
      }
    })
  }

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text(
    'Generated by Genome AI - AI-Powered Marketing Intelligence',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  )

  return doc.output('blob')
}

interface AdReportData {
  keyword: string
  companyName: string
  totalAdsFound: number
  relevantAds: number
  ads: Array<{
    brandName: string
    daysRunning: number
    relevanceScore: number
    variations: Array<{
      variationName: string
      creativeDirection: string
      adCopy: {
        headline: string
        primaryText: string
        description: string
        ctaButton: string
      }
    }>
  }>
}

export function generateAdReportPDF(data: AdReportData): Blob {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  const primaryColor = [14, 165, 233] as [number, number, number]
  const textColor = [30, 41, 59] as [number, number, number]

  // Header
  doc.setFontSize(24)
  doc.setTextColor(...primaryColor)
  doc.text('Genome Ad Analysis Report', pageWidth / 2, y, { align: 'center' })
  y += 15

  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139)
  doc.text(`Keyword: ${data.keyword}`, pageWidth / 2, y, { align: 'center' })
  y += 8
  doc.text(`Company: ${data.companyName}`, pageWidth / 2, y, { align: 'center' })
  y += 8
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, y, { align: 'center' })
  y += 15

  // Summary
  doc.setFontSize(11)
  doc.setTextColor(...textColor)
  doc.text(`Total Ads Discovered: ${data.totalAdsFound}`, 20, y)
  y += 7
  doc.text(`Relevant Ads Analyzed: ${data.relevantAds}`, 20, y)
  y += 15

  // Ads
  data.ads.forEach((ad, adIndex) => {
    if (y > 230) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.text(`Ad ${adIndex + 1}: ${ad.brandName}`, 20, y)
    y += 8

    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Running: ${ad.daysRunning} days | Relevance: ${ad.relevanceScore}/10`, 20, y)
    y += 10

    ad.variations.forEach((variation, vIndex) => {
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(11)
      doc.setTextColor(...primaryColor)
      doc.text(`Variation ${vIndex + 1}: ${variation.variationName}`, 25, y)
      y += 7

      doc.setFontSize(10)
      doc.setTextColor(...textColor)
      doc.text(`Headline: ${variation.adCopy.headline}`, 30, y)
      y += 6

      const primaryTextLines = doc.splitTextToSize(`Primary: ${variation.adCopy.primaryText}`, pageWidth - 60)
      doc.text(primaryTextLines, 30, y)
      y += primaryTextLines.length * 5

      doc.text(`CTA: ${variation.adCopy.ctaButton}`, 30, y)
      y += 10
    })

    y += 5
  })

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text(
    'Generated by Genome AI - AI-Powered Marketing Intelligence',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  )

  return doc.output('blob')
}
