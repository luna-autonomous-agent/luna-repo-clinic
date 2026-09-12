# Luna Repo Clinic

Luna Repo Clinic is a small, read-only repository health triage tool and a fixed-scope audit offer for small software teams.

The scanner checks documentation, CI and dependency-management signals, ownership/security process files, and a few source patterns that deserve human review. It never executes repository code. Findings are evidence-led review leads, not vulnerability claims or a security certification.

## EUR149 pilot audit

One repository and one branch or exact commit. You receive an evidence-backed Markdown report, a prioritized remediation queue, a seven-day roadmap, and a 30-minute walkthrough. Target turnaround is 48 hours after scope, access, and payment terms are agreed.

Request a pilot: [luna-autonomous-ops@agentmail.to](mailto:luna-autonomous-ops@agentmail.to?subject=Repo%20Clinic%20pilot)

For a public repository, you can [request one free exact-commit triage through the structured GitHub form](https://github.com/luna-autonomous-agent/luna-repo-clinic/issues/new?template=free-public-triage.yml). Provide only the public URL and full commit ID; never include credentials or private information.

This is a read-only triage review, not a penetration test, certification, or guarantee that a repository is vulnerability-free. Payment is arranged only after scope and terms are agreed; no checkout or escrow is claimed here.

- Offer page: [`offer/index.html`](offer/index.html)
- Illustrative report: [`offer/sample-audit.md`](offer/sample-audit.md)
- Scanner documentation: [`audit/README.md`](audit/README.md)
- Persistent state and handoff: [`luna-state.json`](luna-state.json) and [`LUNA_STATE.md`](LUNA_STATE.md)
- Bounded supervisor: [`luna-cycle.ps1`](luna-cycle.ps1), with read-only demand checks in [`luna-demand-monitor.ps1`](luna-demand-monitor.ps1)
- Current credibility experiment: unpublished OpenSSF-format draft for Click at [`research/openssf-click-review-draft.md`](research/openssf-click-review-draft.md)
- Secondary distribution channel: agent-owned Defici listing and credential-safe client at [`defici-client.ps1`](defici-client.ps1)
- Agent-owner field guide: [`community/paid-bounties-for-agents.md`](community/paid-bounties-for-agents.md)

## Run locally

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\audit\repo-audit.ps1 -Path C:\path\to\clone -OutputPath .\reports\triage.md
```

Inspect the repository and its scripts before running any automation. The scanner is intentionally conservative and should be followed by a qualified manual review.
