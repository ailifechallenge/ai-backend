import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'caution' | 'ghost'

interface Common {
  variant?: Variant
  block?: boolean
}

const cls = (variant: Variant, block?: boolean, extra?: string) =>
  [styles.button, styles[variant], block ? styles.block : '', extra ?? ''].filter(Boolean).join(' ')

export function Button({
  variant = 'primary',
  block,
  className,
  type = 'button',
  ...props
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cls(variant, block, className)} {...props} />
}

export function ButtonLink({ variant = 'primary', block, className, ...props }: Common & LinkProps) {
  return <Link className={cls(variant, block, className)} {...props} />
}

/** 외부 링크·tel: 링크용 */
export function ButtonAnchor({
  variant = 'primary',
  block,
  className,
  ...props
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cls(variant, block, className)} {...props} />
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}
