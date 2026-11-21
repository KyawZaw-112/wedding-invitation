/**
 * Sunflower Wedding Invitation - Interactive Experience
 * Couple: Nyan Win Tun & Mar Mar Thinn
 * Date: 28 November 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio Synthesis Engine (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.isPlayingMusic = false;
      this.musicInterval = null;
      this.step = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Wax seal break / click sound
    playSealPop() {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }

    // Soft petal pluck chime
    playPetalPluck() {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const freqs = [523.25, 587.33, 659.25, 783.99, 880.00];
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    }

    // Romantic background song playback (Ed Sheeran - Perfect)
    startRomanticMusic() {
      if (this.isPlayingMusic) return;
      this.isPlayingMusic = true;

      const audio = document.getElementById('wedding-audio');
      if (audio) {
        audio.play().then(() => {
          updateMusicUI(true);
        }).catch(() => {
          // Fallback or user gesture required
          updateMusicUI(false);
          this.isPlayingMusic = false;
        });
      } else {
        updateMusicUI(true);
      }
    }

    stopRomanticMusic() {
      this.isPlayingMusic = false;
      const audio = document.getElementById('wedding-audio');
      if (audio) {
        audio.pause();
      }
      updateMusicUI(false);
    }

    toggleMusic() {
      const audio = document.getElementById('wedding-audio');
      if (audio) {
        if (!audio.paused) {
          this.stopRomanticMusic();
        } else {
          this.startRomanticMusic();
        }
      } else {
        if (this.isPlayingMusic) {
          this.stopRomanticMusic();
        } else {
          this.startRomanticMusic();
        }
      }
    }
  }

  const sound = new SoundEngine();

  // --- Envelope Opening Sequence ---
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const tapPill = document.getElementById('tap-to-open-pill');

  function openEnvelope() {
    if (envelopeWrapper.classList.contains('opening')) return;
    envelopeWrapper.classList.add('opening');
    sound.playSealPop();

    // Start background music
    setTimeout(() => {
      sound.startRomanticMusic();
    }, 400);

    // Fade out overlay screen
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      document.body.style.overflow = 'auto';
      setTimeout(() => {
        envelopeScreen.style.display = 'none';
      }, 800);
    }, 1200);
  }

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (tapPill) tapPill.addEventListener('click', openEnvelope);
  if (envelopeWrapper) envelopeWrapper.addEventListener('click', openEnvelope);

  // --- Music Player UI Toggle ---
  const musicBtn = document.getElementById('floating-music-btn');
  const vinylDisc = document.getElementById('vinyl-disc');
  const soundWaves = document.getElementById('sound-waves');

  function updateMusicUI(isPlaying) {
    if (isPlaying) {
      if (vinylDisc) vinylDisc.classList.add('vinyl-spin');
      if (soundWaves) soundWaves.classList.add('playing');
    } else {
      if (vinylDisc) vinylDisc.classList.remove('vinyl-spin');
      if (soundWaves) soundWaves.classList.remove('playing');
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      sound.toggleMusic();
    });
  }

  // --- Live Countdown Timer ---
  // Wedding Date: 28 November 2026, 6:00 PM (18:00) MMT (UTC+6:30 or UTC+7)
  const targetDate = new Date('2026-11-28T18:00:00+06:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);

    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    if (elDays) elDays.innerText = pad(days);
    if (elHours) elHours.innerText = pad(hours);
    if (elMinutes) elMinutes.innerText = pad(minutes);
    if (elSeconds) elSeconds.innerText = pad(seconds);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- Sunflower Fortune Game ("Loves me, loves me not") ---
  const petals = document.querySelectorAll('.sunflower-petal');
  const fortuneStatus = document.getElementById('fortune-status');
  const fortuneSub = document.getElementById('fortune-sub');
  const beeContainer = document.getElementById('bee-container');
  const fortunePolaroid = document.getElementById('fortune-polaroid');
  const resetBtn = document.getElementById('reset-sunflower-btn');

  let pluckedCount = 0;
  const totalPetals = petals.length;

  petals.forEach((petal, idx) => {
    petal.addEventListener('click', () => {
      if (petal.classList.contains('petal-plucked')) return;

      sound.playPetalPluck();
      pluckedCount++;

      // Set random horizontal drift variable for physics fall animation
      const dx = (Math.random() - 0.5) * 120 + 'px';
      petal.style.setProperty('--dx', dx);
      petal.classList.add('petal-plucked');

      if (pluckedCount < totalPetals) {
        // Alternate phrase
        if (pluckedCount % 2 === 1) {
          fortuneStatus.textContent = "Loves me...";
          fortuneStatus.style.color = "#c99e32";
        } else {
          fortuneStatus.textContent = "Loves me not...";
          fortuneStatus.style.color = "#8c7657";
        }
        fortuneSub.textContent = `Pluck the petals, one by one (${totalPetals - pluckedCount} left)`;
      } else {
        // Final Petal Plucked!
        fortuneStatus.textContent = "Loves me!";
        fortuneStatus.style.color = "#d9822b";
        fortuneStatus.classList.add('animate-bounce');
        fortuneSub.textContent = "...just as we always knew.";

        // Reveal cute bee and polaroid
        if (beeContainer) beeContainer.classList.remove('hidden');
        if (fortunePolaroid) {
          fortunePolaroid.classList.remove('hidden');
          fortunePolaroid.classList.add('animate-fade-in');
        }
        if (resetBtn) resetBtn.classList.remove('hidden');
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      pluckedCount = 0;
      petals.forEach(p => p.classList.remove('petal-plucked'));
      fortuneStatus.textContent = "Loves me, loves me not";
      fortuneStatus.style.color = "#5c4728";
      fortuneStatus.classList.remove('animate-bounce');
      fortuneSub.textContent = "Pluck the petals, one by one";
      if (beeContainer) beeContainer.classList.add('hidden');
      if (fortunePolaroid) fortunePolaroid.classList.add('hidden');
      resetBtn.classList.add('hidden');
    });
  }

  // --- Photo Lightbox ---
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const polaroids = document.querySelectorAll('.polaroid-card');

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-caption');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption && caption) {
          lightboxCaption.textContent = caption.textContent;
        }
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  // --- Toast Notification ---
  function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    const toastText = document.getElementById('toast-text');
    if (!toast) return;
    if (toastText) toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // --- Add to Calendar (.ics download) ---
  window.downloadCalendarEvent = function() {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nyan Win Tun & Mar Mar Thinn Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Wedding of Nyan Win Tun & Mar Mar Thinn',
      'DESCRIPTION:Together with our families, we joyfully invite you to celebrate the wedding dinner of Nyan Win Tun and Mar Mar Thinn at Mercure Yangon Kaba Aye (Grand Ballroom).',
      'LOCATION:Mercure Yangon Kaba Aye, Grand Ballroom, No 17 Kaba Aye Pagoda Road, Yangon 11081, Myanmar',
      'DTSTART:20261128T113000Z',
      'DTEND:20261128T153000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Nyan_Thin_Wedding_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Calendar Event downloaded (.ics)");
  };

  // --- Falling Sunflower Petals Canvas Effect ---
  const canvas = document.getElementById('petals-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = 24;
    const particles = [];

    for (let i = 0; i < petalCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 8 + 8,
        d: Math.random() * petalCount,
        color: Math.random() > 0.4 ? 'rgba(245, 175, 40, 0.75)' : 'rgba(223, 186, 83, 0.65)',
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.03,
        tiltAngle: 0,
        speed: (Math.random() * 1.2) + 0.8
      });
    }

    function drawPetals() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petalCount; i++) {
        const p = particles[i];
        p.tiltAngle += p.tiltAngleInc;
        p.y += p.speed;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 12;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        // Oval petal shape
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.55, p.tilt * Math.PI / 180, 0, 2 * Math.PI);
        ctx.fill();

        // Reset particle when it drops past bottom
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      }

      requestAnimationFrame(drawPetals);
    }

    requestAnimationFrame(drawPetals);
  }
});
