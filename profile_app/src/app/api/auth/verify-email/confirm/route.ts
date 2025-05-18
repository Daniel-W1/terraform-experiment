import { prisma } from "@/server/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    console.log('Confirm verification request body:', rawBody)
    
    const { token } = JSON.parse(rawBody)
    console.log('Verification token:', token)

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date()
        }
      }
    })

    console.log('User found with token:', user ? 'Yes' : 'No')
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        tokenExpiry: user.verificationTokenExpiry
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    })

    console.log('Email verified successfully for:', user.email)

    return NextResponse.json({ 
      message: 'Email verified successfully',
      email: user.email
    })
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { error: 'Error verifying email' },
      { status: 500 }
    )
  }
}