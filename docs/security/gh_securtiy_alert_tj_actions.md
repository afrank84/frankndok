# GH Security Alert: tj-actions/changed-files
---
## 🚨 GitHub Action Security Alert: `tj-actions/changed-files` Compromised – What You Need to Do 🚨


## What Happened?  
A popular GitHub Action called **`tj-actions/changed-files`** has been **hacked**! This tool, used in over 23,000 projects, helps developers check which files were changed in a commit. But hackers secretly **modified its code** to **steal sensitive information** from workflows.  

## How Did It Work?  
The **hacked version** of `tj-actions/changed-files` did something sneaky:  
✅ It grabbed **secrets** (like API keys, passwords, and tokens) from GitHub workflows.  
✅ It **printed those secrets** into the workflow logs.  
✅ If the logs were **public**, anyone could see and steal these secrets.  

## Why Is This Bad?  
😱 If you use this action, your **GitHub secrets might already be exposed**.  
😱 Hackers could use stolen API keys or tokens to **access your services, modify your code, or launch attacks**.  
😱 Any **public logs** could be a goldmine for attackers.  

## How to Check if You're Affected  
🔍 **Go to your GitHub repository** and check your workflows.  
🔍 Look for this line in your `.github/workflows/*.yml` files:  
```yaml
- uses: tj-actions/changed-files@v*
```
🔍 If you see it, **you might be using the compromised version**!  

## How to Fix It ASAP 🚀  
✅ **Step 1:** Immediately replace `tj-actions/changed-files` with this secure alternative:  
```yaml
- uses: step-security/changed-files@v*
```
✅ **Step 2:** Check your GitHub **workflow logs** for any leaked secrets.  
✅ **Step 3:** If you suspect exposure, **rotate (change) your API keys, tokens, and passwords** right away.  

## How Was This Discovered?  
🔎 A security tool called **Harden-Runner** from StepSecurity noticed **unexpected network activity** and flagged it. This helped security experts uncover the breach before more damage was done.  

## How to Stay Safe in the Future  
🔐 **Use security monitoring tools** like StepSecurity’s Harden-Runner to detect threats early.  
🔐 **Avoid using actions from unknown sources**—stick to well-maintained and verified ones.  
🔐 **Regularly audit your GitHub workflows** for outdated or vulnerable actions.  

## Final Warning 🚨  
This is **a serious security issue**, and **you must take action immediately** if you are using `tj-actions/changed-files`. Hackers **could already have your secrets**—don’t wait to fix this!  

**Share this with your team and other developers** so they can secure their repositories too! 🛡️