'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, CATEGORY_CONFIG, TransactionCategory } from '@/types'
import { cn } from '@/lib/utils'
import { AlertTriangle, TrendingUp } from 'lucide-react'

export interface Budget {
  id: string
  category: TransactionCategory
  spent: number
  total: number
  daysRemaining?: number
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}

export interface BudgetProgressProps {
  budget: Budget
  onClick?: () => void
}

const BudgetProgress = React.memo<BudgetProgressProps>(({
  budget,
  onClick
}) => {
  const categoryConfig = CATEGORY_CONFIG[budget.category]
  const percentage = (budget.spent / budget.total) * 100
  const remaining = budget.total - budget.spent
  const isExceeded = percentage > 100
  const isWarning = percentage >= 80 && !isExceeded
  const isApproaching = percentage >= 60 && percentage < 80

  // Determine progress variant based on percentage
  const getProgressVariant = () => {
    if (isExceeded) return 'danger'
    if (isWarning) return 'warning'
    return 'success'
  }

  // Determine status badge
  const getStatusBadge = () => {
    if (isExceeded) {
      return (
        <Badge variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Dépassé
        </Badge>
      )
    }
    if (isWarning) {
      return (
        <Badge variant="warning">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Attention
        </Badge>
      )
    }
    if (isApproaching) {
      return (
        <Badge variant="secondary">
          <TrendingUp className="h-3 w-3 mr-1" />
          En cours
        </Badge>
      )
    }
    return (
      <Badge variant="success">
        OK
      </Badge>
    )
  }

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-md',
        isExceeded && 'border-[#ef4444] border-2',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-xl"
              role="img"
              aria-label={categoryConfig.label}
            >
              {categoryConfig.emoji}
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">
                {categoryConfig.label}
              </h3>
              {budget.daysRemaining !== undefined && (
                <p className="text-xs text-gray-500">
                  {budget.daysRemaining} jours restants
                </p>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress
            value={budget.spent}
            max={budget.total}
            variant={getProgressVariant()}
            className="h-3"
          />

          {/* Amounts */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {formatCurrency(budget.spent)}
              </span>
              <span className="text-gray-500">dépensé</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-semibold',
                  isExceeded ? 'text-[#ef4444]' : 'text-gray-500'
                )}
              >
                {formatCurrency(Math.abs(remaining))}
              </span>
              <span className="text-gray-500">
                {isExceeded ? 'au-dessus' : 'restant'}
              </span>
            </div>
          </div>

          {/* Percentage */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Budget: {formatCurrency(budget.total)}
            </span>
            <span
              className={cn(
                'text-xs font-semibold',
                isExceeded && 'text-[#ef4444]',
                isWarning && 'text-[#f59e0b]',
                !isExceeded && !isWarning && 'text-gray-600'
              )}
            >
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

BudgetProgress.displayName = 'BudgetProgress'

export default BudgetProgress
