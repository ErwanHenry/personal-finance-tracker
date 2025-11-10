import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#10b981] text-white hover:bg-[#059669]',
        secondary:
          'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
        destructive:
          'border-transparent bg-[#ef4444] text-white hover:bg-[#dc2626]',
        warning:
          'border-transparent bg-[#f59e0b] text-white hover:bg-[#d97706]',
        outline: 'text-gray-700 border-gray-200',
        success:
          'border-transparent bg-[#22c55e] text-white hover:bg-[#16a34a]',
        purple:
          'border-transparent bg-[#8b5cf6] text-white hover:bg-[#7c3aed]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
