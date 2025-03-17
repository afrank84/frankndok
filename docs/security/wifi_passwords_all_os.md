# Wifi Password Retrieval

### 📡 How to View Saved WiFi Passwords on Linux, Windows, and macOS

Sometimes, you may need to retrieve a WiFi password stored on your computer. Whether you've forgotten it or need to share it with someone, this guide will show you how to list all saved WiFi passwords on **Linux, Windows (PowerShell), and macOS** using a single command for each system.

---

## 🐧 Linux (Debian-based)
On Linux, WiFi passwords are stored in the **NetworkManager** system connections folder. To display all saved passwords, open a terminal and run:

```bash
sudo grep -r '^psk=' /etc/NetworkManager/system-connections/ | awk -F '=' '{print "SSID: " $1 "\nPassword: " $2 "\n"}'
```

### 🔍 Explanation:
- `sudo`: Runs the command as root (needed to access network configurations).
- `grep -r '^psk='`: Searches recursively for the `psk=` (pre-shared key) in network configuration files.
- `/etc/NetworkManager/system-connections/`: The directory where WiFi profiles are stored.
- `awk -F '=' '{print "SSID: " $1 "\nPassword: " $2 "\n"}'`: Extracts and formats the SSID (WiFi name) and password.

### 📌 Example Output:
```
SSID: MyHomeWiFi
Password: mysecurepassword123
```

---

## 🖥️ Windows (PowerShell)
On Windows, saved WiFi profiles can be retrieved using `netsh`. Open PowerShell **as Administrator** and run:

```powershell
(netsh wlan show profiles) -match '\s:\s' | % {$_ -replace '.*:\s'} | % {"SSID: $_ `nPassword: " + ((netsh wlan show profile name="$_" key=clear | Select-String "Key Content") -replace '.*:\s', '') + "`n"}
```

### 🔍 Explanation:
- `netsh wlan show profiles`: Lists all saved WiFi profiles.
- `-match '\s:\s'`: Extracts SSID names from the output.
- `netsh wlan show profile name="SSID" key=clear`: Displays details of each WiFi profile, including its password.
- `Select-String "Key Content"`: Filters the output to show only the password.
- `-replace '.*:\s', ''`: Removes unnecessary text for clean output.

### 📌 Example Output:
```
SSID: MyHomeWiFi
Password: mysecurepassword123
```

---

## 🍏 macOS
On macOS, WiFi passwords are stored in the Keychain. To retrieve them, open a terminal and run:

```bash
networksetup -listpreferredwirelessnetworks en0 | awk -F': ' 'NR>1 {print $2}' | while read ssid; do echo "SSID: $ssid"; security find-generic-password -ga "$ssid" 2>&1 | grep "password:" | awk -F'"' '{print "Password: " $2}'; echo ""; done
```

### 🔍 Explanation:
- `networksetup -listpreferredwirelessnetworks en0`: Lists all saved WiFi SSIDs.
- `awk -F': ' 'NR>1 {print $2}'`: Extracts only the SSID names.
- `while read ssid; do ... done`: Loops through each SSID to find its password.
- `security find-generic-password -ga "$ssid"`: Retrieves the WiFi password from Keychain (may prompt for your Mac password).
- `grep "password:" | awk -F'"' '{print "Password: " $2}'`: Extracts and formats the password.

### 📌 Example Output:
```
SSID: MyHomeWiFi
Password: mysecurepassword123
```

---

## ⚠️ Important Notes
- **Linux:** Requires `sudo` privileges.
- **Windows:** PowerShell must be run **as Administrator**.
- **macOS:** The command will **prompt for your Mac password** when accessing the Keychain.

---

## 🎯 Conclusion
With these simple commands, you can quickly retrieve all saved WiFi passwords on **Linux, Windows, and macOS**. This can be useful when reconnecting devices, sharing WiFi with friends, or troubleshooting network issues.


---
