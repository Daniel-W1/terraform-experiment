resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = var.ssh_public_key
}

resource "aws_security_group" "nextjs_sg" {
  name        = "nextjs-security-group"
  description = "Security group for Next.js application"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
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

resource "aws_instance" "nextjs_app" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = "terraform-ec2-key-pair"

  vpc_security_group_ids = [aws_security_group.nextjs_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y nodejs npm git
              npm install -g pm2
              mkdir -p /var/www/nextjs
              chown -R ec2-user:ec2-user /var/www/nextjs
              EOF

  tags = {
    Name = "NextJSApp"
  }
}
