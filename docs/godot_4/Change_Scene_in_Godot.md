## Change Scenes in Godot Using a Menu Button

```gdscript
# MainMenu.gd
extends Control

func _on_button_start_game_pressed() -> void:
    change_to_game_scene()

func change_to_game_scene() -> void:
    var game_scene = load("res://GameScene.tscn")
    get_tree().change_scene_to_packed(game_scene)
```

Connect the button's `pressed()` signal to `_on_button_start_game_pressed`.
