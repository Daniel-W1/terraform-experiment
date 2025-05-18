import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'

type Params = Promise<{ id: string }>;


export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const profile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,  
        profileImage: true,
        bio: true,
        createdAt: true,
        portfolio: {
          select: {
            id: true,
            title: true,
            description: true,
            items: {
              where: {
                isPublic: true
              },
              select: {
                id: true,
                title: true,
                description: true,
                mediaUrl: true,
                mediaType: true,
                createdAt: true
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Error fetching profile' },
      { status: 500 }
    )
  }
} 