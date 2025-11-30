variable "users" {
  description = "Map of IAM users to create"
  type = map(object({
    email            = string
    permission_level = string
  }))
}

