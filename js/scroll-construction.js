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
          title: "Walkthrough 01: Sobha Privy Collection — Ultra-Luxury Sky Penthouse",
          desc: "Double-height architectural volume, bespoke Italian bookmatched marble, and floor-to-ceiling panoramic ocean vistas.",
          duration: "00:12 min",
          src: "assets/videos/sobha-teaser.mp4",
          poster: "assets/videos/sobha-poster.jpg"
        },
        {
          id: 1,
          title: "Scan 02: Mega High-Rise Concrete Superstructure & Crane Scan",
          desc: "Full multi-story reinforced concrete core, tower crane maneuvering, and 360-degree perimeter structural inspection.",
          duration: "00:35 min",
          src: "assets/videos/construction-drone-scan.mp4",
          poster: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85"
        },
        {
          id: 2,
          title: "Scan 03: Ultra-Luxury Architectural Villa & Private Swimming Pool",
          desc: "Modern cantilevered estate, travertine pool deck, outdoor fire pit, and bespoke landscaped perimeter gardens.",
          duration: "00:17 min",
          src: "assets/videos/villa-pool-scan.mp4",
          poster: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=85"
        },
        {
          id: 3,
          title: "Scan 04: Skyscraper Tower Construction & Structural Facade Timelapse",
          desc: "Rapid vertical floor progression, curtain wall installation, and structural engineering in an urban metropolis.",
          duration: "00:10 min",
          src: "assets/videos/skyscraper-construction.mp4",
          poster: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85"
        },
        {
          id: 4,
          title: "Scan 05: Rooftop Sky Lounge & Infinity Pool Aerial Elevation",
          desc: "Crystal blue elevated rooftop pool, private cabanas, and panoramic city skyline views captured via high-definition drone.",
          duration: "00:15 min",
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
      this.$videoBadge.text(`Video ${index + 1} / ${this.videos.length}`);

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
