import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    console.log('Login request body:', rawBody)
    
    const { email, password } = JSON.parse(rawBody)
    console.log('Email:', email)
    console.log('Password:', password)

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    console.log('User found:', user ? 'Yes' : 'No')
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Return user data and token
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error during login' },
      { status: 500 }
    )
  }
}