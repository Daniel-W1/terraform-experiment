provider "aws" {
  region = "us-east-1"
}

# IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "ec2_secrets_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2_secrets_profile"
  role = aws_iam_role.ec2_role.name
}

# S3 Bucket
resource "aws_s3_bucket" "my_bucket" {
  bucket = "binis-terraform-demo-bucket"
  force_destroy = true
}

# EC2 Instance
resource "aws_instance" "web" {
  ami           = "ami-0c7217cdde317cfec" # Amazon Linux 2023 AMI (us-east-1)
  instance_type = var.instance_type
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name = "terraform-ec2-key"
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y git gcc openssl-devel bzip2-devel libffi-devel zlib-devel xz-devel make
    cd /opt
    wget https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tgz
    tar xzf Python-3.10.12.tgz
    cd Python-3.10.12
    ./configure --enable-optimizations
    make altinstall
    ln -sf /usr/local/bin/python3.10 /usr/bin/python3.10
    ln -sf /usr/local/bin/pip3.10 /usr/bin/pip3.10
    cd /home/ec2-user
    git clone https://github.com/Biniyamseid/BackendDemo.git backend-demo
    cd backend-demo
    echo "AWS_REGION=us-east-1" >> .env
    echo "AWS_SECRET_NAME=terraform-demo-secrets" >> .env
    python3.10 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    nohup venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &
  EOF

  tags = {
    Name = "TerraformEC2"
  }
}

# RDS MySQL Database
resource "aws_db_instance" "default" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name             = "mydb"
  username            = "admin"
  password            = "Terraform123!"
  skip_final_snapshot = true
  
  # Security best practices
  publicly_accessible = false
  multi_az           = false
  
  tags = {
    Name = "TerraformRDS"
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.my_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.my_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.my_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_dynamodb_table" "sms_table" {
  name           = "smstable"
  billing_mode   = "PAY_PER_REQUEST" # or "PROVISIONED" if you want to set read/write capacity
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "smstable"
    Environment = "dev"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Allow HTTP inbound traffic"


ingress {
  from_port   = 8000
  to_port     = 8000
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}




