import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/goals - List all savings goals for the authenticated user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goals = await prisma.savingsGoal.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        deadline: 'asc'
      }
    })

    // Calculate progress percentage for each goal
    const goalsWithProgress = goals.map(goal => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100
      const daysLeft = goal.deadline ? Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

      return {
        ...goal,
        percentage: Math.min(percentage, 100),
        remaining: goal.targetAmount - goal.currentAmount,
        daysLeft,
        isComplete: goal.currentAmount >= goal.targetAmount
      }
    })

    return NextResponse.json({ goals: goalsWithProgress })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

// POST /api/goals - Create a new savings goal
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, targetAmount, currentAmount, deadline } = body

    // Validate required fields
    if (!name || !targetAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the goal
    const goal = await prisma.savingsGoal.create({
      data: {
        userId: session.user.id,
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadline ? new Date(deadline) : null
      }
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}
