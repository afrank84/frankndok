## Godot 4 Git Ignore

Recommended `.gitignore` for Godot 4

Use this `.gitignore` file to avoid committing temporary files, OS clutter, and auto-generated content that Godot 4 doesn't need under version control.

```gitignore title=".gitignore"
# Godot-specific
.import/                  # Imported asset cache (auto-generated)
export.cfg               # Export config (optional to track)
export_presets.cfg       # Export presets (optional to track)

# OS-generated files
.DS_Store                # macOS thumbnail cache
Thumbs.db                # Windows image cache
desktop.ini              # Windows folder settings

# Temporary files
*.tmp                    # Generic temp files

# Editor-specific
*.godot/settings-*.tmp   # Godot temporary editor settings
.editor_config.json      # Local editor preferences (optional to ignore)

# Mono/C# (if using C# in Godot)
.mono/                   # Mono build artifacts
*.csproj                 # C# project file
*.sln                    # Visual Studio solution file
*.user                   # User-specific IDE settings
*.dll                    # Compiled libraries
*.pdb                    # Debug symbols
*.mdb                    # Mono debug symbols
*.pidb                   # C# Intellisense cache
*.suo                    # Solution user options
*.ncb                    # Old IntelliSense database
*.vcproj                 # Old VC++ project files
*.sln.docstates          # Visual Studio state

# Build/Export folders (optional, depending on your structure)
build/
bin/
export/

# Godot 4 optional
.godot/                  # Editor layout, tabs, and internal settings
```

### Explanation

* **Godot-specific**: `.import/` is automatically regenerated. `export.cfg` and `export_presets.cfg` can be tracked if you're sharing export settings between team members.
* **OS-generated files**: Files like `.DS_Store` or `Thumbs.db` clutter the repo and have no project relevance.
* **Temporary files**: Catch-all for any temp file created during builds or editor use.
* **Editor-specific**: Tracks settings that are not necessarily shared across developers.
* **Mono/C# files**: If using Godot with C#, these are auto-generated and can be excluded unless your project setup depends on them.
* **Build/Export folders**: Useful if you're generating game builds locally but don’t want to include them in version control.
* **`.godot/` folder**: Stores local layout settings and should generally be ignored unless you want to sync workspace layout across a team.

---

