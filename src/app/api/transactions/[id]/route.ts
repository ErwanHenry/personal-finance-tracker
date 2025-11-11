import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/transactions/[id] - Get a single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        bankAccount: {
          userId: session.user.id
        }
      },
      include: {
        bankAccount: {
          select: {
            name: true,
            type: true
          }
        }
      }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

// PUT /api/transactions/[id] - Update a transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, type, category, description, date } = body

    // Get the old transaction to calculate balance adjustment
    const oldTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        bankAccount: {
          userId: session.user.id
        }
      }
    })

    if (!oldTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Update the transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        type: type || undefined,
        category: category || undefined,
        description: description !== undefined ? description : undefined,
        date: date ? new Date(date) : undefined
      },
      include: {
        bankAccount: {
          select: {
            name: true,
            type: true
          }
        }
      }
    })

    // Adjust account balance if amount or type changed
    if (amount !== undefined || type !== undefined) {
      const oldAmount = Number(oldTransaction.amount)
      const newAmount = Number(transaction.amount)
      const oldBalance = oldTransaction.type === 'INCOME' ? oldAmount : -oldAmount
      const newBalance = transaction.type === 'INCOME' ? newAmount : -newAmount
      const balanceChange = newBalance - oldBalance

      await prisma.bankAccount.update({
        where: { id: transaction.bankAccountId },
        data: {
          balance: {
            increment: balanceChange
          }
        }
      })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the transaction to adjust balance before deleting
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        bankAccount: {
          userId: session.user.id
        }
      }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Delete the transaction
    await prisma.transaction.delete({
      where: { id }
    })

    // Adjust account balance
    const amount = Number(transaction.amount)
    const balanceChange = transaction.type === 'INCOME' ? -amount : amount
    await prisma.bankAccount.update({
      where: { id: transaction.bankAccountId },
      data: {
        balance: {
          increment: balanceChange
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
