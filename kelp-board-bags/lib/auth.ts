import NextAuth, { DefaultSession, NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { z } from 'zod'

// Extend the built-in session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
  }
}

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedFields = loginSchema.safeParse(credentials)

          if (!validatedFields.success) {
            return null
          }

          const { email, password } = validatedFields.data

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              emailVerified: true,
            },
          })

          if (!user || !user.password) {
            return null
          }

          // Verify password
          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // Return user object (password excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID and role to token on sign in
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Add user ID and role to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log('User signed in:', user.email)
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
