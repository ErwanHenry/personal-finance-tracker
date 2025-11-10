'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/types'
import { cn } from '@/lib/utils'
import { Plus, PartyPopper, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export interface SavingsGoal {
  id: string
  name: string
  emoji: string
  current: number
  target: number
  deadline?: Date | string
}

export interface SavingsGoalCardProps {
  goal: SavingsGoal
  onQuickAdd?: (amount: number) => void
  onClick?: () => void
}

const SavingsGoalCard = React.memo<SavingsGoalCardProps>(({
  goal,
  onQuickAdd,
  onClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const percentage = Math.min((goal.current / goal.target) * 100, 100)
  const remaining = goal.target - goal.current
  const isCompleted = percentage >= 100

  // Chart data
  const chartData = [
    { name: 'Current', value: goal.current, color: '#10b981' },
    { name: 'Remaining', value: Math.max(remaining, 0), color: '#e5e7eb' },
  ]

  const handleQuickAdd = (amount: number) => {
    if (onQuickAdd) {
      setIsAnimating(true)
      onQuickAdd(amount)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  // Trigger celebration animation when completed
  React.useEffect(() => {
    if (isCompleted) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCompleted])

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        isCompleted && 'border-[#22c55e] border-2',
        onClick && 'cursor-pointer',
        isAnimating && 'animate-pulse'
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label={goal.name}>
              {goal.emoji}
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">{goal.name}</h3>
              {goal.deadline && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDate(goal.deadline)}
                </div>
              )}
            </div>
          </div>

          {isCompleted && (
            <Badge variant="success" className="animate-bounce">
              <PartyPopper className="h-3 w-3 mr-1" />
              Atteint!
            </Badge>
          )}
        </div>

        {/* Circular Progress */}
        <div className="relative mb-4">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-gray-900">
              {percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500">complété</p>
          </div>
        </div>

        {/* Amounts */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Actuel</span>
            <span className="font-semibold text-[#10b981]">
              {formatCurrency(goal.current)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Objectif</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(goal.target)}
            </span>
          </div>
          {!isCompleted && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="text-gray-500">Restant</span>
              <span className="font-semibold text-gray-700">
                {formatCurrency(remaining)}
              </span>
            </div>
          )}
        </div>

        {/* Quick Add Buttons */}
        {!isCompleted && onQuickAdd && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Ajouter rapidement</p>
            <div className="grid grid-cols-3 gap-2">
              {[10, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleQuickAdd(amount)
                  }}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {amount}€
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Completion message */}
        {isCompleted && (
          <div className="text-center p-3 bg-[#22c55e]/10 rounded-lg">
            <p className="text-sm font-semibold text-[#22c55e]">
              Félicitations! Objectif atteint! 🎉
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

SavingsGoalCard.displayName = 'SavingsGoalCard'

export default SavingsGoalCard
