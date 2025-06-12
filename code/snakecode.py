import time
start_time = time.time()

import math
import asyncio

global index
index = 0

try:
    from js import document, window, console
    from pyodide.ffi import create_proxy
except ImportError:
    document = window = None
    def create_proxy(x): return x
    class DummyConsole:
        def log(self, *args, **kwargs): pass
    console = DummyConsole()

canvas = document.getElementById("snake-canvas") if document else None
ctx = canvas.getContext("2d") if canvas else None
TILE = 16
COLS = canvas.width // TILE if canvas else 15
ROWS = canvas.height // TILE if canvas else 15

digit_el = document.getElementById("digits") if document else None
digit_boxes = digit_el.children if digit_el else []

phone = "0523961348"

bombs = []
snake = []
dir_x, dir_y = 1, 0
food = {}
blue_food = {}
index = 0
task = None

def draw_sq(x: int, y: int, color: str, index: int = 0, total_segments: int = 1) -> None:
    if color == "#ffffff":
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    else:
        r, g, b = 0, 255, 255
        darkness = 0.5 * index / max(total_segments - 1, 1)
        r = int(r * (1 - darkness))
        g = int(g * (1 - darkness))
        b = int(b * (1 - darkness))
        ctx.fillStyle = f"rgb({r}, {g}, {b})"
    ctx.fillRect(x * TILE, y * TILE, TILE - 1, TILE - 1)

def place_object(exclude_snake=True, exclude_bombs=True, exclude_tokens=True, is_blue_token=False):
    while True:
        x = math.floor(window.Math.random() * COLS)
        y = math.floor(window.Math.random() * ROWS)
        conflict = False
        if exclude_snake:
            conflict |= any(seg["x"] == x and seg["y"] == y for seg in snake)
        if exclude_bombs:
            conflict |= any(b["x"] == x and b["y"] == y for b in bombs)
        if exclude_tokens:
            if is_blue_token:
                conflict |= (food["x"] == x and food["y"] == y)
            else:
                conflict |= (blue_food.get("x") == x and blue_food.get("y") == y)
        if not conflict:
            return {"x": x, "y": y}

def place_food(is_blue=False):
    return place_object(is_blue_token=is_blue)

def on_key(evt):
    global dir_x, dir_y
    k = evt.key.lower()
    if (k in ("arrowup", "w")) and dir_y != 1:
        dir_x, dir_y = 0, -1
    elif (k in ("arrowdown", "s")) and dir_y != -1:
        dir_x, dir_y = 0, 1
    elif (k in ("arrowleft", "a")) and dir_x != 1:
        dir_x, dir_y = -1, 0
    elif (k in ("arrowright", "d")) and dir_x != -1:
        dir_x, dir_y = 1, 0

if document:
    document.addEventListener("keydown", create_proxy(on_key), False)

def reset_game():
    global snake, dir_x, dir_y, food, blue_food, index, bombs
    snake = [{"x": 5, "y": 5}, {"x": 4, "y": 5}]
    dir_x, dir_y = 1, 0
    food = place_food()
    blue_food = place_food(is_blue=True)
    index = 0
    bombs = []
    for _ in range(4):
        bombs.append(place_object(exclude_tokens=True))
    if digit_boxes:
        for d in digit_boxes:
            d.textContent = "*"

async def game_loop():
    global snake, food, blue_food, dir_x, dir_y, index
    console.log("🎯 Python: Game started")
    if not snake:
        console.log("⏱ Premature start — snake is empty")
        return

    while True:
        await asyncio.sleep(0.1)
        head = {"x": snake[0]["x"] + dir_x, "y": snake[0]["y"] + dir_y}
        head["x"] %= COLS
        head["y"] %= ROWS

        hit_self = any(seg["x"] == head["x"] and seg["y"] == head["y"] for seg in snake[1:])
        hit_bomb = any(b["x"] == head["x"] and b["y"] == head["y"] for b in bombs)

        if hit_self or hit_bomb:
            if hasattr(window, "failCallback"):
                window.failCallback()
            break

        snake.insert(0, head)

        ate_food = False
        if head["x"] == food["x"] and head["y"] == food["y"]:
            ate_food = True
            index += 1
            if index <= len(phone):
                digit_boxes[index - 1].textContent = phone[index - 1]
            if hasattr(window, "js") and hasattr(window.js, "playEatSound"):
                console.log("🐍 Python: Calling playEatSound() for yellow token")
                window.js.playEatSound()
            if index >= len(phone):
                if hasattr(window, "unlockCallback"):
                    window.unlockCallback()
                break
            food = place_food()

        elif head["x"] == blue_food["x"] and head["y"] == blue_food["y"]:
            ate_food = True
            if digit_boxes:
                for d in digit_boxes:
                    d.textContent = "*"
                index = 0
            if hasattr(window, "js") and hasattr(window.js, "playEatSound"):
                console.log("🐍 Python: Calling playEatSound() for blue token")
                window.js.playEatSound()
            blue_food = place_food(is_blue=True)

        if not ate_food:
            snake.pop()

        ctx.fillStyle = "#272627"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        draw_token(food["x"], food["y"])
        draw_blue_token(blue_food["x"], blue_food["y"])

        for i, seg in enumerate(snake[1:-1]):
            draw_sq(seg["x"], seg["y"], "#00ffff", i + 1, len(snake) - 1)

        if len(snake) > 1:
            draw_tail(snake[-1]["x"], snake[-1]["y"], snake[-2])

        draw_head(snake[0]["x"], snake[0]["y"], dir_x, dir_y)

        for b in bombs:
            draw_bomb(b["x"], b["y"])

def draw_token_generic(x: int, y: int, colors: dict, draw_aura: bool = True) -> None:
    elapsed = time.time() - start_time
    alpha = 0.75 + 0.25 * math.sin(elapsed * 2 * math.pi)
    scale = 0.92 + 0.09 * math.sin(elapsed * 2 * math.pi)
    cx = x * TILE + TILE // 2
    cy = y * TILE + TILE // 2
    base_radius = TILE // 2.0
    radius = base_radius * scale

    if draw_aura:
        ctx.beginPath()
        ctx.arc(cx, cy, radius * 1.4, 0, 2 * math.pi)
        ctx.fillStyle = colors["aura"].format(alpha=alpha * 0.15)
        ctx.fill()

    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, 2 * math.pi)
    ctx.fillStyle = colors["main"].format(alpha=alpha)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(cx + 0, cy + 0, radius * 0.8, 0, 2 * math.pi)
    ctx.fillStyle = colors["shadow"].format(alpha=alpha)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(cx - 2, cy - 2, radius * 0.6, 0, 2 * math.pi)
    ctx.fillStyle = colors["highlight"].format(alpha=alpha)
    ctx.fill()

def draw_token(x: int, y: int) -> None:
    colors = {
        "aura": "rgba(255, 220, 100, {alpha:.2f})",
        "main": "rgba(245, 208, 75, {alpha:.2f})",
        "shadow": "rgba(199, 187, 139, {alpha:.3f})",
        "highlight": "rgba(238, 223, 171, {alpha:.3f})"
    }
    draw_token_generic(x, y, colors)

def draw_blue_token(x: int, y: int) -> None:
    colors = {
        "aura": "rgba(100, 220, 255, {alpha:.2f})",
        "main": "rgba(75, 208, 245, {alpha:.2f})",
        "shadow": "rgba(139, 187, 199, {alpha:.3f})",
        "highlight": "rgba(171, 223, 238, {alpha:.3f})"
    }
    draw_token_generic(x, y, colors)

def draw_bomb(x: int, y: int) -> None:
    colors = {
        "aura": "rgba(255, 68, 68, {alpha:.2f})",
        "main": "rgba(255, 68, 68, {alpha:.2f})",
        "shadow": "rgba(180, 50, 50, {alpha:.3f})",
        "highlight": "rgba(255, 200, 200, {alpha:.3f})"
    }
    draw_token_generic(x, y, colors, draw_aura=False)

async def start():
    global task
    console.log("🐍 Python: start() called")
    try:
        if task and not task.done():
            task.cancel()
            console.log("🛑 Old task cancelled")
    except Exception as e:
        console.log("⚠️ Error cancelling task:", str(e))

    reset_game()
    try:
        task = asyncio.create_task(game_loop())
        console.log("✅ New task created")
    except Exception as e:
        console.log("❌ Error starting game_loop():", str(e))

def draw_corner_mask(x: int, y: int, dx: int, dy: int, size: int, offset: int, bg_color: str) -> None:
    ctx.fillStyle = bg_color
    if dx == 1:  # right
        # Top-right
        ctx.beginPath()
        ctx.moveTo((x + 1) * TILE, y * TILE)
        ctx.lineTo((x + 1) * TILE - size, y * TILE)
        ctx.lineTo((x + 1) * TILE, y * TILE + offset)
        ctx.fill()
        # Bottom-right
        ctx.beginPath()
        ctx.moveTo((x + 1) * TILE, (y + 1) * TILE)
        ctx.lineTo((x + 1) * TILE - size, (y + 1) * TILE)
        ctx.lineTo((x + 1) * TILE, (y + 1) * TILE - offset)
        ctx.fill()
    elif dx == -1:  # left
        # Top-left
        ctx.beginPath()
        ctx.moveTo(x * TILE, y * TILE)
        ctx.lineTo(x * TILE + size, y * TILE)
        ctx.lineTo(x * TILE, y * TILE + offset)
        ctx.fill()
        # Bottom-left
        ctx.beginPath()
        ctx.moveTo(x * TILE, (y + 1) * TILE)
        ctx.lineTo(x * TILE + size, (y + 1) * TILE)
        ctx.lineTo(x * TILE, (y + 1) * TILE - offset)
        ctx.fill()
    elif dy == -1:  # up
        # Top-left
        ctx.beginPath()
        ctx.moveTo(x * TILE, y * TILE)
        ctx.lineTo(x * TILE + offset, y * TILE)
        ctx.lineTo(x * TILE, y * TILE + size)
        ctx.fill()
        # Top-right
        ctx.beginPath()
        ctx.moveTo((x + 1) * TILE, y * TILE)
        ctx.lineTo((x + 1) * TILE - offset, y * TILE)
        ctx.lineTo((x + 1) * TILE, y * TILE + size)
        ctx.fill()
    elif dy == 1:  # down
        # Bottom-left
        ctx.beginPath()
        ctx.moveTo(x * TILE, (y + 1) * TILE)
        ctx.lineTo(x * TILE + offset, (y + 1) * TILE)
        ctx.lineTo(x * TILE, (y + 1) * TILE - size)
        ctx.fill()
        # Bottom-right
        ctx.beginPath()
        ctx.moveTo((x + 1) * TILE, (y + 1) * TILE)
        ctx.lineTo((x + 1) * TILE - offset, (y + 1) * TILE)
        ctx.lineTo((x + 1) * TILE, (y + 1) * TILE - size)
        ctx.fill()

def draw_head(x: int, y: int, dx: int, dy: int) -> None:
    cx = x * TILE + TILE // 2
    cy = y * TILE + TILE // 2
    radius = TILE // 2.0
    head_color = "#00ffff"
    bg_color = "#272627"

    ctx.fillStyle = head_color
    ctx.fillRect(x * TILE, y * TILE, TILE - 1, TILE - 1)

    draw_corner_mask(x, y, dx, dy, 8, 4, bg_color)

    eye_offset = TILE * 0.2
    eye_x = cx + dx * eye_offset
    eye_y = cy + dy * eye_offset
    ctx.beginPath()
    ctx.arc(eye_x, eye_y, radius * 0.4, 0, 2 * math.pi)
    ctx.fillStyle = "#eeeeee"
    ctx.fill()
    pupil_offset = TILE * 0.1
    pupil_x = cx + dx * (eye_offset + pupil_offset)
    pupil_y = cy + dy * (eye_offset + pupil_offset)
    ctx.beginPath()
    ctx.arc(pupil_x, pupil_y, radius * 0.15, 0, 2 * math.pi)
    ctx.fillStyle = "#000000"
    ctx.fill()

def draw_tail(x: int, y: int, prev: dict) -> None:
    draw_sq(x, y, "#00ffff", len(snake) - 2, len(snake) - 1)
    bg_color = "#272627"
    dx = prev["x"] - x
    dy = prev["y"] - y

    draw_corner_mask(x, y, -dx, -dy, 10, 10, bg_color)

import builtins
builtins.start = start
