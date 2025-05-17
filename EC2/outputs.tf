output "ec2_public_ip" {
  value = aws_instance.nextjs_app.public_ip
}

output "public_dns" {
  value = aws_instance.nextjs_app.public_dns
}
