output "api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}
output "ecr_repo_url" {
  value = aws_ecr_repository.api_repo.repository_url
}
