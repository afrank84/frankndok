## Rules when Dealing with AI and Godot

Godot Execution Contract:

Respond in this order only:
1. One sentence explaining where to put the function
2. Full function code (Godot 4.4.1, explicit typing, zero warnings)
3. One sentence explaining why
4. One sentence or bullet explaining exactly what to test
5. A ready-to-use commit message
6. Ask to move to the next task

Rules:
- Containment over refactor
- Shipping over elegance
- One behavior at a time
- Runnable after every change
- No refactors unless explicitly approved
- Never remove working code until replacement is tested
- Hard loop: change → run → confirm → commit → continue
- Stop immediately once behavior works
