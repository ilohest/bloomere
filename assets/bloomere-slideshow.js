/* Pipeline fade with optional autoplay, pause, focus and reduced-motion handling. */
(() => {
  if (customElements.get('bloomere-hero')) return;
  class BloomereHero extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      this.slides = [...this.querySelectorAll('[data-bh-slide]')];
      this.dots = [...this.querySelectorAll('[data-bh-go]')];
      this.index = 0;
      this.autoplay = this.dataset.autoplay === 'true' && this.slides.length > 1;
      this.interval = Math.max(1000, Number(this.dataset.interval) || 8000);
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.paused = this.motion.matches || this.dataset.editor === 'true';
      this.hovering = false;
      this.motion.addEventListener('change', () => {
        if (this.motion.matches) this.paused = true;
        this.schedule();
      }, options);
      this.addEventListener('mouseenter', () => { this.hovering = true; this.schedule(); }, options);
      this.addEventListener('mouseleave', () => { this.hovering = false; this.schedule(); }, options);
      this.addEventListener('focusin', () => { this.paused = true; this.schedule(); }, options);
      document.addEventListener('visibilitychange', () => this.schedule(), options);
      if (!this.slides.length) return;
      const nav = this.querySelector('.bh__navigation');
      if (nav) nav.hidden = this.slides.length < 2;
      this.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button || !this.contains(button)) return;
        if (button.hasAttribute('data-bh-toggle')) {
          this.paused = !this.paused;
          this.schedule();
          return;
        }
        if (button.hasAttribute('data-bh-prev')) this.show(this.index - 1, true);
        if (button.hasAttribute('data-bh-next')) this.show(this.index + 1, true);
        if (button.hasAttribute('data-bh-go')) this.show(Number(button.dataset.bhGo), true);
      }, options);
      this.addEventListener('keydown', event => {
        if (!event.target.closest('.bh__navigation')) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          this.show(this.index + (event.key === 'ArrowRight' ? 1 : -1), true);
        }
      }, options);
      // Native vertical scrolling is preserved. Only deliberate horizontal gestures navigate.
      this.addEventListener('touchstart', event => {
        this.start = null;
        if (this.flkty || event.touches.length !== 1 || event.target.closest('a,button,input,textarea,select')) return;
        this.start = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }, { ...options, passive: true });
      this.addEventListener('touchend', event => {
        if (!this.start || !event.changedTouches.length) return;
        const dx = event.changedTouches[0].clientX - this.start.x;
        const dy = event.changedTouches[0].clientY - this.start.y;
        this.start = null;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) this.show(this.index + (dx < 0 ? 1 : -1), true);
      }, { ...options, passive: true });
      this.addEventListener('touchcancel', () => { this.start = null; }, options);
      document.addEventListener('shopify:block:select', event => {
        const index = this.slides.findIndex(slide => slide.dataset.blockId === event.detail?.blockId);
        if (index >= 0) { this.paused = true; this.show(index); }
      }, options);
      // Use Pipeline's own fade engine; keep our controls and autoplay handling.
      const Fade = window.themeVendor?.FlickityFade;
      const surface = this.querySelector('.bh__slides');
      if (Fade && surface && this.slides.length > 1) {
        this.slides.forEach(slide => { slide.hidden = false; });
        this.flkty = new Fade(surface, {
          cellSelector: '[data-bh-slide]',
          autoPlay: false,
          contain: false,
          pageDots: false,
          adaptiveHeight: true,
          accessibility: false,
          wrapAround: this.slides.length !== 2,
          prevNextButtons: false,
          draggable: true,
          fade: true,
          rightToLeft: document.documentElement.dir === 'rtl'
        });
        this.flkty.on('change', index => this.show(index));
        this.flkty.on('dragStart', () => { this.paused = true; this.schedule(); });
      }
      this.setupArrowNavigation(options);
      this.show(0);
    }
    setupArrowNavigation(options) {
      const surface = this.querySelector('.bh__slides');
      if (!surface || this.slides.length < 2) return;
      const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
      const interactive = 'a, button, input, textarea, select, label, summary, video, audio, iframe, [role="button"], [role="link"], [contenteditable]:not([contenteditable="false"])';
      const direction = event => {
        const bounds = surface.getBoundingClientRect();
        return event.clientX < bounds.left + bounds.width / 2 ? 'previous' : 'next';
      };
      const reset = () => { delete surface.dataset.arrow; this.arrowStart = null; };
      surface.addEventListener('pointermove', event => {
        if (!pointer.matches || event.pointerType !== 'mouse' || event.target.closest(interactive)) {
          delete surface.dataset.arrow;
          return;
        }
        surface.dataset.arrow = direction(event);
      }, options);
      surface.addEventListener('pointerdown', event => {
        this.arrowStart = pointer.matches && event.pointerType === 'mouse' && event.button === 0 && !event.target.closest(interactive)
          ? { x: event.clientX, y: event.clientY } : null;
      }, options);
      surface.addEventListener('pointerleave', reset, options);
      surface.addEventListener('pointercancel', reset, options);
      pointer.addEventListener('change', reset, options);
      surface.addEventListener('click', event => {
        const start = this.arrowStart;
        this.arrowStart = null;
        if (!pointer.matches || !start || event.defaultPrevented || event.detail === 0 || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.target.closest(interactive)) return;
        if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8 || !window.getSelection()?.isCollapsed) return;
        this.show(this.index + (direction(event) === 'previous' ? -1 : 1), true);
        surface.dataset.arrow = direction(event);
      }, options);
    }
    show(index, announce = false) {
      if (!this.slides?.length) return;
      if (announce) this.paused = true;
      this.index = (index + this.slides.length) % this.slides.length;
      if (this.flkty) this.flkty.select(this.index, false, this.motion.matches);
      this.slides.forEach((slide, i) => {
        const inactive = i !== this.index;
        slide.hidden = !this.flkty && inactive;
        slide.inert = inactive;
        slide.setAttribute('aria-hidden', String(inactive));
      });
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('is-selected', i === this.index);
        if (i === this.index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      const status = this.querySelector('[data-bh-status]');
      if (status && announce) status.textContent = `Slide ${this.index + 1} of ${this.slides.length}`;
      this.schedule();
    }
    schedule() {
      clearTimeout(this.timer);
      const toggle = this.querySelector('[data-bh-toggle]');
      if (toggle) {
        toggle.textContent = this.paused ? '▶' : 'Ⅱ';
        toggle.setAttribute('aria-label', this.paused ? 'Play slideshow' : 'Pause slideshow');
      }
      if (!this.autoplay || this.paused || this.hovering || document.hidden || !this.isConnected) return;
      this.timer = setTimeout(() => this.show(this.index + 1), this.interval);
    }
    disconnectedCallback() {
      this.flkty?.destroy();
      this.flkty = null;
      this.slides?.forEach(slide => {
        slide.inert = false;
        slide.removeAttribute('aria-hidden');
      });
      clearTimeout(this.timer);
      this.controller?.abort();
      this.controller = null;
    }
  }
  customElements.define('bloomere-hero', BloomereHero);
})();
