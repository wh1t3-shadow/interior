/**
 * ==========================================================================
 * AURA ARCHITECTS - CINEMATIC AUTOPLAY INTERIOR VIDEO WALKTHROUGHS
 * Autoplaying Real Interior Videos with Room Switchers & Playback Controls
 * ==========================================================================
 */

(function($) {
  'use strict';

  class CinematicVideoWalkthrough {
    constructor() {
      this.$video = $('#interiorWalkthroughVideo');
      this.$videoTitle = $('#videoStatusTitle');
      this.$videoDesc = $('#videoStatusDesc');
      this.$videoBadge = $('#videoStepCounter');
      this.$playBtn = $('#videoPlayPauseBtn');
      this.$muteBtn = $('#videoMuteToggleBtn');
      this.$progressBar = $('#videoTimelineProgress');

      this.currentVideoIdx = 0;

      // Sobha Privy Collection, Mega Construction, Building Orbit, Rooftop & Swimming Pool Drone Videos
      this.videos = [
        {
          id: 0,
          title: "ওয়াকথ্রু ০১: শোভা প্রিভি কালেকশন — আল্ট্রা-লাক্সারি স্কাই পেন্টহাউস",
          desc: "ডাবল-হাইট সিলিং, গ্র্যান্ড মার্বেল ডাইনিং এবং মেঝে থেকে ছাদ পর্যন্ত প্যানোরামিক ওশান ভিউ সম্বলিত সিগনেচার স্পেস।",
          duration: "০০:১২ মিনিট",
          src: "assets/videos/sobha-teaser.mp4",
          poster: "assets/videos/sobha-poster.jpg"
        },
        {
          id: 1,
          title: "স্ক্যান ০২: মেগা বিল্ডিং কনস্ট্রাকশন ও সুপার-স্ট্রাকচার ড্রোন স্ক্যান",
          desc: "সম্পূর্ণ মাল্টি-স্টোরি বিল্ডিং কনস্ট্রাকশন সাইট, স্টিল ফ্রেম স্ট্রাকচার, মেগা ক্রেন ও চারপাশের ৩৬০ ডিগ্রি এরিয়াল ড্রোন স্ক্যান।",
          duration: "০০:৩৫ মিনিট",
          src: "assets/videos/construction-drone-scan.mp4",
          poster: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1400&q=85"
        },
        {
          id: 2,
          title: "স্ক্যান ০৩: আল্ট্রা-লাক্সারি ভিলা, রুফটপ ও আউটডোর সুইমিং পুল",
          desc: "মডার্ন আর্কিটেকচারাল ভিলা, ব্যক্তিগত সুইমিং পুল, টেরেস ও সুসজ্জিত গার্ডেন প্যান্ডেল সহ সম্পূর্ণ এক্সটেরিয়র স্ক্যান।",
          duration: "০০:১৭ মিনিট",
          src: "assets/videos/villa-pool-scan.mp4",
          poster: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=85"
        },
        {
          id: 3,
          title: "স্ক্যান ০৪: হাই-রাইজ স্কাইস্ক্র্যাপার টাওয়ার নির্মাণ টাইম-ল্যাপ্স",
          desc: "আকাশচুম্বী মেগা টাওয়ারের ফ্লোর নির্মাণ, ক্রেন অপারেশন এবং চারপাশের আধুনিক সিটি আর্কিটেকচার ওভারভিউ।",
          duration: "০০:১০ মিনিট",
          src: "assets/videos/skyscraper-construction.mp4",
          poster: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85"
        },
        {
          id: 4,
          title: "স্ক্যান ০৫: রুফটপ লাউঞ্জ ও সুইমিং পুল এরিয়াল ভিউ",
          desc: "ক্রিস্টাল ব্লু রুফটপ পুল, লাউঞ্জ সানবেড এবং রিভার্স আর্কিটেকচারাল ভিউ-এর ওপর থেকে ৩৬০ ডিগ্রি এরিয়াল শট।",
          duration: "০০:১৫ মিনিট",
          src: "assets/videos/pool-aerial-scan.mp4",
          poster: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85"
        }
      ];

      this.bindEvents();
      this.switchVideo(0);
    }

    switchVideo(index) {
      const vid = this.videos[index];
      if (!vid) return;

      this.currentVideoIdx = index;
      const videoElem = this.$video[0];

      // Update text info
      this.$videoTitle.text(vid.title);
      this.$videoDesc.text(vid.desc);
      this.$videoBadge.text(`ভিডিও ${index + 1} / ${this.videos.length}`);

      // Update active milestone tab
      $('.real-step-card').removeClass('active');
      $(`.real-step-card[data-stage="${index}"]`).addClass('active');

      // Update video source & poster
      if (videoElem) {
        videoElem.muted = true;
        videoElem.defaultMuted = true;
        videoElem.playsInline = true;
        this.$video.attr('poster', vid.poster);
        this.$video.find('source').attr('src', vid.src);
        videoElem.src = vid.src;
        videoElem.load();
        const playPromise = videoElem.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }

      $('#seqPosterFallback').css('background-image', `url(${vid.poster})`);

      if (window.soundFX) window.soundFX.playClick();
    }

    bindEvents() {
      const self = this;
      const videoElem = this.$video[0];

      // Tab switcher clicks
      $('.real-step-card').on('click', function() {
        const idx = parseInt($(this).data('stage'));
        self.switchVideo(idx);
      });

      // Click on video directly to toggle play/pause smoothly
      this.$video.on('click', function() {
        if (!videoElem) return;
        if (videoElem.paused) videoElem.play();
        else videoElem.pause();
      });

      // Progress bar updates
      if (videoElem) {
        videoElem.addEventListener('timeupdate', () => {
          if (videoElem.duration) {
            const percent = (videoElem.currentTime / videoElem.duration) * 100;
            self.$progressBar.css('width', `${percent}%`);
          }
        });

        videoElem.addEventListener('ended', () => {
          // Auto advance to next room walkthrough
          const nextIdx = (self.currentVideoIdx + 1) % self.videos.length;
          self.switchVideo(nextIdx);
        });

        // Autoplay when scrolled into viewport
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                videoElem.muted = true;
                videoElem.play().catch(() => {});
              }
            });
          }, { threshold: 0.25 });
          observer.observe(videoElem);
        }
      }
    }
  }

  window.CinematicVideoWalkthrough = CinematicVideoWalkthrough;
  $(document).ready(function() {
    window.videoWalkthroughApp = new CinematicVideoWalkthrough();
  });

})(jQuery);
