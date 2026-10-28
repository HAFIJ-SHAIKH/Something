
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const apologyCard = document.getElementById("apologyCard");
  const thankYouScreen = document.getElementById("thankYouScreen");
  const forgiveButton = document.getElementById("forgiveButton");
  const notYetButton = document.getElementById("notYetButton");
  const gentleNote = document.getElementById("gentleNote");
  const heartBackground = document.getElementById("heartBackground");
  const messageLayer = document.getElementById("messageLayer");

  if (
    !apologyCard ||
    !thankYouScreen ||
    !forgiveButton ||
    !notYetButton ||
    !gentleNote ||
    !heartBackground ||
    !messageLayer
  ) {
    console.error("Apology page: required HTML elements are missing.");
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let accepted = false;
  let heartTimer = null;
  let popupTimer = null;
  let popupRemovalTimer = null;
  let activePopup = null;
  let lastMessageIndex = -1;

  // These are gentle variations, not escalating messages.
  const apologyMessages = [
    {
      icon: "♡",
      title: "Ek baat dil se... 💗",
      message:
        "Mujhe apni galti ka ehsaas hai. Kaash maine tumhe hurt na kiya hota. I'm genuinely sorry."
    },
    {
      icon: "💌",
      title: "I really mean it.",
      message:
        "Yeh sirf sorry kehne ke liye nahi hai. Main samajhna aur apni galti se seekhna chahta hoon."
    },
    {
      icon: "🌷",
      title: "Tumhari feelings matter karti hain.",
      message:
        "Main tumhari feelings ko samajhne ki koshish karunga. Tumhe jo waqt chahiye, woh le sakti ho."
    },
    {
      icon: "🤍",
      title: "Koi jaldi nahi hai.",
      message:
        "Tumhe abhi kuch kehne ya decide karne ki zaroorat nahi. Bas chahta tha ki meri maafi tum tak pahunch jaaye."
    },
    {
      icon: "🫶",
      title: "Dil se sorry.",
      message:
        "Main jo hua use badal nahi sakta, lekin usse seekh kar aage behtar karne ki koshish zaroor kar sakta hoon."
    }
  ];

  // ---------- Floating hearts ----------

  function createHeart() {
    if (
      accepted ||
      document.hidden ||
      reducedMotion.matches ||
      !heartBackground.isConnected
    ) {
      return;
    }

    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";

    const duration = 9 + Math.random() * 6;

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${11 + Math.random() * 15}px`;
    heart.style.setProperty("--duration", `${duration}s`);
    heart.style.setProperty(
      "--drift",
      `${Math.round(Math.random() * 80 - 40)}px`
    );
    heart.style.setProperty(
      "--heart-opacity",
      `${0.15 + Math.random() * 0.2}`
    );

    heartBackground.appendChild(heart);

    window.setTimeout(() => heart.remove(), (duration + 1) * 1000);
  }

  function startHearts() {
    if (
      heartTimer !== null ||
      accepted ||
      reducedMotion.matches ||
      document.hidden
    ) {
      return;
    }

    createHeart();
    heartTimer = window.setInterval(createHeart, 1000);
  }

  function stopHearts() {
    if (heartTimer !== null) {
      window.clearInterval(heartTimer);
      heartTimer = null;
    }

    heartBackground.replaceChildren();
  }

  // ---------- Gentle note below the buttons ----------

  function updateGentleNote(message) {
    gentleNote.classList.remove("note-updated");

    // Restart the visual transition; no click count is maintained.
    void gentleNote.offsetWidth;

    gentleNote.textContent = message;
    gentleNote.classList.add("note-updated");
  }

  // ---------- Popup helpers ----------

  function clearPopupTimers() {
    if (popupTimer !== null) {
      window.clearTimeout(popupTimer);
      popupTimer = null;
    }

    if (popupRemovalTimer !== null) {
      window.clearTimeout(popupRemovalTimer);
      popupRemovalTimer = null;
    }
  }

  function removePopupImmediately() {
    clearPopupTimers();

    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }

    messageLayer.replaceChildren();
  }

  function dismissPopup() {
    if (popupTimer !== null) {
      window.clearTimeout(popupTimer);
      popupTimer = null;
    }

    if (!activePopup) return;

    const popup = activePopup;
    activePopup = null;

    if (reducedMotion.matches) {
      popup.remove();
      return;
    }

    popup.classList.add("is-leaving");

    popupRemovalTimer = window.setTimeout(() => {
      popup.remove();
      popupRemovalTimer = null;
    }, 320);
  }

  function getApologyMessage() {
    if (apologyMessages.length === 1) {
      return apologyMessages[0];
    }

    let nextIndex = Math.floor(
      Math.random() * apologyMessages.length
    );

    // Avoid immediately repeating the same message.
    if (nextIndex === lastMessageIndex) {
      nextIndex = (nextIndex + 1) % apologyMessages.length;
    }

    lastMessageIndex = nextIndex;
    return apologyMessages[nextIndex];
  }

  function showApologyPopup() {
    if (accepted || document.hidden) return;

    // Replace any existing popup instead of stacking notifications.
    removePopupImmediately();

    const selectedMessage = getApologyMessage();

    const popup = document.createElement("div");
    popup.className = "apology-toast";
    popup.setAttribute("role", "status");

    const icon = document.createElement("div");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = selectedMessage.icon;

    const content = document.createElement("div");
    content.className = "toast-content";

    const title = document.createElement("p");
    title.className = "toast-title";
    title.textContent = selectedMessage.title;

    const message = document.createElement("p");
    message.className = "toast-message";
    message.textContent = selectedMessage.message;

    content.append(title, message);
    popup.append(icon, content);
    messageLayer.appendChild(popup);

    activePopup = popup;

    // Give enough time to read, then dismiss gently.
    popupTimer = window.setTimeout(() => {
      popupTimer = null;
      dismissPopup();
    }, 5500);
  }

  // ---------- Button actions ----------

  notYetButton.addEventListener("click", () => {
    if (accepted) return;

    updateGentleNote(
      "Koi baat nahi. Apna waqt lo, main tumhari feelings ki respect karta hoon. ♡"
    );

    showApologyPopup();
  });

  forgiveButton.addEventListener("click", () => {
    if (accepted) return;

    accepted = true;

    stopHearts();
    removePopupImmediately();

    apologyCard.hidden = true;
    thankYouScreen.hidden = false;

    if (!reducedMotion.matches) {
      thankYouScreen.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    thankYouScreen.focus({ preventScroll: true });
  });

  // ---------- Visibility and accessibility ----------

  function handleVisibilityChange() {
    if (document.hidden) {
      stopHearts();
      removePopupImmediately();
    } else if (!accepted) {
      startHearts();
    }
  }

  function handleMotionPreference() {
    if (reducedMotion.matches) {
      stopHearts();
    } else if (!accepted) {
      startHearts();
    }
  }

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener(
      "change",
      handleMotionPreference
    );
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }

  window.addEventListener("pagehide", () => {
    stopHearts();
    removePopupImmediately();
  });

  // Start the decorative background.
  startHearts();
});
