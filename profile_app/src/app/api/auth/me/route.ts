import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/server/lib/prisma'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1]

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        bio: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        portfolio: {
          select: {
            id: true,
            title: true,
            description: true,
            isPublic: true,
            items: {
              select: {
                id: true,
                title: true,
                description: true,
                mediaUrl: true,
                mediaType: true,
                order: true,
                isPublic: true
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error in GET /api/auth/me: ", error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
