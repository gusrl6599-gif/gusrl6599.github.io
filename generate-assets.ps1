# Creates images/profile.png and images/matrix-bg.png (replace with your own photos anytime).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = $PSScriptRoot
$dir = Join-Path $root 'images'
if (-not (Test-Path -LiteralPath $dir)) {
  New-Item -ItemType Directory -Force -LiteralPath $dir | Out-Null
}

# --- matrix-bg.png ---
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

# --- profile.png ---
$S = 600
$p = New-Object System.Drawing.Bitmap $S, $S
$gp = [System.Drawing.Graphics]::FromImage($p)
$gp.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gp.Clear([System.Drawing.Color]::FromArgb(255, 10, 22, 40))

$r2 = New-Object System.Drawing.Rectangle 0, 0, $S, $S
$bg2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
  $r2,
  [System.Drawing.Color]::FromArgb(255, 70, 58, 48),
  [System.Drawing.Color]::FromArgb(255, 12, 18, 32),
  [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
)
$gp.FillRectangle($bg2, $r2)
$bg2.Dispose()

$clip = New-Object System.Drawing.Drawing2D.GraphicsPath
$clip.AddEllipse(48, 48, $S - 96, $S - 96)
$gp.SetClip($clip)
$face = New-Object System.Drawing.Drawing2D.GraphicsPath
$face.AddEllipse(70, 120, $S - 140, $S - 200)
$fb = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 105, 92, 80))
$gp.FillPath($fb, $face)
$fb.Dispose()
$face.Dispose()
$gp.ResetClip()
$clip.Dispose()

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(210, 100, 255, 218), 6)
$gp.DrawEllipse($pen, 44, 44, $S - 89, $S - 89)
$pen.Dispose()

# No overlaid initials: keeps profile.png neutral for the site (replace file with a real photo anytime).

$outP = Join-Path $dir 'profile.png'
$p.Save($outP, [System.Drawing.Imaging.ImageFormat]::Png)
$gp.Dispose()
$p.Dispose()

Write-Host "Wrote: $outM"
Write-Host "Wrote: $outP"
