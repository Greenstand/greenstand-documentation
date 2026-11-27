variable "user_name" {
  type        = string
  description = "IAM username (e.g. vol-dmoney)"
}

variable "email" {
  type        = string
  description = "User email for tagging"
}

variable "permission_level" {
  type        = string
  description = "Logical permission level"
  validation {
    condition     = contains(["ReadOnly", "PowerUser", "Admin"], var.permission_level)
    error_message = "permission_level must be one of: ReadOnly, PowerUser, Admin."
  }
}
