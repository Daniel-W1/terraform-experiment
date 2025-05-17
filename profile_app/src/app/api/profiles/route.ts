import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log('Fetching profiles')
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get public profiles with pagination
    const profiles = await prisma.user.findMany({
      where: {
        // isVerified: true, // Only show verified users
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        createdAt: true,
        portfolio: {
          select: {
            title: true,
            description: true,
            items: {
              where: {
                isPublic: true
              },
              select: {
                title: true,
                description: true,
                mediaUrl: true,
                mediaType: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.user.count({
      where: {
        // isVerified: true
      }
    })

    return NextResponse.json({
      profiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: 'Error fetching profiles' },
      { status: 500 }
    )
  }
}