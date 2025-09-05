### ✅ Install NVIDIA drivers on Pop!\_OS

First, enable the `restricted` repo (Pop!\_OS usually has this enabled, but just in case):

```bash
sudo add-apt-repository restricted
sudo apt update
```

Then install the recommended driver + utils (let’s use **535** for stability):

```bash
sudo apt install nvidia-driver-535 nvidia-utils-535
```

If you prefer latest:

```bash
sudo apt install nvidia-driver-550 nvidia-utils-550
```

---

### 🔄 Reboot

```bash
sudo reboot
```

---

### 🖥️ Verify after reboot

Run:

```bash
nvidia-smi
```

You should see your **GeForce GTX 960** listed, along with the driver version.

---
