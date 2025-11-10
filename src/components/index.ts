// UI Components
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/card'
export { Button, buttonVariants } from './ui/button'
export { Badge, badgeVariants } from './ui/badge'
export { Progress } from './ui/progress'

// Dashboard Components
export { default as KPICard } from './dashboard/KPICard'
export type { KPICardProps } from './dashboard/KPICard'

export { default as CashFlowChart } from './dashboard/CashFlowChart'
export type { CashFlowChartProps } from './dashboard/CashFlowChart'

export { default as QuickActions } from './dashboard/QuickActions'
export type { QuickActionsProps, QuickAction } from './dashboard/QuickActions'

// Transaction Components
export { default as TransactionItem } from './transactions/TransactionItem'
export type { TransactionItemProps, Transaction } from './transactions/TransactionItem'

// Budget Components
export { default as BudgetProgress } from './budgets/BudgetProgress'
export type { BudgetProgressProps, Budget } from './budgets/BudgetProgress'

// Savings Components
export { default as SavingsGoalCard } from './savings/SavingsGoalCard'
export type { SavingsGoalCardProps, SavingsGoal } from './savings/SavingsGoalCard'

// Insight Components
export { default as AIInsightCard } from './insights/AIInsightCard'
export type { AIInsightCardProps, Insight } from './insights/AIInsightCard'
