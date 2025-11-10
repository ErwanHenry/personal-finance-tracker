'use client'

import React from 'react'
import {
  KPICard,
  CashFlowChart,
  QuickActions,
  TransactionItem,
  BudgetProgress,
  SavingsGoalCard,
  AIInsightCard
} from '@/components'
import type {
  Transaction,
  Budget,
  SavingsGoal,
  Insight,
  CashFlowPoint
} from '@/components'
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Target
} from 'lucide-react'

export default function DemoPage() {
  // Mock data
  const kpiData = {
    currentBalance: 3450.75,
    availableThisMonth: 1200.50,
    budgetStatus: 750.00,
    savingsProgress: 2500.00
  }

  const transactions: Transaction[] = [
    {
      id: '1',
      amount: 3500,
      category: 'SALARY',
      description: 'Salaire mensuel',
      date: new Date('2025-11-01'),
      type: 'INCOME'
    },
    {
      id: '2',
      amount: 85.50,
      category: 'GROCERIES',
      description: 'Courses Carrefour',
      date: new Date('2025-11-08'),
      type: 'EXPENSE'
    },
    {
      id: '3',
      amount: 1200,
      category: 'HOUSING',
      description: 'Loyer novembre',
      date: new Date('2025-11-05'),
      isRecurring: true,
      type: 'EXPENSE'
    },
    {
      id: '4',
      amount: 45.00,
      category: 'FOOD_DINING',
      description: 'Déjeuner restaurant',
      date: new Date('2025-11-09'),
      type: 'EXPENSE'
    }
  ]

  const budgets: Budget[] = [
    {
      id: '1',
      category: 'FOOD_DINING',
      spent: 280,
      total: 300,
      daysRemaining: 20,
      period: 'MONTHLY'
    },
    {
      id: '2',
      category: 'GROCERIES',
      spent: 350,
      total: 400,
      daysRemaining: 20,
      period: 'MONTHLY'
    },
    {
      id: '3',
      category: 'ENTERTAINMENT',
      spent: 180,
      total: 150,
      daysRemaining: 20,
      period: 'MONTHLY'
    }
  ]

  const savingsGoals: SavingsGoal[] = [
    {
      id: '1',
      name: 'Vacances été',
      emoji: '🏖️',
      current: 1500,
      target: 2000,
      deadline: new Date('2025-07-01')
    },
    {
      id: '2',
      name: 'Nouveau laptop',
      emoji: '💻',
      current: 800,
      target: 1500,
      deadline: new Date('2025-12-31')
    },
    {
      id: '3',
      name: 'Fonds urgence',
      emoji: '🆘',
      current: 5000,
      target: 5000,
      deadline: new Date('2025-11-10')
    }
  ]

  const insights: Insight[] = [
    {
      id: '1',
      type: 'WARNING',
      title: 'Budget Loisirs dépassé',
      description: 'Vous avez dépassé votre budget loisirs de 30€ ce mois-ci. Considérez réduire vos dépenses dans cette catégorie.',
      priority: 'HIGH',
      action: {
        label: 'Voir détails',
        onClick: () => console.log('View budget details')
      },
      onDismiss: () => console.log('Dismiss warning')
    },
    {
      id: '2',
      type: 'SUGGESTION',
      title: 'Opportunité d\'épargne',
      description: 'Basé sur vos habitudes, vous pourriez économiser 150€ supplémentaires ce mois-ci en réduisant vos dépenses restaurants.',
      priority: 'MEDIUM',
      action: {
        label: 'Créer objectif',
        onClick: () => console.log('Create savings goal')
      }
    },
    {
      id: '3',
      type: 'CELEBRATION',
      title: 'Objectif atteint!',
      description: 'Félicitations! Vous avez atteint votre objectif "Fonds d\'urgence". Continuez comme ça!',
      priority: 'LOW',
      onDismiss: () => console.log('Dismiss celebration')
    },
    {
      id: '4',
      type: 'FORECAST',
      title: 'Prévision fin de mois',
      description: 'À ce rythme, vous devriez terminer le mois avec un solde de 3,200€, soit 15% de plus que prévu.',
      priority: 'MEDIUM'
    }
  ]

  const cashFlowData: CashFlowPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2025, 10, i + 1)
    const dayOfMonth = i + 1
    return {
      date: `${dayOfMonth}/11`,
      balance: 3000 + Math.sin(i / 5) * 500 + i * 15,
      income: dayOfMonth === 1 || dayOfMonth === 15 ? 3500 : Math.random() * 200,
      expense: 50 + Math.random() * 150,
      type: i > 9 ? 'projected' : 'actual'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Demo - Composants Finance Tracker
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Présentation de tous les composants UI créés
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* KPI Cards */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">KPI Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Solde actuel"
              amount={kpiData.currentBalance}
              trend={12.5}
              icon={<Wallet className="h-6 w-6" />}
              color="#10b981"
              sparkline={[100, 150, 120, 180, 200, 190, 220]}
            />
            <KPICard
              label="Disponible ce mois"
              amount={kpiData.availableThisMonth}
              trend={-5.2}
              icon={<TrendingDown className="h-6 w-6" />}
              color="#3b82f6"
              sparkline={[150, 140, 130, 120, 110, 100, 90]}
            />
            <KPICard
              label="Budget restant"
              amount={kpiData.budgetStatus}
              icon={<Target className="h-6 w-6" />}
              color="#f59e0b"
            />
            <KPICard
              label="Épargne totale"
              amount={kpiData.savingsProgress}
              trend={8.3}
              icon={<PiggyBank className="h-6 w-6" />}
              color="#22c55e"
              sparkline={[80, 90, 95, 100, 110, 120, 130]}
            />
          </div>
        </section>

        {/* Cash Flow Chart */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cash Flow Chart</h2>
          <CashFlowChart data={cashFlowData} />
        </section>

        {/* Transactions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Transactions</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {transactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onClick={() => console.log('Transaction clicked:', transaction.id)}
              />
            ))}
          </div>
        </section>

        {/* Budget Progress */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map(budget => (
              <BudgetProgress
                key={budget.id}
                budget={budget}
                onClick={() => console.log('Budget clicked:', budget.id)}
              />
            ))}
          </div>
        </section>

        {/* Savings Goals */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Savings Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsGoals.map(goal => (
              <SavingsGoalCard
                key={goal.id}
                goal={goal}
                onQuickAdd={(amount) => console.log(`Add ${amount}€ to goal:`, goal.id)}
                onClick={() => console.log('Goal clicked:', goal.id)}
              />
            ))}
          </div>
        </section>

        {/* AI Insights */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map(insight => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
