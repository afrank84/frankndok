# Remmina And Vino - PopOs

To remote into a local Pop!_OS computer using **Remmina**, you’ll need to use **VNC** (for graphical remote control) or **SSH** (for terminal access). Since both systems are Pop!_OS, you can enable a VNC server on the remote machine and connect to it from the local one.

---

### ✅ Step-by-Step: Remote into a Local Pop!_OS Machine Using Remmina + VNC

#### 🖥️ On the Remote Computer (the one you want to control):

1. **Install Vino (VNC server):**
    
    ```bash
    sudo apt install vino
    ```
    
2. **Enable desktop sharing:** Run this command to allow remote access:
    
    ```bash
    gsettings set org.gnome.Vino require-encryption false
    gsettings set org.gnome.Vino prompt-enabled false
    gsettings set org.gnome.Vino authentication-methods "['vnc']"
    gsettings set org.gnome.Vino vnc-password $(echo -n 'yourpassword' | base64)
    ```
* *Used my 4 digit pin*    

3. **Start the VNC server:**
    
    ```bash
    /usr/lib/vino/vino-server &
    ```
4. **(Optional) Set this to run on login:** Add `/usr/lib/vino/vino-server` to your **Startup Applications**.
    
5. **Get the remote computer’s IP:**
    
    ```bash
    ip a
    ```
    
    Look for something like `192.168.x.x`.
    

---

#### 💻 On the Local Computer (the one you're using Remmina on):

1. Open **Remmina**.
2. Click **+** to create a new connection.
3. Set the following:
    - **Protocol:** VNC - Virtual Network Computing
    - **Server:** `<remote_ip>:5900` (e.g. `192.168.1.100:5900`)
    - **Username:** (leave blank unless specified)
    - **Password:** the VNC password you set earlier
        
4. Click **Connect**.
    

---

### ✅ Alternative: SSH (for terminal only)

If you only need terminal access:

1. **On the remote system:**
    
    ```bash
    sudo apt install openssh-server
    sudo systemctl enable --now ssh
    ```
    
2. **On the local system:**
    
    ```bash
    ssh username@remote_ip
    ```
    
