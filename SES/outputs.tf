output "ses_user_access_key" {
  value     = aws_iam_access_key.ses_user_key.id
  sensitive = true
}

output "ses_user_secret_key" {
  value     = aws_iam_access_key.ses_user_key.secret
  sensitive = true
}

output "verified_email" {
  value = aws_ses_email_identity.sender.email
} 