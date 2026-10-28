
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const apologyCard = document.getElementById("apologyCard");
  const thankYouScreen = document.getElementById("thankYouScreen");
  const forgiveButton = document.getElementById("forgiveButton");
  const notYetButton = document.getElementById("notYetButton");
  const gentleNote = document.getElementById("gentleNote");
  const heartBackground = document.getElementById("heartBackground");

  // Stop safely if the HTML elements are missing.
  if (
    !apologyCard ||
    !thankYouScreen ||
    !forgiveButton ||
    !notYetButton ||
    !gentleNote ||
    !heartBackground
  ) {
    console.error(
      "Opener page setup error: check the HTML element IDs."
    );
    return;
  }

  let accepted = false;
  let heartTimer = null;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Create a decorative floating heart.
  function createHeart() {
    if (
      reducedMotion.matches ||
      document.hidden ||
      accepted ||
      !heartBackground.isConnected
    ) {
      return;
    }

    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";

    const size = 11 + Math.random() * 16;
    const duration = 9 + Math.random() * 7;
    const left = Math.random() * 100;
    const drift = Math.round(Math.random() * 90 - 45);
    const opacity = (0.15 + Math.random() * 0.2).toFixed(2);

    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty("--duration", `${duration}s`);
    heart.style.setProperty("--drift", `${drift}px`);
    heart.style.setProperty("--heart-opacity", opacity);

    heartBackground.appendChild(heart);

    window.setTimeout(() => {
      heart.remove();
    }, (duration + 1) * 1000);
  }

  function startHearts() {
    if (reducedMotion.matches || heartTimer !== null || accepted) {
      return;
    }

    createHeart();
    heartTimer = window.setInterval(createHeart, 950);
  }

  function stopHearts() {
    if (heartTimer !== null) {
      window.clearInterval(heartTimer);
      heartTimer = null;
    }

    heartBackground.replaceChildren();
  }

  function updateGentleNote(message) {
    gentleNote.classList.remove("note-updated");

    // Restart the small visual transition without tracking user actions.
    void gentleNote.offsetWidth;

    gentleNote.textContent = message;
    gentleNote.classList.add("note-updated");
  }

  // A gentle response that does not demand or count anything.
  notYetButton.addEventListener("click", () => {
    if (accepted) return;

    updateGentleNote(
      "I understand. Take the time you need. I'm truly sorry. ♡"
    );
  });

  // Show a calm thank-you screen when forgiveness is offered.
  forgiveButton.addEventListener("click", () => {
    if (accepted) return;

    accepted = true;
    stopHearts();

    apologyCard.hidden = true;
    thankYouScreen.hidden = false;

    // Move keyboard and screen-reader focus to the new content.
    thankYouScreen.focus({ preventScroll: true });

    // Respect the user's reduced-motion preference.
    if (!reducedMotion.matches) {
      thankYouScreen.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });

  // Pause decorative effects while the page is in the background.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (heartTimer !== null) {
        window.clearInterval(heartTimer);
        heartTimer = null;
      }
    } else if (!accepted) {
      startHearts();
    }
  });

  // Respond if the user changes their motion preference.
  function handleMotionPreference() {
    if (reducedMotion.matches) {
      stopHearts();
    } else if (!accepted) {
      startHearts();
    }
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof reducedMotion.addListener === "function") {
    // Compatibility for older browsers.
    reducedMotion.addListener(handleMotionPreference);
  }

  // Clean up decorative activity when leaving the page.
  window.addEventListener("pagehide", stopHearts, { once: true });

  // Start the background animation.
  startHearts();
});
