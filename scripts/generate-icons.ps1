Add-Type -AssemblyName System.Drawing

function Generate-IotIcon {
    param(
        [int]$size,
        [string]$outputPath,
        [bool]$maskable = $false,
        [int]$cornerRadius = 0
    )

    $bitmap = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background
    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.ColorTranslator]::FromHtml("#0f172a")), ([System.Drawing.ColorTranslator]::FromHtml("#0284c7")), 45.0
    $g.FillRectangle($brush, $rect)

    # Scale factor
    $scale = if ($maskable) { 0.65 } else { 0.8 }
    $innerSize = [int]($size * $scale)
    $offset = [int](($size - $innerSize) / 2)

    # Chip Outer Body
    $chipX = $offset + [int]($innerSize * 0.16)
    $chipY = $offset + [int]($innerSize * 0.16)
    $chipW = [int]($innerSize * 0.68)
    $chipH = [int]($innerSize * 0.68)
    $chipRadius = [int]($innerSize * 0.1)

    # Chip fill with gradient
    $chipRect = New-Object System.Drawing.Rectangle $chipX, $chipY, $chipW, $chipH
    $chipBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $chipRect, ([System.Drawing.ColorTranslator]::FromHtml("#0284c7")), ([System.Drawing.ColorTranslator]::FromHtml("#06b6d4")), 45.0
    
    # Path for rounded chip
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $chipRadius * 2
    $path.AddArc($chipX, $chipY, $d, $d, 180, 90)
    $path.AddArc($chipX + $chipW - $d, $chipY, $d, $d, 270, 90)
    $path.AddArc($chipX + $chipW - $d, $chipY + $chipH - $d, $d, $d, 0, 90)
    $path.AddArc($chipX, $chipY + $chipH - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.FillPath($chipBrush, $path)

    # Inner core
    $coreW = [int]($chipW * 0.45)
    $coreH = [int]($chipH * 0.45)
    $coreX = $chipX + [int](($chipW - $coreW) / 2)
    $coreY = $chipY + [int](($chipH - $coreH) / 2)
    $coreRect = New-Object System.Drawing.Rectangle $coreX, $coreY, $coreW, $coreH
    $coreBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#0f172a"))
    $g.FillRectangle($coreBrush, $coreRect)

    # Core inner glow
    $glowW = [int]($coreW * 0.5)
    $glowH = [int]($coreH * 0.5)
    $glowX = $coreX + [int](($coreW - $glowW) / 2)
    $glowY = $coreY + [int](($coreH - $glowH) / 2)
    $glowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#38bdf8"))
    $g.FillRectangle($glowBrush, (New-Object System.Drawing.Rectangle $glowX, $glowY, $glowW, $glowH))

    # Pins Pen
    $penWidth = [Math]::Max(2, [int]($size * 0.025))
    $pinPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#38bdf8")), $penWidth
    $pinPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pinPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $pinLen = [int]($innerSize * 0.12)

    # Top & Bottom Pins (2 pairs)
    $p1 = $chipX + [int]($chipW * 0.35)
    $p2 = $chipX + [int]($chipW * 0.65)
    
    # Top
    $g.DrawLine($pinPen, $p1, ($chipY - $pinLen), $p1, $chipY)
    $g.DrawLine($pinPen, $p2, ($chipY - $pinLen), $p2, $chipY)
    # Bottom
    $g.DrawLine($pinPen, $p1, ($chipY + $chipH), $p1, ($chipY + $chipH + $pinLen))
    $g.DrawLine($pinPen, $p2, ($chipY + $chipH), $p2, ($chipY + $chipH + $pinLen))

    # Left & Right Pins (2 pairs)
    $py1 = $chipY + [int]($chipH * 0.35)
    $py2 = $chipY + [int]($chipH * 0.65)
    # Left
    $g.DrawLine($pinPen, ($chipX - $pinLen), $py1, $chipX, $py1)
    $g.DrawLine($pinPen, ($chipX - $pinLen), $py2, $chipX, $py2)
    # Right
    $g.DrawLine($pinPen, ($chipX + $chipW), $py1, ($chipX + $chipW + $pinLen), $py1)
    $g.DrawLine($pinPen, ($chipX + $chipW), $py2, ($chipX + $chipW + $pinLen), $py2)

    # Clean up and save
    $g.Dispose()
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Output "Generated icon: $outputPath ($($size)x$($size))"
}

$destDir = "D:\projects\R_IOT_devices\client\public"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force }

Generate-IotIcon -size 192 -outputPath "$destDir\pwa-192x192.png"
Generate-IotIcon -size 512 -outputPath "$destDir\pwa-512x512.png"
Generate-IotIcon -size 512 -outputPath "$destDir\maskable-icon-512x512.png" -maskable $true
Generate-IotIcon -size 180 -outputPath "$destDir\apple-touch-icon.png"
Generate-IotIcon -size 64  -outputPath "$destDir\pwa-64x64.png"

