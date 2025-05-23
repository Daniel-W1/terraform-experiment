variable "sender_email" {
  description = "Email address to be verified for sending emails"
  type        = string
}

variable "aws_region" {
  description = "AWS region for SES"
  type        = string
  default     = "us-east-1"
} 