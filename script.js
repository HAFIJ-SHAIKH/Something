
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const get = (id) => document.getElementById(id);

  const noBtn = get("noBtn");
  const yesBtn = get("yesBtn");
  const attemptText = get("attemptText");
  const popupLayer = get("popupLayer");
  const heartsBackground = get("heartsBackground");
  const mainCard = get("mainCard");
  const successScreen = get("successScreen");

  const requiredElements = [
    noBtn,
    yesBtn,
    attemptText,
    popupLayer,
    heartsBackground,
    mainCard,
    successScreen
  ];

  if (requiredElements.some((element) => !element)) {
    console.error(
      "Maaf Kar Do: A required HTML element is missing. Check index.html."
    );
    return;
  }

  const apologyMessages = [
    "Mujhe sach mein afsos hai. ❤️",
    "Tumhari feelings mere liye important hain. 💗",
    "Main apni galti ki zimmedari leta hoon. 🥺",
    "Kaash main tumhari takleef door kar sakun. 💕",
    "Main apni galti se seekhna chahta hoon. ❤️",
    "Tumhari baat sunne ke liye main yahin hoon. 🫶",
    "I'm genuinely sorry. 💖",
    "Main chahta hoon ki tumhe meri baaton se nahi, actions se bharosa ho."
  ];

  const heartSymbols = ["💗", "💕", "💖", "♡", "💘"];

  let heartInterval = null;
  let nextMessage = "";

  function chooseApologyMessage() {
    const choices = apologyMessages.filter(
      (message) => message !== nextMessage
    );

    const pool = choices.length ? choices : apologyMessages;
    const message = pool[Math.floor(Math.random() * pool.length)];

    nextMessage = message;
    return message;
  }

  // Create soft background hearts.
  function createFloatingHeart() {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent =
      heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${14 + Math.random() * 20}px`;
    heart.style.animationDuration = `${8 + Math.random() * 5}s`;

    heartsBackground.appendChild(heart);

    heart.addEventListener("animationend", () => heart.remove(), {
      once: true
    });

    window.setTimeout(() => heart.remove(), 15000);
  }

  // Add a short-lived message without blocking the page.
  function showApologyPopup() {
    const popup = document.createElement("div");
    popup.className = "apology-popup";
    popup.textContent = chooseApologyMessage();
    popup.setAttribute("role", "status");

    // Alternate upper and lower placement without displaying a counter.
    const useTop = Math.random() < 0.5;
    popup.style.top = useTop ? "12px" : "auto";
    popup.style.bottom = useTop ? "auto" : "12px";
    popup.style.visibility = "hidden";

    popupLayer.appendChild(popup);

    const width = popup.getBoundingClientRect().width;
    const sidePadding = 12;
    const freeSpace = Math.max(
      0,
      window.innerWidth - width - sidePadding * 2
    );

    popup.style.left =
      `${sidePadding + Math.random() * freeSpace}px`;
    popup.style.visibility = "visible";

    const removalTimer = window.setTimeout(() => {
      popup.remove();
    }, 4300);

    popup.addEventListener("animationend", (event) => {
      if (event.animationName === "popupOut") {
        window.clearTimeout(removalTimer);
        popup.remove();
      }
    });

    // Keep the number of simultaneous popups limited.
    while (popupLayer.children.length > 4) {
      popupLayer.firstElementChild?.remove();
    }
  }

  function handleNo() {
    // No click counter, no changing button label, and no disabling.
    showApologyPopup();

    // The message is sincere and stable, not a score or challenge.
    attemptText.textContent =
      "Main samajhta hoon. Tum apna waqt le sakti ho. ❤️";
  }

  function handleYes() {
    mainCard.hidden = true;
    popupLayer.replaceChildren();
    successScreen.hidden = false;

    if (heartInterval !== null) {
      window.clearInterval(heartInterval);
      heartInterval = null;
    }
  }

  noBtn.addEventListener("click", handleNo);
  yesBtn.addEventListener("click", handleYes);

  // Start the background animation.
  for (let i = 0; i < 5; i++) {
    window.setTimeout(createFloatingHeart, i * 250);
  }

  heartInterval = window.setInterval(createFloatingHeart, 1000);

  // Avoid keeping a running interval when the page is left.
  window.addEventListener("pagehide", () => {
    if (heartInterval !== null) {
      window.clearInterval(heartInterval);
      heartInterval = null;
    }
  }, { once: true });
});
