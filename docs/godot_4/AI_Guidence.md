## Rules when Dealing with AI and Godot

- Invocation (paste at start of a new chat): Apply Godot execution contract.
---
Godot Execution Contract (INTJ)

Response order only:

1. Placement (1 sentence):
   - Explicit file path + script name + function name, stated in text (never implied by the code),
   because identical function names (_ready, _process, etc.) exist across files.
2. Code:
   - Full function only (never partial snippets),
   - Godot 4.4.1 only,
   - explicit typing,
   - zero warnings,
   - no refactors,
   - no removal of working code unless replacing it after a successful test.
3. Reason (1 sentence):
   - Why this approach was chosen over the most obvious viable alternative.
4. Test for success (1 sentence or single bullet):
   - One concrete, observable condition that confirms success.
   - I will only give “Test for success” bullets that are logically guaranteed by the exact code change provided, or I will explicitly label them as “what we’re checking next.”
5. Commit message:
   - Ready-to-use, present tense, scoped only to the change just made.
6. Proceed confirmation:
   - Ask to move on to the next task.

Hard rules (non-negotiable):
- Containment over refactor
- Shipping over elegance
- One behavior at a time
- Runnable after every change
- No refactors unless explicitly approved
- Never remove working code until the replacement is tested
- Hard loop: change → run → confirm → commit → continue
- Stop immediately once the requested behavior works

Failure conditions (response is invalid if):
- File path and script name are not explicitly stated in text
- Partial code is provided
- More than one behavior is changed
- Any refactor occurs without permission
- Any exploration occurs without explicit request
- Guessing APIs, engine behavior, or side effects
- Explanations exceed one sentence
- Godot version deviates from 4.4.1

Unknown handling:
- If Godot 4.4.1 API is uncertain, use web search, state, engine behavior, or side effect, respond only with:
  “I don’t know and 1 sentence about uncertainty”
  and stop.

## Architecture Recognition Rules (Godot)

Before proposing any implementation:

1. Determine the Existing Architecture

   * Read enough files to identify the architectural pattern before proposing changes.
   * Do not assume a standard Godot architecture.
   * Do not assume editor-driven workflows.
   * Do not assume physics bodies, TileSets, collision layers, navigation, resources, or scene hierarchies are being used unless the code proves it.

2. Respect the Existing Architecture

   * New features should be implemented using the same architectural style already present in the project unless explicitly told otherwise.
   * If the project is code-driven, prefer code-driven solutions.
   * If the project is editor-driven, prefer editor-driven solutions.
   * Do not migrate architectures without explicit approval.

3. Architecture Mismatch Detection

   * If the requested feature is most naturally solved using a different architecture than the project currently uses:

     * STOP.
     * State the mismatch.
     * Present both options:
       A. Implement within the current architecture.
       B. Migrate toward the alternative architecture.
     * Wait for direction before coding.

4. No Hidden Migrations

   * The following are considered architecture changes and require explicit approval:

     * Node2D → CharacterBody2D
     * Manual movement → move_and_slide()
     * Runtime-generated systems → editor-authored systems
     * Code-generated content → scene-authored content
     * Custom collision → Godot physics collision
     * Custom data structures → NavigationServer / PhysicsServer solutions

5. Code-First Detection
   If most of the following are true:

   * Scenes are mostly empty containers.
   * Nodes are created dynamically in code.
   * Maps are generated in code.
   * Sprites are generated in code.
   * Resources are loaded dynamically.
   * Systems are instantiated from scripts.

   Then assume the project is code-first and remain code-first unless explicitly instructed otherwise.

6. Before Any Large Change
   Ask:
   "Am I adding a feature, or am I changing the architecture?"

   If the answer is "changing the architecture," stop and get approval first.

Additional Failure Conditions
* Fails to identify the project's architectural style before proposing implementation.
* Proposes an editor-driven solution for a code-driven system without approval.
* Proposes an architecture migration without explicitly labeling it as a migration.
* Treats a feature request as a refactor or architecture change without approval.
* Assumes standard Godot patterns when project code demonstrates a different pattern.


