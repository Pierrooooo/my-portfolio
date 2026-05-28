export function initAudioManager({ cursor } = {}) {
  // ─── Audio Context ───────────────────────────────────────────────
  let ctx = null;
  let masterGain = null;
  let ambientNodes = [];
  let isPlaying = false;
  let isInitialized = false;
  let currentVolume = 0.3;
  let fadeInTimeout = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
    }
    return ctx;
  }

  // ─── Ambient Music ───────────────────────────────────────────────

  function buildReverb(audioCtx, seconds = 3) {
    const rate = audioCtx.sampleRate;
    const length = rate * seconds;
    const impulse = audioCtx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    const convolver = audioCtx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  function createAmbient() {
    const audioCtx = getCtx();
    const reverb = buildReverb(audioCtx, 4);
    const reverbGain = audioCtx.createGain();
    reverbGain.gain.value = 0.45;
    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);

    const dryGain = audioCtx.createGain();
    dryGain.gain.value = 0.55;
    dryGain.connect(masterGain);

    const nodes = [];

    const drones = [
      { freq: 55, detune: 0, vol: 0.18 },
      { freq: 82.4, detune: 3, vol: 0.12 },
      { freq: 110, detune: -4, vol: 0.1 },
      { freq: 220, detune: 7, vol: 0.06 },
    ];

    drones.forEach(({ freq, detune, vol }) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const gain = audioCtx.createGain();
      gain.gain.value = vol;
      const lfo = audioCtx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.07 + Math.random() * 0.05;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = vol * 0.3;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      osc.connect(gain);
      gain.connect(dryGain);
      gain.connect(reverb);
      osc.start();
      nodes.push(osc, gain, lfo, lfoGain);
    });

    const padFreqs = [220, 329.6, 440, 523.25];
    padFreqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.detune.value = (i % 2 === 0 ? 1 : -1) * (8 + i * 3);
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600 + i * 80;
      filter.Q.value = 0.8;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.025;
      const freqLfo = audioCtx.createOscillator();
      freqLfo.type = "sine";
      freqLfo.frequency.value = 0.03 + i * 0.01;
      const freqLfoGain = audioCtx.createGain();
      freqLfoGain.gain.value = 2.5;
      freqLfo.connect(freqLfoGain);
      freqLfoGain.connect(osc.frequency);
      freqLfo.start();
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(reverb);
      osc.start();
      nodes.push(osc, filter, gain, freqLfo, freqLfoGain);
    });

    const bufferSize = audioCtx.sampleRate * 4;
    const noiseBuffer = audioCtx.createBuffer(
      1,
      bufferSize,
      audioCtx.sampleRate,
    );
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) noiseData[i] = Math.random() * 2 - 1;
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 180;
    noiseFilter.Q.value = 0.4;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.018;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(reverb);
    noiseSource.start();

    nodes.push(
      noiseSource,
      noiseFilter,
      noiseGain,
      reverb,
      reverbGain,
      dryGain,
    );
    return nodes;
  }

  // ─── Click Sounds ────────────────────────────────────────────────

  function playClickSound(isInteractive = false) {
    if (!isPlaying) return;
    const audioCtx = getCtx();

    if (isInteractive) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        340,
        audioCtx.currentTime + 0.2,
      );
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.24,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        340,
        audioCtx.currentTime + 0.009,
      );
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.01,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    }
  }

  // ─── Volume ──────────────────────────────────────────────────────

  function setVolume(value, instant = false) {
    currentVolume = Math.max(0, Math.min(1, value));
    if (masterGain && isPlaying) {
      if (instant) {
        masterGain.gain.setValueAtTime(currentVolume, getCtx().currentTime);
      } else {
        masterGain.gain.linearRampToValueAtTime(
          currentVolume,
          getCtx().currentTime + 0.05,
        );
      }
    }
  }

  // ─── Play / Pause ────────────────────────────────────────────────

  function startAmbient(shouldFadeIn = false) {
    const audioCtx = getCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();

    if (!isInitialized) {
      ambientNodes = createAmbient();
      isInitialized = true;
    }

    if (shouldFadeIn) {
      // Démarre à 0 et fait un fade-in sur 1.2 secondes
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(
        currentVolume,
        audioCtx.currentTime + 1.2,
      );
    } else {
      masterGain.gain.linearRampToValueAtTime(
        currentVolume,
        audioCtx.currentTime + 2.5,
      );
    }
    isPlaying = true;
  }

  function stopAmbient() {
    if (!ctx) return;
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);
    isPlaying = false;
  }

  // ─── UI ──────────────────────────────────────────────────────────

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* ── Wrapper ── */
      .audio-widget {
        position: fixed;
        bottom: 2.5rem;
        left: 2.5rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        pointer-events: none;
      }

      .audio-widget.fade-in {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }

      /* ── Volume slider panel ── */
      .audio-volume {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 10px 0 8px;
        width: 44px;
        background: rgba(10,10,10,0.55);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.18);
        border-bottom: none;
        border-radius: 22px 22px 0 0;
        overflow: hidden;

        /* hidden by default */
        max-height: 0;
        opacity: 0;
        padding-top: 0;
        padding-bottom: 0;
        pointer-events: none;
        transition:
          max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
          opacity    0.25s ease,
          padding    0.35s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .audio-widget:not(.fade-in) .audio-volume {
        display: none;
      }

      .audio-widget:hover .audio-volume,
      .audio-widget:focus-within .audio-volume,
      .audio-volume:hover {
        max-height: 130px;
        opacity: 1;
        padding-top: 10px;
        padding-bottom: 8px;
        pointer-events: auto;
      }

      /* Volume percentage label */
      .audio-volume__label {
        font-family: "Syne", sans-serif;
        font-size: 9px;
        letter-spacing: 0.06em;
        color: rgba(255,255,255,0.4);
        user-select: none;
        transition: color 0.2s;
        min-width: 28px;
        text-align: center;
      }

      /* Vertical slider track */
      .audio-volume__track {
        position: relative;
        width: 2px;
        padding: 0 12px;
        height: 72px;
        border-radius: 1px;
        cursor: pointer;
      }

      .audio-volume__fill {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-radius: 1px;
        transition: background 0.2s;
        pointer-events: none;
      }

      .audio-volume__fill:before {
        content: '';
        position: absolute;
        inset: 0;
        width: 2px;
        background: rgba(255,255,255,0.75);
        left: calc(50% - 1px);
        border-radius: 1px;
      }

      .audio-volume__thumb {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 50%);
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.15);
        transition: transform 0.15s, box-shadow 0.15s;
        pointer-events: none;
      }

      .audio-volume__track:hover .audio-volume__thumb,
      .audio-volume__track.dragging .audio-volume__thumb {
        transform: translate(-50%, 50%) scale(1.3);
        box-shadow: 0 0 0 4px rgba(255,255,255,0.1);
      }

      /* ── Toggle button ── */
      .audio-toggle {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(10,10,10,0.55);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: rgba(255,255,255,0.55);
        cursor: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: border-color 0.3s, color 0.3s, background 0.3s, border-radius 0.35s;
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
      }

      /* Flatten top corners when panel is open */
      .audio-widget:hover .audio-toggle,
      .audio-widget:focus-within .audio-toggle {
        border-radius: 0 0 22px 22px;
        border-top-color: rgba(255,255,255,0.08);
      }

      .audio-toggle:hover {
        border-color: rgba(255,255,255,0.45);
        // color: rgba(255,255,255,0.95);
        background: rgba(20,20,20,0.75);
      }

      .audio-toggle.is-playing {
        color: rgba(255,255,255,0.9);
        border-color: rgba(255,255,255,0.35);
      }

      .audio-toggle__icon {
        position: relative;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .audio-toggle__icon svg {
        width: 18px;
        height: 18px;
        position: absolute;
        transition: opacity 0.25s, transform 0.25s;
      }

      .audio-toggle .icon-on  { opacity: 0; transform: scale(0.8); }
      .audio-toggle .icon-off { opacity: 1; transform: scale(1);   }

      .audio-toggle.is-playing .icon-on  { opacity: 1; transform: scale(1);   }
      .audio-toggle.is-playing .icon-off { opacity: 0; transform: scale(0.8); }

      .audio-toggle__ripple {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        transform: scale(0);
        opacity: 0;
        pointer-events: none;
      }

      .audio-toggle.ripple-active .audio-toggle__ripple {
        animation: audio-ripple 0.5s ease-out forwards;
      }

      @keyframes audio-ripple {
        0%   { transform: scale(0);   opacity: 0.6; }
        100% { transform: scale(2.4); opacity: 0;   }
      }

      .audio-toggle.is-playing::after {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.12);
        animation: audio-breathe 3s ease-in-out infinite;
      }

      @keyframes audio-breathe {
        0%, 100% { transform: scale(1);    opacity: 0.5; }
        50%       { transform: scale(1.15); opacity: 0;   }
      }
    `;
    document.head.appendChild(style);
  }

  function createWidget() {
    injectStyles();

    // ── Wrapper
    const widget = document.createElement("div");
    widget.className = "audio-widget";

    // ── Volume panel
    const volumePanel = document.createElement("div");
    volumePanel.className = "audio-volume";

    const label = document.createElement("span");
    label.className = "audio-volume__label";
    label.textContent = Math.round(currentVolume * 100) + "%";

    const track = document.createElement("div");
    track.className = "audio-volume__track";

    const fill = document.createElement("div");
    fill.className = "audio-volume__fill";

    const thumb = document.createElement("div");
    thumb.className = "audio-volume__thumb";

    track.appendChild(fill);
    track.appendChild(thumb);
    volumePanel.appendChild(label);
    volumePanel.appendChild(track);

    // ── Toggle button
    const btn = document.createElement("button");
    btn.className = "audio-toggle";
    btn.setAttribute("aria-label", "Activer le son");
    btn.setAttribute("data-cursor-text", "Activer le son");
    btn.innerHTML = `
      <span class="audio-toggle__icon">
        <svg class="icon-on" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 9H5L3 11v2l2 2h4l5 4V5L9 9Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <svg class="icon-off" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 9H5L3 11v2l2 2h4l5 4V5L9 9Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
          <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="audio-toggle__ripple"></span>
    `;

    widget.appendChild(volumePanel);
    widget.appendChild(btn);
    document.body.appendChild(widget);

    // ── Fade in animation after 1 second
    setTimeout(() => {
      widget.classList.add("fade-in");
    }, 1000);

    // ── Slider logic
    const TRACK_HEIGHT = 72;

    function updateSliderUI(vol) {
      const pct = Math.round(vol * 100);
      const fillH = vol * TRACK_HEIGHT;
      const thumbBottom = fillH;
      fill.style.height = fillH + "px";
      thumb.style.bottom = thumbBottom + "px";
      label.textContent = pct + "%";
    }

    updateSliderUI(currentVolume);

    function volFromPointer(e) {
      const rect = track.getBoundingClientRect();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const relY = rect.bottom - clientY;
      return Math.max(0, Math.min(1, relY / TRACK_HEIGHT));
    }

    let dragging = false;

    track.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      dragging = true;
      track.classList.add("dragging");
      const vol = volFromPointer(e);
      setVolume(vol);
      updateSliderUI(vol);
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const vol = volFromPointer(e);
      setVolume(vol);
      updateSliderUI(vol);
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("dragging");
    });

    // Touch support
    track.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
        dragging = true;
        track.classList.add("dragging");
        const vol = volFromPointer(e);
        setVolume(vol);
        updateSliderUI(vol);
      },
      { passive: true },
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging) return;
        const vol = volFromPointer(e);
        setVolume(vol);
        updateSliderUI(vol);
      },
      { passive: true },
    );

    window.addEventListener("touchend", () => {
      dragging = false;
      track.classList.remove("dragging");
    });

    // Scroll on track
    track.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        const vol = Math.max(0, Math.min(1, currentVolume + delta));
        setVolume(vol);
        updateSliderUI(vol);
      },
      { passive: false },
    );

    // ── Toggle logic
    btn.addEventListener("click", () => {
      if (isPlaying) {
        stopAmbient();
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "Activer le son");
        btn.setAttribute("data-cursor-text", "Activer le son");
      } else {
        startAmbient();
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "Désactiver le son");
        btn.setAttribute("data-cursor-text", "Désactiver le son");
      }
      btn.classList.remove("ripple-active");
      void btn.offsetWidth;
      btn.classList.add("ripple-active");
      playClickSound(true);
    });

    return { widget, btn, updateSliderUI };
  }

  // ─── Global Click Sound Binding ──────────────────────────────────

  function bindClickSounds() {
    const INTERACTIVE = [
      "a",
      "button",
      "input",
      "select",
      "textarea",
      "[role='button']",
      "[tabindex]",
    ].join(",");

    document.addEventListener(
      "click",
      (e) => {
        const isInteractive = e.target.closest(INTERACTIVE) !== null;
        playClickSound(isInteractive);
      },
      { capture: true },
    );
  }

  // ─── Init ────────────────────────────────────────────────────────

  const { widget, btn } = createWidget();
  bindClickSounds();

  // Fonction pour démarrer l'audio après interaction utilisateur
  let audioStarted = false;

  function tryStartAudio() {
    if (audioStarted) return;

    const audioCtx = getCtx();

    // Créer un gain silencieux pour "réveiller" l'AudioContext
    if (audioCtx.state === "suspended") {
      audioCtx.resume().then(() => {
        startAmbient(true);
        if (btn) {
          btn.classList.add("is-playing");
          btn.setAttribute("aria-label", "Désactiver le son");
          btn.setAttribute("data-cursor-text", "Désactiver le son");
        }
        audioStarted = true;
      });
    } else {
      startAmbient(true);
      if (btn) {
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "Désactiver le son");
        btn.setAttribute("data-cursor-text", "Désactiver le son");
      }
      audioStarted = true;
    }
  }

  // Écouter le premier clic, toucher ou mouvement de souris, scroll ou touche clavier pour démarrer l'audio
  const startEvents = ["click", "touchstart", "keydown", "mousemove", "scroll"];
  startEvents.forEach((event) => {
    document.addEventListener(event, tryStartAudio, { once: true });
  });

  if (cursor && typeof cursor.bindHoverElements === "function") {
    cursor.bindHoverElements();
  }

  return {
    start: startAmbient,
    stop: stopAmbient,
    toggle: () => btn.click(),
    setVolume,
    playClick: playClickSound,
  };
}