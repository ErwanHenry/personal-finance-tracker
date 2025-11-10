import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface FinancialInsight {
  type: 'warning' | 'suggestion' | 'celebration' | 'forecast'
  title: string
  description: string
  actionable: boolean
  action?: {
    label: string
    endpoint: string
  }
  priority: 'high' | 'medium' | 'low'
  dataPoints?: {
    metric: string
    value: number
    comparison?: number
  }[]
}

export async function analyzeSpending(
  transactions: any[],
  budgets: any[]
): Promise<FinancialInsight[]> {
  const prompt = `You are a financial advisor. Analyze these transactions and budgets:

Transactions: ${JSON.stringify(transactions, null, 2)}
Budgets: ${JSON.stringify(budgets, null, 2)}

Provide 2-3 actionable financial insights. Focus on:
1. Spending patterns and anomalies
2. Budget adherence
3. Opportunities to save

Return insights in JSON format:
[
  {
    "type": "warning|suggestion|celebration|forecast",
    "title": "Brief title",
    "description": "Friendly, encouraging explanation",
    "actionable": true|false,
    "priority": "high|medium|low"
  }
]`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }

    return []
  } catch (error) {
    console.error('Error analyzing spending:', error)
    return []
  }
}

export async function calculateSafeToSpend(
  currentBalance: number,
  upcomingExpenses: any[],
  savingsGoal: number
): Promise<{ amount: number; explanation: string }> {
  const prompt = `Calculate how much money is safe to spend:

Current Balance: €${currentBalance}
Upcoming Expenses: ${JSON.stringify(upcomingExpenses, null, 2)}
Monthly Savings Goal: €${savingsGoal}

Provide a safe-to-spend amount and friendly explanation in JSON:
{
  "amount": 123.45,
  "explanation": "You can safely spend €123.45 this week..."
}`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }

    return {
      amount: 0,
      explanation: 'Unable to calculate safe spending amount',
    }
  } catch (error) {
    console.error('Error calculating safe to spend:', error)
    return {
      amount: 0,
      explanation: 'Error calculating safe spending amount',
    }
  }
}

export async function categorizTransaction(
  description: string
): Promise<string> {
  const prompt = `Categorize this transaction: "${description}"

Available categories:
- HOUSING (rent, mortgage, utilities)
- FOOD_DINING (restaurants, cafes)
- GROCERIES (supermarket, food shopping)
- TRANSPORTATION (uber, gas, public transport)
- ENTERTAINMENT (movies, games, streaming)
- SHOPPING (clothes, electronics)
- HEALTHCARE (doctor, pharmacy)
- UTILITIES (electricity, water, internet)
- OTHER_EXPENSE

Return ONLY the category name, nothing else.`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-3-5-20241022',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      return content.text.trim()
    }

    return 'OTHER_EXPENSE'
  } catch (error) {
    console.error('Error categorizing transaction:', error)
    return 'OTHER_EXPENSE'
  }
}

export { client as anthropicClient }
