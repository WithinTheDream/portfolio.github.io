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

  // Dimensi lorong panjang diperluas (5100px)
  let charPixelPos = 240; // Posisi awal karakter di lorong (pixel)
  const minPixelPos = 120;
  const maxPixelPos = 4980; // Panjang lintasan lorong (5100px)
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
      const maxScroll = 5100 - viewportWidth;
      const clampedScroll = Math.max(0, Math.min(maxScroll, targetScroll));
      
      corridorTrack.style.transform = `translateX(-${clampedScroll}px)`;
    }

    // Dialog responsif saat karakter melewati figura riwayat (Minimalist Micro-HUD)
    if (dialogText) {
      if (charPixelPos >= 650 && charPixelPos <= 1100) {
        dialogText.textContent = "SDN Ngaluran & Studi Lanjut";
      } else if (charPixelPos >= 1350 && charPixelPos <= 1800) {
        dialogText.textContent = "Panggung Musik & Eksplorasi Seni Band";
      } else if (charPixelPos >= 2050 && charPixelPos <= 2500) {
        dialogText.textContent = "Karir Software Dev & Clean Code";
      } else if (charPixelPos >= 2750 && charPixelPos <= 3200) {
        dialogText.textContent = "Sketsa Tangan & Creative Coding";
      } else if (charPixelPos >= 3350 && charPixelPos <= 3800) {
        dialogText.textContent = "Ekosistem & Riset Open Source";
      } else if (charPixelPos >= 3950 && charPixelPos <= 4400) {
        dialogText.textContent = "Visi Inovasi Rekayasa Web";
      } else if (charPixelPos > 4450) {
        dialogText.textContent = "Tekan untuk melihat projek & portofolio";
      } else if (charPixelPos <= 500) {
        dialogText.textContent = "Melangkah menelusuri lorong profil";
      }
    }
  }

  const walkHint = document.getElementById('walkHintIndicator');

  function dismissWalkHint() {
    if (walkHint && !walkHint.classList.contains('hint-hidden')) {
      walkHint.classList.add('hint-hidden');
      setTimeout(() => {
        if (walkHint && walkHint.parentNode) {
          walkHint.parentNode.removeChild(walkHint);
        }
      }, 500);
    }
  }

  function startMovement(dir) {
    dismissWalkHint();

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

  // Controller Tombol Navigasi Panah Kiri & Kanan di Layar (Section 2)
  const btnNavLeft = document.getElementById('btnCorridorNavLeft');
  const btnNavRight = document.getElementById('btnCorridorNavRight');

  function attachArrowButtonControls(button, direction) {
    if (!button) return;

    let isPressed = false;

    const onPointerDown = (e) => {
      e.preventDefault();
      if (isPressed) return;
      isPressed = true;
      startMovement(direction);
    };

    const onPointerUp = (e) => {
      if (!isPressed) return;
      isPressed = false;
      stopMovement();
    };

    button.addEventListener('mousedown', onPointerDown);
    button.addEventListener('mouseup', onPointerUp);
    button.addEventListener('mouseleave', onPointerUp);

    button.addEventListener('touchstart', onPointerDown, { passive: false });
    button.addEventListener('touchend', onPointerUp, { passive: false });
    button.addEventListener('touchcancel', onPointerUp, { passive: false });

    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startMovement(direction);
      }
    });
    button.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stopMovement();
      }
    });
  }

  attachArrowButtonControls(btnNavLeft, 'left');
  attachArrowButtonControls(btnNavRight, 'right');

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
