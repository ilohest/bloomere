/* Draw oval scallops in actual pixels, evenly spaced along the ellipse perimeter. */
(() => {
  if (customElements.get('bloomere-mosaic-frame')) return;
  class BloomereMosaicFrame extends HTMLElement {
    connectedCallback() {
      if (this.observer || !['oval', 'circle'].includes(this.dataset.shape)) return;
      this.tile = this.closest('.tile');
      this.svg = this.querySelector('svg');
      if (!this.tile || !this.svg) return;
      this.observer = new ResizeObserver(() => this.draw());
      this.observer.observe(this.tile);
      this.draw();
    }
    draw() {
      const { width, height } = this.tile.getBoundingClientRect();
      if (width < 40 || height < 40) return;
      const key = `${width}:${height}`;
      if (key === this.size) return;
      this.size = key;
      const w = this.dataset.shape === 'circle' ? Math.min(width, height) : width;
      const h = this.dataset.shape === 'circle' ? w : height;
      const cx = width / 2, cy = height / 2;
      const wave = Math.max(20, Math.min(40, Math.min(w, h) * .09));
      const amplitude = wave * .20;
      const border = Math.max(12, Math.min(28, Math.min(w, h) * .045));
      const rx = w / 2 - amplitude - 2, ry = h / 2 - amplitude - 2;
      // Arc-length lookup avoids the dense, stretched waves at the tips of a portrait oval.
      const table = [{ angle: 0, length: 0 }];
      let length = 0, previous = { x: rx, y: 0 };
      for (let i = 1; i <= 2048; i++) {
        const angle = i * Math.PI * 2 / 2048;
        const point = { x: rx * Math.cos(angle), y: ry * Math.sin(angle) };
        length += Math.hypot(point.x - previous.x, point.y - previous.y);
        table.push({ angle, length });
        previous = point;
      }
      const count = Math.max(12, Math.round(length / wave));
      const pointAt = fraction => {
        const distance = fraction * length;
        let lo = 0, hi = table.length - 1;
        while (hi - lo > 1) {
          const mid = (lo + hi) >> 1;
          if (table[mid].length < distance) lo = mid; else hi = mid;
        }
        const t = (distance - table[lo].length) / (table[hi].length - table[lo].length);
        const angle = table[lo].angle + t * (table[hi].angle - table[lo].angle);
        const cos = Math.cos(angle), sin = Math.sin(angle);
        const norm = Math.hypot(cos / rx, sin / ry);
        return { x: cx + rx * cos, y: cy + ry * sin, nx: cos / rx / norm, ny: sin / ry / norm };
      };
      const f = n => n.toFixed(2);
      let d = '';
      for (let i = 0; i <= count * 24; i++) {
        const fraction = i / (count * 24), p = pointAt(fraction);
        const offset = amplitude * (.5 + .5 * Math.cos(fraction * count * Math.PI * 2));
        d += `${i ? 'L' : 'M'}${f(p.x + p.nx * offset)} ${f(p.y + p.ny * offset)} `;
      }
      const ix = rx - border, iy = ry - border;
      d += `Z M${f(cx - ix)} ${f(cy)} a${f(ix)} ${f(iy)} 0 1 0 ${f(2 * ix)} 0 a${f(ix)} ${f(iy)} 0 1 0 ${f(-2 * ix)} 0 Z `;
      const dot = Math.max(1.2, Math.min(2.2, border * .09));
      for (let i = 0; i < count; i++) {
        const p = pointAt(i / count), x = p.x - p.nx * border * .4, y = p.y - p.ny * border * .4;
        d += `M${f(x - dot)} ${f(y)} a${f(dot)} ${f(dot)} 0 1 0 ${f(2 * dot)} 0 a${f(dot)} ${f(dot)} 0 1 0 ${f(-2 * dot)} 0 Z `;
      }
      this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'currentColor');
      path.setAttribute('fill-rule', 'evenodd');
      this.svg.replaceChildren(path);
      for (const [name, value] of Object.entries({left:cx-ix, top:cy-iy, width:2*ix, height:2*iy})) {
        this.tile.style.setProperty(`--bm-image-${name}`, `${value}px`);
      }
      this.tile.classList.add('bm-frame-sized');
    }
    disconnectedCallback() {
      this.observer?.disconnect();
      this.observer = null;
      this.size = null;
    }
  }
  customElements.define('bloomere-mosaic-frame', BloomereMosaicFrame);
})();
