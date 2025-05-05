import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateString(str: string | undefined, start = 6, end = 4) {
  if (!str) return 'Could not format address...'
  return `${str.slice(0, start)}...${str.slice(0 - end)}`
}
