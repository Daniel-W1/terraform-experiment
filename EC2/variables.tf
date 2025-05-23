variable "instance_type" {
  default = "t2.medium"
}

variable "ami_id" {
  description = "Amazon Linux 2023 AMI ID"
  default     = "ami-0230bd60aa48260c6"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 instance access"
  type        = string
}
