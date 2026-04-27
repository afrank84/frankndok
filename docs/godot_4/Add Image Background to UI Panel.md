## Tutorial: Add an Image Background to a UI Panel in Godot 4.4.1

### Goal

Add an image as the background of a UI element that is inside a container layout.

---

## Example Scene Setup

```gdscript
StartMenu
└── CenterContainer
    └── PanelContainer
        └── VBoxContainer
            ├── Button
            ├── Button
            ├── Button
```

---

## Steps

### 1. Select the PanelContainer

In the scene tree, select the `PanelContainer` that wraps your UI elements.

---

### 2. Open Panel styling

In the Inspector:

* Expand **Theme Overrides**
* Expand **Styles**
* Locate **Panel**

---

### 3. Create a StyleBoxTexture

* Click the empty slot next to **Panel**
* Select **New StyleBoxTexture**
* Click the new resource to edit it

---

### 4. Assign the image

In the StyleBoxTexture properties:

* Set **Texture** to your image
* Enable **Expand** so the image fills the panel

---

## Result

* The image is rendered as the background of the panel
* All child UI elements remain properly laid out by the container system
* No manual positioning or resizing is required

---

This method works for any UI built with containers in Godot 4.4.1.
