# Creates images/matrix-bg.png (optional backdrop asset).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = $PSScriptRoot
$dir = Join-Path $root 'images'
if (-not (Test-Path -LiteralPath $dir)) {
  New-Item -ItemType Directory -Force -LiteralPath $dir | Out-Null
}

$W, $H = 1920, 1080
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Black)

$rect = New-Object System.Drawing.Rectangle 0, 0, $W, $H
$gb = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
  $rect,
  [System.Drawing.Color]::FromArgb(120, 10, 20, 45),
  [System.Drawing.Color]::FromArgb(255, 0, 0, 0),
  [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
)
$g.FillRectangle($gb, $rect)
$gb.Dispose()

$redPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$redPath.AddEllipse([int]($W * 0.12), [int]($H * 0.42), 220, 100)
$redBr = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 220, 50, 65))
$g.FillPath($redBr, $redPath)
$redBr.Dispose()
$redPath.Dispose()

$bluePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$bluePath.AddEllipse([int]($W * 0.72), [int]($H * 0.42), 220, 100)
$blueBr = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 55, 140, 240))
$g.FillPath($blueBr, $bluePath)
$blueBr.Dispose()
$bluePath.Dispose()

$outM = Join-Path $dir 'matrix-bg.png'
$bmp.Save($outM, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

Write-Host "Wrote: $outM"
