# Verify email identity for SES
resource "aws_ses_email_identity" "sender" {
  email = var.sender_email
}

# IAM User for SES access
resource "aws_iam_user" "ses_user" {
  name = "ses-smtp-user"
  path = "/"
}

# IAM policy for SES access
resource "aws_iam_user_policy" "ses_policy" {
  name = "ses-policy"
  user = aws_iam_user.ses_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      }
    ]
  })
}

# Create access key for SES user
resource "aws_iam_access_key" "ses_user_key" {
  user = aws_iam_user.ses_user.name
} 