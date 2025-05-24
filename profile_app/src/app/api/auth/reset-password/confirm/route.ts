import { prisma } from "@/server/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { AUTH, HTTP_STATUS, ERROR_MESSAGES } from '@/constants'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Validate password
    if (!password || password.length < AUTH.PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.PASSWORD_TOO_SHORT },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error) {
    console.error('Reset password confirmation error:', error)
    return NextResponse.json(
      { error: 'Error resetting password' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}
