/**
 * Main Application Orchestrator
 * "రక్షాబంధన్ — ఒక దారం చెప్పే మాట"
 */

import { BookComponent } from './components/book.js';
import { HeroComponent } from './components/hero.js';
import { NavigationComponent } from './components/navigation.js';
import { TableOfContentsComponent } from './components/tableOfContents.js';
import { PromptModalComponent } from './components/promptModal.js';

class StorybookApp {
  constructor() {
    this.book = null;
    this.hero = null;
    this.nav = null;
    this.toc = null;
    this.promptModal = null;

    this.init();
  }

  init() {
    const bookMount = document.getElementById('bookMount');
    const heroMount = document.getElementById('heroMount');
    const navMount = document.getElementById('navMount');
    const audioMount = document.getElementById('audioMount');
    const tocMount = document.getElementById('tocModalContainer');
    const promptMount = document.getElementById('promptModalContainer');

    // 1. Initialize Modals
    this.toc = new TableOfContentsComponent(tocMount, (targetIndex) => {
      if (this.book) this.book.goToPage(targetIndex);
    });

    this.promptModal = new PromptModalComponent(promptMount);

    // 2. Initialize Book Reader
    this.book = new BookComponent(bookMount, (pageIndex, totalPages, pageData) => {
      if (this.nav) this.nav.updateProgress(pageIndex, totalPages);
    });

    // 3. Initialize Top/Bottom Navigation HUD
    this.nav = new NavigationComponent(navMount, audioMount, {
      onTOCRequested: () => {
        if (this.toc && this.book) this.toc.show(this.book.currentPageIndex);
      },
      onNext: () => {
        if (this.book) this.book.nextPage();
      },
      onPrev: () => {
        if (this.book) this.book.prevPage();
      }
    });

    // 4. Initialize Hero Prologue Opening
    this.hero = new HeroComponent(heroMount, () => {
      // Callback after hero dismissed
    });

    // 5. Wire up Inspect 3D Prompt Button
    document.addEventListener('click', (e) => {
      const promptBtn = e.target.closest('#inspectPromptBtn');
      if (promptBtn && this.book && this.promptModal) {
        const curPage = this.book.getCurrentPage();
        this.promptModal.show(curPage);
      }
    });
  }
}

// Boot application on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.storybookApp = new StorybookApp();
});
