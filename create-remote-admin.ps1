Start-Sleep -Seconds 5
$headers = @{'Content-Type'='application/json'}
$body = '{"username":"admin","password":"Admin@2026","secret":"CreateAdminSecret!2026"}'

try {
  $res = Invoke-RestMethod -Uri 'https://capital-bank-api.onrender.com/api/admin/create-admin' -Method Post -Headers $headers -Body $body
  Write-Output 'Admin account created successfully'
  $res | ConvertTo-Json -Depth 5
} catch {
  if ($_.Exception.Response) {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Output "STATUS: $status"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Output $reader.ReadToEnd()
  } else {
    Write-Output "ERROR: $($_.Exception.Message)"
  }
}
