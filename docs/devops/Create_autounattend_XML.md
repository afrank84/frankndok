---
title: Automated Windows 11 Pro Install With Local Account (autounattend.xml)
description: Zero-touch-ish Windows 11 Pro install from USB that creates a local admin account and skips most OOBE screens.
---

## Goal

After a clean wipe and install of Windows 11 Pro, you want:

- A local admin account created automatically
- A temporary password set automatically
- The PC name set to `CATTLE-01`
- Minimal Out of Box Experience (OOBE) prompts

This is done using a Windows Setup answer file: `autounattend.xml`.

Microsoft docs (reference):
- Windows Setup automation overview (answer file name and where Setup searches) :contentReference[oaicite:0]{index=0}
- Automate OOBE (how Unattend controls OOBE screens) :contentReference[oaicite:1]{index=1}
- Local account creation elements (LocalAccount / LocalAccounts) :contentReference[oaicite:2]{index=2}

## What you need

- Windows 11 Pro install USB (created with Media Creation Tool, Rufus, etc.)
- Ability to boot the target PC from USB
- A keyboard

## Where to put the file

Copy the answer file to the root of the Windows install USB and name it:

- `autounattend.xml`

Example (if your USB is drive `E:` on another PC):
- `E:\autounattend.xml`

Windows Setup looks for `Autounattend.xml` on removable media at the root of the drive during clean installs from boot media. :contentReference[oaicite:3]{index=3}

## How to use it

1. Create a normal Windows 11 Pro bootable USB.
2. Copy `autounattend.xml` (from below) to the root of the USB.
3. Boot the target PC from the USB.
4. Run the install as usual.
   - This file does not auto-partition disks. You will still choose the disk/partition unless you add DiskConfiguration settings.
5. When Windows reboots into first boot / OOBE, it should automatically:
   - Skip most setup screens
   - Create the local admin account
   - Name the machine `CATTLE-01`
6. Log in with the local account and change the temporary password.

## Security warning

This file contains a plaintext temporary password. That is normal for simple unattend flows, but treat the USB as sensitive.

Do these two things:
- Change the password immediately after first login.
- Do not store this exact file in a repo unless you remove or replace the password.

## The autounattend.xml (copy/paste)

Save this exact content as `autounattend.xml` on the USB root.

Replace only the password value in the `ChangeMe_12345` line.

```xml
<?xml version="1.0" encoding="utf-8"?>
<unattend xmlns="urn:schemas-microsoft-com:unattend"
          xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <!-- windowsPE: language/locale + accept EULA -->
  <settings pass="windowsPE">
    <component name="Microsoft-Windows-International-Core-WinPE"
               processorArchitecture="amd64"
               publicKeyToken="31bf3856ad364e35"
               language="neutral"
               versionScope="nonSxS">
      <SetupUILanguage>
        <UILanguage>en-US</UILanguage>
      </SetupUILanguage>
      <InputLocale>en-US</InputLocale>
      <SystemLocale>en-US</SystemLocale>
      <UILanguage>en-US</UILanguage>
      <UserLocale>en-US</UserLocale>
    </component>

    <component name="Microsoft-Windows-Setup"
               processorArchitecture="amd64"
               publicKeyToken="31bf3856ad364e35"
               language="neutral"
               versionScope="nonSxS">
      <UserData>
        <AcceptEula>true</AcceptEula>
      </UserData>
    </component>
  </settings>

  <!-- specialize: machine-level settings -->
  <settings pass="specialize">
    <component name="Microsoft-Windows-Shell-Setup"
               processorArchitecture="amd64"
               publicKeyToken="31bf3856ad364e35"
               language="neutral"
               versionScope="nonSxS">
      <TimeZone>Eastern Standard Time</TimeZone>
      <ComputerName>CATTLE-01</ComputerName>
    </component>
  </settings>

  <!-- oobeSystem: skip OOBE screens + create local admin -->
  <settings pass="oobeSystem">
    <component name="Microsoft-Windows-International-Core"
               processorArchitecture="amd64"
               publicKeyToken="31bf3856ad364e35"
               language="neutral"
               versionScope="nonSxS">
      <InputLocale>en-US</InputLocale>
      <SystemLocale>en-US</SystemLocale>
      <UILanguage>en-US</UILanguage>
      <UserLocale>en-US</UserLocale>
    </component>

    <component name="Microsoft-Windows-Shell-Setup"
               processorArchitecture="amd64"
               publicKeyToken="31bf3856ad364e35"
               language="neutral"
               versionScope="nonSxS">

      <OOBE>
        <HideEULAPage>true</HideEULAPage>
        <HideOEMRegistrationScreen>true</HideOEMRegistrationScreen>
        <HideOnlineAccountScreens>true</HideOnlineAccountScreens>
        <HideWirelessSetupInOOBE>true</HideWirelessSetupInOOBE>
        <ProtectYourPC>3</ProtectYourPC>

        <SkipMachineOOBE>true</SkipMachineOOBE>
        <SkipUserOOBE>true</SkipUserOOBE>
      </OOBE>

      <UserAccounts>
        <LocalAccounts>
          <LocalAccount wcm:action="add">
            <Name>Owner</Name>
            <DisplayName>Owner</DisplayName>
            <Group>Administrators</Group>
            <Password>
              <Value>ChangeMe_12345</Value>
              <PlainText>true</PlainText>
            </Password>
          </LocalAccount>
        </LocalAccounts>
      </UserAccounts>

    </component>
  </settings>

</unattend>
````

## Verification and troubleshooting

### How to verify Setup used the file

After install, check for these:

* Computer name is `CATTLE-01`
* You can log in as `Owner` with the temporary password
* OOBE screens were skipped or reduced

Windows also writes setup logs and processed answer files under:

* `C:\Windows\Panther\`
* `C:\Windows\Panther\UnattendGC\`

### If it still forces a Microsoft account

Try these checks:

1. Confirm the file name and location:

   * Must be `autounattend.xml` on the USB root. ([Microsoft Learn][1])

2. Confirm you are booting from the USB (clean install path):

   * The removable-media auto-detection is for installs launched from WinPE / boot media flows. ([Microsoft Learn][1])

3. Remove other unattend files:

   * If you have multiple answer files on the media, simplify to one.

4. If you are on a very new Windows 11 release and behavior changed:

   * Keep using local account creation via `LocalAccounts` in `oobeSystem` (supported structure documented by Microsoft). ([Microsoft Learn][2])

## Next steps (recommended for cattle machines)

* Change the temporary password.
* Run your bootstrap script (winget installs, settings, runner setup).
* Then take a NAS snapshot/image if you still want a checkpoint.
