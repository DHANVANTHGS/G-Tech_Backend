$port = 5000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Killing process on port $port (PID: $process)..."
    Stop-Process -Id $process -Force
    Write-Host "Process killed."
} else {
    Write-Host "No process found on port $port."
}

Write-Host "Starting Backend Server..."
npm start
