/**
 * Skrip Interaktivitas Halaman Home (B&W Paper World)
 * -----------------------------------------------------------------
 * 1. Home (1): Galeri Foto Polaroid B&W & Scroll Smooth Transition
 * 2. Home (2): Karakter Walk Cycle Animation (char1.png - char4.png)
 *    - Animasi langkah kaki berganti frame berurutan saat bergerak
 *    - Fix: Satu ketukan keyboard (tap) tetap memicu animasi + langkah singkat
 *    - Hold: Terus jalan selama tombol ditekan
 *    - Pembalikan hadap scaleX(-1) saat ke kiri & scaleX(1) saat ke kanan
 *    - Kembali ke pose awal (char1.png) saat berhenti bergerak
 * 3. Parallax halus untuk doodles melayang B&W
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. HOME (1): GALERI POLAROID & SCROLL TRANSITION
  // =========================================================================
  const polaroidItems = document.querySelectorAll('.polaroid-stack-item');
  const btnScrollToWorld = document.getElementById('btnScrollToWorld');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const worldSection = document.getElementById('worldSection');

  polaroidItems.forEach(item => {
    item.addEventListener('click', () => {
      polaroidItems.forEach(i => {
        i.style.zIndex = '1';
        i.classList.remove('scale-105');
      });
      item.style.zIndex = '10';
      item.classList.add('scale-105');
    });
  });

  function scrollToWorld(e) {
    if (e) e.preventDefault();
    if (worldSection) {
      worldSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (btnScrollToWorld) btnScrollToWorld.addEventListener('click', scrollToWorld);
  if (scrollIndicator) scrollIndicator.addEventListener('click', scrollToWorld);


  // =========================================================================
  // 2. HOME (2): WALK CYCLE ANIMATION (char1.png -> char2 -> char3 -> char4)
  // FIX: Tap 1x tetap memicu animasi + langkah singkat tanpa perlu hold.
  // =========================================================================
  const walker = document.getElementById('sketchCharWalker');
  const charSprite = document.getElementById('sketchCharSprite');
  const charSpeech = document.getElementById('sketchCharSpeech');
  const charPosText = document.getElementById('charPosText');
  const btnWalkLeft = document.getElementById('btnWalkLeft');
  const btnWalkRight = document.getElementById('btnWalkRight');
  const walkingFloor = document.getElementById('walkingFloorCanvas');

  // Urutan frame walk cycle
  const walkFrames = [
    'assets/char1.png',
    'assets/char2.png',
    'assets/char3.png',
    'assets/char4.png'
  ];

  // Preload seluruh frame untuk transisi frame instan tanpa flicker
  walkFrames.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let currentPos = 50;
  const minPos = 5;
  const maxPos = 95;
  const step = 1.2;

  let moveInterval = null;
  let animFrameInterval = null;
  let currentFrameIdx = 0;
  let isWalking = false;

  // Jumlah minimum langkah saat tap singkat (agar 1 ketukan terasa responsif)
  const TAP_STEPS = 18; // ~18 * 18ms = ~320ms gerak minimum per tap

  const dialogues = [
    "Hai! Senang bertemu denganmu di dunia gambarku!",
    "Langkah kakiku bergerak sesuai sketsa!",
    "Lihat figura di atas! Itu catatan sejarah karyaku.",
    "Semua di sini digambar tangan dengan tinta hitam.",
    "Cek halaman My Work untuk melihat proyekku!"
  ];

  function startWalkCycleAnimation() {
    if (animFrameInterval) return; // sudah jalan, jangan dobel
    animFrameInterval = setInterval(() => {
      currentFrameIdx = (currentFrameIdx + 1) % walkFrames.length;
      if (charSprite) charSprite.src = walkFrames[currentFrameIdx];
    }, 120);
  }

  function stopWalkCycleAnimation() {
    if (animFrameInterval) {
      clearInterval(animFrameInterval);
      animFrameInterval = null;
    }
    currentFrameIdx = 0;
    if (charSprite) charSprite.src = walkFrames[0];
  }

  function setDirection(direction) {
    if (!charSprite) return;
    charSprite.style.transform = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  }

  function updatePosition(newPos) {
    currentPos = Math.max(minPos, Math.min(maxPos, newPos));
    if (walker) walker.style.left = `${currentPos}%`;
    if (charPosText) charPosText.textContent = `Posisi: ${Math.round(currentPos)}%`;

    if (charSpeech) {
      if (currentPos <= 20) {
        charSpeech.textContent = "Ini foto awal perjalanan sketsaku di 2022!";
      } else if (currentPos >= 80) {
        charSpeech.textContent = "Dan ini eksplorasi interaktif terbaruku di 2026!";
      }
    }
  }

  // Mulai jalan (hold / continuous movement)
  function startMovement(dir) {
    setDirection(dir);
    isWalking = true;
    startWalkCycleAnimation();

    if (moveInterval) clearInterval(moveInterval);
    moveInterval = setInterval(() => {
      updatePosition(currentPos + (dir === 'left' ? -step : step));
    }, 18);
  }

  // Hentikan jalan sepenuhnya
  function stopMovement() {
    if (moveInterval) {
      clearInterval(moveInterval);
      moveInterval = null;
    }
    isWalking = false;
    stopWalkCycleAnimation();
  }

  // -------------------------------------------------------------------------
  // FIX: Tap singkat (bukan hold) tetap menggerakkan karakter sejumlah TAP_STEPS
  // Menggunakan flag per-key untuk mengetahui apakah ini tap atau hold.
  // -------------------------------------------------------------------------
  const keyState = {}; // { left: { held, tapTimer }, right: { held, tapTimer } }

  function handleKeyPress(dir) {
    if (!keyState[dir]) keyState[dir] = {};
    if (keyState[dir].held) return; // sudah ditekan, abaikan repeat

    keyState[dir].held = true;
    setDirection(dir);

    // Mulai animasi & langkah langsung
    isWalking = true;
    startWalkCycleAnimation();
    if (moveInterval) clearInterval(moveInterval);
    moveInterval = setInterval(() => {
      updatePosition(currentPos + (dir === 'left' ? -step : step));
    }, 18);

    // Minimal langkah agar terlihat bergerak walau cuma tap 1x
    keyState[dir].tapTimer = setTimeout(() => {
      // Setelah TAP_STEPS terpenuhi, cek apakah tombol masih ditekan
      // Jika tidak lagi ditekan (keyup sudah dipanggil), baru berhenti
      if (!keyState[dir].held) {
        stopMovement();
      }
    }, TAP_STEPS * 18);
  }

  function handleKeyRelease(dir) {
    if (!keyState[dir]) keyState[dir] = {};
    keyState[dir].held = false;
    // Jangan langsung stop — biarkan tapTimer selesai dulu
    // Jika tapTimer sudah selesai, stopMovement dipanggil dari sana
    // Jika tombol dilepas setelah tapTimer, hentikan sekarang
    if (keyState[dir].tapTimer) {
      clearTimeout(keyState[dir].tapTimer);
      keyState[dir].tapTimer = null;
      stopMovement();
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return; // Abaikan browser key-repeat, kita handle sendiri
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      handleKeyPress('left');
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      handleKeyPress('right');
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      handleKeyRelease('left');
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      handleKeyRelease('right');
    }
  });

  // On-screen Buttons (Mouse & Touch) — hold behaviour tetap sama
  if (btnWalkLeft) {
    btnWalkLeft.addEventListener('mousedown', () => startMovement('left'));
    btnWalkLeft.addEventListener('mouseup', stopMovement);
    btnWalkLeft.addEventListener('mouseleave', stopMovement);
    btnWalkLeft.addEventListener('touchstart', (e) => { e.preventDefault(); startMovement('left'); });
    btnWalkLeft.addEventListener('touchend', stopMovement);
  }

  if (btnWalkRight) {
    btnWalkRight.addEventListener('mousedown', () => startMovement('right'));
    btnWalkRight.addEventListener('mouseup', stopMovement);
    btnWalkRight.addEventListener('mouseleave', stopMovement);
    btnWalkRight.addEventListener('touchstart', (e) => { e.preventDefault(); startMovement('right'); });
    btnWalkRight.addEventListener('touchend', stopMovement);
  }

  // Klik langsung pada lantai untuk menyuruh karakter melangkah ke titik tersebut
  if (walkingFloor) {
    walkingFloor.addEventListener('click', (e) => {
      if (e.target.closest('#btnWalkLeft') || e.target.closest('#btnWalkRight')) return;
      const rect = walkingFloor.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const targetPercent = (clickX / rect.width) * 100;
      const dir = targetPercent > currentPos ? 'right' : 'left';

      startMovement(dir);
      const walkDuration = Math.min(2000, Math.abs(targetPercent - currentPos) * 30);
      setTimeout(() => {
        stopMovement();
        updatePosition(targetPercent);
      }, walkDuration);
    });
  }


  // =========================================================================
  // 3. PARALLAX HALUS DOODLES MELAYANG B&W
  // =========================================================================
  const doodleCanvas = document.getElementById('doodleCanvas');
  if (doodleCanvas) {
    window.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.015;

      const doodles = doodleCanvas.querySelectorAll('.doodle-item');
      doodles.forEach((doodle, idx) => {
        const factor = (idx + 1) * 0.6;
        doodle.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    });
  }

});
