output "user_emails" {
  description = "Map of usernames to email addresses"
  value       = { for username, cfg in var.users : username => cfg.email }
}
