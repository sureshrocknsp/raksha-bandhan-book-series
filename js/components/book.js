/**
 * 3D Interactive Book Component
 * "రక్షాబంధన్ — ఒక దారం చెప్పే మాట"
 * Handles dual-page book rendering, 3D WebGL viewport synchronization,
 * instant navigation across all 26 pages, keyboard controls, and touch gestures.
 */

import { BOOK_PAGES, BOOK_CHAPTERS } from '../data/bookData.js';
import { ThreeViewport } from '../visual/ThreeViewport.js';
import { soundEngine } from '../audio/soundEngine.js';

export class BookComponent {
  constructor(container, onPageChangeCallback) {
    this.container = container;
    this.onPageChange = onPageChangeCallback;
    this.currentPageIndex = 0; // 0 to 25
    this.totalPages = BOOK_PAGES.length;
    this.threeViewport = null;
    this.isFlipping = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.flipTimer = null;

    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="book-viewport">
        <!-- 3D Book Container -->
        <div class="book-container" id="bookContainer">
          <!-- Spine Shadow -->
          <div class="book-spine"></div>
          
          <!-- Left Page: Telugu Story Text -->
          <div class="book-page book-page-left" id="bookPageLeft">
            <div class="page-inner-content" id="leftPageContent">
              <!-- Content injected dynamically -->
            </div>
            <div class="page-footer-meta left-meta">
              <span class="chapter-badge" id="leftChapterBadge">ప్రారంభం & అనుబంధం</span>
              <span class="page-num" id="leftPageNum">1</span>
            </div>
          </div>

          <!-- Right Page: 3D Cinematic Visual -->
          <div class="book-page book-page-right" id="bookPageRight">
            <div class="visual-canvas-container" id="visualContainer">
              <!-- High-res 3D Image Layer -->
              <img id="rightPageImage" class="page-base-image" src="assets/images/page_1.png" alt="3D Visual" />
              
              <!-- Three.js 3D WebGL Canvas Layer (Embers, Light, Parallax) -->
              <div class="three-container" id="threeViewportContainer"></div>
              
              <!-- Floating Header Badge -->
              <div class="visual-glass-badge">
                <span class="badge-dot"></span>
                <span id="visualThemeTitle">ఒక దారం చెప్పే మాట</span>
              </div>

              <!-- Floating Prompt Inspector Button -->
              <button class="inspect-prompt-btn" id="inspectPromptBtn" title="3D AI ప్రాంప్ట్ చూడండి">
                <span class="btn-icon">✨</span>
                <span>3D ప్రాంప్ట్</span>
              </button>
            </div>
            
            <div class="page-footer-meta right-meta">
              <span class="scene-type-tag" id="sceneTypeTag">సినిమాటిక్ 3D దృశ్యం</span>
              <span class="page-num" id="rightPageNum">పేజీ 1 / 26</span>
            </div>
          </div>

          <!-- Page Flip Animation Leaf -->
          <div class="book-page-flipper" id="bookFlipper"></div>
        </div>

        <!-- Floating Side Navigation Arrows -->
        <button class="side-nav-btn prev-btn" id="sidePrevBtn" aria-label="మునుపటి పేజీ">
          <span>‹</span>
        </button>
        <button class="side-nav-btn next-btn" id="sideNextBtn" aria-label="తర్వాతి పేజీ">
          <span>›</span>
        </button>
      </div>
    `;

    // Initialize ThreeViewport inside right page
    const threeContainer = document.getElementById('threeViewportContainer');
    if (threeContainer && typeof THREE !== 'undefined') {
      this.threeViewport = new ThreeViewport(threeContainer);
    }

    this.updatePageContent(false);
  }

  getCurrentPage() {
    return BOOK_PAGES[this.currentPageIndex] || BOOK_PAGES[0];
  }

  updatePageContent(playTurnSfx = true) {
    const page = this.getCurrentPage();
    if (!page) return;

    if (playTurnSfx) {
      soundEngine.playPageTurn();
    }
    soundEngine.setPageMood(page.audioMood);

    // Update Left Page Story Content
    const leftContent = document.getElementById('leftPageContent');
    const chapterBadge = document.getElementById('leftChapterBadge');
    const leftPageNum = document.getElementById('leftPageNum');
    const rightPageNum = document.getElementById('rightPageNum');
    const visualThemeTitle = document.getElementById('visualThemeTitle');
    const sceneTypeTag = document.getElementById('sceneTypeTag');
    const rightPageImg = document.getElementById('rightPageImage');

    const curChapter = BOOK_CHAPTERS.find(c => c.id === page.chapter) || BOOK_CHAPTERS[0];

    if (chapterBadge) {
      chapterBadge.textContent = curChapter.titleTelugu;
      chapterBadge.style.borderColor = curChapter.color;
      chapterBadge.style.color = curChapter.color;
    }

    if (leftPageNum) leftPageNum.textContent = page.pageNumber;
    if (rightPageNum) rightPageNum.textContent = `పేజీ ${page.pageNumber} / ${this.totalPages}`;
    if (visualThemeTitle) visualThemeTitle.textContent = page.themeTelugu || page.subtitle;

    if (sceneTypeTag) {
      const typeLabels = {
        family: 'కుటుంబ అనుబంధం',
        emotional: 'హృదయ స్పందన',
        memories: 'జ్ఞాపకాల తీరం',
        soldier: 'వీర సైనికుల రక్ష',
        nation: 'జాతి సమైక్యత',
        wisdom: 'జీవన సత్యం',
        climax: 'దివ్య రక్షాబంధన్'
      };
      sceneTypeTag.textContent = typeLabels[page.sceneType] || 'సినిమాటిక్ 3D దృశ్యం';
    }

    // Format Telugu text into clean paragraphs
    const formattedParagraphs = page.storyTelugu
      .split('\n\n')
      .map((p, idx) => {
        if (idx === 0) {
          return `<p class="story-paragraph drop-cap-para">${this.formatBoldText(p)}</p>`;
        }
        return `<p class="story-paragraph">${this.formatBoldText(p)}</p>`;
      })
      .join('');

    if (leftContent) {
      leftContent.innerHTML = `
        <div class="story-header-wrapper">
          <div class="page-top-accent">
            <span class="accent-line"></span>
            <span class="accent-star">✦</span>
            <span class="accent-line"></span>
          </div>
          <h2 class="page-story-title">${page.title}</h2>
          <h3 class="page-story-subtitle">${page.subtitle}</h3>
        </div>

        <div class="story-body-text">
          ${formattedParagraphs}
        </div>

        <div class="story-quote-card">
          <div class="quote-icon-mark">“</div>
          <p class="quote-telugu-text">${page.quoteTelugu}</p>
        </div>
      `;
    }

    // Update Base Image
    if (rightPageImg && page.imageAsset) {
      rightPageImg.src = page.imageAsset;
    }

    // Update Three.js 3D WebGL Viewport
    if (this.threeViewport) {
      this.threeViewport.loadPageImage(page.imageAsset, page.palette, page.particles);
    }

    // Notify Navigation HUD
    if (this.onPageChange) {
      this.onPageChange(this.currentPageIndex, this.totalPages, page);
    }
  }

  formatBoldText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  goToPage(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.totalPages || targetIndex === this.currentPageIndex) {
      return;
    }

    const isForward = targetIndex > this.currentPageIndex;

    if (this.flipTimer) {
      clearTimeout(this.flipTimer);
    }

    this.animatePageFlip(isForward, () => {
      this.currentPageIndex = targetIndex;
      this.updatePageContent(true);
    });
  }

  nextPage() {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.goToPage(this.currentPageIndex + 1);
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.goToPage(this.currentPageIndex - 1);
    }
  }

  animatePageFlip(isForward, onComplete) {
    const flipper = document.getElementById('bookFlipper');
    if (!flipper) {
      onComplete();
      return;
    }

    this.isFlipping = true;
    flipper.className = `book-page-flipper ${isForward ? 'flipping-next' : 'flipping-prev'}`;
    flipper.style.display = 'block';

    this.flipTimer = setTimeout(() => {
      onComplete();
      setTimeout(() => {
        if (flipper) {
          flipper.style.display = 'none';
          flipper.className = 'book-page-flipper';
        }
        this.isFlipping = false;
      }, 150);
    }, 180);
  }

  attachEvents() {
    const prevBtn = document.getElementById('sidePrevBtn');
    const nextBtn = document.getElementById('sideNextBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        this.nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.prevPage();
      } else if (e.key === 'Home') {
        this.goToPage(0);
      } else if (e.key === 'End') {
        this.goToPage(this.totalPages - 1);
      }
    });

    const viewport = this.container.querySelector('.book-viewport');
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.touchStartX = e.touches[0].clientX;
          this.touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
          const deltaX = e.changedTouches[0].clientX - this.touchStartX;
          const deltaY = e.changedTouches[0].clientY - this.touchStartY;

          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
              this.nextPage();
            } else {
              this.prevPage();
            }
          }
        }
      }, { passive: true });
    }
  }
}
