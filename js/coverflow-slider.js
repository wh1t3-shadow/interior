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
          categoryLabel: 'Luxury Villa',
          title: 'The Imperial Sky Duplex Villa',
          desc: '8,500 sq. ft. triplex residence engineered with imported Calacatta marble, smart home automation, and an expansive private rooftop infinity pool.',
          photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 2,
          category: 'commercial',
          categoryLabel: 'Commercial Tower',
          title: 'Lumina Iconic Headquarters Tower',
          desc: '28-story LEED Gold certified commercial landmark. High-performance Low-E acoustic curtain glazing with Seismic Zone-4 structural resilience.',
          photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 3,
          category: 'penthouse',
          categoryLabel: 'Penthouse Interior',
          title: 'Ambience Sky Penthouse Retreat',
          desc: 'American black walnut millwork, acoustic fluted wall architecture, double-height living volume, and panoramic 360-degree city views.',
          photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 4,
          category: 'villa',
          categoryLabel: 'Luxury Villa',
          title: 'Vertical Green Biophilic Mansion',
          desc: 'Seamless organic architecture integrating vertical suspended botanic gardens, cantilevered terraces, and passive net-zero solar engineering.',
          photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 5,
          category: 'renovation',
          categoryLabel: 'Modern Renovation',
          title: 'Heritage Estate Architectural Metamorphosis',
          desc: 'Preserving historical structural integrity while executing a comprehensive open-concept architectural remodel with bespoke luxury detailing.',
          photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 6,
          category: 'commercial',
          categoryLabel: 'Commercial Tower',
          title: 'Orion Global Financial Centre',
          desc: 'State-of-the-art corporate headquarters featuring column-free floor plates, high-speed destination dispatch elevators, and thermal glass skin.',
          photo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 7,
          category: 'penthouse',
          categoryLabel: 'Penthouse Interior',
          title: 'The Sovereign Presidential Suite',
          desc: 'Custom sculptural bronze chandeliers, bookmatched statuario marble slabs, and minimalist architectural lighting creating ethereal living spaces.',
          photo: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=85',
          link: '#contactSection'
        },
        {
          id: 8,
          category: 'renovation',
          categoryLabel: 'Modern Renovation',
          title: 'Brutalist Concrete to Glass Residence',
          desc: 'Structural transformation converting 1980s load-bearing masonry into dramatic steel-framed floor-to-ceiling glass expanses.',
          photo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85',
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
                  <span>Explore Project Details</span>
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
