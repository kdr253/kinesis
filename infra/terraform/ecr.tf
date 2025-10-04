resource "aws_ecr_repository" "api_repo" {
  name = "${var.project_name}-api-${var.team_suffix}"
  image_scanning_configuration { scan_on_push = false }
  tags = { Owner = "AI-Hackathon", Team = var.team_name }
}
