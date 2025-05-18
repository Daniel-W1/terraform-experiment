import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    console.log('Reset password requested for:', email)

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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    console.log('Reset token generated for:', email)

    // Return the token directly (for testing only)
    return NextResponse.json({ 
      message: 'Reset token generated',
      token: resetToken,
      expiresIn: '1 hour'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Error generating reset token' },
      { status: 500 }
    )
  }
}
