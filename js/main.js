/**
 * ==========================================================================
 * AURA ARCHITECTS - MAIN APPLICATION ENGINE (WHITE LUXURY THEME)
 * Before/After Slider, Cost Estimator, Video/Photo Gallery, Audio & Nav
 * ==========================================================================
 */

(function($) {
  'use strict';

  // 1. Synthesized Web Audio Sound Effects
  class SoundFX {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    initContext() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  window.soundFX = new SoundFX();

  // 2. Interactive Before & After Renovation Slider
  class BeforeAfterSlider {
    constructor() {
      this.$container = $('#baSliderContainer');
      this.$afterLayer = $('#baImageAfter');
      this.$handle = $('#baHandle');
      if (!this.$container.length) return;

      this.isDragging = false;
      this.syncImageWidth();
      this.bindEvents();
    }

    syncImageWidth() {
      const containerW = this.$container.width();
      if (containerW) {
        this.$afterLayer.find('img').css('width', `${containerW}px`);
      }
    }

    bindEvents() {
      const self = this;

      $(window).on('resize', () => self.syncImageWidth());

      const updatePosition = (clientX) => {
        const rect = self.$container[0].getBoundingClientRect();
        let posX = clientX - rect.left;
        posX = Math.max(0, Math.min(rect.width, posX));
        const percent = (posX / rect.width) * 100;

        self.$afterLayer.css('width', `${percent}%`);
        self.$handle.css('left', `${percent}%`);
      };

      this.$container.on('mousedown touchstart', function(e) {
        self.syncImageWidth();
        self.isDragging = true;
        const clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
        updatePosition(clientX);
      });

      $(window).on('mousemove touchmove', function(e) {
        if (!self.isDragging) return;
        const clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
        updatePosition(clientX);
      });

      $(window).on('mouseup touchend', function() {
        self.isDragging = false;
      });
    }
  }

  // 3. Interactive Construction & Interior Cost Estimator
  class CostEstimator {
    constructor() {
      this.projectType = 'interior';
      this.propertyType = 'duplex';
      this.materialGrade = 'luxury';
      this.area = 3500;

      this.init();
    }

    init() {
      this.bindControls();
      this.calculate();
    }

    bindControls() {
      const self = this;

      $('.calc-type-btn').on('click', function() {
        $('.calc-type-btn').removeClass('active');
        $(this).addClass('active');
        self.projectType = $(this).data('type');
        self.calculate();
        if (window.soundFX) window.soundFX.playClick();
      });

      $('.calc-prop-btn').on('click', function() {
        $('.calc-prop-btn').removeClass('active');
        $(this).addClass('active');
        self.propertyType = $(this).data('prop');
        self.calculate();
        if (window.soundFX) window.soundFX.playClick();
      });

      $('.calc-grade-btn').on('click', function() {
        $('.calc-grade-btn').removeClass('active');
        $(this).addClass('active');
        self.materialGrade = $(this).data('grade');
        self.calculate();
        if (window.soundFX) window.soundFX.playClick();
      });

      $('#calcAreaSlider').on('input', function() {
        self.area = parseInt($(this).val());
        $('#calcAreaDisplay').text(`${self.area.toLocaleString('bn-BD')} Sq.Ft`);
        self.calculate();
      });

      $('#calcQuoteBtn').on('click', function(e) {
        e.preventDefault();
        showToast('✅ আপনার প্রজেক্টের প্রাথমিক প্রাক্কলন ও কোটেশন ফাইল তৈরি হয়েছে!');
      });
    }

    calculate() {
      let ratePerSqFt = 2400;
      if (this.projectType === 'construction') ratePerSqFt = 3600;
      else if (this.projectType === 'renovation') ratePerSqFt = 1750;

      let gradeMultiplier = 1.0;
      if (this.materialGrade === 'bespoke') gradeMultiplier = 1.4;
      else if (this.materialGrade === 'standard') gradeMultiplier = 0.8;

      let propMultiplier = 1.0;
      if (this.propertyType === 'commercial') propMultiplier = 1.15;
      else if (this.propertyType === 'villa') propMultiplier = 1.25;

      const totalCostBDT = Math.round(this.area * ratePerSqFt * gradeMultiplier * propMultiplier);

      const civilShare = Math.round(totalCostBDT * 0.32);
      const woodMarbleShare = Math.round(totalCostBDT * 0.38);
      const electricSmartShare = Math.round(totalCostBDT * 0.18);
      const designFeeShare = Math.round(totalCostBDT * 0.12);

      $('#costBreakdownCivil').text(this.formatBDT(civilShare));
      $('#costBreakdownWood').text(this.formatBDT(woodMarbleShare));
      $('#costBreakdownSmart').text(this.formatBDT(electricSmartShare));
      $('#costBreakdownDesign').text(this.formatBDT(designFeeShare));

      $('#calcTotalCost').text(this.formatBDTLakhCrore(totalCostBDT));
    }

    formatBDT(val) {
      return `৳ ${val.toLocaleString('en-IN')}`;
    }

    formatBDTLakhCrore(val) {
      if (val >= 10000000) {
        const crore = (val / 10000000).toFixed(2);
        return `৳ ${crore} কোটি`;
      } else {
        const lakh = (val / 100000).toFixed(1);
        return `৳ ${lakh} লাখ`;
      }
    }
  }

  // 4. Toast Notification
  function showToast(message) {
    let $toast = $('#toastNotice');
    if (!$toast.length) {
      $toast = $('<div id="toastNotice" class="toast-notice"></div>').appendTo('body');
    }
    $toast.html(`<span>${message}</span>`);
    $toast.addClass('show');

    setTimeout(() => {
      $toast.removeClass('show');
    }, 4000);
  }
  window.showToast = showToast;

  // 5. Stat Counter Animations
  function initStatCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseFloat(entry.target.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const step = target / 50;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            entry.target.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
          }, 30);

          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // 6. Navigation & Media Gallery Lightbox
  function initNavigationAndMedia() {
    const $header = $('#siteHeader');

    $(window).on('scroll', function() {
      if ($(window).scrollTop() > 50) {
        $header.addClass('scrolled');
      } else {
        $header.removeClass('scrolled');
      }
    });

    $('#mobileMenuToggle').on('click', function(e) {
      e.stopPropagation();
      $('#navMenu').toggleClass('mobile-open');
    });

    // Auto close drawer when nav link is tapped on mobile
    $('#navMenu a').on('click', function() {
      $('#navMenu').removeClass('mobile-open');
    });

    // Close mobile drawer when clicking outside
    $(document).on('click', function(e) {
      if (!$(e.target).closest('#siteHeader').length) {
        $('#navMenu').removeClass('mobile-open');
      }
    });

    // Gallery Image Switcher on clicking small photo quads
    $('.gallery-quad-item').on('click', function() {
      const fullImg = $(this).find('img').attr('src');
      const title = $(this).find('.quad-hover-info span').text();
      $('#featuredVideoImg').attr('src', fullImg);
      $('#featuredVideoTitle').text(title);
      showToast(`📸 ${title} গ্যালারি ফটো প্রিভিউ লোড হয়েছে`);
    });

    // Video Trigger Preview
    $('#videoPlayTrigger').on('click', function() {
      showToast('🎬 ৪K আর্কিটেকচারাল সাইট ভার্চুয়াল ভিডিও প্লেব্যাক শুরু হয়েছে!');
    });

    // Form submission
    $('#consultationForm').on('submit', function(e) {
      e.preventDefault();
      showToast('🎉 ধন্যবাদ! আপনার ফ্রি সাইট ভিজিট ও আর্কিটেকচারাল কনসালটেশন বুকিং সফল হয়েছে।');
      this.reset();
    });
  }

  // 7. Hero Real 3D Model Switcher
  function initHero3DModelSwitcher() {
    const $viewer = $('#heroRealModelViewer');
    const $buttons = $('.hero-model-btn');
    const $title = $('#hero3DModelTitle');

    if (!$viewer.length) return;
    const viewerEl = $viewer[0];

    // Ensure initial src is set to embedded model immediately
    if (viewerEl && (!viewerEl.getAttribute('src') || viewerEl.getAttribute('src').startsWith('models/')) && window.HERO_3D_MODELS) {
      viewerEl.setAttribute('src', window.HERO_3D_MODELS.interiorVilla);
    }

    $buttons.on('click', function() {
      const $btn = $(this);
      const key = $btn.data('key');
      const caption = $btn.data('caption');

      $buttons.removeClass('active');
      $btn.addClass('active');

      if ($title.length && caption) {
        $title.text(caption);
      }

      if (viewerEl) {
        if (key && window.HERO_3D_MODELS && window.HERO_3D_MODELS[key]) {
          viewerEl.setAttribute('src', window.HERO_3D_MODELS[key]);
        } else if (key === 'luxuryVilla') {
          if (window.location.protocol === 'file:') {
            showToast('💡 মেগা লাক্সারি ভিলা দেখতে "start.bat" ডাবল ক্লিক করে লোকাল সার্ভারে ওপেন করুন।');
            viewerEl.setAttribute('src', window.HERO_3D_MODELS.modernBuilding);
          } else {
            viewerEl.setAttribute('src', 'models/luxury_villa.glb');
          }
        }
        viewerEl.setAttribute('camera-orbit', '45deg 70deg auto');
      }

      if (window.soundFX) window.soundFX.playClick();
    });

    if (viewerEl) {
      viewerEl.addEventListener('error', function(err) {
        console.warn('Model load error, falling back to embedded model:', err);
        if (window.HERO_3D_MODELS && window.HERO_3D_MODELS.interiorVilla) {
          viewerEl.setAttribute('src', window.HERO_3D_MODELS.interiorVilla);
        }
      });

      viewerEl.addEventListener('progress', function(e) {
        const progressBar = document.querySelector('.update-bar');
        if (progressBar) {
          const progress = (e.detail.totalProgress || 0) * 100;
          progressBar.style.width = `${progress}%`;
          if (progress >= 100) {
            setTimeout(function() {
              progressBar.style.width = '0%';
            }, 300);
          }
        }
      });
    }
  }

  $(document).ready(function() {
    initNavigationAndMedia();
    initStatCounters();
    initHero3DModelSwitcher();
    window.beforeAfterApp = new BeforeAfterSlider();
    window.costEstimatorApp = new CostEstimator();
  });

})(jQuery);
