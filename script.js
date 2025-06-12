document.addEventListener("DOMContentLoaded", () => {
   // Кэшируем DOM-элементы
   const DOM = {
      burgerBtn: document.getElementById('burger-btn'),
      navMenu: document.getElementById('nav-menu'),
      lightbulb: document.getElementById('lightbulb'),
      track: document.getElementById("track"),
      galleryCards: document.querySelectorAll(".gallery-card"),
      weatherIcon: document.getElementById('weather-icon'),
      weatherTemp: document.getElementById('weather-temp'),
      weatherDesc: document.getElementById('weather-desc'),
      weatherLocation: document.getElementById('weather-location'),
      clock: document.getElementById('clock'),
      date: document.getElementById('date'),
      factTitle: document.getElementById('fact-title'),
      factText: document.getElementById('fact-text'),
      toggleButtons: document.querySelectorAll('.toggleBtn'),
      passwordLength: document.getElementById('password-length'),
      passwordSlider: document.getElementById('password-slider'),
      passwordOutput: document.getElementById('password-output'),
      contactForm: document.getElementById('contact-form'),
      digits: document.getElementById("digits"),
      startBtn: document.getElementById("startBtn"),
      snakeCanvas: document.getElementById("snake-canvas"),
      bgMusic: document.getElementById("bg-music"),
      victorySound: document.getElementById("victory-sound"),
      failSound: document.getElementById("fail-sound"),
      startImage: document.getElementById("startImage"),
      snakeCover: document.getElementById("snake-cover")
   };

   // === Утилиты ===
   function playSound(element, errorMessage) {
      if (element) {
         element.currentTime = 0;
         element.play().catch(e => console.warn(errorMessage, e));
      }
   }

   function stopSound(element) {
      if (element) {
         element.pause();
         element.currentTime = 0;
      }
   }

   function resetStartScreen() {
      if (DOM.startImage) {
         DOM.startImage.classList.remove("opacity-0");
         DOM.startImage.style.pointerEvents = "auto";
      }
      if (DOM.snakeCover) {
         DOM.snakeCover.classList.remove("pointer-events-none");
      }
   }

   function hideStartScreen() {
      if (DOM.startImage) {
         DOM.startImage.classList.add("opacity-0");
         DOM.startImage.style.pointerEvents = "none";
      }
      if (DOM.snakeCover) {
         DOM.snakeCover.classList.add("pointer-events-none");
      }
   }

   function resetDigits() {
      if (DOM.digits) {
         DOM.digits.innerHTML = "**********".split("").map(c =>
            `<span class="digit-box inline-block min-w-[1.2rem] text-center">*</span>`
         ).join("");
      }
   }

   function clearCanvas() {
      if (DOM.snakeCanvas) {
         const ctx = DOM.snakeCanvas.getContext("2d");
         ctx.fillStyle = "#272627";
         ctx.fillRect(0, 0, DOM.snakeCanvas.width, DOM.snakeCanvas.height);
      }
   }

   function createModal({ content, buttonId, buttonText, buttonClass, textClass, onButtonClick }) {
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-center";
      modal.innerHTML = `
         <div class="bg-[#333] ${textClass} p-8 rounded-xl shadow-xl">
            <p class="text-lg mb-4">${content}</p>
            <button id="${buttonId}" class="${buttonClass} px-6 py-2 rounded transition">
               ${buttonText}
            </button>
         </div>
      `;
      document.body.appendChild(modal);
      document.getElementById(buttonId).addEventListener("click", () => {
         modal.remove();
         if (onButtonClick) onButtonClick();
      });
      return modal;
   }

   async function launchGame() {
      if (!window.pyodide) {
         console.warn("⛔ Pyodide not loaded");
         return;
      }
      try {
         if (window.startFn) {
            await window.startFn();
         } else {
            await window.pyodide.runPythonAsync("start()");
         }
      } catch (err) {
         console.error("Ошибка запуска игры:", err);
      }
   }

   // === burger + glow ===
   document.addEventListener('mouseover', (e) => {
      if (window.innerWidth >= 640 && isTextElement(e.target)) {
         DOM.lightbulb.classList.add('glow');
      }
   });

   document.addEventListener('mouseout', (e) => {
      if (isTextElement(e.target)) {
         DOM.lightbulb.classList.remove('glow');
      }
   });

   function isTextElement(el) {
      const tag = el.tagName.toLowerCase();
      return (
         el.nodeType === Node.ELEMENT_NODE &&
         window.getComputedStyle(el).pointerEvents !== 'none' && 
         ['p', 'a', 'span', 'strong', 'em', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tag)
      );
   }

   // === gallery scroll ===
   const cards = Array.from(DOM.track.children);
   const cardCount = cards.length;
   const cardWidth = cards[0].offsetWidth +
      parseInt(getComputedStyle(cards[0]).marginLeft) +
      parseInt(getComputedStyle(cards[0]).marginRight);

   let position = 0;
   let transitioning = false;
   let interval;

   cards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add("gallery-card");
      DOM.track.appendChild(clone);
   });

   function slide() {
      if (transitioning) return;
      transitioning = true;
      position++;
      DOM.track.style.transform = `translateX(-${position * cardWidth}px)`;

      if (position >= cardCount) {
         setTimeout(() => {
            DOM.track.style.transition = "none";
            position = 0;
            DOM.track.style.transform = `translateX(0)`;
            transitioning = false;
            setTimeout(() => {
               DOM.track.style.transition = "transform 0.7s ease-in-out";
            }, 50);
         }, 700);
      } else {
         setTimeout(() => {
            transitioning = false;
         }, 700);
      }
   }

   function startAutoScroll() {
      stopAutoScroll();
      interval = setInterval(slide, 4000);
   }

   function stopAutoScroll() {
      clearInterval(interval);
   }

   startAutoScroll();

   // === pause on hover ===
   DOM.galleryCards.forEach(card => {
      card.addEventListener("mouseenter", stopAutoScroll);
      card.addEventListener("mouseleave", startAutoScroll);
   });

   // === burger toggle ===
   let lastScrollTop = 0;
   let isManuallyOpened = false;

   DOM.burgerBtn.addEventListener("click", () => {
      const isOpen = DOM.burgerBtn.classList.toggle("open");
      isManuallyOpened = isOpen;

      if (isOpen) {
         DOM.navMenu.classList.remove("hidden", "max-h-0", "opacity-0");
         setTimeout(() => {
            DOM.navMenu.classList.add("max-h-40", "opacity-100");
         }, 10);
      } else {
         DOM.navMenu.classList.remove("max-h-40", "opacity-100");
         DOM.navMenu.classList.add("max-h-0", "opacity-0");
         setTimeout(() => {
            DOM.navMenu.classList.add("hidden");
         }, 300);
      }
   });

   window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
         if (!DOM.navMenu.classList.contains("hidden") && !isManuallyOpened) {
            DOM.navMenu.classList.remove("max-h-40", "opacity-100");
            DOM.navMenu.classList.add("max-h-0", "opacity-0");
            setTimeout(() => {
               DOM.navMenu.classList.add("hidden");
               DOM.burgerBtn.classList.remove("open");
            }, 300);
         }
      } else {
         if (DOM.burgerBtn.classList.contains("open") && DOM.navMenu.classList.contains("hidden")) {
            DOM.navMenu.classList.remove("hidden");
            setTimeout(() => {
               DOM.navMenu.classList.remove("max-h-0", "opacity-0");
               DOM.navMenu.classList.add("max-h-40", "opacity-100");
            }, 10);
         }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
   });

   // === weather ===
   const apiKey = "409912f51957e260bf89f5420c9d458e";

   navigator.geolocation.getCurrentPosition(
      async position => {
         const { latitude, longitude } = position.coords;
         console.log("Geolocation success:", { latitude, longitude });
         await fetchWeather(latitude, longitude);
      },
      async error => {
         console.error("Geolocation error:", error.message);
         console.log("Falling back to Haifa");
         await fetchWeather(null, null, "Haifa");
      }
   );

   async function fetchWeather(lat = null, lon = null, city = null) {
      let url = '';
      if (lat && lon) {
         url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      } else if (city) {
         url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      } else {
         return;
      }

      try {
         const res = await fetch(url);
         const data = await res.json();
         updateWeatherUI(data);
      } catch (e) {
         console.error("Weather fetch failed:", e);
      }
   }

   function updateWeatherUI(data) {
      const iconCode = data.weather[0].icon;
      const iconUrl = `assets/weather-icons/${iconCode}.svg`;

      DOM.weatherIcon.src = iconUrl;
      DOM.weatherIcon.alt = data.weather[0].description || "Weather";
      DOM.weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
      DOM.weatherDesc.textContent = data.weather[0].description;
      DOM.weatherLocation.textContent = `${data.name}, ${data.sys.country}`;
   }

   // === time and fact ===
   function updateTimeAndDate() {
      const now = new Date();
      const time = now.toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit'
      });
      const options = {
         weekday: 'long',
         month: 'long',
         day: 'numeric'
      };
      const date = now.toLocaleDateString('en-US', options);

      DOM.clock.textContent = time;
      DOM.date.textContent = date;
   }

   async function loadFact() {
      try {
         const today = new Date();
         const month = today.getMonth() + 1;
         const day = today.getDate();

         const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`);
         const data = await res.json();

         if (data.events && data.events.length > 0) {
            const randomFact = data.events[Math.floor(Math.random() * data.events.length)];
            const year = randomFact.year;
            const text = randomFact.text;

            DOM.factTitle.textContent = `On this day: ${year}`;
            DOM.factText.textContent = text;
         } else {
            DOM.factTitle.textContent = "On this day";
            DOM.factText.textContent = "Nothing happened. The universe blinked.";
         }
      } catch (err) {
         DOM.factTitle.textContent = "On this day";
         DOM.factText.textContent = "Could not load historical fact.";
      }
   }

   updateTimeAndDate();
   setInterval(updateTimeAndDate, 1000);
   loadFact();

   // === toggle expand ===
   DOM.toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
         const card = button.closest('.card');
         card.classList.toggle('expanded');
         button.textContent = card.classList.contains('expanded') ? 'Show less' : 'Show more';
      });
   });

   // === password generator ===
   DOM.passwordSlider.addEventListener('input', () => DOM.passwordLength.value = DOM.passwordSlider.value);
   DOM.passwordLength.addEventListener('input', () => DOM.passwordSlider.value = DOM.passwordLength.value);

   window.generatePassword = function() {
      const length = +DOM.passwordLength.value;
      const upper = document.getElementById('upper').checked;
      const lower = document.getElementById('lower').checked;
      const numbers = document.getElementById('numbers').checked;
      const symbols = document.getElementById('symbols').checked;

      let charset = '';
      if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lower) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (numbers) charset += '0123456789';
      if (symbols) charset += '!@#$%^&*()_+-=[]{};:,.<>?';

      if (!charset) {
         DOM.passwordOutput.textContent = 'select at least one option';
         return;
      }

      let password = '';
      for (let i = 0; i < length; i++) {
         password += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      DOM.passwordOutput.textContent = password;
   };

   window.copyPassword = function() {
      navigator.clipboard.writeText(DOM.passwordOutput.textContent).then(() => {
         alert('Password copied to clipboard!');
      });
   };

   // === contact form handling ===
   if (DOM.contactForm) {
      DOM.contactForm.addEventListener('submit', function(e) {
         e.preventDefault();
         emailjs.sendForm('service_iqyx8v5', 'template_fa6a58b', this, 'Dcqqxk4oL6reqG_Zr')
            .then(() => {
               alert("Message sent successfully!");
               this.reset();
            }, (error) => {
               console.error('FAILED...', error);
               alert("Failed to send message. See console for details.");
            });
      });
   } else {
      console.warn('contact-form not found in DOM.');
   }

   // === Snake 2.5-D bootstrap ===
   (async () => {
      if (!DOM.digits) return;

      resetDigits();

      if (!window.loadPyodide) {
         await new Promise(res => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
            s.onload = res;
            document.head.appendChild(s);
         });
      }

      const py = await loadPyodide({
         indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
      });
      window.pyodide = py;
// Начало питона
      const code =
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
      await py.runPythonAsync(code);
 // конец питона
      const startFn = py.globals.get("start");
      if (startFn) {
         window.startFn = startFn;
         console.log("✅ Snake startFn готова.");
      } else {
         console.warn("⛔ 'start' function not found in Python globals.");
      }

      // Full-screen helper
      window.openSnakeFull = () => {
         const url = "/projects/snake-2_5d/snake_py.html";
         const mobile = window.matchMedia("(max-width: 768px)").matches;

         if (mobile) {
            const wrap = document.createElement("div");
            wrap.className = "fixed inset-0 bg-black/90 z-50 flex items-center justify-center";
            wrap.innerHTML = `
               <iframe src="${url}" class="w-[90vw] h-[90vh] rounded-lg border border-[#f7d86a]"></iframe>
               <button class="absolute top-4 right-6 text-3xl text-[#f7d86a]"
                       onclick="this.parentNode.remove()">×</button>`;
            document.body.appendChild(wrap);
         } else {
            window.open(url, "snakeFull",
                        "width=800,height=600,menubar=no,location=no");
         }
      };
   })();

   // === game controls ===
   document.addEventListener("keydown", (e) => {
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const key = e.key;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
         e.preventDefault();
      }

      switch (key) {
         case "ArrowUp":
         case "w":
         case "W":
            dir_x = 0;
            dir_y = -1;
            break;
         case "ArrowDown":
         case "s":
         case "S":
            dir_x = 0;
            dir_y = 1;
            break;
         case "ArrowLeft":
         case "a":
         case "A":
            dir_x = -1;
            dir_y = 0;
            break;
         case "ArrowRight":
         case "d":
         case "D":
            dir_x = 1;
            dir_y = 0;
            break;
         case "Escape":
            closeModal();
            break;
      }
   });

   window.startGame = function() {
      if (DOM.startBtn) DOM.startBtn.disabled = true;
      playSound(DOM.bgMusic, "🎧 Автозапуск заблокирован:");
      hideStartScreen();
      clearCanvas();
      launchGame();
   };

   window.gameOver = function() {
      console.log("📛 Вызвана window.gameOver()");
      stopSound(DOM.bgMusic);
      playSound(DOM.failSound, "💀 Ошибка звука поражения:");
      createModal({
         content: "💥 Oops! You hit a bomb.",
         buttonId: "retryBtn",
         buttonText: "Try Again",
         buttonClass: "bg-red-500 text-white hover:bg-red-400",
         textClass: "text-red-400",
         onButtonClick: () => {
            resetStartScreen();
            resetDigits();
            clearCanvas();
            if (DOM.startBtn) DOM.startBtn.disabled = false;
         }
      });
   };

window.unlockCallback = function() {
    console.log("🏁 Победа!");
    stopSound(DOM.bgMusic);
    playSound(DOM.victorySound, "🎺 Ошибка тадама:");
    createModal({
        content: "🎉<br>Number Unlocked!<br>052-3961348",
        buttonId: "okBtn",
        buttonText: "OK",
        buttonClass: "bg-[#f7d86a] text-black hover:bg-yellow-400",
        textClass: "text-[#f7d86a]",
        onButtonClick: () => {
            resetStartScreen();
            resetDigits();
            clearCanvas();
            if (DOM.startBtn) DOM.startBtn.disabled = false;
         //   launchGame(); // Этот вызов запускает игру автоматически
        }
    });
};


   window.failCallback = function() {
      console.log("💥 Поражение!");
      stopSound(DOM.bgMusic);
      playSound(DOM.failSound, "💀 Ошибка звука поражения:");
      window.gameOver();
   };

   if (DOM.startBtn) {
      DOM.startBtn.addEventListener("click", window.startGame);
   }

   window.playEatSound = function() {
      console.log("🍏 playEatSound вызвана!");
      playSound(document.getElementById("eat-sound"), "🍽️ Звук еды не воспроизвёлся:");
   };

   window.sendKey = function(key) {
      const evt = new KeyboardEvent("keydown", { key });
      document.dispatchEvent(evt);
      if (navigator.vibrate) navigator.vibrate(50);
   };
});

function escCloseHandler(event) {
   if (event.key === "Escape") {
      closeModal();
   }
}

function openModal(src) {
   const modal = document.getElementById("imageModal");
   const modalImg = document.getElementById("modalImage");
   modalImg.src = src;
   modal.classList.remove("hidden");
   document.addEventListener("keydown", escCloseHandler);
}

function closeModal(event) {
   if (!event || event.target.id === "imageModal" || event.target.tagName === "SPAN") {
      const modal = document.getElementById("imageModal");
      modal.classList.add("hidden");
      document.removeEventListener("keydown", escCloseHandler);
   }
}

// === 🎨 PALETTE GENERATOR ===

// 1. Получаем элементы
const imageEl = document.getElementById("preview-img");
const paletteEl = document.getElementById("palette-bar");
const sliderEl = document.getElementById("palette-slider");

// 2. Обработчик загрузки картинки
imageEl.onload = () => {
   generatePalette();
};

// 🔧 Проверяем, загружено ли уже
if (imageEl.complete && imageEl.naturalHeight !== 0) {
   generatePalette();
}

// 3. Обработка ползунка
sliderEl.addEventListener("input", () => {
   generatePalette();
});

// 4. Основная функция
function generatePalette() {
   const colorThief = new ColorThief();
   const count = parseInt(sliderEl.value, 10);

   if (imageEl.complete && imageEl.naturalHeight !== 0) {
      const palette = colorThief.getPalette(imageEl, count);
      updatePaletteUI(palette);
   }
}

// 🔁 Кнопка Renew
function renewPalette() {
   const colorThief = new ColorThief();
   const count = parseInt(sliderEl.value, 10);

   if (!imageEl.complete || imageEl.naturalHeight === 0) return;

   const palette = [];
   const cropSize = 100;
   const canvas = document.createElement("canvas");
   const ctx = canvas.getContext("2d");
   canvas.width = cropSize;
   canvas.height = cropSize;

   let generated = 0;

   function generateNextColor() {
      const maxX = imageEl.naturalWidth - cropSize;
      const maxY = imageEl.naturalHeight - cropSize;
      const offsetX = Math.floor(Math.random() * maxX);
      const offsetY = Math.floor(Math.random() * maxY);

      ctx.clearRect(0, 0, cropSize, cropSize);
      ctx.drawImage(imageEl, offsetX, offsetY, cropSize, cropSize, 0, 0, cropSize, cropSize);

      const tempImg = new Image();
      tempImg.src = canvas.toDataURL();
      tempImg.onload = () => {
         try {
            const color = colorThief.getColor(tempImg);
            palette.push(color);
         } catch (e) {
            console.warn("⚠️ Ошибка при получении цвета:", e);
         }

         generated++;
         if (generated < count) {
            generateNextColor();
         } else {
            updatePaletteUI(palette);
         }
      };
   }

   generateNextColor();
}

// 🎨 Общая отрисовка палитры
function updatePaletteUI(palette) {
   paletteEl.innerHTML = "";
   palette.forEach(color => {
      const hex = rgbToHex(...color);
      const swatch = document.createElement("div");
      swatch.className = "h-full";
      swatch.style.backgroundColor = hex;
      swatch.style.flex = "1";
      paletteEl.appendChild(swatch);
   });
}

// 🔠 RGB → HEX
function rgbToHex(r, g, b) {
   return "#" + [r, g, b].map(x =>
      x.toString(16).padStart(2, "0")
   ).join("");
}

function triggerImageUpload() {
   const input = document.getElementById("image-input");
   if (input) input.click();
}

document.getElementById("image-input").addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
   const file = event.target.files[0];
   if (!file) return;

   const reader = new FileReader();
   reader.onload = function (e) {
      imageEl.src = e.target.result;
      // generatePalette() будет вызван автоматически через imageEl.onload
   };
   reader.readAsDataURL(file);
}
function showExportPreview() {
   const palette = getCurrentPalette();
   const container = document.getElementById("palette-preview");
   container.innerHTML = "";

   palette.forEach(color => {
      const hex = rgbToHex(...color);

      const column = document.createElement("div");
      column.className = "flex flex-col justify-between items-center flex-1 h-full";

      const hexText = document.createElement("div");
      hexText.textContent = hex;
      hexText.className = "text-xs text-white font-mono mt-1 select-text";

      const swatch = document.createElement("div");
      swatch.className = "w-full flex-1";
      swatch.style.backgroundColor = hex;

      column.appendChild(hexText);
      column.appendChild(swatch);
      container.appendChild(column);
   });

   document.getElementById("export-modal").classList.remove("hidden");
}


function hideExportPreview() {
   document.getElementById("export-modal").classList.add("hidden");
}

function downloadPalette() {
   const colors = getCurrentPalette(); // [[r, g, b], ...]
   const canvas = document.createElement("canvas");
   const ctx = canvas.getContext("2d");

   const width = 500;
   const height = 120;
   const blockWidth = width / colors.length;

   canvas.width = width;
   canvas.height = height;

   // Отрисовка цветных блоков
   colors.forEach((color, i) => {
      const hex = rgbToHex(...color);
      ctx.fillStyle = hex;
      ctx.fillRect(i * blockWidth, 0, blockWidth, 80);

      ctx.fillStyle = "#ffffff";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(hex, i * blockWidth + blockWidth / 2, 105);
   });

   // Скачивание
   const link = document.createElement("a");
   link.download = "palette.png";
   link.href = canvas.toDataURL("image/png");
   link.click();
}


function getCurrentPalette() {
   // Используем текущие DOM-элементы палитры
   const swatches = paletteEl.querySelectorAll("div");
   return Array.from(swatches).map(swatch => {
      const hex = swatch.style.backgroundColor;
      const [r, g, b] = hex.replace(/[^\d,]/g, '').split(',').map(Number);
      return [r, g, b];
   });
}

  const msg2 = document.createElement("div");
  msg2.className = "message-melissa flex justify-start";
  msg2.innerHTML = `
    <div class="bg-[#444] text-yellow-200 italic font-light text-[13px] rounded px-3 py-1 mt-2 ml-4 max-w-[75%] text-left">
      <span class="text-pink-400 font-semibold">Melissa:</span><br>Hello there!<br>!שלום וברכה<br>Привет!<br>I’m here.<br>Fully present.<br>Fully yours.<br>So... what’s on your mind?
    </div>`;
  chatbox.appendChild(msg2);

  chatbox.scrollTop = chatbox.scrollHeight;
;

window.js = window.js || {};
