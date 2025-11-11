import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/budgets - List all budgets for the authenticated user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date()
        startDate.setDate(1) // First day of current month

        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0) // Last day of current month

        // Get user's account IDs first
        const userAccounts = await prisma.bankAccount.findMany({
          where: { userId: session.user.id },
          select: { id: true }
        })
        const accountIds = userAccounts.map(a => a.id)

        const transactions = await prisma.transaction.findMany({
          where: {
            accountId: { in: accountIds },
            category: budget.category,
            type: 'EXPENSE',
            date: {
              gte: startDate,
              lte: endDate
            }
          }
        })

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0)
        const percentage = (spent / budget.amount) * 100

        return {
          ...budget,
          spent,
          remaining: budget.amount - spent,
          percentage: Math.min(percentage, 100)
        }
      })
    )

    return NextResponse.json({ budgets: budgetsWithSpent })
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { category, amount, period } = body

    // Validate required fields
    if (!category || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if budget already exists for this category
    const existing = await prisma.budget.findFirst({
      where: {
        userId: session.user.id,
        category
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Budget already exists for this category' },
        { status: 409 }
      )
    }

    // Create the budget
    const budget = await prisma.budget.create({
      data: {
        userId: session.user.id,
        category,
        amount: parseFloat(amount),
        period: period || 'MONTHLY'
      }
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}
