# Send and Receive SMS on Ubuntu with GrapheneOS and KDE Connect

**A complete guide to sending and receiving text messages from Linux without Google services.**

This tutorial covers installing KDE Connect, pairing devices, synchronizing contacts, and fixing sent messages that disappear from the desktop conversation history.

## Requirements

- Ubuntu Linux desktop
- GrapheneOS phone (tested with Google Pixel 7)
- Both devices connected to the same local network
- USB data cable (for the SMS permission workaround)
- Internet access for installing packages

**No Google account, Google Messages, or Google Play Services required.**

---

## 1. Install KDE Connect

### Ubuntu

Open a terminal:

```bash
sudo apt update
sudo apt install kdeconnect
```

Launch KDE Connect:

```bash
kdeconnect-app
```

### GrapheneOS

Install KDE Connect from F-Droid:

https://f-droid.org/packages/org.kde.kdeconnect_tp/

Open KDE Connect after installation.

## 2. Pair Your Phone and Computer

1. Connect both devices to the same local network.
2. Open KDE Connect on your Pixel 7.
3. Open KDE Connect on Ubuntu.
4. On your phone, select your Ubuntu computer.
5. Tap **Request Pairing**.
6. On Ubuntu, accept the pairing request in the main KDE Connect application.

Your phone should now appear as **Trusted and connected**.

Verify connectivity:

```bash
kdeconnect-cli -a
```

Your Pixel 7 should appear in the available device list.

If the command reports `0 devices found`, check that both devices are on the same network and KDE Connect is running.

## 3. Enable SMS and Contact Synchronization

### GrapheneOS permissions

Open:

**Settings → Apps → KDE Connect → Permissions**

Grant the following permissions:

- SMS
- Contacts
- Notifications

Then open KDE Connect, select your Ubuntu computer, and enable the relevant plugins, including SMS and Contacts Synchronization.

### Ubuntu settings

1. Open KDE Connect.
2. Select your Pixel 7.
3. Click **Plugin Settings**.
4. Ensure SMS and contact-related plugins are enabled.

## 4. Open SMS Messaging on Ubuntu

Launch the SMS application:

```bash
kdeconnect-sms
```

The desktop interface provides:

- A list of SMS conversations
- Contact names or telephone numbers
- Conversation history
- A message composition field

Messages are sent through your phone's cellular connection.

**Note:** MMS, attachments, and group messaging may have limited functionality.

## 5. Fix Contacts Showing Only Phone Numbers

During our setup, SMS messages worked, but KDE Connect initially displayed telephone numbers instead of contact names.

### Check contact synchronization

Run:

```bash
ls -lah ~/.local/share/kpeoplevcard/
```

You may see a directory associated with your KDE Connect device.

Count synchronized contact files:

```bash
find ~/.local/share/kpeoplevcard/ -type f | wc -l
```

Initially, our result was:

```text
0
```

No contact files had been stored in that directory.

### Troubleshooting

On GrapheneOS:

1. Open KDE Connect.
2. Select your Ubuntu computer.
3. Open Plugin Settings.
4. Disable and re-enable Contacts Synchronization.
5. Verify Contacts permission remains enabled.

On Ubuntu, check the contact integration package:

```bash
dpkg -l kpeople-vcard
```

If missing and available:

```bash
sudo apt install kpeople-vcard
```

Reopen KDE Connect SMS and allow time for synchronization.

**Our result:** Contact names eventually appeared after troubleshooting and reconnecting KDE Connect. The exact action that resolved synchronization was not isolated.

## 6. Fix Sent SMS Messages Disappearing

### The problem

We encountered a second issue:

- Messages sent from Ubuntu were successfully delivered.
- Recipients received the messages.
- Sent messages appeared in the Pixel 7's normal SMS application.
- However, sent messages disappeared or failed to appear in KDE Connect SMS on Ubuntu.

This behavior matches a reported KDE Connect issue involving access to restricted SMS messages on newer Android versions.

Reference: https://bugs.kde.org/show_bug.cgi?id=523424

### Solution: Grant restricted message access using ADB

Android Debug Bridge (ADB) allows Ubuntu to communicate with your Android phone over USB.

This workaround grants KDE Connect additional permission to read restricted messages.

### Step 1: Install ADB on Ubuntu

```bash
sudo apt update
sudo apt install adb
```

### Step 2: Enable Developer Options on GrapheneOS

On your Pixel 7:

1. Open **Settings → About phone**.
2. Scroll to **Build number**.
3. Tap Build number seven times.
4. Enter your device PIN if prompted.
5. Return to **Settings → System → Developer options**.
6. Enable **USB debugging**.

### Step 3: Connect the phone

Connect your Pixel 7 to Ubuntu using a USB data cable.

Run:

```bash
adb devices
```

Initially, you might see:

```text
List of devices attached
```

If no device appears, verify USB debugging is enabled and try reconnecting the cable.

### Step 4: Authorize Ubuntu

Once detected, your phone may appear as:

```text
List of devices attached
XXXXXXXX    unauthorized
```

Unlock your Pixel 7.

When prompted to allow USB debugging:

1. Check **Always allow from this computer**, if this is a trusted computer.
2. Tap **Allow**.

Run again:

```bash
adb devices
```

Expected output:

```text
List of devices attached
XXXXXXXX    device
```

The word `device` confirms that ADB is authorized.

### Step 5: Apply the SMS permission fix

Run:

```bash
adb shell appops set --uid org.kde.kdeconnect_tp READ_RESTRICTED_MESSAGES allow
```

Then stop KDE Connect on the phone so it can restart with the updated permission:

```bash
adb shell am force-stop org.kde.kdeconnect_tp
```

### Step 6: Restart KDE Connect

1. Reopen KDE Connect on your Pixel 7.
2. Reopen KDE Connect SMS on Ubuntu:

   ```bash
   kdeconnect-sms
   ```

3. Open an existing conversation.
4. Verify previously missing sent messages appear.
5. Send another test message.

**Our result: Success.** Previously missing messages became accessible, and sending and receiving SMS worked correctly.

### Security considerations

`READ_RESTRICTED_MESSAGES` grants KDE Connect additional access to SMS data. Only grant this permission to applications you trust.

After completing setup, disable USB debugging on your phone if you no longer need it.

To reverse the additional permission later, reconnect with ADB and run:

```bash
adb shell appops set --uid org.kde.kdeconnect_tp READ_RESTRICTED_MESSAGES default
```

---

## 7. Useful Commands

| Command | Purpose |
|---|---|
| `kdeconnect-app` | Open KDE Connect |
| `kdeconnect-sms` | Open the SMS interface |
| `kdeconnect-cli -a` | List available devices |
| `kdeconnect-cli --list-devices` | List known devices |
| `kdeconnect-cli --refresh` | Refresh device discovery |
| `adb devices` | Check USB debugging connection |
| `find ~/.local/share/kpeoplevcard/ -type f \| wc -l` | Count synchronized contact files |

## 8. Troubleshooting Notes

### KDE Connect shows no devices

Verify both devices are on the same local network, check KDE Connect is running on the phone, and confirm that pairing is still active.

### Pairing request isn't visible

Open the main KDE Connect application using `kdeconnect-app`, not the SMS window.

### KDE Connect service cannot be restarted

On our Ubuntu installation, this command failed:

```bash
systemctl --user restart kdeconnect.service
```

With:

```text
Unit kdeconnect.service not found.
```

KDE Connect was not registered under that systemd user service name.

Avoid terminating `kdeconnectd` without first verifying its executable path and restart mechanism. Doing so interrupted our working connection.

### SMS messages send but do not appear

Check whether messages appear in the phone's native SMS application. If they do, but KDE Connect does not display them, review Section 6.

---

## Final Working Configuration

| Component | Configuration |
|---|---|
| Phone | Google Pixel 7 |
| Mobile OS | GrapheneOS |
| Desktop OS | Ubuntu Linux |
| Connectivity | Local network |
| Messaging application | KDE Connect SMS |
| Contact synchronization | Working |
| Incoming SMS | Working |
| Outgoing SMS | Working |
| Sent message history | Working after ADB permission fix |
| Google services | Not required |

## Conclusion

KDE Connect provides a practical way to send and receive SMS messages directly from Ubuntu using a GrapheneOS phone.

The two main problems encountered were contact names not synchronizing and outgoing messages disappearing from the desktop conversation history.

Both were resolved during setup, with the outgoing-message problem fixed using the ADB `READ_RESTRICTED_MESSAGES` permission workaround.

The final configuration supports SMS messaging, contact names, and conversation history without relying on Google's messaging services.

**Useful links**

- KDE Connect: https://kdeconnect.kde.org/
- F-Droid package: https://f-droid.org/packages/org.kde.kdeconnect_tp/
- KDE SMS bug report: https://bugs.kde.org/show_bug.cgi?id=523424
- GrapheneOS: https://grapheneos.org/