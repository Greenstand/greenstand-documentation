terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional but strongly recommended: S3 backend for state
  backend "s3" {
    bucket = "volunteer-access-cf"                 # your bucket
    key    = "terraform/iam-users/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

module "iam_user" {
  source = "../modules/iam_user"

  for_each = var.users

  user_name        = each.key
  email            = each.value.email
  permission_level = each.value.permission_level
}
