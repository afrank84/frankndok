# Enemy Text Resource Files
Seems to be a problem creating them directly in VSCode, here is the work around. 

```gdscript
# NO CODE — EDITOR ACTION (CRITICAL)

# Step 1:
# In Godot FileSystem panel → RIGHT CLICK dummy_target.tres → Delete

# Step 2:
# Right click folder → New Resource → EnemyData → Save as dummy_target.tres

# Step 3 (Inspector):
health = 3
speed = 50.0
scale = 1.0
sprite_path = "res://assets/sprites_enemy/dummy_target_move.png"

# Repeat for microslope:
# New Resource → EnemyData → Save as microslope.tres

health = 6
speed = 50.0
scale = 1.0
sprite_path = "res://assets/sprites_enemy/mircoslope_idle.png"

```
