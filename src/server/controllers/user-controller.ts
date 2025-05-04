import db from '@/server/clients/db'
import {
  CreateUserInput,
  createUserSchema,
} from '@/server/schema/user-services-schema'
import { AppError } from '@/server/utils/errors'
import { User } from '@prisma/client'
import { z } from 'zod'

export class UserController {
  static async findAll(): Promise<User[]> {
    try {
      const users = await db.user.findMany()
      return users as User[]
    } catch (error) {
      console.error('Error finding users:', error)
      throw new AppError('Failed to fetch users', 500)
    }
  }

  static async findById(id: string): Promise<User | null> {
    try {
      const user = await db.user.findUnique({
        where: { id },
      })

      return user
    } catch (error) {
      console.error('Error finding user:', error)
      throw new AppError('Failed to fetch user', 500)
    }
  }

  static async findByAddress(address: string): Promise<User | null> {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [{ appWallet: address }, { extWallet: address }],
        },
      })

      return user
    } catch (error) {
      console.error('Error finding user:', error)
      throw new AppError('Failed to fetch user', 500)
    }
  }

  static async findOrCreate(input: CreateUserInput): Promise<User> {
    try {
      // Validate input
      const validatedData = createUserSchema.parse(input)

      // Try to find existing user
      const existingUser = await db.user.findUnique({
        where: {
          id: input.id,
        },
      })

      if (existingUser) return existingUser as User

      // Create new user if not found
      const newUser = await db.user.create({
        data: {
          username: validatedData.appWallet,
          ...validatedData,
        },
      })

      return newUser as User
    } catch (error) {
      console.error('Error in findOrCreate:', error)

      if (error instanceof z.ZodError) {
        throw new AppError('Invalid input data', 400, {
          code: 'VALIDATION_ERROR',
          details: error.errors,
        })
      }

      throw new AppError('Failed to create user', 500)
    }
  }

  static async updateUser(
    id: string,
    data: Partial<CreateUserInput>,
  ): Promise<User> {
    try {
      const updatedUser = await db.user.update({
        where: { id },
        data,
      })

      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      throw new AppError('Failed to update user', 500)
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      await db.user.delete({
        where: { id },
      })

      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new AppError('Failed to delete user', 500)
    }
  }
}
