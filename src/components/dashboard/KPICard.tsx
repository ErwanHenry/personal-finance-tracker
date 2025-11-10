'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/types'
import { cn } from '@/lib/utils'

export interface KPICardProps {
  label: string
  amount: number
  trend?: number
  icon: React.ReactNode
  color?: string
  sparkline?: number[]
}

const KPICard = React.memo<KPICardProps>(({
  label,
  amount,
  trend,
  icon,
  color = '#10b981',
  sparkline
}) => {
  const isPositive = trend !== undefined && trend >= 0
  const hasTrend = trend !== undefined && trend !== 0

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p
              className="text-3xl font-bold font-mono tracking-tight"
              style={{ color }}
            >
              {formatCurrency(amount)}
            </p>

            {hasTrend && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-[#22c55e]" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-[#ef4444]" />
                )}
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'
                  )}
                >
                  {isPositive ? '+' : ''}{trend.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
              </div>
            )}
          </div>

          <div
            className="flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${color}15` }}
          >
            <div style={{ color }}>
              {icon}
            </div>
          </div>
        </div>

        {sparkline && sparkline.length > 0 && (
          <div className="mt-4 h-12 flex items-end gap-1">
            {sparkline.map((value, index) => {
              const maxValue = Math.max(...sparkline)
              const height = (value / maxValue) * 100
              return (
                <div
                  key={index}
                  className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    opacity: 0.3 + (index / sparkline.length) * 0.7,
                  }}
                />
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
})

KPICard.displayName = 'KPICard'

export default KPICard
