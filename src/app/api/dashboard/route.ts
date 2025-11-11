import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/dashboard - Get complete dashboard data
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get all accounts
    const accounts = await prisma.bankAccount.findMany({
      where: { userId }
    })

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

    // Get current month transactions
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const endOfMonth = new Date()
    endOfMonth.setMonth(endOfMonth.getMonth() + 1)
    endOfMonth.setDate(0)
    endOfMonth.setHours(23, 59, 59, 999)

    const accountIds = accounts.map(a => a.id)

    const monthTransactions = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    const monthIncome = monthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthExpenses = monthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds }
      },
      include: {
        account: {
          select: { name: true, type: true }
        }
      },
      orderBy: { date: 'desc' },
      take: 10
    })

    // Get budgets with spending
    const budgets = await prisma.budget.findMany({
      where: { userId }
    })

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = monthTransactions
          .filter(t => t.type === 'EXPENSE' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0)

        return {
          ...budget,
          spent,
          remaining: Math.max(budget.amount - spent, 0),
          percentage: Math.min((spent / budget.amount) * 100, 100)
        }
      })
    )

    // Get savings goals
    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { deadline: 'asc' }
    })

    const goalsWithProgress = goals.map(goal => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100
      const daysLeft = goal.deadline
        ? Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null

      return {
        ...goal,
        percentage: Math.min(percentage, 100),
        remaining: goal.targetAmount - goal.currentAmount,
        daysLeft,
        isComplete: goal.currentAmount >= goal.targetAmount
      }
    })

    // Generate cash flow data for the last 30 days
    const cashFlowData = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      const dayTransactions = await prisma.transaction.findMany({
        where: {
          accountId: { in: accountIds },
          date: {
            gte: date,
            lte: endDate
          }
        }
      })

      const income = dayTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)

      const expense = dayTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

      // Calculate balance up to this day
      const balanceUpToDate = await prisma.transaction.findMany({
        where: {
          accountId: { in: accountIds },
          date: {
            lte: endDate
          }
        }
      })

      const balance = balanceUpToDate.reduce((sum, t) => {
        return sum + (t.type === 'INCOME' ? t.amount : -t.amount)
      }, 0)

      cashFlowData.push({
        date: date.toISOString().split('T')[0],
        income,
        expense,
        balance,
        type: 'actual'
      })
    }

    return NextResponse.json({
      summary: {
        totalBalance,
        monthIncome,
        monthExpenses,
        monthSavings: monthIncome - monthExpenses,
        accountsCount: accounts.length
      },
      accounts,
      recentTransactions,
      budgets: budgetsWithSpent,
      goals: goalsWithProgress,
      cashFlowData
    })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
