/**
 * Table of Contents Modal Drawer Component
 * 26-Page Visual Thumbnail Grid with 1-click jump
 */

import { BOOK_PAGES } from '../data/bookData.js';

export class TableOfContentsComponent {
  constructor(container, onPageSelectCallback) {
    this.container = container;
    this.onPageSelect = onPageSelectCallback;
    this.isOpen = false;
  }

  show(currentPageIndex = 0) {
    this.isOpen = true;
    this.container.classList.add('active');

    const cardsHtml = BOOK_PAGES.map((page, idx) => {
      const isActive = idx === currentPageIndex;
      return `
        <div class="toc-card-item ${isActive ? 'active' : ''}" data-page-index="${idx}">
          <div class="toc-thumb-wrapper">
            <img class="toc-thumb-img" src="${page.imageAsset}" alt="${page.title}" loading="lazy" />
          </div>
          <div class="toc-info">
            <span class="toc-page-pill">పేజీ ${page.pageNumber}</span>
            <span class="toc-page-name">${page.title}</span>
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="modal-backdrop-screen" id="tocBackdrop">
        <div class="modal-window-card">
          <div class="modal-header-bar">
            <div class="modal-title-group">
              <span>📑</span>
              <h3>విషయ సూచిక (26 అధ్యాయాలు)</h3>
            </div>
            <button class="modal-close-btn" id="tocCloseBtn">✕</button>
          </div>

          <div class="modal-body-scrollable">
            <div class="toc-grid-container">
              ${cardsHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  hide() {
    this.isOpen = false;
    this.container.classList.remove('active');
    this.container.innerHTML = '';
  }

  attachEvents() {
    const closeBtn = document.getElementById('tocCloseBtn');
    const backdrop = document.getElementById('tocBackdrop');

    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.hide();
      });
    }

    const cards = this.container.querySelectorAll('.toc-card-item');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const pageIdx = parseInt(card.getAttribute('data-page-index'), 10);
        if (!isNaN(pageIdx) && this.onPageSelect) {
          this.onPageSelect(pageIdx);
        }
        this.hide();
      });
    });
  }
}
