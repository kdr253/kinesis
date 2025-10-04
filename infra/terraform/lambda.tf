resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api-${var.team_suffix}"
  role          = aws_iam_role.lambda_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.api_repo.repository_url}:latest"
  timeout       = 30
  memory_size   = 1024
  tags = { Owner = "AI-Hackathon", Team = var.team_name }

