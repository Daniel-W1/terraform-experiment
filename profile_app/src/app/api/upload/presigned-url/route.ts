import { NextResponse } from 'next/server'
import AWS from 'aws-sdk'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!
      }
    })

    const token = request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const uniqueFileName = `${Date.now()}-${file.name}`

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: uniqueFileName,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      Metadata: {
        'x-amz-meta-user-id': decoded.userId
      }
    }

    await s3.upload(uploadParams).promise()

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`

    return NextResponse.json({ fileUrl })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}