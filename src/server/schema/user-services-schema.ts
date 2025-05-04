import { z } from 'zod'

// User schemas
export const createUserSchema = z.object({
  id: z.string().uuid(),
  appWallet: z.string().startsWith('0x').toLowerCase(),
  extWallet: z.string().startsWith('0x').toLowerCase().optional(),
  email: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().email().optional()),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// Form validation schema
export const userAccountFormSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Display name must be at least 2 characters.',
  }),
  email: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().email('Invalid email address.').optional())
    .optional()
    .nullable(),
  bio: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(
      z
        .string()
        .max(500, {
          message: 'Bio must not exceed 500 characters.',
        })
        .optional(),
    )
    .optional()
    .nullable(),
  website: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().url('Please enter a valid URL.').optional())
    .optional()
    .nullable(),
})

export type UserAccountFormValues = z.infer<typeof userAccountFormSchema>

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().optional())
    .optional()
    .nullable(),
  lastName: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().optional())
    .optional()
    .nullable(),
  cityRegion: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().optional())
    .optional()
    .nullable(),
  country: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().optional())
    .optional()
    .nullable(),
  primaryRole: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().optional())
    .optional()
    .nullable(),
  professionalProfile: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(
      z
        .string()
        .max(1000, {
          message: 'Professional profile must not exceed 1000 characters.',
        })
        .optional(),
    )
    .optional()
    .nullable(),
  isStudent: z.boolean().default(false).optional(),
  farcasterUsername: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
