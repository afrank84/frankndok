```
title: Fix: Titanfall 2 on Steam (Linux / Pop!_OS)
```
EA App download loop – game won’t launch

## Step 1: Force Proton Experimental
* Note: If you are using Steam as a flatpak, then the flatpack technology isolates software as it's security policy. Meaning that for Steam it not uncommon that the Application (Steam) cannot see the Launcher (EA, or whatever). Use the .deb or another installation for Steam to avoid this. 

1. Open Steam
2. Library → Titanfall 2
3. Right-click → Properties
4. Compatibility
5. Check “Force the use of a specific Steam Play compatibility tool”
6. Select “Proton Experimental”
7. Close Properties

## Step 2: Close Steam

* Exit Steam completely
* Ensure it is not running in the background

## Step 3: Remove Titanfall 2 Proton prefix

Run in terminal:

```bash
rm -rf ~/.steam/steam/steamapps/compatdata/1237970
```

## Step 4: Launch the game

1. Reopen Steam
2. Click Play on Titanfall 2
3. Wait on first launch without canceling anything

## Result

* EA App installs once
* Titanfall 2 launches normally
* Future launches work without repeating these steps
