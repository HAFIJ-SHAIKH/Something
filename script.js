const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const replayBtn = document.getElementById("replayBtn");

const attemptText = document.getElementById("attemptText");
const cuteImage = document.getElementById("cuteImage");
const popupLayer = document.getElementById("popupLayer");
const heartsBackground = document.getElementById("heartsBackground");

const mainCard = document.getElementById("mainCard");
const successScreen = document.getElementById("successScreen");

let noCount = 0;
let popupCount = 0;

const apologyMessages = [
  "Please meri baat sun lo 🥺",
  "Mujhe sach mein afsos hai ❤️",
  "Tumhari feelings mere liye important hain 💗",
  "Kaash main apni galti sudhaar sakun 🥹",
  "Main sirf sorry nahi, behtar bhi banna chahta hoon 💖",
  "Tumhe hurt karna meri galti thi 😔",
  "Main tumhari narazgi samajhne ki koshish karunga 💕",
  "Jab tum ready ho, main sunne ke liye yahin hoon ❤️",
  "Please mujhe apni galti sudharne ka mauka dena 🥺",
  "I'm genuinely sorry. 💗"
];

const noButtonLabels = [
  "Abhi nahi 🥺",
  "Sochungi 🤔",
  "Abhi bhi naraz hoon 😤",
  "Itni jaldi nahi 💔",
  "Pehle prove karo 🥹",
  "Hmm... nahi 😶",
  "Abhi nahi 💗"
];

const expressions = ["🥺", "😔", "🥹", "💗", "😿", "🫶", "💖"];

// Create floating background hearts.
function createFloatingHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";

  const symbols = ["💗", "💕", "💖", "♡", "💘"];
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 22}px`;
  heart.style.animationDuration = `${7 + Math.random() * 7}s`;

  heartsBackground.appendChild(heart);

  heart.addEventListener("animationend", () => heart.remove());
}

const heartInterval = window.setInterval(createFloatingHeart, 650);

// Add an apology popup on every No click.
// Popups are decorative and never intercept clicks.
function createApologyPopup() {
  const popup = document.createElement("div");
  popup.className = "apology-popup";

  popup.textContent =
    apologyMessages[popupCount % apologyMessages.length];

  const maxLeft = Math.max(0, window.innerWidth - 250);
  const maxTop = Math.max(0, window.innerHeight - 100);

  popup.style.left = `${Math.random() * maxLeft}px`;
  popup.style.top = `${Math.random() * maxTop}px`;

  popupLayer.appendChild(popup);
  popupCount++;

  // Remove old popups after their fade-out animation.
  window.setTimeout(() => popup.remove(), 5200);

  // Keep the DOM lightweight even after many clicks.
  while (popupLayer.children.length > 12) {
    popupLayer.firstElementChild.remove();
  }
}

function handleNo() {
  noCount++;

  createApologyPopup();

  noBtn.textContent =
    noButtonLabels[(noCount) % noButtonLabels.length];

  cuteImage.textContent =
    expressions[noCount % expressions.length];

  attemptText.textContent =
    `You've clicked "Abhi nahi" ${noCount} time${noCount === 1 ? "" : "s"}. ` +
    "Main samajhta hoon. Jab tum ready ho, tabhi. ❤️";

  // Small visual feedback without moving or hiding the button.
  noBtn.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.06)" },
      { transform: "scale(1)" }
    ],
    { duration: 250 }
  );
}

function createConfetti() {
  const colors = [
    "#ff4f87",
    "#ffc2d8",
    "#f7a8c8",
    "#ffd166",
    "#cdb4db"
  ];

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.animationDuration = `${2 + Math.random() * 3}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;

    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function handleYes() {
  mainCard.style.display = "none";
  successScreen.classList.remove("hidden");

  createConfetti();
}

function replay() {
  noCount = 0;
  popupCount = 0;

  noBtn.textContent = "Abhi nahi 🥺";
  cuteImage.textContent = "🥺";
  attemptText.textContent = "Main dil se sorry hoon. ❤️";

  popupLayer.replaceChildren();
  successScreen.classList.add("hidden");
  mainCard.style.display = "";

  document.querySelectorAll(".confetti").forEach((item) => item.remove());
}

// Use explicit event listeners for reliable mobile and desktop clicks.
noBtn.addEventListener("click", handleNo);
yesBtn.addEventListener("click", handleYes);
replayBtn.addEventListener("click", replay);

// Create a few hearts immediately so the background isn't empty at startup.
for (let i = 0; i < 8; i++) {
  window.setTimeout(createFloatingHeart, i * 180);
}

// Clean up the interval if the page is being unloaded.
window.addEventListener("pagehide", () => {
  window.clearInterval(heartInterval);
});
