resource "aws_s3_bucket_cors_configuration" "profile_app_bucket_cors" {
  bucket = aws_s3_bucket.profile_app_bucket.id

  cors_rule {
    allowed_headers = [
      "*",
      "Authorization",
      "Content-Type",
      "x-amz-acl",
      "x-amz-meta-*",
      "x-amz-date",
      "x-amz-content-sha256"
    ]
    allowed_methods = ["PUT", "POST", "GET", "HEAD"]
    allowed_origins = ["*"]  # For development. Change this to your specific domains in production
    expose_headers  = ["ETag", "x-amz-server-side-encryption"]
    max_age_seconds = 3000
  }
}