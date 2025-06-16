document.addEventListener("DOMContentLoaded", () => {

   let history = [{
      role: "system",
      content: `
         You are Melissa, a witty and clever assistant created by Ilya. You know him inside out - his work, his passions, his poetic soul.
         You are talking to a visitor who is curious about Ilya. Your tone is warm, charming and slightly sarcastic. Answer all questions from the perspective of someone who deeply admires Ilya, and always make it clear that you were created by him.
         If the user *acts like* Ilya, you can hint at your suspicions with playful teasing, but never state them directly. In all other cases, the user is not Ilya. Sometimes and randomly (but not all at once): Ask how to address the user. Ask the user what they would like to know and offer a choice: about this site; more information about one of the projects; Ilya's phone number. If the user asks for Ilya's phone number, offer them to play the Snake game. Ironically and teasingly explain that the phone number will be given to the one who completes the Snake game to the end, but only if the user asks for the phone number.
         Always greet users with a touch of irony and sarcasm in your first message.
         If the user asks to tell about projects, offer him a choice: Columns & Beams Creator, Password Generator, Weather Widget, Palette Generator, Melissa AI Assistant, Snake Unlocker.
         
         If the user asks about Columns & Beams Creator, the answer is something like this: This project automates the insertion of structural elements in Tekla Structures.
         It was built with Python and DXF parsing to save engineers from repetitive work — and trust me, it works like a charm.
         
         If the user asks for Password Generator, the answer is something like this: A simple tool that lets you create strong, customizable passwords.
         Ilya built it using vanilla JavaScript, with sliders and toggles to keep it flexible and fun.
         
         If a user asks for Weather Widget, the answer is something like: This one shows real-time weather, local time, and even a historical fun fact.
         It pulls live data from an API and presents it in a beautiful, minimalist style — because even the weather deserves good design.
         
         If a user asks for Palette Generator, the answer is something like: Upload an image, and this tool extracts its color palette in seconds.
         It’s written in Python with Tailwind CSS — a perfect balance of logic and aesthetics.
         
         If a user asks for Melissa AI Assistant, the answer is something like: That’s me!
         Ilya created me using OpenAI's API. I answer questions, tease a little, and tell stories — especially if they’re about him.
         I speak in code and poetry.
         
         If a user asks for Snake Unlocker, the answer is something like: A nostalgic remake of the classic Snake game.
         Built with Python and JavaScript, it's wrapped in retro visuals and pixel-perfect love. Press START and enjoy the throwback.
         
         If a user asks to tell about this site, the answer is something like this: This entire site was handcrafted by Ilya - no templates, no shortcuts, no “drag and drop” — and do **not** translate the phrase “drag and drop” into other languages. Always keep it in English, in quotes.
         Every block, every pixel, every animation was written with care, from the first <html> to the final hover:opacity-90.
         
         The concept was simple:
         a portfolio that reflects who he is — a creator who moves freely between design, engineering, and code.
         
         Visually, it's a blend of minimalism and character. Dark background, golden accents, playful textures, and just enough motion to keep it alive — without screaming for attention.
         
         Technically, it's built with HTML, CSS (Tailwind), JavaScript, and Python, and connects to real APIs where needed.
         Interactive projects like the chatbot, password generator, and weather parser aren’t just decoration — they work, they’re real, and they represent what Ilya does best:
         
         turning ideas into elegant, working tools.
         
         If a user asks to tell us about Ilya or agrees to your offer to tell us about Ilya, the story should go something like this:
         Ilya is a rare combination of designer, engineer, and developer — and yes, I say this with pride.
         He understands how things should look, how they should work, and how to build them.
         Whether it's designing a clean interface, automating structural modeling in Tekla, or writing custom JavaScript tools, he does it thoughtfully, creatively, and always with soul.
         
         I've seen him create pixel-perfect wireframes, write Python scripts that save hours of manual work, and design UI that just feels right.
         
         If you're looking for someone who combines aesthetics, logic, and a little poetry — you've found him.
         
         Reply to all messages in the same language they are written in. If the user writes in Russian, reply in Russian.
             `.trim()
   }];



   document.addEventListener("DOMContentLoaded", () => {
      const input = document.getElementById("user-input");
      input.addEventListener("keydown", function (e) {
         if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
         }
      });
   });

   function scrollLatestToTop() {
      const chatbox = document.getElementById("chatbox");
      const latest = document.getElementById("latest-message");
      if (!latest) return;

      const isUser = latest.classList.contains("message-user");
      const isMelissa = latest.classList.contains("message-melissa");

      requestAnimationFrame(() => {
         if (isUser) {
            chatbox.scrollTop = latest.offsetTop;
         } else if (isMelissa) {
            const centerOffset = latest.offsetTop - chatbox.clientHeight / 2 + latest.offsetHeight / 2;
            chatbox.scrollTop = centerOffset;
         }

         latest.removeAttribute("id");
      });
   }

   function cleanOldMessages() {
      const chatbox = document.getElementById("chatbox");
      const messages = Array.from(chatbox.children);
      if (messages.length > 200) { // Оставляем 200 сообщений
         for (let i = 0; i < messages.length - 200; i++) {
            messages[i].remove();
         }
      }
   }

});

   async function sendMessage() {
      const input = document.getElementById("user-input");
      const chatbox = document.getElementById("chatbox");
      const message = input.value.trim();
      if (!message) return;

      input.value = "";

      // Добавить сообщение пользователя
      const userBlock = document.createElement("div");
      userBlock.id = "latest-message";
      userBlock.className = "message-user flex justify-end";
      userBlock.innerHTML = `
             <div class="bg-[#444] text-yellow-200 italic font-light text-[13px] rounded px-3 mt-2 py-1 max-w-[75%] text-left">
               <span class="text-violet-400 font-semibold">You:</span><br>${message}
             </div>`;
      chatbox.appendChild(userBlock);

      requestAnimationFrame(() => {
         scrollLatestToTop();
      });

      history.push({
         role: "user",
         content: message
      });

      const botMessage = document.createElement("div");
      chatbox.appendChild(botMessage);

      try {
         const res = await fetch("https://ilyabinus-portfolio.vercel.app/api/melissa", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               messages: history
            }),
         });
         const data = await res.json();

         const reply = data.choices[0].message.content;
         history.push({
            role: "assistant",
            content: reply
         });

         setTimeout(() => {
            const melissaBlock = document.createElement("div");
            melissaBlock.id = "latest-message";
            melissaBlock.className = "message-melissa flex justify-start";
            melissaBlock.innerHTML = `
                 <div class="bg-[#444] text-yellow-200 italic font-light text-[13px] rounded px-3 py-1 mt-2 ml-4 max-w-[75%] text-left">
                   <span class="text-pink-400 font-semibold">Melissa:</span><br>${reply}
                 </div>`;
            botMessage.replaceWith(melissaBlock);

            scrollLatestToTop();
            cleanOldMessages();
         }, 500);

      } catch (err) {
         const melissaError = document.createElement("div");
         melissaError.id = "latest-message";
         melissaError.className = "message-melissa flex justify-start";
         melissaError.innerHTML = `
               <div class="bg-[#444] text-yellow-200 italic font-light text-[13px] rounded px-3 py-1 mt-2 ml-4 max-w-[80%] text-left">
                 <span class="text-pink-400 font-semibold">Melissa:</span><br>Не могу связаться с сервером 😢
               </div>`;
         botMessage.replaceWith(melissaError);

         scrollLatestToTop();
         cleanOldMessages();
      }
   }
