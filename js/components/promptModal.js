/**
 * 3D AI Prompt Inspector Modal
 * Displays page prompt + global negative prompt with 1-click clipboard copy
 */

import { GLOBAL_NEGATIVE_PROMPT } from '../data/bookData.js';

export class PromptModalComponent {
  constructor(container) {
    this.container = container;
  }

  show(page) {
    if (!page) return;
    this.container.classList.add('active');

    this.container.innerHTML = `
      <div class="modal-backdrop-screen" id="promptBackdrop">
        <div class="modal-window-card">
          <div class="modal-header-bar">
            <div class="modal-title-group">
              <span>✨</span>
              <h3>3D AI ప్రాంప్ట్ ఇన్‌స్పెక్టర్ — పేజీ ${page.pageNumber}</h3>
            </div>
            <button class="modal-close-btn" id="promptCloseBtn">✕</button>
          </div>

          <div class="modal-body-scrollable">
            <div class="prompt-box-wrapper">
              <div class="prompt-box-header">
                <span>3D సినిమాటిక్ ఇమేజ్ ప్రాంప్ట్ (Page Prompt)</span>
                <button class="copy-btn" id="copyPromptBtn">📋 ప్రాంప్ట్ కాపీ</button>
              </div>
              <textarea class="prompt-text-area" id="promptTextArea" rows="6" readonly>${page.imagePrompt}</textarea>
            </div>

            <div class="prompt-box-wrapper">
              <div class="prompt-box-header">
                <span>గ్లోబల్ నెగెటివ్ ప్రాంప్ట్ (Global Negative Prompt)</span>
                <button class="copy-btn" id="copyNegPromptBtn">📋 నెగెటివ్ కాపీ</button>
              </div>
              <textarea class="prompt-text-area" id="negPromptTextArea" rows="4" readonly>${GLOBAL_NEGATIVE_PROMPT}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(page);
  }

  hide() {
    this.container.classList.remove('active');
    this.container.innerHTML = '';
  }

  attachEvents(page) {
    const closeBtn = document.getElementById('promptCloseBtn');
    const backdrop = document.getElementById('promptBackdrop');

    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.hide();
      });
    }

    const copyBtn = document.getElementById('copyPromptBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(page.imagePrompt).then(() => {
          copyBtn.textContent = '✓ కాపీ చేయబడింది!';
          setTimeout(() => { copyBtn.textContent = '📋 ప్రాంప్ట్ కాపీ'; }, 2000);
        });
      });
    }

    const copyNegBtn = document.getElementById('copyNegPromptBtn');
    if (copyNegBtn) {
      copyNegBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(GLOBAL_NEGATIVE_PROMPT).then(() => {
          copyNegBtn.textContent = '✓ కాపీ చేయబడింది!';
          setTimeout(() => { copyNegBtn.textContent = '📋 నెగెటివ్ కాపీ'; }, 2000);
        });
      });
    }
  }
}
