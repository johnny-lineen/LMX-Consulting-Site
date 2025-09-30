# PowerShell Script to Reorganize Resources
# This script reorganizes your resource files into the expected structure

$baseFolder = "C:\Users\jline\OneDrive\Desktop\resources"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Resource Folder Reorganization Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Base folder: $baseFolder" -ForegroundColor Yellow
Write-Host ""

# Create type-based folders
Write-Host "Creating type-based folders..." -ForegroundColor Green
$folders = @('guides', 'checklists', 'ebooks', 'toolkits', 'covers')

foreach ($folder in $folders) {
    $folderPath = Join-Path $baseFolder $folder
    if (!(Test-Path $folderPath)) {
        New-Item -Path $folderPath -ItemType Directory -Force | Out-Null
        Write-Host "  ✓ Created: $folder/" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Exists: $folder/" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Finding and organizing files..." -ForegroundColor Green
Write-Host ""

# Find all PDFs and DOCX files in nested folders
$files = Get-ChildItem -Path $baseFolder -Recurse -Include "*.pdf","*.docx" -File | 
    Where-Object { $_.DirectoryName -notmatch "\\(guides|checklists|ebooks|toolkits|covers)$" }

$fileCount = 0

foreach ($file in $files) {
    $fileName = $file.Name
    $destFolder = "guides" # Default
    
    # Determine destination based on filename
    if ($fileName -like "*checklist*" -or $fileName -like "*Checklist*") {
        $destFolder = "checklists"
    }
    elseif ($fileName -like "*guide*" -or $fileName -like "*Guide*") {
        $destFolder = "guides"
    }
    elseif ($fileName -like "*ebook*" -or $fileName -like "*E-book*") {
        $destFolder = "ebooks"
    }
    elseif ($fileName -like "*toolkit*" -or $fileName -like "*Toolkit*") {
        $destFolder = "toolkits"
    }
    
    $destPath = Join-Path (Join-Path $baseFolder $destFolder) $fileName
    
    # Check if file already exists in destination
    if (Test-Path $destPath) {
        Write-Host "  ⚠️  Skipped (exists): $fileName" -ForegroundColor Yellow
    } else {
        Copy-Item $file.FullName -Destination $destPath -Force
        Write-Host "  ✓ Copied to $destFolder/: $fileName" -ForegroundColor Green
        $fileCount++
    }
}

Write-Host ""
Write-Host "Finding and organizing cover images..." -ForegroundColor Green
Write-Host ""

# Find all image files for covers
$images = Get-ChildItem -Path $baseFolder -Recurse -Include "*.jpg","*.png","*.jpeg" -File | 
    Where-Object { $_.DirectoryName -notmatch "\\covers$" }

$imageCount = 0

foreach ($image in $images) {
    $imageName = $image.Name
    $destPath = Join-Path (Join-Path $baseFolder "covers") $imageName
    
    # Check if already exists
    if (Test-Path $destPath) {
        Write-Host "  ⚠️  Skipped (exists): $imageName" -ForegroundColor Yellow
    } else {
        Copy-Item $image.FullName -Destination $destPath -Force
        Write-Host "  ✓ Copied to covers/: $imageName" -ForegroundColor Green
        $imageCount++
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Reorganization Complete!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  - Files organized: $fileCount" -ForegroundColor White
Write-Host "  - Images organized: $imageCount" -ForegroundColor White
Write-Host ""
Write-Host "Your resources folder now has:" -ForegroundColor Yellow
Write-Host "  - guides/      (guide PDFs)" -ForegroundColor White
Write-Host "  - checklists/  (checklist PDFs)" -ForegroundColor White
Write-Host "  - ebooks/      (ebook PDFs)" -ForegroundColor White
Write-Host "  - toolkits/    (toolkit files)" -ForegroundColor White
Write-Host "  - covers/      (all cover images)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your dev server: npm run dev" -ForegroundColor White
Write-Host "  2. Go to /admin/resources" -ForegroundColor White
Write-Host "  3. Click 'Import from Folder'" -ForegroundColor White
Write-Host "  4. Select files to import!" -ForegroundColor White
Write-Host ""
Write-Host "Note: Original files were COPIED, not moved." -ForegroundColor Gray
Write-Host "      You can safely delete the old nested folders if desired." -ForegroundColor Gray
Write-Host ""
