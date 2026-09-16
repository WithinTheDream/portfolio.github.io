/**
 * Skrip Interaktivitas Halaman Home (B&W Paper World)
 * -----------------------------------------------------------------
 * 1. Home (1): Scroll Smooth Transition
 * 2. Home (2): Lorong Panjang (Long Corridor) & Karakter 400% Walk Cycle
 *    - Kamera horizontal mengikuti langkah karakter menembus lorong objek
 *    - Dialog minimalis modern merespons figura riwayat (Pendidikan, Karir, Hobi)
 *    - Animasi langkah kaki responsif untuk SINGLE TAP maupun HOLD
 *    - Pembalikan hadap scaleX(-1) saat ke kiri & scaleX(1) saat ke kanan
 *    - Dukungan gestur sentuh / drag pada layar HP
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. HOME (1): SCROLL TRANSITION
  // =========================================================================
  const btnScrollToWorld = document.getElementById('btnScrollToWorld');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const worldSection = document.getElementById('worldSection');

  function scrollToWorld(e) {
    if (e) e.preventDefault();
    if (worldSection) {
      worldSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (btnScrollToWorld) btnScrollToWorld.addEventListener('click', scrollToWorld);
  if (scrollIndicator) scrollIndicator.addEventListener('click', scrollToWorld);


  // =========================================================================
  // 2. HOME (2): LORONG PANJANG & CHAR 400% WALK CYCLE ANIMATION
  // =========================================================================
  const walker = document.getElementById('sketchCharWalker');
  const charSprite = document.getElementById('sketchCharSprite');
  const dialogText = document.getElementById('dialogText');
  const corridorTrack = document.getElementById('corridorTrack');
  const corridorViewport = document.getElementById('corridorViewport');

  // Urutan frame walk cycle
  const walkFrames = [
    'assets/char1.png',
    'assets/char2.png',
    'assets/char3.png',
    'assets/char4.png'
  ];

  // Preload seluruh frame
  walkFrames.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Dimensi lorong panjang
  let charPixelPos = 240; // Posisi awal karakter di lorong (pixel)
  const minPixelPos = 120;
  const maxPixelPos = 3380; // Panjang lintasan lorong
  const stepPixels = 6.5; // Langkah per interval

  let moveInterval = null;
  let animFrameInterval = null;
  let gracefulStopTimeout = null;
  let currentFrameIdx = 0;
  let isWalking = false;
  let walkStartTime = 0;
  const MIN_STEP_DURATION = 180; // Durasi minimum 1 langkah saat single tap (ms)

  // Majukan 1 frame animasi
  function advanceWalkFrame() {
    currentFrameIdx = (currentFrameIdx + 1) % walkFrames.length;
    if (charSprite) {
      charSprite.src = walkFrames[currentFrameIdx];
    }
  }

  function startWalkCycleAnimation() {
    if (animFrameInterval) clearInterval(animFrameInterval);
    
    animFrameInterval = setInterval(() => {
      advanceWalkFrame();
    }, 120);
  }

  function stopWalkCycleAnimation() {
    if (animFrameInterval) {
      clearInterval(animFrameInterval);
      animFrameInterval = null;
    }
    currentFrameIdx = 0;
    if (charSprite) {
      charSprite.src = walkFrames[0];
    }
    if (walker) {
      walker.classList.remove('walking');
    }
  }

  // Update posisi karakter & kamera horizontal
  function updateCharacterPosition(newPixelPos, direction) {
    charPixelPos = Math.max(minPixelPos, Math.min(maxPixelPos, newPixelPos));
    
    if (walker) {
      walker.style.left = `${charPixelPos}px`;
    }

    // Pembalikan arah hadap
    if (direction) {
      if (charSprite) {
        if (direction === 'left') {
          charSprite.style.transform = 'scaleX(-1)';
        } else {
          charSprite.style.transform = 'scaleX(1)';
        }
      }
    }

    // Kamera Horizontal: Geser track lorong agar karakter tetap berada di bidang pandang utama
    if (corridorTrack && corridorViewport) {
      const viewportWidth = corridorViewport.clientWidth;
      const targetScroll = charPixelPos - (viewportWidth / 2);
      const maxScroll = 3500 - viewportWidth;
      const clampedScroll = Math.max(0, Math.min(maxScroll, targetScroll));
      
      corridorTrack.style.transform = `translateX(-${clampedScroll}px)`;
    }

    // Dialog responsif saat karakter melewati figura riwayat
    if (dialogText) {
      if (charPixelPos >= 700 && charPixelPos <= 1100) {
        dialogText.textContent = "🎓 Zona Riwayat Pendidikan (SDN Ngaluran & Studi Lanjut)";
      } else if (charPixelPos >= 1700 && charPixelPos <= 2100) {
        dialogText.textContent = "💼 Zona Karir & Rekayasa Perangkat Lunak";
      } else if (charPixelPos >= 2650 && charPixelPos <= 3050) {
        dialogText.textContent = "🎨 Zona Hobi & Eksplorasi Seni Interaktif";
      } else if (charPixelPos >= 3150) {
        dialogText.textContent = "🚀 Ujung lorong! Lanjutkan eksplorasi ke halaman My Work";
      } else if (charPixelPos <= 450) {
        dialogText.textContent = "Melangkah menelusuri lorong profil & ide";
      }
    }
  }

  function startMovement(dir) {
    if (gracefulStopTimeout) {
      clearTimeout(gracefulStopTimeout);
      gracefulStopTimeout = null;
    }

    walkStartTime = Date.now();

    if (!isWalking) {
      isWalking = true;
      if (walker) walker.classList.add('walking');

      // Instant first step untuk single tap
      advanceWalkFrame();
      updateCharacterPosition(charPixelPos + (dir === 'right' ? stepPixels * 1.5 : -stepPixels * 1.5), dir);

      startWalkCycleAnimation();
    }

    if (moveInterval) clearInterval(moveInterval);

    moveInterval = setInterval(() => {
      if (dir === 'left') {
        updateCharacterPosition(charPixelPos - stepPixels, 'left');
      } else if (dir === 'right') {
        updateCharacterPosition(charPixelPos + stepPixels, 'right');
      }
    }, 18);
  }

  function stopMovement() {
    if (moveInterval) {
      clearInterval(moveInterval);
      moveInterval = null;
    }

    const elapsed = Date.now() - walkStartTime;
    const remainingTime = MIN_STEP_DURATION - elapsed;

    if (remainingTime > 0) {
      gracefulStopTimeout = setTimeout(() => {
        isWalking = false;
        stopWalkCycleAnimation();
      }, remainingTime);
    } else {
      isWalking = false;
      stopWalkCycleAnimation();
    }
  }

  // Keyboard Controller (Panah Kiri/Kanan & A/D)
  const keysPressed = {};
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      if (!keysPressed['left']) {
        keysPressed['left'] = true;
        startMovement('left');
      }
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      if (!keysPressed['right']) {
        keysPressed['right'] = true;
        startMovement('right');
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      keysPressed['left'] = false;
      if (!keysPressed['right']) stopMovement();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      keysPressed['right'] = false;
      if (!keysPressed['left']) stopMovement();
    }
  });

  // Touch Controller untuk Smartphone (Swipe / Touch Drag di HP)
  let touchStartX = 0;
  if (corridorViewport) {
    corridorViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    corridorViewport.addEventListener('touchmove', (e) => {
      const touchCurrentX = e.touches[0].clientX;
      const diffX = touchCurrentX - touchStartX;

      if (diffX > 15) {
        startMovement('right');
      } else if (diffX < -15) {
        startMovement('left');
      }
    }, { passive: true });

    corridorViewport.addEventListener('touchend', () => {
      stopMovement();
    }, { passive: true });
  }

  // Inisialisasi posisi awal karakter
  updateCharacterPosition(charPixelPos, 'right');
});
