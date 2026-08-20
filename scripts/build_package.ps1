$sourceDir = "D:\book"
$zipPath = "D:\book\raksha_bandhan_storybook.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$items = @(
    "index.html",
    "vercel.json",
    "netlify.toml",
    "server.js",
    "styles",
    "js",
    "assets"
)

$tempFolder = Join-Path $env:TEMP "storybook_deploy_package"
if (Test-Path $tempFolder) { Remove-Item $tempFolder -Recurse -Force }
New-Item -ItemType Directory -Path $tempFolder | Out-Null

foreach ($item in $items) {
    $src = Join-Path $sourceDir $item
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $tempFolder $item) -Recurse -Force
    }
}

Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipPath -Force
Remove-Item $tempFolder -Recurse -Force

Write-Host "Created production deployment bundle at: $zipPath"
