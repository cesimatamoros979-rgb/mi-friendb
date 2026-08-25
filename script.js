const screens = [
  document.getElementById("levelOne"),
  document.getElementById("levelTwo"),
  document.getElementById("levelThree"),
  document.getElementById("summaryScreen")
];
const progressBar = document.getElementById("progressBar");
const levelCounter = document.getElementById("levelCounter");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const noMessage = document.getElementById("noMessage");
const planButtons = document.querySelectorAll(".plan-option");
const toFoodButton = document.getElementById("toFoodButton");
const foodSelect = document.getElementById("foodSelect");
const toSummaryButton = document.getElementById("toSummaryButton");
const termsCheck = document.getElementById("termsCheck");
const finalButton = document.getElementById("finalButton");
const finalMessage = document.getElementById("finalMessage");

let chosenPlan = "";
let chosenFood = "";
let musicContext;
let musicTimer;
let musicPlaying = false;
const musicVolume = 0.12;

function startRomanticMusic() {
  if (musicPlaying) return;

  musicContext = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = musicContext.createGain();
  masterGain.gain.value = musicVolume;
  masterGain.connect(musicContext.destination);
  const chords = [[293.66, 369.99, 440], [246.94, 293.66, 369.99], [196, 246.94, 329.63], [220, 277.18, 349.23]];
  let chordIndex = 0;

  const playChord = () => {
    chords[chordIndex].forEach((frequency, noteIndex) => {
      const oscillator = musicContext.createOscillator();
      const noteGain = musicContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      noteGain.gain.setValueAtTime(0, musicContext.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.12, musicContext.currentTime + 1.4);
      noteGain.gain.linearRampToValueAtTime(0, musicContext.currentTime + 5.2);
      oscillator.connect(noteGain).connect(masterGain);
      oscillator.start();
      oscillator.stop(musicContext.currentTime + 5.3 + noteIndex * 0.08);
    });
    chordIndex = (chordIndex + 1) % chords.length;
  };

  playChord();
  musicTimer = window.setInterval(playChord, 5000);
  musicPlaying = true;
  addMusicControl(masterGain);
}

function playLevelSound() {
  if (!musicContext) return;
  musicContext.resume();
  [659.25, 783.99].forEach((frequency, index) => {
    const oscillator = musicContext.createOscillator();
    const noteGain = musicContext.createGain();
    const startTime = musicContext.currentTime + index * 0.12;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.16, startTime + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
    oscillator.connect(noteGain).connect(musicContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.5);
  });
}

function addMusicControl(masterGain) {
  const musicButton = document.createElement("button");
  musicButton.className = "music-control";
  musicButton.type = "button";
  musicButton.textContent = "♫ Música";
  musicButton.setAttribute("aria-label", "Silenciar música romántica");
  musicButton.addEventListener("click", () => {
    const isMuted = masterGain.gain.value === 0;
    masterGain.gain.value = isMuted ? musicVolume : 0;
    musicButton.textContent = isMuted ? "♫ Música" : "♫ Silenciada";
    musicButton.setAttribute("aria-label", isMuted ? "Silenciar música romántica" : "Activar música romántica");
  });
  document.body.appendChild(musicButton);
}

function showScreen(screenIndex) {
  screens.forEach((screen, index) => screen.classList.toggle("active", index === screenIndex));
  const progress = Math.min(100, ((screenIndex + 1) / 3) * 100);
  progressBar.style.width = `${progress}%`;
  levelCounter.textContent = screenIndex === 3 ? "♡ / ♡" : `0${screenIndex + 1} / 03`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function celebrateWithCats() {
  document.querySelectorAll(".cat-celebration").forEach((celebration) => celebration.remove());
  const catCelebration = document.createElement("div");
  catCelebration.className = "cat-celebration";
  catCelebration.setAttribute("aria-label", "Celebración con muchos gatitos");

  for (let index = 0; index < 35; index += 1) {
    const cat = document.createElement("img");
    cat.src = `https://cataas.com/cat?width=130&height=130&${Date.now()}-${index}`;
    cat.alt = "Gatito celebrando";
    cat.className = "floating-cat";
    cat.style.setProperty("--cat-left", `${4 + Math.random() * 92}%`);
    cat.style.setProperty("--cat-delay", `${Math.random() * 1.2}s`);
    cat.style.setProperty("--cat-size", `${62 + Math.random() * 54}px`);
    catCelebration.appendChild(cat);
  }

  document.body.appendChild(catCelebration);
  window.setTimeout(() => catCelebration.remove(), 6500);
}

yesButton.addEventListener("click", () => {
  startRomanticMusic();
  playLevelSound();
  celebrateWithCats();
  showScreen(1);
});

noButton.addEventListener("click", () => {
  noMessage.textContent = "Esa opción está en mantenimiento... prueba la de al lado ♡";
  noButton.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-5px)" },
    { transform: "translateX(5px)" },
    { transform: "translateX(0)" }
  ], { duration: 300 });
});

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    planButtons.forEach((option) => option.classList.remove("selected"));
    button.classList.add("selected");
    chosenPlan = button.dataset.plan;
    toFoodButton.disabled = false;
    playLevelSound();
    celebrateWithCats();
  });
});

toFoodButton.addEventListener("click", () => showScreen(2));

foodSelect.addEventListener("change", () => {
  chosenFood = foodSelect.value;
  toSummaryButton.disabled = !chosenFood;
  if (chosenFood) {
    playLevelSound();
    celebrateWithCats();
  }
});

toSummaryButton.addEventListener("click", () => {
  document.getElementById("summaryPlan").textContent = chosenPlan;
  document.getElementById("summaryFood").textContent = chosenFood;
  showScreen(3);
});

termsCheck.addEventListener("change", () => {
  finalButton.disabled = !termsCheck.checked;
  if (termsCheck.checked) {
    playLevelSound();
    celebrateWithCats();
  }
});

finalButton.addEventListener("click", () => {
  finalMessage.textContent = "¡Has elegido una cita con la chela de tus sueños! ♡";
  finalButton.textContent = "Plan aceptado ♡";
  finalButton.disabled = true;
  playLevelSound();
  celebrateWithCats();
});
