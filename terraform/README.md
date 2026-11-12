**IAM Users – Terraform Management**
---
This directory contains the Terraform configuration used to manage all volunteer IAM users in AWS.
Everything is handled through code so that access is consistent, reviewed, and easy to update.

**How This Works**

- All IAM users are defined in a single file: `users.auto.tfvars.`

- Terraform reads this list and creates, updates, or removes users as needed.

- A reusable module `(modules/iam_user)` handles:

    - Creating the IAM user

    - Assigning tags

    - Applying the correct permission level

- GitHub Actions runs Terraform using secure AWS OIDC authentication, so no AWS access keys are stored anywhere.

This setup ensures that user access is managed in a clear, repeatable, and auditable way.

**Folder Structure**
``````
terraform/
  iam-users/
    main.tf
    variables.tf
    users.auto.tfvars
  modules/
    iam_user/
      main.tf
      variables.tf
``````
Adding or Updating a User

To add a new volunteer or update an existing one, edit the users.auto.tfvars file.
Example:
```json
users = {
  "vol-dmoney" = {
    email            = "darrell@example.org"
    permission_level = "ReadOnly"
  }

  "vol-jdoe" = {
    email            = "jdoe@example.org"
    permission_level = "PowerUser"
  }
}
```

*Valid permission_level values:*

- ReadOnly

- PowerUser

- Admin

Terraform will attach the appropriate AWS-managed policies for each level.

**Deploying Changes**
---

1. Once you update users.auto.tfvars:

2. Commit and push your changes.

3. Go to the GitHub Actions tab.

4. Run the workflow named IAM Users – Terraform.

The workflow initializes Terraform, shows the plan, and applies the changes automatically.

**Removing a User**
---
To remove a user, delete their entry from users.auto.tfvars.
Terraform will see the removal and plan to delete the IAM user.

If you want additional safety to prevent accidental deletion, we can add prevent_destroy to the module. Let me know if you'd like that enabled.

**Security Notes**
---
GitHub Actions uses OIDC to assume an AWS IAM role. No access keys are stored in the repository.

The IAM role is restricted to:

Only the volunteer IAM user path

Only the necessary IAM and CloudFormation permissions

Terraform state is stored in an S3 bucket configured for this project.

**Troubleshooting**
---
If something does not look right, you can:

Review the Terraform plan in GitHub Actions

Check for typos in `users.auto.tfvars`

Run Terraform locally (if you have permissions):

```terraform
terraform init
terraform plan
terraform apply

```
If you need help reviewing logs or adjusting the workflow, feel free to ask.