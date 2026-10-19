import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const btn = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-gradient text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-border',
        outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
        ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
        danger: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20',
        success: 'bg-success/15 text-success hover:bg-success/25 border border-success/25',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'size-9 rounded-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type BtnVariants = VariantProps<typeof btn>

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & BtnVariants & { loading?: boolean }) {
  return (
    <button className={cn(btn({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function LinkButton({
  className,
  variant,
  size,
  href,
  ...props
}: React.ComponentProps<typeof Link> & BtnVariants) {
  return <Link href={href} className={cn(btn({ variant, size }), className)} {...props} />
}
