import { Decimal } from '@prisma/client/runtime/library'

export type TransactionType = 'INCOME' | 'EXPENSE'

export type TransactionCategory =
  | 'SALARY'
  | 'FREELANCE'
  | 'INVESTMENT_INCOME'
  | 'GIFT_RECEIVED'
  | 'OTHER_INCOME'
  | 'HOUSING'
  | 'FOOD_DINING'
  | 'GROCERIES'
  | 'TRANSPORTATION'
  | 'UTILITIES'
  | 'HEALTHCARE'
  | 'ENTERTAINMENT'
  | 'SHOPPING'
  | 'PERSONAL_CARE'
  | 'EDUCATION'
  | 'INSURANCE'
  | 'DEBT_PAYMENT'
  | 'GIFTS_DONATIONS'
  | 'SAVINGS_TRANSFER'
  | 'OTHER_EXPENSE'

export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'

export type InsightType = 'WARNING' | 'SUGGESTION' | 'CELEBRATION' | 'FORECAST'

export type InsightPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface CategoryConfig {
  label: string
  emoji: string
  color: string
  type: TransactionType
}

export const CATEGORY_CONFIG: Record<TransactionCategory, CategoryConfig> = {
  // Income
  SALARY: { label: 'Salaire', emoji: '💰', color: '#10b981', type: 'INCOME' },
  FREELANCE: { label: 'Freelance', emoji: '💼', color: '#10b981', type: 'INCOME' },
  INVESTMENT_INCOME: { label: 'Investissements', emoji: '📈', color: '#10b981', type: 'INCOME' },
  GIFT_RECEIVED: { label: 'Cadeau reçu', emoji: '🎁', color: '#10b981', type: 'INCOME' },
  OTHER_INCOME: { label: 'Autre revenu', emoji: '💵', color: '#10b981', type: 'INCOME' },

  // Expenses
  HOUSING: { label: 'Logement', emoji: '🏠', color: '#3b82f6', type: 'EXPENSE' },
  FOOD_DINING: { label: 'Restaurant', emoji: '🍔', color: '#f59e0b', type: 'EXPENSE' },
  GROCERIES: { label: 'Courses', emoji: '🛒', color: '#f59e0b', type: 'EXPENSE' },
  TRANSPORTATION: { label: 'Transport', emoji: '🚗', color: '#8b5cf6', type: 'EXPENSE' },
  UTILITIES: { label: 'Factures', emoji: '💡', color: '#6366f1', type: 'EXPENSE' },
  HEALTHCARE: { label: 'Santé', emoji: '💊', color: '#ef4444', type: 'EXPENSE' },
  ENTERTAINMENT: { label: 'Loisirs', emoji: '🎮', color: '#ec4899', type: 'EXPENSE' },
  SHOPPING: { label: 'Shopping', emoji: '🛍️', color: '#14b8a6', type: 'EXPENSE' },
  PERSONAL_CARE: { label: 'Soins', emoji: '💇', color: '#f43f5e', type: 'EXPENSE' },
  EDUCATION: { label: 'Éducation', emoji: '📚', color: '#0ea5e9', type: 'EXPENSE' },
  INSURANCE: { label: 'Assurance', emoji: '🛡️', color: '#84cc16', type: 'EXPENSE' },
  DEBT_PAYMENT: { label: 'Remboursement', emoji: '💳', color: '#ef4444', type: 'EXPENSE' },
  GIFTS_DONATIONS: { label: 'Cadeaux & Dons', emoji: '🎁', color: '#ec4899', type: 'EXPENSE' },
  SAVINGS_TRANSFER: { label: 'Épargne', emoji: '🎯', color: '#22c55e', type: 'EXPENSE' },
  OTHER_EXPENSE: { label: 'Autre dépense', emoji: '📦', color: '#6b7280', type: 'EXPENSE' },
}

export interface KPIData {
  currentBalance: number
  availableThisMonth: number
  budgetStatus: number
  savingsProgress: number
  trends: {
    balance: number
    available: number
    budget: number
    savings: number
  }
}

export interface CashFlowPoint {
  date: string
  balance: number
  income: number
  expense: number
  type?: 'actual' | 'projected'
}

export function formatCurrency(amount: number | Decimal, currency: string = 'EUR'): string {
  const num = typeof amount === 'number' ? amount : parseFloat(amount.toString())
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} ans`
}
