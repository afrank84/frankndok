---
title: Cloudflare Tunnel in CasaOS
---

## Setting Up Cloudflare Tunnel in CasaOS

### **Step 1: Install the Cloudflared App**

1. **Access the App Store**: In your CasaOS dashboard, navigate to the **App Store**.
2. **Search for Cloudflared**: Use the search bar to find the **Cloudflared** app.
3. **Install the App**: Click on the app and follow the prompts to install it.

### **Step 2: Create a Tunnel in Cloudflare**

1. **Log in to Cloudflare**: Go to [Cloudflare](https://www.cloudflare.com) and log in to your account.
2. **Navigate to Zero Trust**: Click on **Zero Trust** in the dashboard.
3. **Access Tunnels**: In the sidebar, click on **Tunnels**.
4. **Create a Tunnel**: Click on **Create a Tunnel**.
5. **Configure Tunnel**:

   * **Name**: Give your tunnel a name (e.g., `home-tunnel`).
   * **Hostname**: Specify the subdomain you want to use (e.g., `home.yourdomain.com`).
   * **Service**: Enter the local service URL, such as `http://192.168.1.x:PORT`.
6. **Save the Tunnel**: After configuring, click **Save**.
7. **Obtain Tunnel Token**: Scroll down to the **Tunnel Connector** section and copy the **Tunnel Token**.([Pi My Life Up][1], [IceWhale Community Forum][2])

### **Step 3: Configure Cloudflared in CasaOS**

1. **Open Cloudflared App**: In your CasaOS dashboard, go to **Installed Apps** and click on the **Cloudflared** app.
2. **Enter Tunnel Token**: Paste the **Tunnel Token** you copied earlier into the provided field.
3. **Save Configuration**: Click **Save**. The button will change to **Start** once saved.([IceWhale Community Forum][2])

### **Step 4: Start the Tunnel**

1. **Start Tunnel**: Click the **Start** button. The status will change to **Healthy** once the tunnel is active.

---

## Verify the Setup

* **Access the Service**: Open a browser and navigate to the hostname you configured (e.g., `home.yourdomain.com`). You should see your local service.
* **Check Tunnel Status**: In the Cloudflare dashboard, under **Tunnels**, ensure the tunnel status is **Healthy**.

---

## Optional: Enhance Security

* **SSL/TLS Settings**: In Cloudflare, go to the **SSL/TLS** settings and set the SSL mode to **Full (Strict)** for secure connections.
* **Firewall Rules**: Configure your local firewall to accept connections only from Cloudflare's IP ranges.

---

This method leverages Cloudflare's **Zero Trust** platform, providing a secure and straightforward way to expose your local services without the need for complex configurations.

