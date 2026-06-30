'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, LogOut, Target,
} from 'lucide-react'

type Account = { id: string; name: string; type: string; balance: number; currency: string }
type Tx = {
  id: string; amount: number; type: string; category: string;
  description: string | null; date: string; bankAccount: { name: string }
}
type Budget = { id: string; category: string; amount: number; spent: number; percentage: number }
type Goal = {
  id: string; name: string; targetAmount: number; currentAmount: number;
  percentage: number; daysLeft: number | null; isComplete: boolean
}
type Dashboard = {
  summary: { totalBalance: number; monthIncome: number; monthExpenses: number; monthSavings: number; accountsCount: number }
  accounts: Account[]
  recentTransactions: Tx[]
  budgets: Budget[]
  goals: Goal[]
}

const ACCOUNT_TYPES = ['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'CASH']
const INCOME_CATS = ['SALARY', 'FREELANCE', 'INVESTMENT_INCOME', 'GIFT_RECEIVED', 'OTHER_INCOME']
const EXPENSE_CATS = [
  'HOUSING', 'FOOD_DINING', 'GROCERIES', 'TRANSPORTATION', 'UTILITIES', 'HEALTHCARE',
  'ENTERTAINMENT', 'SHOPPING', 'PERSONAL_CARE', 'EDUCATION', 'INSURANCE',
  'DEBT_PAYMENT', 'GIFTS_DONATIONS', 'SAVINGS_TRANSFER', 'OTHER_EXPENSE',
]

const eur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0)
const label = (s: string) => s.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAccount, setShowAccount] = useState(false)
  const [showTx, setShowTx] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/dashboard')
    if (res.status === 401) { router.push('/auth/signin'); return }
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement…</div>
  if (!data) return null

  const s = data.summary
  const kpis = [
    { label: 'Solde total', value: eur(s.totalBalance), icon: Wallet, color: 'text-green-600' },
    { label: 'Revenus du mois', value: eur(s.monthIncome), icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Dépenses du mois', value: eur(s.monthExpenses), icon: TrendingDown, color: 'text-red-500' },
    { label: 'Épargne du mois', value: eur(s.monthSavings), icon: PiggyBank, color: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-lg flex items-center gap-2"><Wallet className="w-5 h-5 text-green-600" /> FinanceTracker</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAccount(true)} className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50 flex items-center gap-1"><Plus className="w-4 h-4" /> Compte</button>
            <button onClick={() => setShowTx(true)} disabled={!data.accounts.length} className="text-sm px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 disabled:opacity-40"><Plus className="w-4 h-4" /> Transaction</button>
            <button onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50 flex items-center gap-1"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{k.label}</span>
                <k.icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <div className="text-2xl font-bold">{k.value}</div>
            </div>
          ))}
        </div>

        {data.accounts.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-800 mb-3">Aucun compte pour l'instant. Crée ton premier compte pour commencer.</p>
            <button onClick={() => setShowAccount(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg">+ Créer un compte</button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Accounts */}
          <section className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold mb-3">Comptes</h2>
            <div className="space-y-2">
              {data.accounts.map((a) => (
                <div key={a.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div><div className="font-medium">{a.name}</div><div className="text-xs text-gray-400">{label(a.type)}</div></div>
                  <div className="font-semibold">{eur(Number(a.balance))}</div>
                </div>
              ))}
              {!data.accounts.length && <p className="text-sm text-gray-400">—</p>}
            </div>
          </section>

          {/* Transactions */}
          <section className="bg-white rounded-xl p-5 shadow-sm lg:col-span-2">
            <h2 className="font-semibold mb-3">Transactions récentes</h2>
            <div className="space-y-1">
              {data.recentTransactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <div className="font-medium">{t.description || label(t.category)}</div>
                    <div className="text-xs text-gray-400">{label(t.category)} · {t.bankAccount?.name} · {new Date(t.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div className={t.type === 'INCOME' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                    {t.type === 'INCOME' ? '+' : '−'}{eur(Number(t.amount))}
                  </div>
                </div>
              ))}
              {!data.recentTransactions.length && <p className="text-sm text-gray-400">Aucune transaction. Ajoute-en une.</p>}
            </div>
          </section>
        </div>

        {/* Budgets + Goals */}
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold mb-3">Budgets</h2>
            {data.budgets.map((b) => (
              <div key={b.id} className="mb-3">
                <div className="flex justify-between text-sm mb-1"><span>{label(b.category)}</span><span>{eur(b.spent)} / {eur(Number(b.amount))}</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${b.percentage >= 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(b.percentage, 100)}%` }} /></div>
              </div>
            ))}
            {!data.budgets.length && <p className="text-sm text-gray-400">Aucun budget défini.</p>}
          </section>
          <section className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> Objectifs d'épargne</h2>
            {data.goals.map((g) => (
              <div key={g.id} className="mb-3">
                <div className="flex justify-between text-sm mb-1"><span>{g.name}</span><span>{eur(Number(g.currentAmount))} / {eur(Number(g.targetAmount))}</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${Math.min(g.percentage, 100)}%` }} /></div>
              </div>
            ))}
            {!data.goals.length && <p className="text-sm text-gray-400">Aucun objectif.</p>}
          </section>
        </div>
      </main>

      {showAccount && <AccountModal onClose={() => setShowAccount(false)} onDone={() => { setShowAccount(false); load() }} />}
      {showTx && <TxModal accounts={data.accounts} onClose={() => setShowTx(false)} onDone={() => { setShowTx(false); load() }} />}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        {children}
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none'

function AccountModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('CHECKING')
  const [balance, setBalance] = useState('')
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/accounts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, balance: balance || 0 }),
    })
    if (res.ok) onDone(); else setErr('Échec de la création')
  }

  return (
    <Modal title="Nouveau compte" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <input className={inputCls} placeholder="Nom (ex: Compte courant)" required value={name} onChange={(e) => setName(e.target.value)} />
        <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
          {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}
        </select>
        <input className={inputCls} type="number" step="0.01" placeholder="Solde initial (€)" value={balance} onChange={(e) => setBalance(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Créer</button>
      </form>
    </Modal>
  )
}

function TxModal({ accounts, onClose, onDone }: { accounts: Account[]; onClose: () => void; onDone: () => void }) {
  const [bankAccountId, setBankAccountId] = useState(accounts[0]?.id || '')
  const [type, setType] = useState('EXPENSE')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('FOOD_DINING')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [err, setErr] = useState('')
  const cats = type === 'INCOME' ? INCOME_CATS : EXPENSE_CATS

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/transactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankAccountId, amount, type, category, description, date }),
    })
    if (res.ok) onDone(); else setErr('Échec de l\'ajout')
  }

  return (
    <Modal title="Nouvelle transaction" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <select className={inputCls} value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)}>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setType('EXPENSE'); setCategory(EXPENSE_CATS[0]) }} className={`flex-1 py-2 rounded-lg border ${type === 'EXPENSE' ? 'bg-red-50 border-red-300 text-red-600' : ''}`}>Dépense</button>
          <button type="button" onClick={() => { setType('INCOME'); setCategory(INCOME_CATS[0]) }} className={`flex-1 py-2 rounded-lg border ${type === 'INCOME' ? 'bg-green-50 border-green-300 text-green-600' : ''}`}>Revenu</button>
        </div>
        <input className={inputCls} type="number" step="0.01" placeholder="Montant (€)" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
          {cats.map((c) => <option key={c} value={c}>{label(c)}</option>)}
        </select>
        <input className={inputCls} placeholder="Description (optionnel)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className={inputCls} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Ajouter</button>
      </form>
    </Modal>
  )
}
