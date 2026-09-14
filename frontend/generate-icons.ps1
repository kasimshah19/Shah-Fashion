Add-Type -AssemblyName System.Drawing

function New-Icon {
    param(
        [int]$size,
        [string]$filename
    )
    
    $bitmap = New-Object System.Drawing.Bitmap $size, $size
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill background
    $color = [System.Drawing.ColorTranslator]::FromHtml("#C15D82")
    $brush = New-Object System.Drawing.SolidBrush $color
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # Draw Text
    $font = New-Object System.Drawing.Font("Arial", ($size/3), [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
    $graphics.DrawString("SF", $font, $textBrush, $rect, $format)
    
    # Save
    $bitmap.Save("d:\Fashion\frontend\public\$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-Icon -size 192 -filename "pwa-192x192.png"
New-Icon -size 512 -filename "pwa-512x512.png"
New-Icon -size 512 -filename "maskable-icon.png"
New-Icon -size 180 -filename "apple-touch-icon.png"

Write-Host "Icons generated successfully."
