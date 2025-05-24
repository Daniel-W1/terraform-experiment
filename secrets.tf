# AWS Secrets Manager
resource "aws_secretsmanager_secret" "terraform_demo_secrets" {
  name        = "terraform-demo-secrets"
  description = "Secrets for Terraform demo application"
}

# Store the secrets
resource "aws_secretsmanager_secret_version" "terraform_demo_secrets" {
  secret_id = aws_secretsmanager_secret.terraform_demo_secrets.id
  secret_string = jsonencode({
    AWS_ACCESS_KEY_ID     = var.aws_access_key_id
    AWS_SECRET_ACCESS_KEY = var.aws_secret_access_key
    API_KEY              = var.api_key
  })
}

# IAM policy for EC2 instance to access Secrets Manager
resource "aws_iam_role_policy" "secrets_access" {
  name = "secrets-access-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.terraform_demo_secrets.arn
        ]
      }
    ]
  })
} 