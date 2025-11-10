'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Plus,
  TrendingUp,
  Target,
  X
} from 'lucide-react'

export interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  color?: string
}

export interface QuickActionsProps {
  actions?: QuickAction[]
  className?: string
}

const defaultActions: QuickAction[] = [
  {
    id: 'add-transaction',
    label: 'Ajouter une transaction',
    icon: <Plus className="h-5 w-5" />,
    onClick: () => console.log('Add transaction'),
    variant: 'primary',
    color: '#10b981'
  },
  {
    id: 'record-income',
    label: 'Enregistrer un revenu',
    icon: <TrendingUp className="h-5 w-5" />,
    onClick: () => console.log('Record income'),
    variant: 'secondary',
    color: '#22c55e'
  },
  {
    id: 'set-budget',
    label: 'Définir un budget',
    icon: <Target className="h-5 w-5" />,
    onClick: () => console.log('Set budget'),
    variant: 'secondary',
    color: '#3b82f6'
  }
]

const QuickActions = React.memo<QuickActionsProps>(({
  actions = defaultActions,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const primaryAction = actions.find(a => a.variant === 'primary') || actions[0]
  const secondaryActions = actions.filter(a => a.variant === 'secondary')

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      {/* Secondary actions (shown when expanded) */}
      <div
        className={cn(
          'flex flex-col gap-3 mb-3 transition-all duration-300',
          isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        {secondaryActions.map((action, index) => (
          <div
            key={action.id}
            className={cn(
              'transition-all duration-300',
              isExpanded
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
            }}
          >
            <Button
              onClick={() => {
                action.onClick()
                setIsExpanded(false)
              }}
              className={cn(
                'h-12 px-5 rounded-full shadow-lg hover:shadow-xl',
                'transition-all duration-300 hover:scale-105',
                'flex items-center gap-2 group'
              )}
              style={{
                backgroundColor: action.color || '#10b981',
              }}
            >
              <span className="group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Primary action button (always visible) */}
      <Button
        onClick={() => {
          if (secondaryActions.length > 0) {
            setIsExpanded(!isExpanded)
          } else {
            primaryAction.onClick()
          }
        }}
        className={cn(
          'h-14 w-14 rounded-full shadow-2xl hover:shadow-3xl',
          'transition-all duration-300 hover:scale-110 active:scale-95',
          'relative overflow-hidden'
        )}
        style={{
          backgroundColor: primaryAction.color || '#10b981',
        }}
        aria-label={isExpanded ? 'Fermer le menu' : primaryAction.label}
      >
        {/* Ripple effect background */}
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75" />

        {/* Icon */}
        <div className={cn(
          'relative transition-transform duration-300',
          isExpanded && 'rotate-45'
        )}>
          {isExpanded && secondaryActions.length > 0 ? (
            <X className="h-6 w-6" />
          ) : (
            primaryAction.icon
          )}
        </div>
      </Button>

      {/* Backdrop (shown when expanded) */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
})

QuickActions.displayName = 'QuickActions'

export default QuickActions
