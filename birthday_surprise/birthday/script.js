const music = document.getElementById("music");

function startMusic() {
  music.play();
  document.removeEventListener("mousemove", startMusic);
  document.removeEventListener("touchstart", startMusic);
}

document.addEventListener("mousemove", startMusic);
document.addEventListener("touchstart", startMusic);
// Afficher le contrôle au moment des confettis (7.5s)
setTimeout(() => {
  music.classList.add("visible");
  console.log("🎵 Contrôle audio visible");
}, 7500);
/* ============================================
           CONFIGURATION DES TIMINGS
           ============================================ */
const TIMINGS = {
  cakeStart: 1500,
  candleAppear: 5500,
  flameStart: 6200,
  textStart: 7000,
  subtitleStart: 8500,
  wishStart: 9200,
  confettiStart: 7500,
  buttonAppear: 10000,
};

/* ============================================
           SÉLECTION DES ÉLÉMENTS DU DOM
           ============================================ */
const elements = {
  confettiContainer: document.getElementById("confetti-container"),
  candle: document.getElementById("candle"),
  message: document.getElementById("message"),
  letters: document.querySelectorAll(".letter"),
  subtitle: document.getElementById("subtitle"),
  wish: document.getElementById("wish"),
  restartBtn: document.getElementById("restartBtn"),
  cake: document.getElementById("cake"),
};

/* ============================================
           CONFIGURATION DES CONFETTIS - OPTIMISÉE MOBILE
           ============================================ */
const isMobile = window.innerWidth < 768;
const CONFETTI_CONFIG = {
  colors: [
    "#ff6b9d",
    "#c44569",
    "#ffd700",
    "#ff69b4",
    "#87ceeb",
    "#98fb98",
    "#dda0dd",
    "#f0e68c",
    "#ff4757",
    "#2ed573",
  ],
  count: isMobile ? 80 : 150,
  duration: 4000,
  interval: isMobile ? 50 : 30,
};

/* ============================================
           FONCTION : CRÉER UN CONFETTI
           ============================================ */
function createConfetti() {
  const confetti = document.createElement("div");
  const size = Math.random() * 8 + 4;
  const color =
    CONFETTI_CONFIG.colors[
      Math.floor(Math.random() * CONFETTI_CONFIG.colors.length)
    ];
  const startX = Math.random() * 100;
  const duration = Math.random() * 3 + 2;
  const delay = Math.random() * 0.5;
  const shapes = ["50%", "0", "30%"];
  const borderRadius = shapes[Math.floor(Math.random() * shapes.length)];

  confetti.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size * (Math.random() * 0.5 + 0.5)}px;
                background: ${color};
                top: -20px;
                left: ${startX}vw;
                border-radius: ${borderRadius};
                opacity: ${Math.random() * 0.5 + 0.5};
                pointer-events: none;
                animation: confettiFall ${duration}s linear ${delay}s forwards;
                transform-origin: center;
                will-change: transform, opacity;
            `;

  elements.confettiContainer.appendChild(confetti);

  setTimeout(
    () => {
      confetti.remove();
    },
    (duration + delay) * 1000 + 500,
  );
}

/* ============================================
           FONCTION : LANCER LES CONFETTIS
           ============================================ */
function startConfetti() {
  let confettiCount = 0;

  const confettiInterval = setInterval(() => {
    createConfetti();
    confettiCount++;

    if (confettiCount >= CONFETTI_CONFIG.count) {
      clearInterval(confettiInterval);
    }
  }, CONFETTI_CONFIG.interval);

  // Deuxième vague (réduite sur mobile)
  setTimeout(() => {
    let secondWaveCount = 0;
    const waveCount = isMobile ? 25 : 50;
    const secondWave = setInterval(() => {
      createConfetti();
      secondWaveCount++;

      if (secondWaveCount >= waveCount) {
        clearInterval(secondWave);
      }
    }, 50);
  }, 2000);
}

/* ============================================
           FONCTION : ANIMER LES LETTRES
           ============================================ */
function animateLetters() {
  elements.letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.classList.add("animate");
    }, index * 100);
  });
}

/* ============================================
           FONCTION : INTERACTION BOUGIE (TOUCH + CLICK)
           ============================================ */
function setupCandleInteraction() {
  if (elements.candle) {
    const blowCandle = () => {
      if (!elements.candle.classList.contains("blown")) {
        elements.candle.classList.add("blown");

        // Confettis bonus
        const bonusCount = isMobile ? 15 : 30;
        for (let i = 0; i < bonusCount; i++) {
          setTimeout(createConfetti, i * 20);
        }

        // Rallumer après 3 secondes
        setTimeout(() => {
          elements.candle.classList.remove("blown");
        }, 3000);
      }
    };

    // Support tactile et souris
    elements.candle.addEventListener("click", blowCandle);
    elements.candle.addEventListener("touchend", (e) => {
      e.preventDefault();
      blowCandle();
    });
  }
}

/* ============================================
           FONCTION : RÉINITIALISER L'ANIMATION
           ============================================ */
function resetAnimation() {
  // Recharger la page (solution simple et fiable)
  location.reload();
}

/* ============================================
           FONCTION : INITIALISER
           ============================================ */
function initAnimations() {
  // Animation des lettres
  setTimeout(() => {
    animateLetters();
  }, TIMINGS.textStart);

  // Confettis
  setTimeout(() => {
    startConfetti();
  }, TIMINGS.confettiStart);

  // Marquer fin d'animation
  setTimeout(() => {
    document.body.classList.add("animation-complete");
  }, TIMINGS.buttonAppear + 500);
}

/* ============================================
           ÉVÉNEMENTS
           ============================================ */
if (elements.restartBtn) {
  elements.restartBtn.addEventListener("click", resetAnimation);
  elements.restartBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    resetAnimation();
  });
}

setupCandleInteraction();

/* ============================================
           DÉMARRAGE
           ============================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    initAnimations();
  }, 300);
});

/* ============================================
           EASTER EGG : DOUBLE-TAP/DOUBLE-CLIC
           ============================================ */
let lastTap = 0;
document.addEventListener("touchend", (e) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;

  if (tapLength < 300 && tapLength > 0) {
    // Double tap détecté
    const touch = e.changedTouches[0];
    createExplosion(touch.clientX, touch.clientY);
  }
  lastTap = currentTime;
});

document.addEventListener("dblclick", (e) => {
  createExplosion(e.clientX, e.clientY);
});

function createExplosion(x, y) {
  const explosionCount = isMobile ? 12 : 20;

  for (let i = 0; i < explosionCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      const size = Math.random() * 6 + 3;
      const color =
        CONFETTI_CONFIG.colors[
          Math.floor(Math.random() * CONFETTI_CONFIG.colors.length)
        ];
      const angle = (Math.PI * 2 * i) / explosionCount;
      const velocity = Math.random() * 80 + 40;

      confetti.style.cssText = `
                        position: fixed;
                        width: ${size}px;
                        height: ${size}px;
                        background: ${color};
                        top: ${y}px;
                        left: ${x}px;
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 1000;
                        animation: explode 0.8s ease-out forwards;
                        --tx: ${Math.cos(angle) * velocity}px;
                        --ty: ${Math.sin(angle) * velocity}px;
                    `;

      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 800);
    }, i * 8);
  }
}

// Ajouter keyframe pour explosion
const explodeStyle = document.createElement("style");
explodeStyle.textContent = `
            @keyframes explode {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) scale(0);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(explodeStyle);
