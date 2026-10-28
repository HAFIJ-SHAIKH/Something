
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
    console.error("Apology page setup error: check the HTML element IDs.");
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let accepted = false;
  let heartTimer = null;
  let popupTimer = null;
  let removalTimer = null;
  let activePopup = null;
  let previousMessageIndex = -1;

  // Natural Hinglish apology messages.
  // No click counter and no escalating or guilt-based messages.
  const apologyMessages = [
    {
      icon: "🥺",
      title: "Ek baat kehni thi...",
      message:
        "Mujhe sach mein afsos hai ki meri wajah se tumhe bura laga."
    },
    {
      icon: "💬",
      title: "I mean it.",
      message:
        "Main bas formalities ke liye sorry nahi keh raha. Mujhe apni galti ka ehsaas hai."
    },
    {
      icon: "🤍",
      title: "I'm sorry.",
      message:
        "Mera irada tumhe hurt karna nahi tha, lekin main samajhta hoon ki tumhe bura laga."
    },
    {
      icon: "🌿",
      title: "Koi pressure nahi.",
      message:
        "Tumhe abhi maaf karna zaroori nahi hai. Main tumhari feelings samajhta hoon."
    },
    {
      icon: "😔",
      title: "Mujhse galti hui.",
      message:
        "Main apni galti ko justify nahi karna chahta. Jo hua, uske liye I'm sorry."
    },
    {
      icon: "🫶",
      title: "Bas itna kehna tha...",
      message:
        "Tumhara hurt hona valid hai. Main tumhari baat ko lightly nahi lena chahta."
    },
    {
      icon: "💭",
      title: "I understand.",
      message:
        "Ho sakta hai meri baat ka asar mujhe us waqt samajh nahi aaya. Uske liye mujhe afsos hai."
    },
    {
      icon: "🕊️",
      title: "Take your time.",
      message:
        "Aaram se sochna. Tumhe abhi koi jawab dene ki zaroorat nahi hai."
    },
    {
      icon: "🌷",
      title: "Dil se maafi.",
      message:
        "Kaash woh baat us tarah na hui hoti. Main genuinely sorry hoon."
    },
    {
      icon: "💌",
      title: "Ek honest apology.",
      message:
        "Main nahi chahta ki meri safai dene mein tumhari feelings peeche reh jaayein."
    },
    {
      icon: "🤝",
      title: "I respect how you feel.",
      message:
        "Tum jo feel kar rahe ho, uske liye main tumhe blame nahi karunga. I'm sorry."
    },
    {
      icon: "🙂",
      title: "Bas meri baat itni si hai.",
      message:
        "Mujhe apni galti ka afsos hai. Main bas chahta tha ki tumhe meri sincere maafi pata chale."
    }
  ];

  // ---------- Floating background decoration ----------

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
    heart.textContent = Math.random() > 0.5 ? "♡" : "·";

    const duration = 10 + Math.random() * 5;

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 12}px`;
    heart.style.setProperty("--duration", `${duration}s`);
    heart.style.setProperty(
      "--drift",
      `${Math.round(Math.random() * 70 - 35)}px`
    );
    heart.style.setProperty(
      "--heart-opacity",
      `${0.12 + Math.random() * 0.14}`
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
    heartTimer = window.setInterval(createHeart, 1200);
  }

  function stopHearts() {
    if (heartTimer !== null) {
      window.clearInterval(heartTimer);
      heartTimer = null;
    }

    heartBackground.replaceChildren();
  }

  // ---------- Small note under the buttons ----------

  function updateGentleNote(message) {
    gentleNote.classList.remove("note-updated");
    void gentleNote.offsetWidth;

    gentleNote.textContent = message;
    gentleNote.classList.add("note-updated");
  }

  // ---------- Popup management ----------

  function clearPopupTimers() {
    if (popupTimer !== null) {
      window.clearTimeout(popupTimer);
      popupTimer = null;
    }

    if (removalTimer !== null) {
      window.clearTimeout(removalTimer);
      removalTimer = null;
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

    removalTimer = window.setTimeout(() => {
      popup.remove();
      removalTimer = null;
    }, 280);
  }

  function chooseMessage() {
    if (apologyMessages.length === 1) {
      return apologyMessages[0];
    }

    let index = Math.floor(Math.random() * apologyMessages.length);

    // Prevent the same message from appearing twice in a row.
    if (index === previousMessageIndex) {
      index = (index + 1) % apologyMessages.length;
    }

    previousMessageIndex = index;
    return apologyMessages[index];
  }

  function showApologyPopup() {
    if (accepted || document.hidden) return;

    // Never stack popups on top of one another.
    removePopupImmediately();

    const item = chooseMessage();
    const popup = document.createElement("div");
    popup.className = "apology-toast";
    popup.setAttribute("role", "status");

    const icon = document.createElement("div");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.icon;

    const content = document.createElement("div");
    content.className = "toast-content";

    const title = document.createElement("p");
    title.className = "toast-title";
    title.textContent = item.title;

    const message = document.createElement("p");
    message.className = "toast-message";
    message.textContent = item.message;

    content.append(title, message);
    popup.append(icon, content);
    messageLayer.appendChild(popup);

    activePopup = popup;

    // Let the person read the message before it disappears.
    popupTimer = window.setTimeout(() => {
      popupTimer = null;
      dismissPopup();
    }, 6000);
  }

  // ---------- Button behavior ----------

  notYetButton.addEventListener("click", () => {
    if (accepted) return;

    updateGentleNote(
      "Theek hai, apna waqt lo. Main tumhari feelings ki respect karta hoon."
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

    thankYouScreen.focus({ preventScroll: true });

    if (!reducedMotion.matches) {
      thankYouScreen.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });

  // ---------- Visibility and motion preferences ----------

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
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreference);
  }

  window.addEventListener("pagehide", () => {
    stopHearts();
    removePopupImmediately();
  });

  startHearts();
});
