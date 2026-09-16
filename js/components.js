/**
 * Shared Navbar & Footer Component for Portfolio
 * Import this file to ensure 100% identical navbar and footer across all pages (Home, My Work, Contact)
 * - Navbar: Pill shape, no outline, no shadow, clean active state
 * - Footer: Solid gray modern 4-column layout, no top outline, pure B&W
 */

function initSharedComponents() {
  const currentPath = window.location.pathname.toLowerCase();
  let activePage = 'home';
  if (currentPath.includes('work.html')) {
    activePage = 'work';
  } else if (currentPath.includes('contact.html')) {
    activePage = 'contact';
  }

  // 1. Synchronize / Inject Shared Navbar
  const navContainer = document.getElementById('sharedNavbar') || document.querySelector('nav.paper-navbar-wrapper');
  if (navContainer) {
    navContainer.outerHTML = `
  <nav class="paper-navbar-wrapper" aria-label="Main Navigation">
    <div class="paper-navbar-pill">
      <!-- Menu 1: Home -->
      <a href="index.html" class="paper-nav-item ${activePage === 'home' ? 'active' : ''}">
        <i class="fa-solid fa-house text-sm"></i>
        <span>Home</span>
      </a>
      
      <!-- Menu 2: My Work -->
      <a href="work.html" class="paper-nav-item ${activePage === 'work' ? 'active' : ''}">
        <i class="fa-solid fa-code text-sm"></i>
        <span>My Work</span>
      </a>
      
      <!-- Menu 3: Contact -->
      <a href="contact.html" class="paper-nav-item ${activePage === 'contact' ? 'active' : ''}">
        <i class="fa-solid fa-envelope text-sm"></i>
        <span>Contact</span>
      </a>
    </div>
  </nav>`;
  }

  // 2. Synchronize / Inject Shared Footer
  const footerContainer = document.getElementById('sharedFooter') || document.querySelector('footer');
  if (footerContainer) {
    footerContainer.outerHTML = `
  <footer class="site-footer-solid">
    <div class="footer-container">
      <!-- Grid 4 Kolom Footer Standar Profesional -->
      <div class="footer-top-grid">
        <!-- Kolom 1: Profil & Brand -->
        <div class="footer-brand">
          <h3>Adam</h3>
          <p>
            Programmer & Creative Software Developer. Membangun sistem komputasi yang terstruktur bersih dan menggabungkan logika kode dengan seni visual interaktif.
          </p>
        </div>

        <!-- Kolom 2: Navigasi Cepat -->
        <div class="footer-col">
          <h5>Navigasi</h5>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#worldSection">Profil & Lorong</a></li>
            <li><a href="work.html">My Work</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <!-- Kolom 3: Spesialisasi & Riwayat -->
        <div class="footer-col">
          <h5>Spesialisasi</h5>
          <ul class="footer-links">
            <li><a href="work.html">Software Engineering</a></li>
            <li><a href="work.html">Web Development</a></li>
            <li><a href="work.html">Interactive Visual</a></li>
            <li><a href="work.html">System Architecture</a></li>
          </ul>
        </div>

        <!-- Kolom 4: Hubungi & Jejaring -->
        <div class="footer-col">
          <h5>Terhubung</h5>
          <ul class="footer-links">
            <li><a href="https://github.com/WithinTheDream" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank"><i class="fa-brands fa-linkedin"></i> LinkedIn</a></li>
            <li><a href="contact.html"><i class="fa-solid fa-paper-plane"></i> Kirim Pesan</a></li>
            <li><a href="mailto:adam@example.com"><i class="fa-solid fa-envelope"></i> Surel Langsung</a></li>
          </ul>
        </div>
      </div>

      <!-- Baris Bawah: Copyright & Label -->
      <div class="footer-bottom-bar">
        <p class="footer-copyright">
          &copy; 2026 Adam • Programmer & Creative Software Developer • Tema B&W Paper Sketchbook
        </p>
        <div class="footer-bottom-badges">
          <span class="footer-badge">B&W Edition</span>
          <span class="footer-badge">Vanilla JS</span>
          <span class="footer-badge">No Outline</span>
        </div>
      </div>
    </div>
  </footer>`;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
  initSharedComponents();
}
