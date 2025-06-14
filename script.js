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
      snakeCover: document.getElementById("snake-cover"),

      // 🧩 Новое для модалки:
      melissaProject: document.getElementById("melissa-project"),
      modal: document.getElementById("modal"),
      modalContent: document.getElementById("modal-content"),
      expandBtn: document.getElementById("expand-button")
   };

// ✅ Безопасно и только если всё найдено
if (
  DOM.melissaProject &&
  DOM.expandBtn &&
  DOM.modal &&
  DOM.modalContent
) {
  const originalParent = DOM.melissaProject.parentNode;
  const placeholder = document.createElement("div");
  placeholder.style.display = "none";

  const melissaCardInner = [...DOM.melissaProject.querySelectorAll("div")].find(div =>
    div.classList.contains("h-[550px]")
  );

  let isExpanded = false;

  DOM.expandBtn.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");

    if (!modal || !modalContent || !DOM.melissaProject) return;

    if (!isExpanded) {
      // 🔼 Открываем
      originalParent.insertBefore(placeholder, DOM.melissaProject);
      modalContent.appendChild(DOM.melissaProject);
      modal.classList.remove("hidden");

      if (melissaCardInner) {
        melissaCardInner.classList.remove("h-[550px]");
        melissaCardInner.classList.add("h-full");
      }

      setTimeout(() => {
        modalContent.classList.remove("scale-95");
        modalContent.classList.add("scale-100");
      }, 10);

      DOM.expandBtn.textContent = "Close";
      isExpanded = true;

    } else {
      // 🔽 Закрываем
      modalContent.classList.remove("scale-100");
      modalContent.classList.add("scale-95");

      setTimeout(() => {
        modal.classList.add("hidden");
        originalParent.insertBefore(DOM.melissaProject, placeholder);
        placeholder.remove();

        if (melissaCardInner) {
          melissaCardInner.classList.remove("h-full");
          melissaCardInner.classList.add("h-[550px]");
        }

        DOM.expandBtn.textContent = "Expand";
        isExpanded = false;
      }, 300);
    }
  });

  // Дополнительно — можно закрывать по фону
  DOM.modal.addEventListener("click", (e) => {
    if (e.target === DOM.modal && isExpanded) {
      DOM.expandBtn.click(); // Просто "кликнуть" на ту же кнопку
    }
  });
}



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
      
          let retries = 20; // Увеличиваем количество попыток
          const retryInterval = 200; // Увеличиваем интервал до 200 мс
          while (!window.startFn && retries > 0) {
              console.log(`⏳ Ждём появления startFn... (попытка ${21 - retries}/20)`);
              await new Promise(res => setTimeout(res, retryInterval));
              retries--;
          }
      
          if (window.startFn) {
              console.log("✅ startFn готова, активируем кнопку");
              if (DOM.startBtn) {
                  DOM.startBtn.disabled = false;
                  DOM.startBtn.textContent = "START";
              }
          } else {
              console.error("❌ startFn не появилась после ожидания");
              if (DOM.startBtn) {
                  DOM.startBtn.textContent = "ERROR";
                  DOM.startBtn.disabled = true;
              }
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

   
      let isReady = false; // 🧠 Флаг готовности
      
      // 🐍 Загрузка и запуск Python-кода
      const code = await (await fetch(
        "https://raw.githubusercontent.com/rmwizard/ilyabinus-portfolio/main/code/snakecode.py?ts=" + Date.now()
      )).text();
      
      console.log("🐍 Загруженный код:\n", code);
      
      await py.runPythonAsync(code);
      

      console.log("🔍 Пробуем получить startFn из Python...");
      const startFn = py.globals.get("start");
      
      if (startFn) {
        window.startFn = startFn;
        isReady = true; // ✅ Устанавливаем флаг готовности
        console.log("✅ Snake startFn готова.");
      
        if (DOM.startBtn) {
          DOM.startBtn.disabled = false;
      
          let firstClick = true;
      
          DOM.startBtn.addEventListener("click", async () => {
            if (!window.startFn) {
              console.warn("⏳ Игра ещё не готова — подожди секунду.");
              return;
            }
      
            if (firstClick) {
              console.log("🎮 Первый клик — двойной запуск");
      
              await window.startGame();
      
              setTimeout(() => {
                window.startGame();
              }, 50);
      
              firstClick = false;
            } else {
              console.log("🎮 Обычный клик");
              await window.startGame();
            }
          });
        }
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

      window.startGame = async () => {
          const btn = DOM.startBtn;
          if (!btn) {
              console.error("❌ startBtn не найден");
              return;
          }
      
          if (!window.startFn) {
              console.warn("⚠️ Игра ещё не готова, пожалуйста, подождите.");
              return;
          }
      
          const isStarting = btn.textContent === "START";
      
          if (isStarting) {
              btn.textContent = "STOP";
              btn.disabled = true; // Отключаем кнопку на время запуска
              playSound(DOM.bgMusic, "🎧 Автозапуск заблокирован:");
              hideStartScreen();
              clearCanvas();
      
              try {
                  console.log("🔍 Вызываем startFn...");
                  await window.startFn();
                  console.log("✅ startFn выполнена успешно");
                  btn.disabled = false; // Включаем кнопку после успешного запуска
              } catch (err) {
                  console.error("🔥 Ошибка запуска:", err);
                  btn.textContent = "START";
                  btn.disabled = false;
                  resetStartScreen();
                  createModal({
                      content: "❌ Не удалось запустить игру. Попробуйте снова.",
                      buttonId: "retryBtn",
                      buttonText: "OK",
                      buttonClass: "bg-red-500 text-white hover:bg-red-400",
                      textClass: "text-red-400",
                      onButtonClick: () => {
                          resetStartScreen();
                          resetDigits();
                          clearCanvas();
                      }
                  });
              }
          } else {
              btn.textContent = "START";
              btn.disabled = true;
              stopSound(DOM.bgMusic);
      
              try {
                  await window.pyodide.runPythonAsync("stop()");
                  console.log("✅ stop() выполнен успешно");
                  btn.disabled = false;
              } catch (err) {
                  console.error("❌ Ошибка при вызове stop():", err);
                  btn.disabled = false;
              }
          }
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
            if (DOM.startBtn) {
                DOM.startBtn.disabled = false;
                DOM.startBtn.textContent = "START";
            }
        }
    }); // ✅ Закрываем createModal
}; // ✅ Закрываем window.gameOver


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
            if (DOM.startBtn) {
                DOM.startBtn.disabled = false;
                DOM.startBtn.textContent = "START";
            }
        }
    }); // ← Закрываем createModal правильно тут
};



   window.failCallback = function() {
      console.log("💥 Поражение!");
      stopSound(DOM.bgMusic);
      playSound(DOM.failSound, "💀 Ошибка звука поражения:");
      window.gameOver();
   };


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

document.addEventListener("DOMContentLoaded", () => {
  const chatbox = document.getElementById("chatbox");
  if (!chatbox) {
    console.warn("❌ chatbox не найден!");
    return;
  }

  const msg2 = document.createElement("div");
  msg2.className = "message-melissa flex justify-start";
  msg2.innerHTML = `
    <div class="bg-[#444] text-yellow-200 italic font-light text-[13px] rounded px-3 py-1 mt-2 ml-4 max-w-[75%] text-left">
      <span class="text-pink-400 font-semibold">Melissa:</span><br>
      Hello there!<br>
      <span dir="rtl">!שלום וברכה</span><br>
      Привет!<br>
      I’m here.<br>
      Fully present.<br>
      Fully yours.<br>
      So... what’s on your mind?
    </div>
  `;

  chatbox.appendChild(msg2);
  chatbox.scrollTop = chatbox.scrollHeight;
});   
   

const input = document.getElementById("user-input");

if (input) {
  input.addEventListener("focus", () => {
    if (window.innerWidth <= 768) {
      const melissa = document.getElementById("melissa-project");
      if (melissa) {
        const rect = melissa.getBoundingClientRect();
        const scrollTop = window.scrollY || window.pageYOffset;
        const offsetTop = rect.top + scrollTop;

        const customOffset = 180; // ⬅️ отступ от верха
        window.scrollTo({
          top: offsetTop - customOffset,
          behavior: "smooth"
        });
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burger-btn");
  const navMenu = document.getElementById("nav-menu");
  const aboutWrapper = document.getElementById("about-wrapper");

  let isOpen = false;

  burgerBtn.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      navMenu.classList.remove("hidden");

      // 💫 Плавное появление меню
      setTimeout(() => {
        navMenu.classList.remove("opacity-0", "scale-y-0");
        navMenu.classList.add("opacity-100", "scale-y-100");
      }, 10);

      // 📱 Только на мобиле добавляем отступ
      if (window.innerWidth < 640) {
        aboutWrapper.classList.add("mt-[80px]");
      }

    } else {
      navMenu.classList.remove("opacity-100", "scale-y-100");
      navMenu.classList.add("opacity-0", "scale-y-0");

      // 💫 Плавное скрытие и скрываем через 300ms
      setTimeout(() => {
        navMenu.classList.add("hidden");
      }, 300);

      // 📱 Убираем отступ только на мобиле
      if (window.innerWidth < 640) {
        aboutWrapper.classList.remove("mt-[80px]");
      }
    }
  });
});

  const melissaSection = document.getElementById("melissa-project");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");






window.js = window.js || {};
