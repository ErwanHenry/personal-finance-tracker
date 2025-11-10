'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  PartyPopper,
  TrendingUp,
  X
} from 'lucide-react'
import type { InsightType, InsightPriority } from '@/types'

export interface Insight {
  id: string
  type: InsightType
  title: string
  description: string
  priority: InsightPriority
  action?: {
    label: string
    onClick: () => void
  }
  onDismiss?: () => void
}

export interface AIInsightCardProps {
  insight: Insight
}

const AIInsightCard = React.memo<AIInsightCardProps>(({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5" />
      case 'SUGGESTION':
        return <Lightbulb className="h-5 w-5" />
      case 'CELEBRATION':
        return <PartyPopper className="h-5 w-5" />
      case 'FORECAST':
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  const getGradient = () => {
    switch (insight.type) {
      case 'WARNING':
        return 'from-[#ef4444]/10 to-[#f59e0b]/10'
      case 'CELEBRATION':
        return 'from-[#22c55e]/10 to-[#10b981]/10'
      default:
        return 'from-[#8b5cf6]/10 to-[#6366f1]/10'
    }
  }

  const getBorderColor = () => {
    switch (insight.type) {
      case 'WARNING':
        return 'border-[#ef4444]/30'
      case 'CELEBRATION':
        return 'border-[#22c55e]/30'
      default:
        return 'border-[#8b5cf6]/30'
    }
  }

  const getPriorityBadge = () => {
    const variants = {
      HIGH: 'destructive' as const,
      MEDIUM: 'warning' as const,
      LOW: 'secondary' as const,
    }
    return (
      <Badge variant={variants[insight.priority]}>
        {insight.priority === 'HIGH' && 'Priorité haute'}
        {insight.priority === 'MEDIUM' && 'Priorité moyenne'}
        {insight.priority === 'LOW' && 'Priorité faible'}
      </Badge>
    )
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-2 transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5',
        getBorderColor()
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Gradient background */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', getGradient())} />

      <CardContent className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                insight.type === 'WARNING' && 'bg-[#ef4444]/20 text-[#ef4444]',
                insight.type === 'CELEBRATION' && 'bg-[#22c55e]/20 text-[#22c55e]',
                (insight.type === 'SUGGESTION' || insight.type === 'FORECAST') &&
                  'bg-[#8b5cf6]/20 text-[#8b5cf6]'
              )}
            >
              {getIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-[#8b5cf6]" />
                <span className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wide">
                  IA Insight
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 leading-tight">
                {insight.title}
              </h3>
            </div>
          </div>

          {/* Dismiss button */}
          {insight.onDismiss && (
            <button
              onClick={insight.onDismiss}
              className="shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss insight"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          {insight.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          {getPriorityBadge()}

          {insight.action && (
            <Button
              onClick={insight.action.onClick}
              size="sm"
              className="ml-auto"
            >
              {insight.action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

AIInsightCard.displayName = 'AIInsightCard'

export default AIInsightCard
