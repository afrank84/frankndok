# Tutorial: Using Active Directory from Linux with PowerShell (pwsh)

## 0) Prerequisites

* A Windows Server or management VM joined to the AD domain with RSAT installed (ActiveDirectory PowerShell module).
* WinRM enabled on that Windows host.
* On Linux: `pwsh` installed. Optional but recommended: Kerberos configured (`/etc/krb5.conf`) so you can use Kerberos (Negotiate) instead of Basic.

---

## 1) Prepare the Windows AD Management Host (one-time)

Run these on a Windows Server or a Windows 10/11 admin VM that is domain-joined.

```powershell
# Install RSAT Active Directory tools (if not already present)
# Windows Server:
Install-WindowsFeature RSAT-AD-PowerShell

# Windows 10/11 (admin PowerShell):
Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0

# Enable PowerShell remoting (WinRM)
Enable-PSRemoting -Force

# Optional: allow remoting only from specific subnets or via HTTPS, per your security policy
# For domain environments using Kerberos, HTTP with mutual auth is common.
```

Confirm the AD module is available:

```powershell
Get-Module -ListAvailable ActiveDirectory
```

---

## 2) From Linux: Connect to the AD Host using pwsh

If you have Kerberos configured on Linux, obtain a ticket (optional but recommended):

```bash
kinit youradminuser@EXAMPLE.COM
```

Open `pwsh` on Linux, then create a session to the Windows AD host:

```powershell
# Option A: Kerberos/Negotiate (preferred in-domain)
$cred = Get-Credential  # enter DOMAIN\user or user@domain and password
$s = New-PSSession -ComputerName dc1.example.com -Authentication Negotiate -Credential $cred

# Option B: Basic over HTTPS (only if your WinRM listener is HTTPS)
# $s = New-PSSession -ComputerName dc1.example.com -UseSSL -Authentication Basic -Credential $cred

# Enter interactive session (optional)
Enter-PSSession $s
```

Inside the remote session (or via Invoke-Command), load the AD module and test:

```powershell
Import-Module ActiveDirectory
Get-ADDomain
Get-ADForest
```

If you prefer to run AD cmdlets locally without staying in a remote session, use implicit remoting:

```powershell
# From your local pwsh session on Linux
Import-Module ActiveDirectory -PSSession $s
# Now AD cmdlets are proxied to the Windows host:
Get-ADUser -Filter 'Name -like "*"' -ResultSetSize 5
```

---

## 3) Common Day-to-Day AD Tasks (via AD module)

### 3.1 Query users, groups, computers

```powershell
# Users
Get-ADUser -Identity jdoe -Properties mail,department,title
Get-ADUser -Filter 'Enabled -eq $true' -SearchBase "OU=Users,OU=Corp,DC=example,DC=com" -ResultSetSize 50

# Groups
Get-ADGroup -Identity "Sec-IT-Admins" -Properties ManagedBy
Get-ADGroupMember -Identity "Sec-IT-Admins"

# Computers
Get-ADComputer -Filter 'OperatingSystem -like "*Windows*"' -Properties OperatingSystem
```

### 3.2 Create and update users

```powershell
# Create a user
New-ADUser -Name "Jane Doe" -SamAccountName jdoe `
  -GivenName Jane -Surname Doe `
  -UserPrincipalName jdoe@example.com `
  -Path "OU=Users,OU=Corp,DC=example,DC=com" `
  -Enabled $true

# Set password and force change at next logon
Set-ADAccountPassword -Identity jdoe -Reset -NewPassword (ConvertTo-SecureString 'Str0ngP@ss!' -AsPlainText -Force)
Set-ADUser -Identity jdoe -ChangePasswordAtLogon $true
```

### 3.3 Unlock or disable accounts

```powershell
Unlock-ADAccount -Identity jdoe
Disable-ADAccount -Identity temp.user
Enable-ADAccount -Identity temp.user
```

### 3.4 Group membership

```powershell
Add-ADGroupMember -Identity "Sec-IT-Admins" -Members jdoe
Remove-ADGroupMember -Identity "Sec-IT-Admins" -Members jdoe -Confirm:$false
```

### 3.5 Move objects and manage OUs

```powershell
# Move a user to a different OU
Get-ADUser jdoe | Move-ADObject -TargetPath "OU=Engineering,OU=Corp,DC=example,DC=com"

# Create an OU
New-ADOrganizationalUnit -Name "Lab" -Path "OU=Corp,DC=example,DC=com"
```

---

## 4) Bulk Operations from CSV

Prepare a CSV (example: `/tmp/new_users.csv`):

```csv
GivenName,Surname,SamAccountName,UPN,OU,TempPassword
Alice,Ng,ang,ang@example.com,"OU=Users,OU=Corp,DC=example,DC=com",S0meP@ss!
Bob,Lee,blee,blee@example.com,"OU=Users,OU=Corp,DC=example,DC=com",S0meP@ss!
```

Import and create:

```powershell
$rows = Import-Csv /tmp/new_users.csv
foreach ($r in $rows) {
  New-ADUser -Name "$($r.GivenName) $($r.Surname)" `
    -GivenName $r.GivenName -Surname $r.Surname `
    -SamAccountName $r.SamAccountName `
    -UserPrincipalName $r.UPN `
    -Path $r.OU -Enabled $true

  Set-ADAccountPassword -Identity $r.SamAccountName -Reset -NewPassword (ConvertTo-SecureString $r.TempPassword -AsPlainText -Force)
  Set-ADUser -Identity $r.SamAccountName -ChangePasswordAtLogon $true
}
```

---

## 5) Running AD Commands Without a Windows Hop (LDAP from pwsh)

This approach uses LDAP/LDAPS directly from Linux. It does not require RSAT, but your Domain Controllers must allow LDAP or LDAPS (636 recommended with a proper certificate). This is useful for read operations or specific write operations when you cannot use WinRM.

```powershell
# Minimal LDAP search using .NET's DirectoryServices.Protocols
$domain = "example.com"
$dc = "dc1.example.com"      # or a VIP/load balancer for LDAP
$bindUser = "EXAMPLE\ldap_svc"  # or user@example.com
$bindPass = "YourPasswordHere"
$baseDN = "DC=example,DC=com"

Add-Type -AssemblyName System.DirectoryServices.Protocols

$cred = New-Object System.Net.NetworkCredential($bindUser, $bindPass)
$conn = New-Object System.DirectoryServices.Protocols.LdapConnection($dc)
$conn.Credential = $cred
$conn.AuthType = [System.DirectoryServices.Protocols.AuthType]::Negotiate
$conn.SessionOptions.ProtocolVersion = 3

# For LDAPS:
# $conn.SessionOptions.SecureSocketLayer = $true
# $conn.SessionOptions.VerifyServerCertificate = { param($c,$cert) $true }  # replace with proper validation

$conn.Bind()

# Search for enabled users in a specific OU
$searchBase = "OU=Users,OU=Corp,$baseDN"
$filter = "(&(objectClass=user)(!(objectClass=computer))(userAccountControl:1.2.840.113556.1.4.803:=512))"
$attrs = @("cn","sAMAccountName","mail")

$req = New-Object System.DirectoryServices.Protocols.SearchRequest($searchBase, $filter, "Subtree", $attrs)
$res = $conn.SendRequest($req)

foreach ($entry in $res.Entries) {
  $cn  = $entry.Attributes["cn"][0]
  $sam = $entry.Attributes["sAMAccountName"][0]
  $mail= $entry.Attributes["mail"][0]
  "$cn`t$sam`t$mail"
}

$conn.Dispose()
```

Modify operations (example: add a user to a group by updating the group’s `member` attribute):

```powershell
$groupDN = "CN=Sec-IT-Admins,OU=Groups,OU=Corp,DC=example,DC=com"
$userDN  = "CN=Jane Doe,OU=Users,OU=Corp,DC=example,DC=com"

$mod = New-Object System.DirectoryServices.Protocols.DirectoryAttributeModification
$mod.Name = "member"
$mod.Operation = [System.DirectoryServices.Protocols.DirectoryAttributeOperation]::Add
$mod.Add($userDN)

$mreq = New-Object System.DirectoryServices.Protocols.ModifyRequest($groupDN, $mod)
$conn.SendRequest($mreq)
```

---

## 6) Troubleshooting

### WinRM or remoting errors

```powershell
# From the Windows host
winrm quickconfig
winrm enumerate winrm/config/listener
Test-WSMan
```

* Ensure DNS resolves the Windows host from Linux and vice versa.
* Verify that the Windows host’s firewall allows WinRM (HTTP 5985, HTTPS 5986).
* If not using Kerberos, prefer HTTPS and Basic only when strictly required and permitted.

### Kerberos issues

* Ensure Linux clock skew is under 5 minutes compared to the domain controllers.
* Verify `/etc/krb5.conf` realm and KDC entries are correct.
* Use `klist` to confirm you have a valid TGT.

### LDAP/LDAPS issues

* Test connectivity: `telnet dc1.example.com 389` or `openssl s_client -connect dc1.example.com:636`.
* For LDAPS, ensure the DC has a valid server certificate trusted by your Linux machine.
* Check base DN and filters for correctness.

---

## 7) Quick Reference

```powershell
# Start a remote session to AD host and load the module
$cred = Get-Credential
$s = New-PSSession -ComputerName dc1.example.com -Authentication Negotiate -Credential $cred
Import-Module ActiveDirectory -PSSession $s

# Examples
Get-ADUser -Identity jdoe -Properties *
New-ADUser -Name "Jane Doe" -SamAccountName jdoe -UserPrincipalName jdoe@example.com -Path "OU=Users,OU=Corp,DC=example,DC=com" -Enabled $true
Set-ADAccountPassword -Identity jdoe -Reset -NewPassword (ConvertTo-SecureString 'Str0ngP@ss!' -AsPlainText -Force)
Add-ADGroupMember -Identity "Sec-IT-Admins" -Members jdoe
Get-ADComputer -Filter * -SearchBase "OU=Servers,DC=example,DC=com"
```
