
# Tauri v2 (Rust Only) Setup Notes

This guide assumes:

- Rust is already installed
- `cargo tauri` CLI is already installed
- Existing HTML/CSS/JS game
- No Node.js
- No Vite

---

## Project Structure

```
FishingGame-Protoype/
├── web/
│   ├── index.html
│   ├── trophy_wall.html
│   ├── css/
│   ├── js/
│   ├── imgs/
│   └── sound/
├── src-tauri/
│   ├── Cargo.toml
│   ├── build.rs
│   ├── tauri.conf.json
│   ├── icon.png
│   ├── capabilities/
│   │   └── default.json
│   ├── icons/          <-- generated
│   └── src/
│       ├── main.rs
│       └── lib.rs
└── README.md
```

---

## Create Directories

```bash
mkdir -p src-tauri/src
mkdir -p src-tauri/icons
mkdir -p src-tauri/capabilities
```

---

## Files Created By Hand

### `src-tauri/Cargo.toml`

```toml
[package]
name = "one_more_cast"
version = "0.1.0"
description = "One More Cast"
authors = ["Anthony Frank"]
edition = "2024"

[lib]
name = "one_more_cast_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2" }

[dependencies]
tauri = { version = "2" }

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
```

---

### `src-tauri/build.rs`

```rust
fn main() {
    tauri_build::build()
}
```

---

### `src-tauri/src/main.rs`

```rust
fn main() {
    one_more_cast_lib::run();
}
```

---

### `src-tauri/src/lib.rs`

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

### `src-tauri/capabilities/default.json`

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default desktop capability",
  "windows": ["main"],
  "permissions": [
    "core:default"
  ]
}
```

---

### `src-tauri/tauri.conf.json`

Important settings:

```json
"build": {
  "beforeDevCommand": "",
  "beforeBuildCommand": "",
  "frontendDist": "../web"
}
```

**Do NOT use**

```json
"frontendDist": ".."
```

Tauri rejects the project root because it contains `src-tauri/`.

---

## Generate Icons

Copy your game icon to:

```
src-tauri/icon.png
```

Generate all required icons:

```bash
cargo tauri icon src-tauri/icon.png
```

This creates:

```
src-tauri/icons/
```

without needing to make anything manually.

---

## Build

```bash
cargo tauri build
```

Output:

```
src-tauri/target/release/
```

Bundles:

- AppImage
- DEB
- RPM (if enabled)

---

## Common Errors

### Missing `lib.rs`

```
can't find library one_more_cast_lib
```

Create:

```
src-tauri/src/lib.rs
```

and have `main.rs` call:

```rust
one_more_cast_lib::run();
```

---

### Missing Icons

```
failed to open icon
```

Run:

```bash
cargo tauri icon src-tauri/icon.png
```

before building.

---

### frontendDist Error

```
frontendDist includes src-tauri
```

Use:

```json
"frontendDist": "../web"
```

instead of pointing to the project root.

---

## Run

Executable:

```bash
./src-tauri/target/release/one_more_cast
```

AppImage:

```bash
chmod +x src-tauri/target/release/bundle/appimage/*.AppImage

./src-tauri/target/release/bundle/appimage/*.AppImage
```
