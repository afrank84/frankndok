# Windows Defender - Viewing Protection History via PowerShell

To view the **Protection History** on a Windows system, you can follow these steps:

### Using Windows Security:
1. **Open Windows Security**:
   - Press `Win + S` and type **Windows Security**. Select it from the search results.

2. **Go to Virus & Threat Protection**:
   - In the Windows Security app, select **Virus & Threat Protection** from the left-hand menu.

3. **View Protection History**:
   - Scroll down to find the **Protection History** section and click on **View Protection History**.
   - Here, you can see a detailed history of detected threats, their actions, and any recommendations.

---

### Alternative: Using PowerShell
You can also retrieve Windows Defender Protection History using PowerShell for more advanced details:
1. Open PowerShell as an Administrator:
   - Press `Win + X` and select **Windows PowerShell (Admin)**.

2. Use the following command:
   ```powershell
   Get-MpThreatDetection
   ```
   - This will list recent threats detected by Windows Defender along with their details.

---

### Notes:
- Protection History is stored for a limited time (30 days by default), after which older entries are removed.
- If you're using third-party antivirus software, the protection history may not be visible in Windows Security. Instead, you'll need to check within the third-party antivirus app.
