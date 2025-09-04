# Tutorial: Installing PowerShell (pwsh) on Linux

## Ubuntu / Debian

```bash
sudo apt update && sudo apt install -y wget apt-transport-https software-properties-common
wget -q https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y powershell
pwsh
```

## RHEL / CentOS

```bash
sudo dnf install -y https://packages.microsoft.com/config/rhel/8/packages-microsoft-prod.rpm
sudo dnf install -y powershell
pwsh
```

## Fedora

```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo dnf install -y https://packages.microsoft.com/config/fedora/38/packages-microsoft-prod.rpm
sudo dnf install -y powershell
pwsh
```

## Arch Linux

```bash
yay -S powershell-bin
paru -S powershell-bin
pwsh
```

## Generic Install (Tarball)

```bash
wget https://github.com/PowerShell/PowerShell/releases/download/v7.4.4/powershell-7.4.4-linux-x64.tar.gz
sudo mkdir -p /opt/microsoft/powershell/7
sudo tar zxf powershell-7.4.4-linux-x64.tar.gz -C /opt/microsoft/powershell/7
sudo ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh
pwsh
```

## Verify Installation

```bash
pwsh --version
```
