/**
 * Navigation HUD & Floating Control Bars
 * "రక్షాబంధన్ — ఒక దారం చెప్పే మాట"
 */

import { soundEngine } from '../audio/soundEngine.js';

export class NavigationComponent {
  constructor(headerContainer, footerContainer, options = {}) {
    this.header = headerContainer;
    this.footer = footerContainer;
    this.options = options;
    this.onTOCRequested = options.onTOCRequested;
    this.onPageSelect = options.onPageSelect;
    this.onNext = options.onNext;
    this.onPrev = options.onPrev;

    this.render();
  }

  render() {
    // Header Bar
    if (this.header) {
      this.header.innerHTML = `
        <div class="brand-section">
          <div class="brand-icon-gem">✤</div>
          <div class="brand-text-group">
            <span class="brand-title">రక్షాబంధన్</span>
            <span class="brand-subtitle">ఒక దారం చెప్పే మాట • సురేష్ తోట</span>
          </div>
        </div>

        <div class="nav-actions">
          <button class="nav-btn" id="tocBtn" title="విషయ సూచిక (Table of Contents)">
            <span>📑</span>
            <span>విషయ సూచిక</span>
          </button>
          
          <button class="nav-btn" id="audioToggleBtn" title="సంగీతం ఆన్/ఆఫ్">
            <span id="audioIcon">🎵</span>
          </button>

          <button class="nav-btn" id="fullscreenBtn" title="పూర్తి స్క్రీన్">
            <span>⛶</span>
          </button>
        </div>
      `;
    }

    // Footer Bar
    if (this.footer) {
      this.footer.innerHTML = `
        <button class="nav-btn" id="hudPrevBtn">
          <span>‹</span>
          <span>మునుపటి</span>
        </button>

        <div class="progress-track-wrapper">
          <span class="page-indicator-text" id="hudPageNum">1 / 26</span>
          <div class="progress-bar-rail" id="progressRail">
            <div class="progress-fill" id="progressFill"></div>
          </div>
        </div>

        <button class="nav-btn" id="hudNextBtn">
          <span>తర్వాతి</span>
          <span>›</span>
        </button>
      `;
    }

    this.attachEvents();
  }

  updateProgress(currentPageIndex, totalPages) {
    const pageNumText = document.getElementById('hudPageNum');
    const progressFill = document.getElementById('progressFill');

    if (pageNumText) {
      pageNumText.textContent = `${currentPageIndex + 1} / ${totalPages}`;
    }

    if (progressFill) {
      const percentage = ((currentPageIndex + 1) / totalPages) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }

  attachEvents() {
    const tocBtn = document.getElementById('tocBtn');
    if (tocBtn && this.onTOCRequested) {
      tocBtn.addEventListener('click', () => this.onTOCRequested());
    }

    const audioToggleBtn = document.getElementById('audioToggleBtn');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        const isPlaying = soundEngine.toggleMusic();
        const icon = document.getElementById('audioIcon');
        if (icon) {
          icon.textContent = isPlaying ? '🔊' : '🔇';
        }
        audioToggleBtn.classList.toggle('active', isPlaying);
      });
    }

    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    const hudPrevBtn = document.getElementById('hudPrevBtn');
    const hudNextBtn = document.getElementById('hudNextBtn');

    if (hudPrevBtn && this.onPrev) hudPrevBtn.addEventListener('click', () => this.onPrev());
    if (hudNextBtn && this.onNext) hudNextBtn.addEventListener('click', () => this.onNext());
  }
}
