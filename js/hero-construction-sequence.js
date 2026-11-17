/**
 * ==========================================================================
 * AURA ARCHITECTS - HERO CONSTRUCTION IMAGE SEQUENCE ENGINE
 * High-performance Apple-style Canvas Scrollytelling & Interactive Scrubber
 * 123 WebP Frames showing architectural building construction from ground up
 * ==========================================================================
 */

(function($) {
  'use strict';

  class HeroConstructionSequence {
    constructor() {
      this.canvas = document.getElementById('heroSequenceCanvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.totalFrames = 170;
      this.frames = [];
      this.loadedCount = 0;
      this.currentFrame = 1;
      this.targetFrame = 1;
      this.isPlaying = false;
      this.playInterval = null;
      this.isDragging = false;

      // Milestone definitions for the 3-Year Residential Construction Timelapse (lukerm/cv-building-timelapse)
      this.milestones = [
        { name: 'গ্রাউন্ড ব্রেকিং ও বেসমেন্ট খনন', start: 1, end: 40 },
        { name: 'কংক্রিট ফ্রেম ও ফ্লোর নির্মাণ', start: 41, end: 90 },
        { name: 'ব্রিকওয়ার্ক ও উইন্ডো গ্লেজিং', start: 91, end: 135 },
        { name: 'পূর্ণাঙ্গ রেসিডেন্সিয়াল আর্কিটেকচার', start: 136, end: 170 }
      ];

      this.init();
    }

    getFramePath(index) {
      const pad = String(index).padStart(3, '0');
      return `assets/construction-frames/frame_${pad}.webp`;
    }

    init() {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      // 1. Preload first frame immediately
      const firstImg = new Image();
      firstImg.src = this.getFramePath(1);
      firstImg.onload = () => {
        this.frames[1] = firstImg;
        this.render(1);
        this.preloadRemaining();
      };

      this.bindEvents();
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.round((rect.width || 640) * dpr);
      this.canvas.height = Math.round((rect.height || 540) * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      this.cssWidth = rect.width || 640;
      this.cssHeight = rect.height || 540;

      if (this.frames[this.currentFrame]) {
        this.render(this.currentFrame);
      }
    }

    preloadRemaining() {
      for (let i = 2; i <= this.totalFrames; i++) {
        const img = new Image();
        img.src = this.getFramePath(i);
        img.onload = () => {
          this.frames[i] = img;
          this.loadedCount++;
          const percent = Math.round((this.loadedCount / (this.totalFrames - 1)) * 100);
          $('#seqLoadProgress').text(`${percent}%`);
          if (percent >= 100) {
            $('#seqLoadingBadge').fadeOut(300);
          }
        };
        img.onerror = () => {
          this.loadedCount++;
        };
      }
    }

    render(frameNum) {
      const img = this.frames[frameNum] || this.frames[1];
      if (!img || !this.ctx) return;

      const cw = this.cssWidth;
      const ch = this.cssHeight;

      this.ctx.clearRect(0, 0, cw, ch);

      // Mobile vs Desktop intelligent frame fitting:
      // On mobile / portrait displays, use 'contain' so 100% of the building, foundation, crane and roof are visible!
      const imgW = img.naturalWidth || img.width || 1920;
      const imgH = img.naturalHeight || img.height || 1080;
      const imgRatio = imgW / imgH;
      const canvasRatio = cw / ch;

      let dw, dh, dx, dy;
      const isMobile = window.innerWidth <= 991;

      if (isMobile) {
        // Complete frame containment: nothing cut off
        if (canvasRatio > imgRatio) {
          dh = ch;
          dw = ch * imgRatio;
          dx = (cw - dw) / 2;
          dy = 0;
        } else {
          dw = cw;
          dh = cw / imgRatio;
          dx = 0;
          dy = (ch - dh) / 2;
        }
      } else {
        // Desktop: fill card elegantly
        if (canvasRatio > imgRatio) {
          dw = cw;
          dh = cw / imgRatio;
          dx = 0;
          dy = (ch - dh) / 2;
        } else {
          dh = ch;
          dw = ch * imgRatio;
          dx = (cw - dw) / 2;
          dy = 0;
        }
      }

      this.ctx.drawImage(img, dx, dy, dw, dh);
      this.currentFrame = frameNum;
      this.updateHUD(frameNum);
    }

    updateHUD(frameNum) {
      const progress = Math.round((frameNum / this.totalFrames) * 100);
      $('#seqProgressPercent').text(`${progress}%`);
      $('#seqTimelineBar').css('width', `${progress}%`);

      // Find current milestone
      const ms = this.milestones.find(m => frameNum >= m.start && frameNum <= m.end) || this.milestones[0];
      $('#seqMilestoneName').text(ms.name);
      $('#seqFrameNumber').text(`ফ্রেম: ${frameNum} / ${this.totalFrames}`);

      // Update milestone pill active states
      $('.seq-milestone-pill').each(function() {
        const target = parseInt($(this).data('frame'), 10);
        if (Math.abs(target - frameNum) <= 15) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    }

    goToFrame(target, duration = 400) {
      const start = this.currentFrame;
      const delta = target - start;
      if (delta === 0) return;

      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const factor = Math.min(elapsed / duration, 1);
        const ease = factor < 0.5 ? 2 * factor * factor : -1 + (4 - 2 * factor) * factor;

        const next = Math.round(start + delta * ease);
        const clamped = Math.max(1, Math.min(this.totalFrames, next));
        this.render(clamped);

        if (factor < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }

    bindEvents() {
      const self = this;
      const heroWrapper = document.getElementById('hero');
      let ticking = false;

      // Scroll-Driven Only: Hero stays pinned in place while building completes
      const updateOnScroll = () => {
        if (!heroWrapper) return;

        const rect = heroWrapper.getBoundingClientRect();
        const scrollDistance = heroWrapper.offsetHeight - window.innerHeight;

        if (scrollDistance <= 0) return;

        // Progress 0 when section enters, 1 when building completes
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
        const targetFrame = Math.max(1, Math.min(self.totalFrames, Math.round(progress * (self.totalFrames - 1)) + 1));

        if (targetFrame !== self.currentFrame) {
          self.render(targetFrame);
        }
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateOnScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        self.resizeCanvas();
        updateOnScroll();
      });

      // Initial render on mount
      updateOnScroll();
    }
  }

  $(document).ready(function() {
    window.heroConstructionSeq = new HeroConstructionSequence();
  });

})(jQuery);
