import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AUTH, HTTP_STATUS, ERROR_MESSAGES } from '@/constants'

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
        { error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isVerified: true
      }
    })
    
    console.log('User found:', user ? 'Yes' : 'No')
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        isVerified: user.isVerified
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_CREDENTIALS },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_CREDENTIALS },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: AUTH.JWT_EXPIRY }
    )

    // Create response with user data
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified
    })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,  // Set to false since we're using http:// with IP
      sameSite: 'lax',
      maxAge: AUTH.COOKIE_MAX_AGE
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error during login' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}