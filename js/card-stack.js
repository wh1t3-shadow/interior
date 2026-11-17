/**
 * ==========================================================================
 * 3D STACKING CARDS CAROUSEL ENGINE
 * Cascading Drop-down & Elevate Card Transitions
 * ==========================================================================
 */

(function($) {
  'use strict';

  class StackingCardCarousel {
    constructor() {
      this.$deck = $('#projectStackDeck');
      this.$cards = this.$deck.find('.stack-card');
      this.totalCards = this.$cards.length;
      if (this.totalCards === 0) return;

      this.currentIndex = 0;
      this.isAnimating = false;

      // Project Data matching the cards
      this.projects = [
        {
          title: "দ্য ইম্পেরিয়াল স্কাই ভিলা ও পেন্টহাউস",
          category: "লাক্সারি রেসিডেন্সিয়াল আর্কিটেকচার",
          desc: "গুলশান-২ এর প্রাণকেন্দ্রে ৮,৫০০ বর্গফুটের ট্রিপ্লেক্স পেন্টহাউস। ইতালিয়ান স্ট্যাচুয়ারিও মার্বেল, স্মার্ট হোম অটোমেশন এবং ৩টি প্রাইভেট রুফটপ ইনফিনিটি পুল সমন্বয়ে নির্মিত এক অনন্য নান্দনিক স্থাপত্য।",
          area: "৮,৫০০ Sq.Ft",
          year: "২০২৪",
          location: "গুলশান, ঢাকা",
          style: "মডার্ন নিও-ক্লাসিক্যাল"
        },
        {
          title: "লুমিনা কর্পোরেট হেডকোয়ার্টার্স টাওয়ার",
          category: "কমার্শিয়াল মেগা-কনস্ট্রাকশন",
          desc: "২৮ তলা বিশিষ্ট গ্রিন বিল্ডিং সার্টিফায়েড কমার্শিয়াল স্কাইস্ক্র্যাপার। ডাবল-গ্লেজড থার্মাল গ্লাস কার্টেইন ওয়াল, সিসমিক জোন-৪ রেজিস্ট্যান্ট স্টিল কোর এবং ইন্টেলিজেন্ট লাইটিং সমৃদ্ধ।",
          area: "৩,২০,০০০ Sq.Ft",
          year: "২০২৩",
          location: "বনানী, ঢাকা",
          style: "প্যারামেট্রিক আর্কিটেকচার"
        },
        {
          title: "অ্যাম্বিয়েন্স লাক্সারি ডুপ্লেক্স রিট্রিট",
          category: "ইন্টেরিয়র ডিজাইন ও ফিট-আউট",
          desc: "প্রাকৃতিক আলো ও সবুজের সমন্বয়ে জেন-স্টাইল আর্কিটেকচার। কাস্টম আমেরিকান ভ্যালনাট উডওয়ার্ক, ফ্লোর-টু-সিলিং অ্যাকোস্টিক ওয়াল এবং কাস্টম ডিনার লাউঞ্জসহ আধুনিক ইন্টেরিয়র।",
          area: "৫,২০০ Sq.Ft",
          year: "২০২৪",
          location: "বারিধারা ডিপ্লোমেটিক জোন",
          style: "মিনিম্যালিস্ট জৈব ডিজাইন"
        },
        {
          title: "ভার্টিক্যাল গ্রিন ইকো-ম্যানশন",
          category: "সাসটেইনেবল আর্কিটেকচার",
          desc: "বায়োফিলিক কনসেপ্টে নির্মিত অত্যাধুনিক ইকো-রেসিডেন্স। সৌরশক্তি চালিত স্মার্ট সিস্টেম, রেইন-ওয়াটার হার্ভেস্টিং এবং প্রতি ফ্লোরে হ্যাঙ্গিং ল্যান্ডস্কেপ টেরেস গার্ডেন।",
          area: "১২,০০০ Sq.Ft",
          year: "২০২৫",
          location: "পূর্বাচল নিউ টাউন",
          style: "বায়োফিলিক সাস্টেইনেবল"
        },
        {
          title: "অরিয়ন বিজনেস পার্ক ও আইকনিক প্লাজা",
          category: "মিক্সড-ইউজ কমার্শিয়াল সেন্টার",
          desc: "আন্তর্জাতিক মানের রিটেল লাক্সারি মল এবং স্টেট-অব-দ্য-আর্ট আইটি পার্ক হাব। স্প্যানিশ টেরাকোটা ফাসাদ এবং সম্পূর্ণ সিসমিক সেফটি আর্কিটেকচার দ্বারা নির্মিত।",
          area: "১,৮৫,০০০ Sq.Ft",
          year: "২০২৩",
          location: "ধানমন্ডি, ঢাকা",
          style: "ফিউচারিস্টিক হাই-টেক"
        }
      ];

      this.initDeck();
      this.bindControls();
    }

    initDeck() {
      this.updateCardIndices();
      this.updateProjectInfo(0);
      this.createDots();
    }

    createDots() {
      const $dotsWrapper = $('#stackDotsIndicator');
      $dotsWrapper.empty();
      for (let i = 0; i < this.totalCards; i++) {
        const $dot = $('<div></div>')
          .addClass('stack-dot')
          .toggleClass('active', i === 0)
          .attr('data-index', i);
        $dotsWrapper.append($dot);
      }

      const self = this;
      $dotsWrapper.on('click', '.stack-dot', function() {
        const targetIdx = parseInt($(this).attr('data-index'));
        if (targetIdx !== self.currentIndex && !self.isAnimating) {
          self.jumpTo(targetIdx);
        }
      });
    }

    updateCardIndices() {
      const self = this;
      this.$cards.each(function(cardIndex) {
        // Calculate relative position from currentIndex
        let relativeIndex = (cardIndex - self.currentIndex + self.totalCards) % self.totalCards;
        $(this).attr('data-index', relativeIndex);
      });
    }

    updateProjectInfo(index) {
      const data = this.projects[index] || this.projects[0];
      const $info = $('.stack-info-col');

      // Subtle cross-fade for typography
      $info.find('.stack-project-title, .stack-project-desc, .stack-specs-grid').css('opacity', 0);
      
      setTimeout(() => {
        $('#stackCategoryTag').text(data.category);
        $('#stackProjectTitle').text(data.title);
        $('#stackProjectDesc').text(data.desc);
        $('#stackSpecArea').text(data.area);
        $('#stackSpecYear').text(data.year);
        $('#stackSpecLocation').text(data.location);

        $info.find('.stack-project-title, .stack-project-desc, .stack-specs-grid').css({
          'opacity': 1,
          'transition': 'opacity 0.35s ease'
        });
      }, 150);

      // Update dots
      $('#stackDotsIndicator .stack-dot').removeClass('active');
      $(`#stackDotsIndicator .stack-dot[data-index="${index}"]`).addClass('active');

      // Play soft UI audio tick if sound enabled
      if (window.soundFX) window.soundFX.playCardDrop();
    }

    next() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      // Find current active top card
      const $currentTopCard = this.$deck.find('.stack-card[data-index="0"]');

      // 1. Trigger the dramatic drop-down exit animation
      $currentTopCard.addClass('dropping');

      // 2. Advance the currentIndex
      this.currentIndex = (this.currentIndex + 1) % this.totalCards;
      this.updateProjectInfo(this.currentIndex);

      // 3. Promote remaining cards upwards in the stack immediately
      const self = this;
      this.$cards.each(function() {
        if (!$(this).is($currentTopCard)) {
          let oldRel = parseInt($(this).attr('data-index'));
          let newRel = (oldRel - 1 + self.totalCards) % self.totalCards;
          $(this).attr('data-index', newRel);
        }
      });

      // 4. After drop finishes, reset the dropped card to bottom of the stack
      setTimeout(() => {
        $currentTopCard.removeClass('dropping');
        $currentTopCard.attr('data-index', self.totalCards - 1);
        self.isAnimating = false;
      }, 480);
    }

    prev() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      // Card from the very back of the stack comes to top
      this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
      this.updateProjectInfo(this.currentIndex);

      // Find the card that will become top (data-index == totalCards - 1)
      const $incomingCard = this.$deck.find(`.stack-card[data-index="${this.totalCards - 1}"]`);

      // Prepare card slightly below to spring up
      $incomingCard.css({
        'transform': 'translateY(120%) scale(0.85) rotate(-10deg)',
        'opacity': 0,
        'z-index': 10
      });

      const self = this;
      // Shift all other cards back by 1 level
      this.$cards.each(function() {
        if (!$(this).is($incomingCard)) {
          let oldRel = parseInt($(this).attr('data-index'));
          let newRel = (oldRel + 1) % self.totalCards;
          $(this).attr('data-index', newRel);
        }
      });

      // Fly incoming card up onto the top of the stack
      setTimeout(() => {
        $incomingCard.removeAttr('style');
        $incomingCard.attr('data-index', 0);
        setTimeout(() => {
          self.isAnimating = false;
        }, 500);
      }, 50);
    }

    jumpTo(targetIdx) {
      this.currentIndex = targetIdx;
      this.updateCardIndices();
      this.updateProjectInfo(targetIdx);
    }

    bindControls() {
      const self = this;

      $('#stackNextBtn').on('click', function(e) {
        e.preventDefault();
        self.next();
      });

      $('#stackPrevBtn').on('click', function(e) {
        e.preventDefault();
        self.prev();
      });

      // Click on top card directly to advance
      this.$deck.on('click', '.stack-card[data-index="0"]', function() {
        self.next();
      });

      // Touch / Mouse Drag Swiping
      let startX = 0;
      let startY = 0;
      let isDragging = false;

      this.$deck.on('mousedown touchstart', function(e) {
        isDragging = true;
        const evt = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
        startX = evt.clientX;
        startY = evt.clientY;
      });

      $(document).on('mouseup touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        const evt = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
        const diffX = evt.clientX - startX;
        const diffY = evt.clientY - startY;

        // Vertical downward swipe or left swipe triggers drop
        if (diffY > 50 || diffX < -60) {
          self.next();
        } else if (diffY < -50 || diffX > 60) {
          self.prev();
        }
      });

      // Keyboard arrow keys when visible
      $(document).on('keydown', function(e) {
        const stackSection = document.getElementById('cardStackSection');
        if (!stackSection) return;
        const rect = stackSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            self.next();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            self.prev();
          }
        }
      });
    }
  }

  // Export & initialize
  window.StackingCardCarousel = StackingCardCarousel;
  $(document).ready(function() {
    window.cardStackApp = new StackingCardCarousel();
  });

})(jQuery);
