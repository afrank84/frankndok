# Fix Halo MCC Campaign Co-op Disconnects on Linux

**Game:** Halo: The Master Chief Collection  
**Platform:** Steam / Linux  
**Working Proton Version:** 7.0-6

## The Problem

While playing Halo: Reach campaign co-op between two Linux computers, both players were disconnected and returned to the lobby approximately 30 seconds after starting.

Both computers were using Proton Experimental.

## The Fix

Switch both computers to **Proton 7.0-6**.

1. Open Steam Library.
2. Right-click **Halo: The Master Chief Collection** → **Properties**.
3. Select **Compatibility**.
4. Enable **Force the use of a specific Steam Play compatibility tool**.
5. Select **Proton 7.0-6**.
6. Repeat on the other computer and restart the game.

## Results

| Proton Version | Result |
|---|---|
| Proton Experimental | Disconnected after ~30 seconds |
| Proton 7.0-6 | Co-op worked |

**Conclusion:** Proton 7.0-6 resolved our Halo: Reach campaign co-op disconnections on Linux. No additional configuration or launch options were required.
