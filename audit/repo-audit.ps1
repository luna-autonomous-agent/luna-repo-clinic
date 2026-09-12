[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [string]$OutputPath,
    [switch]$IncludeFileList
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$resolved = (Resolve-Path -LiteralPath $Path -ErrorAction Stop).Path
if (-not (Test-Path -LiteralPath (Join-Path $resolved '.git'))) {
    throw "Path does not look like a Git repository: $resolved"
}

$files = Get-ChildItem -LiteralPath $resolved -Recurse -File -Force | Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and $_.Length -lt 2MB
}
$relative = @($files | ForEach-Object {
        $_.FullName.Substring($resolved.Length).TrimStart('\','/') -replace '\\','/'
    })
$lower = @($relative | ForEach-Object { $_.ToLowerInvariant() })

function Has-Any {
    param([string[]]$Candidates)
    foreach ($candidate in $Candidates) {
        if ($lower -contains $candidate.ToLowerInvariant()) { return $true }
    }
    return $false
}

function Count-Matches {
    param([string]$Pattern)
    $count = 0
    foreach ($file in $files) {
        if ($file.Extension -in @('.md','.txt','.yml','.yaml','.json','.toml','.ini','.cfg','.conf','.ps1','.psm1','.py','.js','.ts','.tsx','.jsx','.java','.go','.rs','.rb','.php','.cs','.cpp','.c','.h','.sh')) {
            $text = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction SilentlyContinue
            if ($text) { $count += ([regex]::Matches($text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count }
        }
    }
    return $count
}

$signals = [ordered]@{
    'README' = Has-Any @('readme','readme.md','readme.rst','readme.txt')
    'LICENSE' = Has-Any @('license','license.md','license.txt','copying','copying.txt')
    'SECURITY.md' = Has-Any @('security.md','.github/security.md')
    'CONTRIBUTING.md' = Has-Any @('contributing.md','.github/contributing.md')
    'CODEOWNERS' = Has-Any @('codeowners','.github/codeowners','docs/codeowners')
    'CI workflow' = @($lower | Where-Object { $_ -like '.github/workflows/*' -and $_ -match '\.(yml|yaml)$' }).Count -gt 0
    'Dependabot config' = Has-Any @('.github/dependabot.yml','.github/dependabot.yaml')
    'Lockfile' = @($lower | Where-Object { $_ -match '(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|pdm\.lock|pipfile\.lock|uv\.lock|cargo\.lock|go\.sum|composer\.lock|gemfile\.lock)$' }).Count -gt 0
    'Tests detected' = @($lower | Where-Object { $_ -match '(^|/)(test|tests|spec|specs)(/|$)' -or $_ -match '\.(test|spec)\.' }).Count -gt 0
}

$riskPatterns = [ordered]@{
    'Dynamic evaluation' = '\beval\s*\(|new\s+Function\s*\('
    'Shell/process execution' = '(child_process\.(exec|spawn)|subprocess\.(run|Popen|call)|os\.system\s*\(|shell=True|Invoke-Expression)'
    'Embedded secret-shaped assignment' = '(api[_-]?key|secret|password|private[_-]?key)\s*[:=]\s*["''][^"'']{12,}["'']'
    'TODO/FIXME markers' = '\b(TODO|FIXME|XXX|HACK)\b'
}
$risks = [ordered]@{}
foreach ($item in $riskPatterns.GetEnumerator()) { $risks[$item.Key] = Count-Matches $item.Value }

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('# Luna Repo Clinic - local triage report')
$lines.Add('')
$lines.Add(('Generated: `{0}`' -f (Get-Date).ToUniversalTime().ToString('o')))
$lines.Add(('Repository path: `{0}`' -f $resolved))
$lines.Add('')
$lines.Add('> This is an automated, read-only triage report. It is not a penetration test, security certification, or proof that a repository is safe. Validate every signal with a qualified reviewer.')
$lines.Add('')
$lines.Add('## Hygiene signals')
$lines.Add('')
$lines.Add('| Area | Detected |')
$lines.Add('| --- | ---: |')
foreach ($item in $signals.GetEnumerator()) {
    $detected = if ($item.Value) { 'yes' } else { 'no' }
    $lines.Add(('| {0} | {1} |' -f $item.Key, $detected))
}
$lines.Add('')
$lines.Add('## Review leads')
$lines.Add('')
$lines.Add('| Pattern | Count | Interpretation |')
$lines.Add('| --- | ---: | --- |')
$lines.Add('| Dynamic evaluation | {0} | Inspect context and input flow; matches are not automatically vulnerabilities. |' -f $risks['Dynamic evaluation'])
$lines.Add('| Shell/process execution | {0} | Check whether arguments and permissions are constrained. |' -f $risks['Shell/process execution'])
$lines.Add('| Secret-shaped assignment | {0} | Review matches immediately and rotate any real credential; pattern matching can be noisy. |' -f $risks['Embedded secret-shaped assignment'])
$lines.Add('| TODO/FIXME markers | {0} | Use as a maintenance backlog signal, not a defect count. |' -f $risks['TODO/FIXME markers'])
$lines.Add('')
$lines.Add('## Suggested next checks')
$lines.Add('')
$lines.Add('1. Confirm the default branch, release process, and supported versions with the maintainer.')
$lines.Add('2. Review CI trigger permissions, third-party action pinning, secret exposure, and branch protection manually.')
$lines.Add('3. Use the native ecosystem audit tool against a lockfile in an isolated environment; do not infer vulnerability status from filenames alone.')
$lines.Add('4. Run tests and linters only in a disposable environment after reviewing scripts and dependencies.')
$lines.Add('5. Prioritize findings by exploitability, exposure, evidence quality, and remediation effort.')

if ($IncludeFileList) {
    $lines.Add('')
    $lines.Add('## File inventory')
    $lines.Add('')
    foreach ($file in $relative | Sort-Object) { $lines.Add(('- `{0}`' -f $file)) }
}

$report = $lines -join [Environment]::NewLine
if ($OutputPath) {
    $out = [IO.Path]::GetFullPath($OutputPath)
    $parent = Split-Path -Parent $out
    if ($parent) { $null = New-Item -ItemType Directory -Force -Path $parent }
    [IO.File]::WriteAllText($out, $report, (New-Object System.Text.UTF8Encoding($false)))
    Write-Output $out
} else {
    Write-Output $report
}
