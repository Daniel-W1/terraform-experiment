import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    console.log('Verify email request body:', rawBody)
    
    const { email } = JSON.parse(rawBody)
    console.log('Email to verify:', email)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 86400000) // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry
      }
    })

    console.log('Verification token generated for:', email)

    // Return the token directly (for testing only)
    return NextResponse.json({ 
      message: 'Verification token generated',
      token: verificationToken,
      expiresIn: '24 hours'
    })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Error generating verification token' },
      { status: 500 }
    )
  }
}