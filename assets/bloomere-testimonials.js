(() => {
  if (customElements.get('bloomere-testimonials')) return;
  class BloomereTestimonials extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      this.slides = [...this.querySelectorAll('[data-bt-slide]')];
      this.dots = [...this.querySelectorAll('[data-bt-go]')];
      this.index = 0;
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.paused = this.motion.matches || this.dataset.editor === 'true';
      this.hovering = false;
      this.autoplay = this.dataset.autoplay === 'true' && this.slides.length > 1;
      this.interval = Math.max(3000, Number(this.dataset.interval) || 7000);
      this.querySelector('[data-bt-nav]').hidden = this.slides.length < 2;
      this.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button || !this.contains(button)) return;
        if (button.hasAttribute('data-bt-toggle')) { this.paused = !this.paused; this.schedule(); }
        if (button.hasAttribute('data-bt-prev')) this.show(this.index - 1, true);
        if (button.hasAttribute('data-bt-next')) this.show(this.index + 1, true);
        if (button.hasAttribute('data-bt-go')) this.show(Number(button.dataset.btGo), true);
      }, options);
      this.addEventListener('keydown', event => {
        if (!event.target.closest('[data-bt-nav]')) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          this.show(this.index + (event.key === 'ArrowRight' ? 1 : -1), true);
        }
      }, options);
      this.addEventListener('mouseenter', () => { this.hovering = true; this.schedule(); }, options);
      this.addEventListener('mouseleave', () => { this.hovering = false; this.schedule(); }, options);
      this.addEventListener('focusin', () => { this.paused = true; this.schedule(); }, options);
      document.addEventListener('visibilitychange', () => this.schedule(), options);
      this.motion.addEventListener('change', () => {
        if (this.motion.matches) this.paused = true;
        this.schedule();
      }, options);
      document.addEventListener('shopify:block:select', event => {
        const index = this.slides.findIndex(slide => slide.dataset.blockId === event.detail?.blockId);
        if (index >= 0) this.show(index, true);
      }, options);
      // Use Pipeline's own fade engine; keep our controls and autoplay handling.
      const Fade = window.themeVendor?.FlickityFade;
      const surface = this.querySelector('.bt__slides');
      if (Fade && surface && this.slides.length > 1) {
        this.slides.forEach(slide => { slide.hidden = false; });
        this.flkty = new Fade(surface, {
          cellSelector: '[data-bt-slide]',
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
      this.show(0);
    }
    show(index, manual = false) {
      if (!this.slides.length) return;
      if (manual) this.paused = true;
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
      if (manual) this.querySelector('[data-bt-status]').textContent = `${this.index + 1} / ${this.slides.length}`;
      this.schedule();
    }
    schedule() {
      clearTimeout(this.timer);
      const toggle = this.querySelector('[data-bt-toggle]');
      if (toggle) {
        toggle.querySelector('[data-bt-play]').hidden = !this.paused;
        toggle.querySelector('[data-bt-pause]').hidden = this.paused;
        toggle.setAttribute('aria-label', this.paused ? toggle.dataset.playLabel : toggle.dataset.pauseLabel);
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
  customElements.define('bloomere-testimonials', BloomereTestimonials);
})();
