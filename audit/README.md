# Luna Repo Clinic scanner

`repo-audit.ps1` performs a local, read-only repository hygiene scan. It is deliberately a triage tool, not a penetration test, security certification, or substitute for a qualified human review.

The scanner inspects filenames and text patterns without executing repository code. It reports evidence and suggested follow-ups for:

- documentation and onboarding basics;
- CI workflow presence and obvious permission/pinning signals;
- dependency manifests and lockfiles;
- security contact and ownership files;
- common high-risk source patterns that deserve human review;
- tests, formatting, and repository hygiene signals.

Example:

```powershell
pwsh -File .\repo-audit.ps1 -Path C:\path\to\clone -OutputPath .\reports\sample.md
```

Use `-IncludeFileList` only for small repositories. Never run customer code as part of this scan, and treat every finding as a lead to validate.
