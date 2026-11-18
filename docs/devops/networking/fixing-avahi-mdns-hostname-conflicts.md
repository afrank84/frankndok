# Fixing Linux Hostname Conflicts with Avahi (mDNS)

## Overview

Linux systems using Avahi for multicast DNS (mDNS) may unexpectedly advertise their hostname with a numeric suffix. For example, `server.local` may become `server-2.local`. This happens when Avahi detects a competing claim for the same mDNS hostname.

Possible causes include another device with the same hostname or a second mDNS responder on the same host. If a conflict follows an interface or address change, check which interfaces Avahi uses, including Docker bridges, and which IPv4 and IPv6 addresses other responders advertise.

## Step 1 — Verify the hostname

Check the system hostname and Avahi's current status.

```bash
hostnamectl
systemctl status avahi-daemon
```

If the static hostname is `server` and Avahi reports `avahi-daemon: running [server-2.local]`, the change is in the name Avahi advertises. The system hostname remains `server`.

## Step 2 — Check for hostname conflicts

Search Avahi's logs from the current boot.

```bash
journalctl -u avahi-daemon -b --no-pager | grep -Ei 'conflict|collision|host name'
```

A hostname conflict can produce entries like these.

```text
Host name conflict, retrying with server-2
Server startup complete. Host name is server-2.local.
```

To inspect events around a specific time, replace the timestamp below and look for interface or address registration changes just before the conflict.

```bash
sudo journalctl -u avahi-daemon --since "YYYY-MM-DD HH:MM" --no-pager
```

## Step 3 — Identify the network interface

List the interfaces and their addresses.

```bash
ip -br addr
```

In this example, `eno1` is the interface connected to the LAN where clients resolve `server.local`.

```text
lo       UNKNOWN  127.0.0.1/8
eno1     UP       192.168.1.100/24
docker0  UP       172.17.0.1/16
br-xxxx  UP       172.18.0.1/16
```

## Step 4 — Restrict Avahi to the LAN interface

Edit Avahi's configuration.

```bash
sudo nano /etc/avahi/avahi-daemon.conf
```

Set `allow-interfaces` in the existing `[server]` section. Replace `eno1` with your LAN interface and keep the current IP settings for this first test.

```ini
[server]
allow-interfaces=eno1
```

Avahi will use only the listed interface for mDNS. If clients need mDNS on multiple interfaces, include all of those interface names in the comma-separated list.

Apply the change and check Avahi's status.

```bash
sudo systemctl restart avahi-daemon
systemctl status avahi-daemon
```

Use the checks in step 7 to verify the result. If the conflict persists and IPv6 activity appears related, continue to step 5.

## Step 5 — Test disabling IPv6 in Avahi

If Avahi currently uses both IPv4 and IPv6, edit `/etc/avahi/avahi-daemon.conf` again. Set `use-ipv6=no` in the existing `[server]` section and keep the LAN interface restriction.

```ini
[server]
use-ipv4=yes
use-ipv6=no
allow-interfaces=eno1
```

System-wide IPv6 stays enabled. This test disables Avahi's use of IPv6 sockets for mDNS. A competing IPv4 advertisement can still cause a conflict.

## Step 6 — Restart Avahi

Apply the IPv6 test and check Avahi's status.

```bash
sudo systemctl restart avahi-daemon
systemctl status avahi-daemon
```

If Avahi registered the original name, the status shows `avahi-daemon: running [server.local]`.

## Step 7 — Verify hostname resolution

From another device on the same LAN with the Avahi utilities installed, test mDNS resolution for the IPv4 address. Substitute your own hostname and confirm the result matches the server's LAN address from step 3.

```bash
avahi-resolve-host-name -4 server.local
```

```text
server.local    192.168.1.100
```

On the server, check for conflicts since the configuration change. Replace the placeholder with the time you restarted Avahi.

```bash
sudo journalctl -u avahi-daemon -b --since "YYYY-MM-DD HH:MM" --no-pager | grep -i conflict
```

## Step 8 — If the conflict returns

Capture mDNS traffic on the LAN interface. Replace `eno1` with your interface name.

```bash
sudo tcpdump -ni eno1 -vv 'udp port 5353'
```

Look for responses advertising `server.local` from an unexpected source. Check that device for a duplicate hostname or a second mDNS responder. If both devices legitimately use the same hostname, give one a unique name.

## Reverting the IPv6 test

If the IPv6 test does not help, restore the previous `use-ipv6` setting in `/etc/avahi/avahi-daemon.conf`. If it was enabled explicitly, restore this line.

```ini
use-ipv6=yes
```

Restart Avahi to apply the restored setting.

```bash
sudo systemctl restart avahi-daemon
```

## Summary

1. Confirm the conflict in Avahi's logs.
2. Identify the LAN interface and restrict Avahi to the interfaces that need mDNS.
3. Check that clients can resolve the original hostname and monitor the logs for recurrence.
4. Test mDNS over IPv4 if IPv6 activity appears related.
5. Capture mDNS traffic if the conflict persists and identify the competing advertiser.
