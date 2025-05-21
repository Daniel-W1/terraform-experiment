import { prisma } from '@/server/lib/prisma'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendEmail } from '@/server/lib/email'

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

    // Send reset email using Resend
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/confirm?token=${resetToken}`
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f9fafb;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .email-wrapper {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              padding: 40px;
              margin: 20px 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              background: linear-gradient(to right, #a855f7, #ec4899);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 20px;
            }
            .title {
              color: #1f2937;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 16px;
            }
            .message {
              color: #4b5563;
              font-size: 16px;
              margin-bottom: 24px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(to right, #a855f7, #ec4899);
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: 500;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
            }
            .warning {
              color: #ef4444;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-wrapper">
              <div class="header">
                <div class="logo">Profile App</div>
                <h1 class="title">Reset Your Password</h1>
              </div>
              <div class="message">
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
              </div>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              <div class="warning">
                <p>This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${resetLink}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    })

    return NextResponse.json({ message: 'Reset link sent to your email' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Error generating reset token' },
      { status: 500 }
    )
  }
}
