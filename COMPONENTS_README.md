# Personal Finance Tracker - UI Components Documentation

This document provides comprehensive documentation for all UI components created for the Personal Finance Tracker application.

## Table of Contents

- [Design System](#design-system)
- [Base UI Components](#base-ui-components)
- [Dashboard Components](#dashboard-components)
- [Transaction Components](#transaction-components)
- [Budget Components](#budget-components)
- [Savings Components](#savings-components)
- [Insight Components](#insight-components)
- [Usage Examples](#usage-examples)
- [Accessibility](#accessibility)

---

## Design System

### Colors

```typescript
Primary (Financial Green): #10b981
Success: #22c55e
Warning: #f59e0b
Danger: #ef4444
AI Insights (Purple): #8b5cf6
Secondary Blue: #3b82f6
```

### Typography

- **Font Family**: Inter (sans-serif)
- **Monospace**: Geist Mono (for amounts)
- **Font Sizes**: Tailwind default scale

### Spacing & Layout

- **Card Padding**: p-4, p-5, p-6
- **Border Radius**: rounded-lg, rounded-xl, rounded-full
- **Shadows**: shadow-sm, shadow-md, shadow-lg, shadow-2xl

---

## Base UI Components

### Card

Location: `/src/components/ui/card.tsx`

A flexible card container with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Props:**
- Extends standard `HTMLDivElement` attributes
- `className`: Custom CSS classes

**Features:**
- Rounded corners (rounded-xl)
- Border and shadow
- Hover effect (shadow-md)
- Fully responsive

---

### Button

Location: `/src/components/ui/button.tsx`

Multi-variant button component with size options.

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="default">
  Click me
</Button>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `className`: Custom CSS classes
- All standard button HTML attributes

**Features:**
- Primary color: Financial Green (#10b981)
- Smooth transitions and hover effects
- Focus ring for accessibility
- Disabled state styling

---

### Badge

Location: `/src/components/ui/badge.tsx`

Small status indicators with multiple variants.

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">New</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

**Props:**
- `variant`: 'default' | 'secondary' | 'destructive' | 'warning' | 'outline' | 'success' | 'purple'
- `className`: Custom CSS classes

**Features:**
- Rounded pill shape
- Color-coded variants
- Hover effects
- Icon support

---

### Progress

Location: `/src/components/ui/progress.tsx`

Progress bar with variant support.

```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={75} max={100} variant="success" />
```

**Props:**
- `value`: Current progress value (number)
- `max`: Maximum value (default: 100)
- `variant`: 'default' | 'success' | 'warning' | 'danger'
- `className`: Custom CSS classes

**Features:**
- Smooth animations (duration-300)
- Color-coded based on variant
- Percentage-based width
- Rounded ends

---

## Dashboard Components

### KPICard

Location: `/src/components/dashboard/KPICard.tsx`

Display key performance indicators with trends and sparklines.

```tsx
import { KPICard } from '@/components'
import { Wallet } from 'lucide-react'

<KPICard
  label="Solde actuel"
  amount={3450.75}
  trend={12.5}
  icon={<Wallet className="h-6 w-6" />}
  color="#10b981"
  sparkline={[100, 150, 120, 180, 200, 190, 220]}
/>
```

**Props:**
```typescript
interface KPICardProps {
  label: string              // KPI label
  amount: number             // Amount to display
  trend?: number            // Percentage change (optional)
  icon: React.ReactNode     // Icon component
  color?: string            // Custom color (default: #10b981)
  sparkline?: number[]      // Array of values for sparkline chart
}
```

**Features:**
- Large monospace amount display
- Trend indicator (up/down arrow)
- Optional sparkline visualization
- Hover lift animation (-translate-y-1)
- Icon with colored background
- Responsive design

---

### CashFlowChart

Location: `/src/components/dashboard/CashFlowChart.tsx`

Visualize cash flow over time with income/expense markers.

```tsx
import { CashFlowChart } from '@/components'

<CashFlowChart data={cashFlowData} />
```

**Props:**
```typescript
interface CashFlowChartProps {
  data: CashFlowPoint[]
  className?: string
}

interface CashFlowPoint {
  date: string
  balance: number
  income: number
  expense: number
  type?: 'actual' | 'projected'
}
```

**Features:**
- Area chart with gradient fill
- Income markers (green dots)
- Expense markers (red dots)
- Average reference line
- Zero/alert reference line
- Custom tooltip with formatted currency
- Trend indicator
- Summary statistics
- Responsive with Recharts

---

### QuickActions

Location: `/src/components/dashboard/QuickActions.tsx`

Floating action button menu with expandable secondary actions.

```tsx
import { QuickActions } from '@/components'
import { Plus, TrendingUp, Target } from 'lucide-react'

<QuickActions
  actions={[
    {
      id: 'add-transaction',
      label: 'Ajouter une transaction',
      icon: <Plus className="h-5 w-5" />,
      onClick: () => console.log('Add transaction'),
      variant: 'primary',
      color: '#10b981'
    },
    // ... more actions
  ]}
/>
```

**Props:**
```typescript
interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  color?: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
  className?: string
}
```

**Features:**
- Fixed position (bottom-right)
- Expandable menu
- Ripple animation on primary button
- Staggered animations on secondary actions
- Backdrop overlay when expanded
- Keyboard accessible
- Rotation animation on expand

---

## Transaction Components

### TransactionItem

Location: `/src/components/transactions/TransactionItem.tsx`

List item for displaying transaction details.

```tsx
import { TransactionItem } from '@/components'

<TransactionItem
  transaction={{
    id: '1',
    amount: 85.50,
    category: 'GROCERIES',
    description: 'Courses Carrefour',
    date: new Date('2025-11-08'),
    type: 'EXPENSE',
    isRecurring: false
  }}
  onClick={() => console.log('Transaction clicked')}
/>
```

**Props:**
```typescript
interface Transaction {
  id: string
  amount: number
  category: TransactionCategory
  description: string
  date: Date | string
  isRecurring?: boolean
  type: 'INCOME' | 'EXPENSE'
}

interface TransactionItemProps {
  transaction: Transaction
  onClick?: () => void
}
```

**Features:**
- Category icon with colored background
- Formatted amount (green for income, gray for expense)
- Relative date formatting
- Recurring badge
- Hover background
- Click/keyboard navigation
- Truncated text with ellipsis
- Fully accessible (ARIA labels)

---

## Budget Components

### BudgetProgress

Location: `/src/components/budgets/BudgetProgress.tsx`

Display budget spending progress with alerts.

```tsx
import { BudgetProgress } from '@/components'

<BudgetProgress
  budget={{
    id: '1',
    category: 'FOOD_DINING',
    spent: 280,
    total: 300,
    daysRemaining: 20,
    period: 'MONTHLY'
  }}
  onClick={() => console.log('Budget clicked')}
/>
```

**Props:**
```typescript
interface Budget {
  id: string
  category: TransactionCategory
  spent: number
  total: number
  daysRemaining?: number
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}

interface BudgetProgressProps {
  budget: Budget
  onClick?: () => void
}
```

**Features:**
- Dynamic progress bar color (green → warning → danger)
- Status badges:
  - OK (< 60%)
  - En cours (60-79%)
  - Attention (80-99%)
  - Dépassé (>= 100%)
- Pulsing animation when exceeded
- Days remaining counter
- Spent vs. remaining display
- Percentage indicator
- Border highlight when exceeded

---

## Savings Components

### SavingsGoalCard

Location: `/src/components/savings/SavingsGoalCard.tsx`

Savings goal tracker with circular progress and quick add buttons.

```tsx
import { SavingsGoalCard } from '@/components'

<SavingsGoalCard
  goal={{
    id: '1',
    name: 'Vacances été',
    emoji: '🏖️',
    current: 1500,
    target: 2000,
    deadline: new Date('2025-07-01')
  }}
  onQuickAdd={(amount) => console.log(`Add ${amount}€`)}
  onClick={() => console.log('Goal clicked')}
/>
```

**Props:**
```typescript
interface SavingsGoal {
  id: string
  name: string
  emoji: string
  current: number
  target: number
  deadline?: Date | string
}

interface SavingsGoalCardProps {
  goal: SavingsGoal
  onQuickAdd?: (amount: number) => void
  onClick?: () => void
}
```

**Features:**
- Circular progress indicator (Recharts Pie)
- Percentage completion in center
- Deadline display
- Current/Target/Remaining amounts
- Quick add buttons (10€, 50€, 100€)
- Completion badge and animation
- Celebration message when completed
- Bounce animation on completion

---

## Insight Components

### AIInsightCard

Location: `/src/components/insights/AIInsightCard.tsx`

AI-generated insights with priority levels and actions.

```tsx
import { AIInsightCard } from '@/components'

<AIInsightCard
  insight={{
    id: '1',
    type: 'WARNING',
    title: 'Budget Loisirs dépassé',
    description: 'Vous avez dépassé votre budget...',
    priority: 'HIGH',
    action: {
      label: 'Voir détails',
      onClick: () => console.log('View details')
    },
    onDismiss: () => console.log('Dismissed')
  }}
/>
```

**Props:**
```typescript
interface Insight {
  id: string
  type: InsightType  // 'WARNING' | 'SUGGESTION' | 'CELEBRATION' | 'FORECAST'
  title: string
  description: string
  priority: InsightPriority  // 'LOW' | 'MEDIUM' | 'HIGH'
  action?: {
    label: string
    onClick: () => void
  }
  onDismiss?: () => void
}

interface AIInsightCardProps {
  insight: Insight
}
```

**Features:**
- Type-specific icons and colors
- Gradient backgrounds
- Shimmer animation effect
- Priority badges (color-coded)
- Optional action button
- Dismiss button
- AI sparkle icon
- Border glow effect
- Hover lift animation

**Insight Types:**
- **WARNING**: Red/orange gradient, AlertTriangle icon
- **SUGGESTION**: Purple gradient, Lightbulb icon
- **CELEBRATION**: Green gradient, PartyPopper icon
- **FORECAST**: Purple gradient, TrendingUp icon

---

## Usage Examples

### Complete Dashboard Example

```tsx
'use client'

import {
  KPICard,
  CashFlowChart,
  QuickActions,
  TransactionItem,
  BudgetProgress,
  SavingsGoalCard,
  AIInsightCard
} from '@/components'
import { Wallet, TrendingDown, PiggyBank, Target } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Solde actuel"
          amount={3450.75}
          trend={12.5}
          icon={<Wallet className="h-6 w-6" />}
          color="#10b981"
        />
        {/* More KPI cards... */}
      </div>

      {/* Cash Flow Chart */}
      <CashFlowChart data={cashFlowData} />

      {/* Budgets and Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-semibold">Budgets</h2>
          {budgets.map(budget => (
            <BudgetProgress key={budget.id} budget={budget} />
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="font-semibold">Objectifs d'épargne</h2>
          {goals.map(goal => (
            <SavingsGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
```

### Responsive Grid Layouts

```tsx
// 4-column grid (responsive)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* KPI Cards */}
</div>

// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Budget cards or savings goals */}
</div>

// 2-column grid
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Insights or split sections */}
</div>
```

---

## Accessibility

All components follow WAI-ARIA accessibility guidelines:

### Keyboard Navigation

- **Buttons**: Tab to focus, Enter/Space to activate
- **Transaction Items**: Tab to focus, Enter/Space to click
- **Quick Actions**: Tab to primary button, opens with Enter/Space

### Screen Readers

- **ARIA Labels**: All interactive elements have descriptive labels
- **Role Attributes**: Proper semantic HTML and ARIA roles
- **Focus Indicators**: Visible focus rings (ring-2)

### Example ARIA Implementation

```tsx
// Transaction Item
<div
  role="button"
  tabIndex={0}
  aria-label={`Transaction: ${description}, ${formatCurrency(amount)}`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick()
    }
  }}
>
```

### Color Contrast

- All text meets WCAG AA standards (4.5:1 minimum)
- Icons have sufficient contrast
- Focus indicators are clearly visible

---

## Testing Components

### View Demo Page

Run the development server and navigate to `/demo`:

```bash
npm run dev
```

Then open: `http://localhost:3000/demo`

### Component Import

```tsx
// Import specific components
import { KPICard, TransactionItem } from '@/components'

// Or import from specific paths
import KPICard from '@/components/dashboard/KPICard'
```

---

## File Structure

```
src/components/
├── ui/
│   ├── card.tsx
│   ├── button.tsx
│   ├── badge.tsx
│   └── progress.tsx
├── dashboard/
│   ├── KPICard.tsx
│   ├── CashFlowChart.tsx
│   └── QuickActions.tsx
├── transactions/
│   └── TransactionItem.tsx
├── budgets/
│   └── BudgetProgress.tsx
├── savings/
│   └── SavingsGoalCard.tsx
├── insights/
│   └── AIInsightCard.tsx
└── index.ts (barrel export)
```

---

## Dependencies

```json
{
  "lucide-react": "^0.553.0",     // Icons
  "recharts": "^3.4.1",            // Charts
  "class-variance-authority": "^*", // Component variants
  "clsx": "^*",                    // Class merging
  "tailwind-merge": "^*"           // Tailwind class merging
}
```

---

## Customization

### Changing Colors

All components use design system colors. To change globally:

```tsx
// Update color in component props
<KPICard color="#custom-color" />

// Or modify the design system in types/index.ts
export const CATEGORY_CONFIG = {
  // Update category colors
}
```

### Custom Animations

Add custom animations in `globals.css`:

```css
@keyframes custom-animation {
  /* Your keyframes */
}

.custom-class {
  animation: custom-animation 2s infinite;
}
```

---

## Performance

All components are optimized for performance:

- **React.memo**: All components are memoized to prevent unnecessary re-renders
- **Lazy Loading**: Components can be lazy loaded with `React.lazy()`
- **Chart Optimization**: Recharts with ResponsiveContainer for efficient rendering
- **CSS Transitions**: Hardware-accelerated transforms

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari, Chrome Android

---

## License

MIT

---

## Support

For issues or questions, refer to the main project documentation or create an issue in the repository.
