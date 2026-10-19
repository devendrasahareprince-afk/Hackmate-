'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/kit/button'
import { Field, Input, Select } from '@/components/kit/form'
import { BRANCHES, YEARS } from '@/lib/constants'
import { useStore } from '@/lib/store'
import type { AcademicYear } from '@/lib/types'

function useAfterAuth() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next')
  const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
  return () => router.push(target)
}

function useRedirectIfLoggedIn(go: () => void) {
  const { hydrated, currentUser } = useStore()
  useEffect(() => {
    if (hydrated && currentUser) go()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, currentUser])
}

function DemoButton({ onDone }: { onDone: () => void }) {
  const { loginDemo } = useStore()
  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className="w-full"
      onClick={() => {
        loginDemo()
        onDone()
      }}
    >
      <Sparkles className="text-brand-cyan" aria-hidden="true" />
      Continue as Demo Student
    </Button>
  )
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      or use email
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
  const { login } = useStore()
  const go = useAfterAuth()
  useRedirectIfLoggedIn(go)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!EMAIL_RE.test(email.trim())) errs.email = 'Enter a valid email address'
    if (!password) errs.password = 'Password is required'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(() => {
      const ok = login(email, password)
      setLoading(false)
      if (ok) go()
    }, 450)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Log in to continue building your dream team.</p>
      <div className="mt-8">
        <DemoButton onDone={go} />
      </div>
      <Divider />
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email" error={errors.email} required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password} required>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
          />
        </Field>
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Log in
        </Button>
      </form>
      <p className="mt-4 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        Demo credentials: <span className="font-medium text-foreground">aryan.rohada@student.demo</span> /{' '}
        <span className="font-medium text-foreground">demo1234</span>
      </p>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to HackMate?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}

export function SignupForm() {
  const { signup } = useStore()
  const go = useAfterAuth()
  useRedirectIfLoggedIn(go)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    college: '',
    branch: '',
    year: '' as AcademicYear | '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (form.name.trim().length < 2) errs.name = 'Enter your full name'
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Enter a valid email address'
    if (form.password.length < 6) errs.password = 'Use at least 6 characters'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    if (form.college.trim().length < 3) errs.college = 'Enter your college name'
    if (!form.branch) errs.branch = 'Select your branch'
    if (!form.year) errs.year = 'Select your academic year'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(() => {
      const ok = signup({
        name: form.name,
        email: form.email,
        password: form.password,
        college: form.college,
        branch: form.branch,
        year: form.year as AcademicYear,
      })
      setLoading(false)
      if (ok) go()
    }, 450)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Join HackMate and start finding teammates in minutes.</p>
      <div className="mt-8">
        <DemoButton onDone={go} />
      </div>
      <Divider />
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name" error={errors.name} required className="sm:col-span-2">
          <Input id="name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email} required className="sm:col-span-2">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            aria-invalid={!!errors.email}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password} required>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            aria-invalid={!!errors.password}
          />
        </Field>
        <Field label="Confirm Password" htmlFor="confirm" error={errors.confirm} required>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={set('confirm')}
            aria-invalid={!!errors.confirm}
          />
        </Field>
        <Field label="College" htmlFor="college" error={errors.college} required className="sm:col-span-2">
          <Input
            id="college"
            placeholder="e.g. PVG's College of Engineering and Technology, Pune"
            value={form.college}
            onChange={set('college')}
            aria-invalid={!!errors.college}
          />
        </Field>
        <Field label="Branch" htmlFor="branch" error={errors.branch} required>
          <Select id="branch" value={form.branch} onChange={set('branch')} aria-invalid={!!errors.branch}>
            <option value="">Select branch</option>
            {BRANCHES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </Field>
        <Field label="Academic Year" htmlFor="year" error={errors.year} required>
          <Select id="year" value={form.year} onChange={set('year')} aria-invalid={!!errors.year}>
            <option value="">Select year</option>
            {YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </Select>
        </Field>
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full sm:col-span-2">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
