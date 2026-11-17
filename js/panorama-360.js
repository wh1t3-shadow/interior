/**
 * ==========================================================================
 * 360° INTERACTIVE PANORAMA ROOM & VIRTUAL TOUR ENGINE
 * Drag-to-Look, Hotspots, Day/Night Lighting Modes, and Inertial Damping
 * ==========================================================================
 */

(function($) {
  'use strict';

  class PanoramaViewer {
    constructor() {
      this.container = document.getElementById('panoramaContainer');
      this.canvas = document.getElementById('panoramaCanvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.isDragging = false;
      this.autoRotate = true;
      this.isNightMode = false;
      this.currentRoom = 'living';

      // Orientation (Euler Angles)
      this.yaw = 0; // horizontal angle 0 to 360
      this.pitch = 0; // vertical angle -45 to 45
      this.targetYaw = 0;
      this.targetPitch = 0;
      this.startX = 0;
      this.startY = 0;
      this.lastMouseX = 0;
      this.velocity = 0;

      // Hotspots data
      this.hotspots = [
        {
          id: 'marble',
          yaw: 28,
          pitch: -18,
          tag: 'মেটেরিয়াল স্পেসিফিকেশন',
          title: 'ইতালিয়ান স্ট্যাচুয়ারিও ক্যালাকাট্টা মার্বেল',
          desc: 'বুক-ম্যাচড প্রিমিয়াম ইতালিয়ান মার্বেল স্ল্যাব। সিএনসি ওয়াটার-জেট কাটিং ও ন্যানো-সিল্যান্ট প্রোটেকশন দ্বারা সুরক্ষিত।',
          specs: [
            { label: 'উৎপত্তি', val: 'কারারা, ইতালি' },
            { label: 'ফিনিশ', val: 'হোন্ড সাটিন সিল্ক' },
            { label: 'ওয়ারেন্টি', val: '২৫ বছর লাইফটাইম' }
          ]
        },
        {
          id: 'lighting',
          yaw: 12,
          pitch: 28,
          tag: 'আর্কিটেকচারাল লাইটিং',
          title: 'কাস্টম রৈখিক ব্রাশিং ব্রাস শ্যান্ডেলিয়ার',
          desc: 'স্বর্ণালী অ্যানোডাইজড ব্রাস ও হাই-সিআরআই (>৯৫) ডিমেবল স্মার্ট এলইডির সমন্বয়ে তৈরি কাস্টম সিলিং পেন্ড্যান্ট।',
          specs: [
            { label: 'কালার টেম্পারেচার', val: '২৭০০K ওয়ার্ম অ্যাম্বিয়েন্স' },
            { label: 'অটোমেশন', val: 'ডালি / লুট্রন স্মার্ট হোম কন্ট্রোল' },
            { label: 'এনার্জি রেটিং', val: 'A+++ গ্রিন সার্টিফায়েড' }
          ]
        },
        {
          id: 'woodwork',
          yaw: -45,
          pitch: 5,
          tag: 'অ্যাকোস্টিক ইন্টেরিয়র',
          title: 'ফ্লুটেড আমেরিকান ব্ল্যাক ভ্যালনাট প্যানেল',
          desc: 'শব্দ নিয়ন্ত্রণ ও নান্দনিকতার জন্য অ্যারোস্পেস গ্রেড অ্যাকোস্টিক ফেল্ট সাবস্ট্রেটের ওপর হ্যান্ড-ক্রাফটেড ভ্যালনাট ফিনিশ।',
          specs: [
            { label: 'কাঠের প্রজাতি', val: 'আমেরিকান ব্ল্যাক ভ্যালনাট' },
            { label: 'শব্দ শোষণ (NRC)', val: '০.৮৫ হাই পারফরম্যান্স' },
            { label: 'কোটিং', val: 'জিরো-VOC ম্যাট পলিউরেথেন' }
          ]
        },
        {
          id: 'glass',
          yaw: 75,
          pitch: 2,
          tag: 'এক্সটেরিয়র প্যানোরামা',
          title: 'ডাবল গ্লেজড আল্ট্রা-ক্লিয়ার উইন্ডো ওয়াল',
          desc: 'ইউভি ব্লকিং ও থার্মাল সাউন্ডপ্রুফ লো-ই গ্লাস। পুরো ঢাকা শহরের ৩৬০ ডিগ্রি স্কাইলাইন ভিউ উপভোগ করার নিশ্চয়তা।',
          specs: [
            { label: 'গ্লাস লেয়ার', val: '১২ মিমি + ১৬ মিমি আর্গন + ১২ মিমি' },
            { label: 'শব্দ নিরোধক', val: '৪২ ডিবি নয়েজ রিডাকশন' },
            { label: 'স্ট্রাকচার', val: 'থার্মালি ব্রোকেন অ্যালুমিনিয়াম' }
          ]
        }
      ];

      this.initCanvasSize();
      this.bindEvents();
      this.render();
    }

    initCanvasSize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    bindEvents() {
      const self = this;
      window.addEventListener('resize', () => {
        self.initCanvasSize();
      });

      // Mouse drag controls
      $(this.canvas).on('mousedown', function(e) {
        self.isDragging = true;
        self.autoRotate = false;
        self.startX = e.clientX;
        self.startY = e.clientY;
        self.lastMouseX = e.clientX;
      });

      $(window).on('mousemove', function(e) {
        if (!self.isDragging) return;
        const deltaX = e.clientX - self.startX;
        const deltaY = e.clientY - self.startY;

        self.targetYaw += deltaX * 0.15;
        self.targetPitch = Math.max(-40, Math.min(40, self.targetPitch - deltaY * 0.12));

        self.velocity = (e.clientX - self.lastMouseX) * 0.05;
        self.lastMouseX = e.clientX;
        self.startX = e.clientX;
        self.startY = e.clientY;
      });

      $(window).on('mouseup', function() {
        self.isDragging = false;
      });

      // Touch drag support
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          self.isDragging = true;
          self.autoRotate = false;
          self.startX = e.touches[0].clientX;
          self.startY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!self.isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - self.startX;
        const deltaY = e.touches[0].clientY - self.startY;

        self.targetYaw += deltaX * 0.18;
        self.targetPitch = Math.max(-40, Math.min(40, self.targetPitch - deltaY * 0.15));

        self.startX = e.touches[0].clientX;
        self.startY = e.touches[0].clientY;
      }, { passive: true });

      window.addEventListener('touchend', () => {
        self.isDragging = false;
      });

      // Auto-rotate button
      $('#panoAutoRotateBtn').on('click', function() {
        self.autoRotate = !self.autoRotate;
        $(this).toggleClass('active', self.autoRotate);
      });

      // Day / Night mode toggle
      $('#panoDayNightBtn').on('click', function() {
        self.isNightMode = !self.isNightMode;
        $(this).toggleClass('active', self.isNightMode);
        const icon = self.isNightMode ? '<i class="fas fa-sun"></i> ডে মোড' : '<i class="fas fa-moon"></i> নাইট মোড';
        $(this).html(icon);
      });

      // Fullscreen button
      $('#panoFullscreenBtn').on('click', function() {
        const elem = document.getElementById('panoramaWrapper');
        if (!document.fullscreenElement) {
          elem.requestFullscreen?.().catch(err => console.log(err));
        } else {
          document.exitFullscreen?.();
        }
      });

      // Room switcher thumbs
      $('.pano-room-thumb').on('click', function() {
        $('.pano-room-thumb').removeClass('active');
        $(this).addClass('active');
        self.currentRoom = $(this).data('room');
        self.targetYaw = 0;
        self.targetPitch = 0;
        self.hideHotspotCard();
      });

      // Hotspot close
      $('#panoCardClose').on('click', function() {
        self.hideHotspotCard();
      });

      // Click on canvas to detect hotspot click
      $(this.canvas).on('click', function(e) {
        const rect = self.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        self.checkHotspotClick(clickX, clickY);
      });
    }

    checkHotspotClick(clickX, clickY) {
      const activeHotspots = this.getProjectedHotspots();
      for (const spot of activeHotspots) {
        const dist = Math.hypot(clickX - spot.screenX, clickY - spot.screenY);
        if (dist <= 26) {
          this.showHotspotCard(spot.data);
          if (window.soundFX) window.soundFX.playClick();
          return;
        }
      }
    }

    showHotspotCard(data) {
      $('#panoCardTag').text(data.tag);
      $('#panoCardTitle').text(data.title);
      $('#panoCardDesc').text(data.desc);
      
      const $specs = $('#panoSpecsList');
      $specs.empty();
      data.specs.forEach(s => {
        $specs.append(`
          <div class="pano-specs-row">
            <span>${s.label}:</span>
            <span>${s.val}</span>
          </div>
        `);
      });

      $('#panoHotspotCard').addClass('show');
    }

    hideHotspotCard() {
      $('#panoHotspotCard').removeClass('show');
    }

    getProjectedHotspots() {
      const w = this.width;
      const h = this.height;
      const results = [];

      this.hotspots.forEach(spot => {
        // Compute relative angle
        let diffYaw = (spot.yaw - (this.yaw % 360) + 540) % 360 - 180;
        let diffPitch = spot.pitch - this.pitch;

        // If within field of view (+- 50 deg horiz, +- 35 deg vert)
        if (Math.abs(diffYaw) < 55 && Math.abs(diffPitch) < 38) {
          const fov = 110;
          const screenX = w / 2 + (diffYaw / fov) * w;
          const screenY = h / 2 - (diffPitch / (fov * 0.65)) * h;

          results.push({
            screenX,
            screenY,
            data: spot
          });
        }
      });

      return results;
    }

    render() {
      // Auto rotation when idle
      if (this.autoRotate && !this.isDragging) {
        this.targetYaw += 0.22;
      }

      // Inertial damping
      this.yaw += (this.targetYaw - this.yaw) * 0.1;
      this.pitch += (this.targetPitch - this.pitch) * 0.1;

      this.drawPanoramaScene();
      this.drawHotspots();

      requestAnimationFrame(() => this.render());
    }

    drawPanoramaScene() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // Virtual 360 Cylindrical Interior Room Projection
      const yawNorm = ((this.yaw % 360) + 360) % 360;
      const pitchOffset = this.pitch * 3.5;

      // 1. Room Horizon & Sky/Walls
      const isNight = this.isNightMode;
      const ceilingGrad = ctx.createLinearGradient(0, 0, 0, h/2 + pitchOffset);
      if (!isNight) {
        ceilingGrad.addColorStop(0, '#121721');
        ceilingGrad.addColorStop(0.7, '#1b2230');
        ceilingGrad.addColorStop(1, '#2c3647');
      } else {
        ceilingGrad.addColorStop(0, '#070a0e');
        ceilingGrad.addColorStop(0.7, '#0d1117');
        ceilingGrad.addColorStop(1, '#161c24');
      }
      ctx.fillStyle = ceilingGrad;
      ctx.fillRect(0, 0, w, h/2 + pitchOffset);

      // 2. Italian Luxury Floor
      const floorGrad = ctx.createLinearGradient(0, h/2 + pitchOffset, 0, h);
      if (!isNight) {
        floorGrad.addColorStop(0, '#352b22');
        floorGrad.addColorStop(0.3, '#5c4d3d');
        floorGrad.addColorStop(1, '#241d16');
      } else {
        floorGrad.addColorStop(0, '#1a1410');
        floorGrad.addColorStop(0.4, '#2e231b');
        floorGrad.addColorStop(1, '#0e0b08');
      }
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, h/2 + pitchOffset, w, h - (h/2 + pitchOffset));

      // Floor plank / marble grid lines shifting with yaw
      ctx.save();
      ctx.strokeStyle = isNight ? 'rgba(201, 168, 106, 0.1)' : 'rgba(201, 168, 106, 0.2)';
      ctx.lineWidth = 1;
      const floorOriginY = h/2 + pitchOffset;
      const shiftX = (this.yaw * 8) % 80;

      for (let x = -80 + shiftX; x < w + 80; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, floorOriginY);
        ctx.lineTo(w/2 + (x - w/2) * 2.2, h);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Panoramic Windows & Architectural Columns
      this.drawPanoramicArchitecture(ctx, w, h, yawNorm, pitchOffset, isNight);

      // 4. Interior Luxury Furniture (Designer Lounge, Coffee Table, Artwork)
      this.drawInteriorFurniture(ctx, w, h, yawNorm, pitchOffset, isNight);

      // 5. Ambient Lighting Glow & Vignette
      this.drawLightingEffects(ctx, w, h, isNight);
    }

    drawPanoramicArchitecture(ctx, w, h, yaw, pitchOffset, isNight) {
      const horizonY = h/2 + pitchOffset;
      
      // Repeating architectural bays every 90 degrees around 360 circle
      for (let bay = 0; bay < 4; bay++) {
        const bayYaw = bay * 90;
        let diffYaw = (bayYaw - yaw + 540) % 360 - 180;

        if (Math.abs(diffYaw) < 90) {
          const bayCenterX = w/2 + (diffYaw / 90) * (w * 0.65);
          const bayW = w * 0.45;

          // Grand Window View (Skyline outside)
          if (bay === 1) {
            // City Skyline Window
            const winLeft = bayCenterX - bayW/2;
            const winTop = horizonY - 180;
            const winHeight = 260;

            ctx.save();
            ctx.beginPath();
            ctx.rect(winLeft, winTop, bayW, winHeight);
            ctx.clip();

            // Outdoor Sky
            const skyGrad = ctx.createLinearGradient(0, winTop, 0, winTop + winHeight);
            if (!isNight) {
              skyGrad.addColorStop(0, '#f97316');
              skyGrad.addColorStop(0.4, '#fbbf24');
              skyGrad.addColorStop(1, '#0284c7');
            } else {
              skyGrad.addColorStop(0, '#020617');
              skyGrad.addColorStop(0.5, '#0f172a');
              skyGrad.addColorStop(1, '#1e1b4b');
            }
            ctx.fillStyle = skyGrad;
            ctx.fillRect(winLeft, winTop, bayW, winHeight);

            // Distant Skyline Silhouettes
            ctx.fillStyle = isNight ? '#0b0f19' : '#1e293b';
            for (let b = 0; b < 10; b++) {
              const bX = winLeft + b * 32;
              const bH = 50 + (b % 4) * 25;
              ctx.fillRect(bX, winTop + winHeight - bH, 26, bH);
              
              if (isNight) {
                // Skyscraper night window lights
                ctx.fillStyle = '#fef08a';
                for (let wy = winTop + winHeight - bH + 6; wy < winTop + winHeight - 6; wy += 8) {
                  ctx.fillRect(bX + 5, wy, 3, 3);
                  ctx.fillRect(bX + 15, wy, 3, 3);
                }
                ctx.fillStyle = '#0b0f19';
              }
            }
            ctx.restore();

            // Window Black Mullion Frame
            ctx.strokeStyle = '#0f1319';
            ctx.lineWidth = 4;
            ctx.strokeRect(winLeft, winTop, bayW, winHeight);
          } else {
            // Luxury Walnut & Marble Wall Panel
            ctx.fillStyle = isNight ? '#141821' : '#1e2533';
            ctx.fillRect(bayCenterX - bayW/2, horizonY - 190, bayW, 280);

            // Fluted vertical wooden slats
            ctx.strokeStyle = 'rgba(201, 168, 106, 0.25)';
            ctx.lineWidth = 2;
            for (let sx = bayCenterX - bayW/2 + 10; sx < bayCenterX + bayW/2; sx += 18) {
              ctx.beginPath();
              ctx.moveTo(sx, horizonY - 190);
              ctx.lineTo(sx, horizonY + 90);
              ctx.stroke();
            }
          }

          // Architectural Pillar Divider between bays
          ctx.fillStyle = '#0c0f14';
          ctx.fillRect(bayCenterX - bayW/2 - 12, horizonY - 210, 24, 320);
          ctx.strokeStyle = 'rgba(201, 168, 106, 0.6)';
          ctx.lineWidth = 1;
          ctx.strokeRect(bayCenterX - bayW/2 - 12, horizonY - 210, 24, 320);
        }
      }
    }

    drawInteriorFurniture(ctx, w, h, yaw, pitchOffset, isNight) {
      const horizonY = h/2 + pitchOffset;

      // Sectional Luxury Sofa facing yaw = 0
      let diffYaw = (0 - yaw + 540) % 360 - 180;
      if (Math.abs(diffYaw) < 70) {
        const sofaX = w/2 + (diffYaw / 70) * (w * 0.45);
        const sofaY = horizonY + 70;

        ctx.save();
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(sofaX, sofaY + 70, 160, 25, 0, 0, Math.PI*2);
        ctx.fill();

        // Leather Sofa Body
        ctx.fillStyle = isNight ? '#2a313d' : '#3d4756';
        ctx.beginPath();
        ctx.roundRect(sofaX - 140, sofaY, 280, 65, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(201, 168, 106, 0.4)';
        ctx.stroke();

        // Cushions
        ctx.fillStyle = '#c9a86a';
        ctx.beginPath();
        ctx.roundRect(sofaX - 110, sofaY - 20, 70, 35, 8);
        ctx.roundRect(sofaX + 40, sofaY - 20, 70, 35, 8);
        ctx.fill();

        // Calacatta Marble Coffee Table in front
        const tableY = sofaY + 45;
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(sofaX - 70, tableY, 140, 30, 8);
        ctx.fill();
        ctx.strokeStyle = '#c9a86a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Marble veins on table
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sofaX - 50, tableY + 8);
        ctx.lineTo(sofaX + 30, tableY + 22);
        ctx.stroke();
        ctx.restore();
      }

      // Linear Chandelier on ceiling
      let diffLightYaw = (10 - yaw + 540) % 360 - 180;
      if (Math.abs(diffLightYaw) < 60) {
        const lightX = w/2 + (diffLightYaw / 60) * (w * 0.4);
        const lightY = horizonY - 140;

        ctx.save();
        // Brass Rod
        ctx.strokeStyle = '#c9a86a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lightX, 0);
        ctx.lineTo(lightX, lightY);
        ctx.stroke();

        // Horizontal Bar
        ctx.beginPath();
        ctx.moveTo(lightX - 80, lightY);
        ctx.lineTo(lightX + 80, lightY);
        ctx.stroke();

        // Glowing bulbs
        ctx.fillStyle = isNight ? '#ffeedd' : '#ffffff';
        ctx.shadowColor = '#fcd34d';
        ctx.shadowBlur = isNight ? 28 : 14;

        for (let bx = lightX - 70; bx <= lightX + 70; bx += 35) {
          ctx.beginPath();
          ctx.arc(bx, lightY + 5, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    drawLightingEffects(ctx, w, h, isNight) {
      // Warm Radial ambient vignette
      const radGrad = ctx.createRadialGradient(w/2, h/2, w * 0.2, w/2, h/2, w * 0.7);
      radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radGrad.addColorStop(1, isNight ? 'rgba(5, 7, 10, 0.75)' : 'rgba(5, 7, 10, 0.45)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);
    }

    drawHotspots() {
      const activeHotspots = this.getProjectedHotspots();
      const ctx = this.ctx;
      const time = Date.now() * 0.003;

      activeHotspots.forEach(spot => {
        const x = spot.screenX;
        const y = spot.screenY;

        ctx.save();
        // Pulsing outer ripple
        const pulse = (Math.sin(time * 3) + 1) / 2;
        ctx.strokeStyle = `rgba(201, 168, 106, ${0.8 - pulse * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 14 + pulse * 12, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid badge
        ctx.fillStyle = 'rgba(8, 10, 14, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#c9a86a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Plus icon / Dot in center
        ctx.fillStyle = '#c9a86a';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Tooltip pill next to hotspot
        ctx.fillStyle = 'rgba(8, 10, 14, 0.85)';
        ctx.strokeStyle = 'rgba(201, 168, 106, 0.5)';
        ctx.lineWidth = 1;
        const text = spot.data.title;
        ctx.font = '600 11px var(--font-sans)';
        const textWidth = ctx.measureText(text).width;

        ctx.beginPath();
        ctx.roundRect(x + 18, y - 12, textWidth + 18, 24, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(text, x + 27, y + 4);
        ctx.restore();
      });
    }
  }

  // Export & initialize
  window.PanoramaViewer = PanoramaViewer;
  $(document).ready(function() {
    window.panoramaApp = new PanoramaViewer();
  });

})(jQuery);
