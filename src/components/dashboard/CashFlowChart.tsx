'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts'
import { formatCurrency } from '@/types'
import type { CashFlowPoint } from '@/types'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

export interface CashFlowChartProps {
  data: CashFlowPoint[]
  className?: string
}

const CashFlowChart = React.memo<CashFlowChartProps>(({ data, className }) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Flux de trésorerie</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Aucune donnée disponible</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate min/max for reference zones
  const balances = data.map(d => d.balance)
  const minBalance = Math.min(...balances)
  const maxBalance = Math.max(...balances)
  const avgBalance = balances.reduce((a, b) => a + b, 0) / balances.length

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-sm text-gray-900 mb-2">
            {data.date}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600">Solde:</span>
              <span className="text-sm font-semibold text-[#10b981]">
                {formatCurrency(data.balance)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600">Revenus:</span>
              <span className="text-sm font-semibold text-[#22c55e]">
                {formatCurrency(data.income)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600">Dépenses:</span>
              <span className="text-sm font-semibold text-[#ef4444]">
                {formatCurrency(data.expense)}
              </span>
            </div>
            {data.type === 'projected' && (
              <p className="text-xs text-gray-500 mt-2 italic">
                Projection
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  // Calculate trend
  const firstBalance = data[0]?.balance || 0
  const lastBalance = data[data.length - 1]?.balance || 0
  const trend = ((lastBalance - firstBalance) / firstBalance) * 100
  const isPositiveTrend = trend >= 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="mb-2">Flux de trésorerie</CardTitle>
            <p className="text-sm text-gray-500">
              Évolution de votre solde sur 30 jours
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isPositiveTrend ? (
              <TrendingUp className="h-5 w-5 text-[#22c55e]" />
            ) : (
              <TrendingDown className="h-5 w-5 text-[#ef4444]" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositiveTrend ? 'text-[#22c55e]' : 'text-[#ef4444]'
              }`}
            >
              {isPositiveTrend ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Green zone gradient (above average) */}
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
              {/* Yellow zone gradient (average) */}
              <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
              {/* Balance area gradient */}
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />

            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />

            {/* Reference line for average */}
            <ReferenceLine
              y={avgBalance}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{
                value: 'Moyenne',
                position: 'right',
                fill: '#f59e0b',
                fontSize: 11
              }}
            />

            {/* Zero line */}
            {minBalance < 0 && (
              <ReferenceLine
                y={0}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: 'Alerte',
                  position: 'left',
                  fill: '#ef4444',
                  fontSize: 11
                }}
              />
            )}

            {/* Main balance area */}
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorBalance)"
              name="Solde"
              activeDot={{ r: 6, fill: '#10b981' }}
            />

            {/* Income markers */}
            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={0}
              fill="transparent"
              name="Revenus"
              dot={{ r: 3, fill: '#22c55e', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#22c55e' }}
            />

            {/* Expense markers */}
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={0}
              fill="transparent"
              name="Dépenses"
              dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#ef4444' }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Solde actuel</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(lastBalance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Moyenne</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(avgBalance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Variation</p>
            <p
              className={`text-sm font-semibold ${
                isPositiveTrend ? 'text-[#22c55e]' : 'text-[#ef4444]'
              }`}
            >
              {formatCurrency(lastBalance - firstBalance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

CashFlowChart.displayName = 'CashFlowChart'

export default CashFlowChart
