import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // Read the body once and parse it
    const rawBody = await request.text()
    console.log('Raw request body:', rawBody)
    
    const { email, password, name } = JSON.parse(rawBody)

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    })

    // Create portfolio for user
    await prisma.portfolio.create({
      data: {
        userId: user.id,
        title: `${name}'s Portfolio`
      }
    })

    // Return user data (excluding password)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}
