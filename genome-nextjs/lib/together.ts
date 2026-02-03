import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateChatResponse(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI chat error:', error)
    throw error
  }
}

export async function generateJSON(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that always responds with valid JSON. Return only the JSON object, no markdown or explanation.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4000,
      temperature: 0.6,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content || '{}'
    return JSON.parse(content)
  } catch (error) {
    console.error('OpenAI JSON error:', error)
    throw error
  }
}

export async function generateImage(prompt: string) {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    return response.data[0]?.url || null
  } catch (error) {
    console.error('OpenAI image error:', error)
    return null
  }
}

export { openai }
