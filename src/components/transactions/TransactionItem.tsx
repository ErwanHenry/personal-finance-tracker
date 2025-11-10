'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatRelativeDate, CATEGORY_CONFIG, TransactionCategory } from '@/types'
import { cn } from '@/lib/utils'
import { Repeat } from 'lucide-react'

export interface Transaction {
  id: string
  amount: number
  category: TransactionCategory
  description: string
  date: Date | string
  isRecurring?: boolean
  type: 'INCOME' | 'EXPENSE'
}

export interface TransactionItemProps {
  transaction: Transaction
  onClick?: () => void
}

const TransactionItem = React.memo<TransactionItemProps>(({
  transaction,
  onClick
}) => {
  const categoryConfig = CATEGORY_CONFIG[transaction.category]
  const isIncome = transaction.type === 'INCOME'

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer',
        'hover:bg-gray-50 active:bg-gray-100',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`Transaction: ${transaction.description}, ${formatCurrency(transaction.amount)}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Category Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: `${categoryConfig.color}20` }}
        >
          <span role="img" aria-label={categoryConfig.label}>
            {categoryConfig.emoji}
          </span>
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            {transaction.isRecurring && (
              <Badge variant="secondary" className="shrink-0">
                <Repeat className="h-3 w-3 mr-1" />
                Récurrent
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">{categoryConfig.label}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">
              {formatRelativeDate(transaction.date)}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0 ml-4">
          <p
            className={cn(
              'text-lg font-semibold font-mono',
              isIncome ? 'text-[#10b981]' : 'text-gray-900'
            )}
          >
            {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
          </p>
        </div>
      </div>
    </div>
  )
})

TransactionItem.displayName = 'TransactionItem'

export default TransactionItem
