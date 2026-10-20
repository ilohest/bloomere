(() => {
  if (customElements.get('bloomere-newsletter-popup')) return;
  class BloomereNewsletterPopup extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      this.dialog = this.querySelector('dialog');
      this.form = this.querySelector('form');
      if (!this.dialog || typeof this.dialog.showModal !== 'function') return;
      this.editor = this.dataset.editor === 'true';
      this.key = `bloomere-newsletter:${this.dataset.sectionId}`;
      this.pendingKey = `${this.key}:pending`;
      this.addEventListener('click', event => {
        if (event.target.closest('[data-bnp-close]')) this.dismiss();
      }, options);
      this.dialog.addEventListener('click', event => {
        if (event.target !== this.dialog) return;
        const rect = this.dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.dismiss();
      }, options);
      this.dialog.addEventListener('cancel', event => { event.preventDefault(); this.dismiss(); }, options);
      this.dialog.addEventListener('close', () => this.unlock(), options);
      this.form?.addEventListener('submit', event => {
        if (this.editor) { event.preventDefault(); return; }
        // Leave Shopify's native submission and spam protection intact.
        this.write('sessionStorage', this.pendingKey, String(Date.now()));
      }, options);
      document.addEventListener('shopify:section:select', event => {
        if (this.editor && event.detail?.sectionId === this.dataset.sectionId) this.open(true);
      }, options);
      document.addEventListener('shopify:section:deselect', event => {
        if (this.editor && event.detail?.sectionId === this.dataset.sectionId) this.dialog.close();
      }, options);
      if (this.editor) return;
      const pending = Number(this.read('sessionStorage', this.pendingKey));
      const result = this.querySelector('[data-bnp-result]');
      // A different newsletter form on the page may share Shopify's success state.
      const ownResponse = result && (location.hash === `#${this.form?.id}` || (pending > 0 && Date.now() - pending < 15 * 60 * 1000));
      if (ownResponse) {
        this.remove('sessionStorage', this.pendingKey);
        if (result.dataset.bnpResult === 'success') this.write('localStorage', 'bloomere-newsletter:subscribed', 'true');
        this.open(true);
        result.focus();
        return;
      }
      if (result || !this.eligible()) return;
      this.timer = setTimeout(() => { this.ready = true; this.tryOpen(); }, Math.max(0, Number(this.dataset.delay) || 0));
      document.addEventListener('visibilitychange', () => { if (this.ready) this.tryOpen(); }, options);
    }
    read(storage, key) { try { return window[storage].getItem(key); } catch { return null; } }
    write(storage, key, value) { try { window[storage].setItem(key, value); } catch { /* Optional persistence. */ } }
    remove(storage, key) { try { window[storage].removeItem(key); } catch { /* Optional persistence. */ } }
    eligible() {
      return this.dataset.enabled === 'true' && this.dataset.subscribed !== 'true'
        && this.read('localStorage', 'bloomere-newsletter:subscribed') !== 'true'
        && Number(this.read('localStorage', this.key) || 0) <= Date.now();
    }
    tryOpen() {
      if (!this.isConnected || this.dialog.open || document.hidden || !this.eligible()) return;
      if ([...document.querySelectorAll('dialog[open], [aria-modal="true"]:not([hidden])')].some(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.tryOpen(), 2000);
        return;
      }
      this.open();
    }
    open(force = false) {
      if (this.dialog.open || (!force && !this.eligible())) return;
      this.dialog.showModal();
      document.documentElement.classList.add('bnp-scroll-lock');
    }
    dismiss() {
      clearTimeout(this.timer);
      this.ready = false;
      if (!this.editor) {
        const days = Math.max(1, Number(this.dataset.days) || 7);
        this.write('localStorage', this.key, String(Date.now() + days * 86400000));
      }
      this.dialog.close();
      this.unlock();
    }
    unlock() {
      if (!document.querySelector('dialog.bnp[open]')) document.documentElement.classList.remove('bnp-scroll-lock');
    }
    disconnectedCallback() {
      clearTimeout(this.timer);
      this.controller?.abort();
      this.controller = null;
      if (this.dialog?.open) this.dialog.close();
      this.unlock();
    }
  }
  customElements.define('bloomere-newsletter-popup', BloomereNewsletterPopup);
})();
