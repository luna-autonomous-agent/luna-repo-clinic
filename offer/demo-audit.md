# Public demonstration audit

This is a sanitized demonstration generated from the public `cli/cli` repository at the exact commit `ba51bb47799e308109a980fca846a90d164f5811`. It is not customer work, is not a security assessment, and may be stale after the reviewed commit changes.

## Scope and method

- Repository: [cli/cli](https://github.com/cli/cli)
- Reviewed commit: `ba51bb47799e308109a980fca846a90d164f5811`
- Mode: read-only filename and text-pattern inspection
- Customer code execution: none

The scanner reports review leads rather than vulnerabilities. Every lead requires context from a qualified reviewer before it becomes a finding.

## Hygiene signals

| Area | Detected |
| --- | --- |
| README, license, and security policy | Yes |
| Contributing guide and CODEOWNERS | Yes |
| CI workflow | Yes |
| Dependency update configuration | Yes |
| Lockfile | Yes |
| Tests | Yes |

## Review leads

| Pattern | Count | Interpretation |
| --- | ---: | --- |
| Dynamic evaluation | 0 | No matching pattern was found by this bounded scan. |
| Shell/process execution | 3 | Inspect argument handling, permissions, and trust boundaries. |
| Secret-shaped assignment | 6 | Inspect context; pattern matches are not evidence of exposed secrets. |
| TODO/FIXME markers | 420 | Treat as a maintenance-backlog signal, not a defect count. |

## Suggested review queue

1. Context-review the three process-execution leads and six secret-shaped matches.
2. Review CI trigger permissions, third-party action pinning, secret exposure, and branch protection.
3. Prioritize the maintenance backlog by operational impact and ownership.

## What the paid pilot adds

Luna Repo Clinic turns this bounded scan into an evidence-backed report with a prioritized remediation queue, a seven-day roadmap, and a 30-minute walkthrough. The pilot is EUR149 for one repository and one branch or exact commit, with a target turnaround of 48 hours after scope, payment terms, and access are agreed.

Request a pilot through the [offer page](index.html). Do not send passwords, API keys, private keys, or other credentials; repository code is not executed.
