locals {
  # Map logical permission levels to AWS managed policy ARNs
  permission_policies = {
    ReadOnly = [
      "arn:aws:iam::aws:policy/ReadOnlyAccess"
    ]

    PowerUser = [
      "arn:aws:iam::aws:policy/PowerUserAccess"
    ]

    Admin = [
      "arn:aws:iam::aws:policy/AdministratorAccess"
    ]
  }

  policies_for_user = lookup(local.permission_policies, var.permission_level, [])
}

resource "aws_iam_user" "this" {
  name = var.user_name
  path = "/volunteers/"

  tags = {
    Purpose      = "VolunteerAccess"
    ContactEmail = var.email
    ManagedBy    = "Terraform"
  }
}

# Attach mapped AWS-managed policies
resource "aws_iam_user_policy_attachment" "managed" {
  for_each = toset(local.policies_for_user)

  user       = aws_iam_user.this.name
  policy_arn = each.value
}
