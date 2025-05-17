resource "aws_s3_bucket" "example" {
  bucket = var.s3_bucket_name
  force_destroy = true

  tags = {
    Name        = "TerraformS3"
    Environment = "Dev"
  }
}
