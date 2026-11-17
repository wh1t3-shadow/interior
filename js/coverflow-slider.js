/**
 * ==========================================================================
 * AURA ARCHITECTS - 3D LAYERED COVERFLOW PROJECT SLIDER
 * True 3D Depth Perspective Stack (Front Card Elevated, Behind Cards Angled)
 * ==========================================================================
 */

(function($) {
  'use strict';

  class CoverFlowSlider {
    constructor() {
      this.$track = $('#coverflowTrack');
      this.$dotsWrapper = $('#coverflowDots');
      this.currentFilter = 'all';
      this.currentIndex = 0;
      this.visibleCards = [];

      this.projects = [
        {
          id: 1,
          category: 'villa',
          categoryLabel: 'লাক্সারি ভিলা',
          title: 'দ্য ইম্পেরিয়াল স্কাই ডুপ্লেক্স ভিলা',
          desc: '৮,৫০০ বর্গফুটের ট্রিপ্লেক্স স্থাপত্য। ইতালিয়ান মার্বেল, স্মার্ট হোম অটোমেশন ও প্রাইভেট রুফটপ ইনফিনিটি পুল সমৃদ্ধ।',
          photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 2,
          category: 'commercial',
          categoryLabel: 'কমার্শিয়াল টাওয়ার',
          title: 'লুমিনা আইকনিক হেডকোয়ার্টার্স টাওয়ার',
          desc: '২৮ তলা বিশিষ্ট গ্রিন বিল্ডিং সার্টিফায়েড কমার্শিয়াল স্কাইস্ক্র্যাপার। লো-ই গ্লাস কার্টেইন ওয়াল ও সিসমিক জোন-৪ রেজিস্ট্যান্ট।',
          photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 3,
          category: 'penthouse',
          categoryLabel: 'পেন্টহাউস ইন্টেরিয়র',
          title: 'অ্যাম্বিয়েন্স লাক্সারি পেন্টহাউস রিট্রিট',
          desc: 'আমেরিকান ব্ল্যাক ভ্যালনাট উডওয়ার্ক, অ্যাকোস্টিক ওয়াল প্যানেল ও বিলাসবহুল মাস্টার সুইটসহ আধুনিক ইন্টেরিয়র স্পেস।',
          photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 4,
          category: 'villa',
          categoryLabel: 'লাক্সারি ভিলা',
          title: 'ভার্টিক্যাল গ্রিন বায়োফিলিক ম্যানশন',
          desc: 'প্রকৃতির সাথে মিশে থাকা আধুনিক গ্রিন আর্কিটেকচার। ভার্টিক্যাল গার্ডেন ডেক ও এনার্জি-এফিশিয়েন্ট সোলার সিস্টেম।',
          photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 5,
          category: 'renovation',
          categoryLabel: 'রিনোভেশন',
          title: 'হেরিটেজ এস্টেট মডার্ন রিনোভেশন',
          desc: 'পুরাতন কাঠামোর শক্তি অক্ষুণ্ণ রেখে সম্পূর্ণ আধুনিক ওপেন-কনসেপ্ট ফ্লোর প্ল্যানে রূপান্তর ও বিলাসবহুল পুনর্নির্মাণ।',
          photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 6,
          category: 'commercial',
          categoryLabel: 'কমার্শিয়াল টাওয়ার',
          title: 'অরিয়ন বিজনেস সেন্টার ও রিটেল মল',
          desc: 'আন্তর্জাতিক মানের আধুনিক রিটেল স্পেস, টেরাকোটা ফাসাদ ও স্টেট-অব-দ্য-আর্ট আইটি পার্ক অবকাঠামো।',
          photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        }
      ];

      this.init();
      this.bindEvents();
    }

    init() {
      this.filterProjects(this.currentFilter);
    }

    filterProjects(filter) {
      this.currentFilter = filter;
      this.currentIndex = 0;

      if (filter === 'all') {
        this.visibleCards = [...this.projects];
      } else {
        this.visibleCards = this.projects.filter(p => p.category === filter);
      }

      this.renderCards();
      this.renderDots();
      this.updatePositions();
    }

    renderCards() {
      this.$track.empty();
      const self = this;

      this.visibleCards.forEach((proj, idx) => {
        const cardHtml = `
          <div class="coverflow-card" data-idx="${idx}">
            <div class="card-thumb-wrap">
              <span class="card-category-pill">${proj.categoryLabel}</span>
              <img src="${proj.photo}" alt="${proj.title}" loading="lazy">
              <div class="card-depth-overlay"></div>
            </div>
            <div class="card-body-content">
              <div>
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
              </div>
              <div class="card-footer-action">
                <a href="${proj.link}" class="card-read-link">
                  <span>প্রজেক্টের বিস্তারিত দেখুন</span>
                  <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        `;
        self.$track.append(cardHtml);
      });
    }

    renderDots() {
      this.$dotsWrapper.empty();
      const count = this.visibleCards.length;
      for (let i = 0; i < count; i++) {
        const $dot = $('<div></div>')
          .addClass('cov-dot')
          .toggleClass('active', i === this.currentIndex)
          .attr('data-dot', i);
        this.$dotsWrapper.append($dot);
      }
    }

    updatePositions() {
      const total = this.visibleCards.length;
      if (total === 0) return;

      const self = this;
      this.$track.find('.coverflow-card').each(function() {
        const idx = parseInt($(this).data('idx'));
        $(this).removeClass('pos-center pos-left pos-right pos-far-left pos-far-right pos-hidden');

        // Circular offset calculation
        let diff = (idx - self.currentIndex) % total;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        if (diff === 0) {
          $(this).addClass('pos-center');
        } else if (diff === -1) {
          $(this).addClass('pos-left');
        } else if (diff === 1) {
          $(this).addClass('pos-right');
        } else if (diff === -2) {
          $(this).addClass('pos-far-left');
        } else if (diff === 2) {
          $(this).addClass('pos-far-right');
        } else {
          $(this).addClass('pos-hidden');
        }
      });

      // Update dots
      this.$dotsWrapper.find('.cov-dot').removeClass('active');
      this.$dotsWrapper.find(`.cov-dot[data-dot="${this.currentIndex}"]`).addClass('active');

      if (window.soundFX) window.soundFX.playClick();
    }

    next() {
      const total = this.visibleCards.length;
      if (total <= 1) return;
      this.currentIndex = (this.currentIndex + 1) % total;
      this.updatePositions();
    }

    prev() {
      const total = this.visibleCards.length;
      if (total <= 1) return;
      this.currentIndex = (this.currentIndex - 1 + total) % total;
      this.updatePositions();
    }

    bindEvents() {
      const self = this;

      // Filter tabs
      $('.filter-tab-btn').on('click', function() {
        $('.filter-tab-btn').removeClass('active');
        $(this).addClass('active');
        const filter = $(this).data('filter');
        self.filterProjects(filter);
      });

      // Arrow buttons
      $('#sliderNextBtn').on('click', function(e) {
        e.preventDefault();
        self.next();
      });

      $('#sliderPrevBtn').on('click', function(e) {
        e.preventDefault();
        self.prev();
      });

      // Click on angled side cards to navigate directly
      this.$track.on('click', '.coverflow-card', function() {
        if ($(this).hasClass('pos-left') || $(this).hasClass('pos-far-left')) {
          self.prev();
        } else if ($(this).hasClass('pos-right') || $(this).hasClass('pos-far-right')) {
          self.next();
        }
      });

      // Dots click
      this.$dotsWrapper.on('click', '.cov-dot', function() {
        const target = parseInt($(this).data('dot'));
        self.currentIndex = target;
        self.updatePositions();
      });

      // Touch drag
      let startX = 0;
      this.$track.on('touchstart', function(e) {
        startX = e.originalEvent.touches[0].clientX;
      });

      this.$track.on('touchend', function(e) {
        const endX = e.originalEvent.changedTouches[0].clientX;
        const diffX = endX - startX;
        if (diffX < -40) self.next();
        else if (diffX > 40) self.prev();
      });
    }
  }

  window.CoverFlowSlider = CoverFlowSlider;
  $(document).ready(function() {
    window.coverFlowApp = new CoverFlowSlider();
  });

})(jQuery);
