$ErrorActionPreference = 'Stop'
$project = Split-Path $PSScriptRoot -Parent
$source = Join-Path $project 'source.pptx'
$output = Join-Path $project 'dist\3D-printer-education.pptx'
$powerpoint = New-Object -ComObject PowerPoint.Application
$deck = $null
try {
    $deck = $powerpoint.Presentations.Open($source, -1, 0, 0)
    if ($deck.Slides.Count -ne 54) { throw 'Expected the original 54-slide presentation.' }
    $excluded = Get-Content -Raw (Join-Path $PSScriptRoot 'excluded-slides.json') | ConvertFrom-Json
    foreach ($i in ($excluded | Sort-Object -Descending)) { $deck.Slides.Item([int]$i).Delete() }
    $deck.SaveAs($output, 24)
    Write-Output "Saved download with $($deck.Slides.Count) slides."
} finally {
    if ($deck) { $deck.Close(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($deck) }
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($powerpoint)
}
