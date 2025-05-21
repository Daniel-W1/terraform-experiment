import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export async function authMiddleware(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    return { user }
  } catch (error) {
    console.error("Error in authMiddleware: ", error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
