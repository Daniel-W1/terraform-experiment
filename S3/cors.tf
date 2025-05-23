resource "aws_s3_bucket_cors_configuration" "profile_app_bucket_cors" {
  bucket = aws_s3_bucket.profile_app_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}