# Pop!_OS / Ubuntu Drops to BusyBox (initramfs)

## Fixing “Filesystem needs manual fsck”

This guide applies to:

* Pop!_OS
* Ubuntu
* Debian-based systems
* ext4 filesystems

---

## What You’ll See

Instead of booting normally, the system drops to:

```
BusyBox v1.30.1 built-in shell (initramfs)
(initramfs)
```

You cannot log in normally.

This usually means:

* The root filesystem is marked dirty
* ext4 detected journal inconsistency
* System refuses to mount root for safety

Do not panic. This is recoverable.

---

# Step 1 – Check If Drive Is Detected

At the `(initramfs)` prompt:

```
ls /dev
```

Look for something like:

```
sda1
sda2
sda3
```

or

```
nvme0n1p1
nvme0n1p2
```

If you see your disk → good. Continue.

If you do NOT see your disk → possible hardware issue.

---

# Step 2 – Identify the Root Partition

Try:

```
blkid
```

Look for the partition that says:

```
TYPE="ext4"
```

Example:

```
/dev/sda3: UUID="xxxx" TYPE="ext4"
```

That is likely your root partition.

If unsure, on most Pop!_OS installs:

* `sda1` = EFI
* `sda2` = recovery
* `sda3` = root

So try `sda3` first.

---

# Step 3 – Run Filesystem Repair

Run:

```
fsck -f -y /dev/sda3
```

Replace `sda3` with your actual root partition if different.

Explanation of flags:

* `-f` → force check even if marked clean
* `-y` → automatically answer “yes” to repair prompts

Let it complete.

You may see:

* Journal recovery
* Inode fixes
* Orphaned block cleanup

This is normal.

---

# Step 4 – Reboot

When fsck finishes:

```
reboot -f
```

System should boot normally.

---

# Why This Happens

Even if you shut down via GUI, a dirty journal can happen due to:

* Interrupted shutdown
* Power instability
* Disk I/O delay
* Kernel update edge case
* Rare transient disk error

ext4 refuses to mount to prevent corruption.

It is protecting your data.

---

# After Booting Normally (Recommended)

Check disk health:

```
sudo apt install smartmontools
sudo smartctl -a /dev/sda
```

Look for:

```
SMART overall-health self-assessment test result: PASSED
```

And verify these are zero:

* Reallocated_Sector_Ct
* Current_Pending_Sector
* Offline_Uncorrectable

If all clean → likely just a one-time dirty shutdown.

---

# When To Worry

Investigate further if:

* This happens repeatedly
* SMART shows sector errors
* System freezes often
* Disk disappears from BIOS

Otherwise, a single event is not alarming.

---

# Mental Model

ext4 detected inconsistency
→ refused to mount
→ initramfs dropped to BusyBox
→ fsck repaired journal
→ filesystem marked clean
→ boot proceeds

That is normal Linux safety behavior.
