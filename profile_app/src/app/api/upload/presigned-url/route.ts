import { NextResponse } from 'next/server'
import AWS from 'aws-sdk'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })

    const cookies = request.headers.get('cookie')
    console.log('Raw cookies:', cookies)
    
    // Try different methods to extract the token
    let token = null
    if (cookies) {
      const cookiesArray = cookies.split(';').map(c => c.trim())
      console.log('Cookies array:', cookiesArray)
      
      // Try direct token match
      const tokenCookie = cookiesArray.find(c => c.startsWith('token='))
      if (tokenCookie) {
        token = tokenCookie.split('=')[1]
      }
    }
    
    console.log('Found token:', token ? 'Yes' : 'No')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized token not found' }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized can\'t decode user id' }, { status: 401 })
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