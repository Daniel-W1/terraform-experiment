resource "aws_s3_bucket_policy" "profile_app_bucket_policy" {
  bucket = aws_s3_bucket.profile_app_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowPublicRead"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.profile_app_bucket.arn}/*"
      },
      {
        Sid       = "AllowAuthenticatedUploads"
        Effect    = "Allow"
        Principal = {
          AWS = aws_iam_user.profile_app_user.arn
        }
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.profile_app_bucket.arn,
          "${aws_s3_bucket.profile_app_bucket.arn}/*"
        ]
      }
    ]
  })
}