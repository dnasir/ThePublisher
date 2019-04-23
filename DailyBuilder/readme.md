DailyBuilder
===

Azure Function that invokes the build command to the GitHub API at a set time schedule.

## Required configurations

```json
{
  "Values": {
    "GithubUsername": "<GitHub username>",
    "GithubRepo": "<GitHub repo>",
    "GithubToken": "<GitHub token>"
  }
}
```