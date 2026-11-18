param([string]$Source = 'C:\Users\handi\Downloads\3D프린터_활용_교육자료_20261118.pptx')
$ErrorActionPreference = 'Stop'
$project = Split-Path $PSScriptRoot -Parent
$output = Join-Path $project 'dist\assets\slides'
New-Item -ItemType Directory -Path $output -Force | Out-Null
$powerpoint = New-Object -ComObject PowerPoint.Application
$deck = $null
try {
    $deck = $powerpoint.Presentations.Open($Source, -1, 0, 0)
    $width = [double]$deck.PageSetup.SlideWidth
    $height = [double]$deck.PageSetup.SlideHeight
    $slides = @()
    foreach ($slide in $deck.Slides) {
        $number = [int]$slide.SlideIndex
        $stem = 'slide-{0:d2}' -f $number
        $slide.Export((Join-Path $output "$stem.png"), 'PNG', 1920, [int](1920 * $height / $width))
        $slide.Export((Join-Path $output "$stem-thumb.png"), 'PNG', 384, [int](384 * $height / $width))
        Write-Output "Exported $number / $($deck.Slides.Count)"
    }
    $metadata = @{ count = $deck.Slides.Count; width = $width; height = $height }
    $metadata | ConvertTo-Json | Set-Content -Encoding UTF8 (Join-Path $project 'export-info.json')
} finally {
    if ($deck) { $deck.Close(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($deck) }
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($powerpoint)
}
