/**
 * Skrip Interaktivitas Halaman Home (B&W Paper World)
 * -----------------------------------------------------------------
 * 1. Home (1): Galeri Foto Polaroid B&W & Scroll Smooth Transition
 * 2. Home (2): Karakter Walk Cycle Animation (char1.png - char4.png)
 *    - Animasi langkah kaki berganti frame berurutan saat bergerak
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
  // Sesuai siklus gambar sketsa langkah kaki & kedip mata dari pengguna
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

  let currentPos = 50; // default 50% di tengah
  const minPos = 5;
  const maxPos = 95;
  const step = 0.9;

  let moveInterval = null;
  let animFrameInterval = null;
  let currentFrameIdx = 0;
  let isWalking = false;
  let currentDirection = 'right';

  const dialogues = [
    "Hai! Senang bertemu denganmu di dunia gambarku!",
    "Langkah kakiku bergerak sesuai sketsa!",
    "Lihat figura di atas! Itu catatan sejarah karyaku.",
    "Semua di sini digambar tangan dengan tinta hitam.",
    "Cek halaman My Work untuk melihat proyekku!"
  ];

  function startWalkCycleAnimation() {
    if (animFrameInterval) clearInterval(animFrameInterval);
    
    // Ganti frame setiap 125ms menghasilkan animasi langkah yang natural
    animFrameInterval = setInterval(() => {
      currentFrameIdx = (currentFrameIdx + 1) % walkFrames.length;
      if (charSprite) {
        charSprite.src = walkFrames[currentFrameIdx];
      }
    }, 125);
  }

  function stopWalkCycleAnimation() {
    if (animFrameInterval) {
      clearInterval(animFrameInterval);
      animFrameInterval = null;
    }
    // Kembali ke frame awal / diam saat berhenti
    currentFrameIdx = 0;
    if (charSprite) {
      charSprite.src = walkFrames[0];
    }
  }

  function updateCharacterPosition(newPos, direction) {
    currentPos = Math.max(minPos, Math.min(maxPos, newPos));
    
    if (walker) {
      walker.style.left = `${currentPos}%`;
    }

    if (direction) {
      currentDirection = direction;
      if (charSprite) {
        if (direction === 'left') {
          charSprite.style.transform = 'scaleX(-1)';
        } else {
          charSprite.style.transform = 'scaleX(1)';
        }
      }
    }

    if (charPosText) {
      charPosText.textContent = `Posisi: ${Math.round(currentPos)}%`;
    }

    if (charSpeech) {
      if (currentPos <= 20) {
        charSpeech.textContent = "Ini foto awal perjalanan sketsaku di 2022!";
      } else if (currentPos >= 80) {
        charSpeech.textContent = "Dan ini eksplorasi interaktif terbaruku di 2026!";
      } else if (Math.round(currentPos) % 25 === 0) {
        const rand = dialogues[Math.floor(Math.random() * dialogues.length)];
        charSpeech.textContent = rand;
      }
    }
  }

  function startMovement(dir) {
    if (!isWalking) {
      isWalking = true;
      startWalkCycleAnimation();
    }

    if (moveInterval) clearInterval(moveInterval);

    moveInterval = setInterval(() => {
      if (dir === 'left') {
        updateCharacterPosition(currentPos - step, 'left');
      } else if (dir === 'right') {
        updateCharacterPosition(currentPos + step, 'right');
      }
    }, 18);
  }

  function stopMovement() {
    if (moveInterval) {
      clearInterval(moveInterval);
      moveInterval = null;
    }
    isWalking = false;
    stopWalkCycleAnimation();
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

  // On-screen Buttons (Mouse & Touch)
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
      const rect = walkingFloor.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const targetPercent = (clickX / rect.width) * 100;
      const dir = targetPercent > currentPos ? 'right' : 'left';
      
      // Jalankan animasi beberapa langkah ke arah tujuan
      startMovement(dir);
      const walkDuration = Math.min(1800, Math.abs(targetPercent - currentPos) * 35);
      setTimeout(() => {
        stopMovement();
        updateCharacterPosition(targetPercent, dir);
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
