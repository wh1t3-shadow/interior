/**
 * ==========================================================================
 * 3D ROTATING EARTH GLOBE & HERO 3D ARCHITECTURAL VISUALIZER
 * Holographic Earth with Global Construction Nodes & Hero 3D Skyscraper
 * ==========================================================================
 */

(function($) {
  'use strict';

  // 1. Interactive 3D Rotating Earth Globe
  class InteractiveGlobe {
    constructor() {
      this.canvas = document.getElementById('earthGlobeCanvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.rotation = 0;
      this.tilt = 0.28; // Earth axial tilt ~23.5 deg
      this.isDragging = false;
      this.startX = 0;
      this.dragSpeed = 0.005;
      this.autoSpeed = 0.007;

      // Global Project Hubs (Longitude, Latitude)
      this.nodes = [
        { name: "ঢাকা হেডকোয়ার্টার্স", lat: 23.81, lon: 90.41, projects: "৩৫+ মেগা প্রজেক্ট" },
        { name: "দুবাই রিজিওনাল ব্রাঞ্চ", lat: 25.20, lon: 55.27, projects: "১২টি স্কাই ভিলা" },
        { name: "সিঙ্গাপুর ইনোভেশন হাব", lat: 1.35, lon: 103.81, projects: "গ্রিন আর্কিটেকচার" },
        { name: "লন্ডন ডিজাইন স্টুডিও", lat: 51.50, lon: -0.12, projects: "লাক্সারি ইন্টেরিয়র" },
        { name: "নিউইয়র্ক পার্টনারশিপ", lat: 40.71, lon: -74.00, projects: "হাই-রাইজ টাওয়ার" }
      ];

      this.initSize();
      this.bindEvents();
      this.render();
    }

    initSize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    bindEvents() {
      window.addEventListener('resize', () => this.initSize());

      $(this.canvas).on('mousedown touchstart', (e) => {
        this.isDragging = true;
        const evt = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
        this.startX = evt.clientX;
      });

      $(window).on('mousemove touchmove', (e) => {
        if (!this.isDragging) return;
        const evt = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
        const deltaX = evt.clientX - this.startX;
        this.rotation += deltaX * this.dragSpeed;
        this.startX = evt.clientX;
      });

      $(window).on('mouseup touchend', () => {
        this.isDragging = false;
      });
    }

    render() {
      if (!this.isDragging) {
        this.rotation += this.autoSpeed;
      }

      this.drawGlobe();
      requestAnimationFrame(() => this.render());
    }

    drawGlobe() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const radius = Math.min(w, h) * 0.38;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.clearRect(0, 0, w, h);

      // Deep Space background glow
      const spaceGlow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 1.5);
      spaceGlow.addColorStop(0, 'rgba(201, 168, 106, 0.08)');
      spaceGlow.addColorStop(0.6, 'rgba(0, 210, 255, 0.04)');
      spaceGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = spaceGlow;
      ctx.fillRect(0, 0, w, h);

      // Orbital Rings (Holographic Gyro Rings)
      this.drawOrbitalRings(ctx, cx, cy, radius);

      // Globe sphere gradient
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Atmospheric gradient
      const globeGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      globeGrad.addColorStop(0, '#151d29');
      globeGrad.addColorStop(0.7, '#0b1017');
      globeGrad.addColorStop(1, '#05070a');
      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Latitude lines (parallels)
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 20) {
        const phi = (lat * Math.PI) / 180;
        const latY = cy + radius * Math.sin(phi);
        const latR = radius * Math.cos(phi);

        ctx.beginPath();
        ctx.ellipse(cx, latY, latR, latR * Math.sin(this.tilt), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines (meridians)
      for (let lon = 0; lon < 360; lon += 30) {
        const theta = ((lon * Math.PI) / 180) + this.rotation;
        const xOffset = Math.sin(theta) * radius;
        const isFront = Math.cos(theta) > 0;

        ctx.strokeStyle = isFront ? 'rgba(201, 168, 106, 0.22)' : 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.ellipse(cx + xOffset * 0.5, cy, Math.abs(xOffset) * 0.5, radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Continents / Dot Matrix points simulation
      this.drawDotMatrixContinents(ctx, cx, cy, radius);

      // Render Project Node Hotspots on Globe
      this.drawNodes(ctx, cx, cy, radius);

      ctx.restore();

      // Glowing outer rim atmosphere
      ctx.save();
      ctx.strokeStyle = 'rgba(201, 168, 106, 0.85)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#c9a86a';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    drawOrbitalRings(ctx, cx, cy, radius) {
      const time = Date.now() * 0.001;
      ctx.save();
      ctx.strokeStyle = 'rgba(201, 168, 106, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 12]);

      // Outer inclined ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.35, radius * 0.45, Math.PI / 6 + Math.sin(time*0.5)*0.1, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite node moving along ring
      const ringAngle = time * 0.8;
      const satX = cx + Math.cos(ringAngle) * (radius * 1.35);
      const satY = cy + Math.sin(ringAngle) * (radius * 0.45);
      
      ctx.fillStyle = '#00d2ff';
      ctx.shadowColor = '#00d2ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawDotMatrixContinents(ctx, cx, cy, radius) {
      ctx.fillStyle = 'rgba(201, 168, 106, 0.45)';
      // Synthetic landmass point grid
      for (let lat = -50; lat <= 60; lat += 8) {
        const phi = (lat * Math.PI) / 180;
        const cosPhi = Math.cos(phi);
        const y = cy - radius * Math.sin(phi);

        for (let lon = 0; lon < 360; lon += 12) {
          // Simple pseudo landmass mask
          const isLand = Math.sin((lon + 40) * 0.05) * Math.cos(lat * 0.06) > -0.15;
          if (!isLand) continue;

          const theta = ((lon * Math.PI) / 180) + this.rotation;
          const z = Math.cos(theta);
          if (z < 0) continue; // back side of globe

          const x = cx + radius * Math.sin(theta) * cosPhi;
          const dotSize = 1.2 * z;

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    drawNodes(ctx, cx, cy, radius) {
      const time = Date.now() * 0.003;

      this.nodes.forEach(node => {
        const phi = (node.lat * Math.PI) / 180;
        const theta = ((node.lon * Math.PI) / 180) + this.rotation;

        const cosPhi = Math.cos(phi);
        const z = Math.cos(theta);

        // Only draw when visible on front hemisphere
        if (z > 0.05) {
          const x = cx + radius * Math.sin(theta) * cosPhi;
          const y = cy - radius * Math.sin(phi);

          // Pulsing signal waves
          const pulse = (Math.sin(time * 4) + 1) / 2;
          ctx.strokeStyle = `rgba(201, 168, 106, ${0.8 - pulse * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, 5 + pulse * 14, 0, Math.PI * 2);
          ctx.stroke();

          // Central glowing pinpoint
          ctx.fillStyle = '#ffeedd';
          ctx.shadowColor = '#c9a86a';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // City badge
          ctx.fillStyle = 'rgba(8, 10, 14, 0.85)';
          ctx.strokeStyle = 'rgba(201, 168, 106, 0.6)';
          ctx.lineWidth = 1;
          const txt = node.name;
          ctx.font = '600 10px var(--font-sans)';
          const tW = ctx.measureText(txt).width;

          ctx.beginPath();
          ctx.roundRect(x + 8, y - 9, tW + 12, 18, 9);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText(txt, x + 14, y + 3);
        }
      });
    }
  }

  // 2. Hero 3D Architectural Skyscraper Wireframe Visualizer
  class Hero3DVisualizer {
    constructor() {
      this.canvas = document.getElementById('heroCanvas3D');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.angleY = 0;
      this.angleX = 0.2;
      this.mouseX = 0;
      this.mouseY = 0;

      this.initSize();
      this.bindEvents();
      this.render();
    }

    initSize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    bindEvents() {
      window.addEventListener('resize', () => this.initSize());

      // Mouse interactive tilt
      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) - 0.5;
        const ny = (e.clientY / window.innerHeight) - 0.5;
        this.mouseX = nx;
        this.mouseY = ny;
      });
    }

    render() {
      // Gentle auto-rotation combined with mouse parallax
      this.angleY += 0.008;
      const targetAngleX = 0.25 + this.mouseY * 0.3;
      this.angleX += (targetAngleX - this.angleX) * 0.05;

      this.drawTower();
      requestAnimationFrame(() => this.render());
    }

    drawTower() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const cx = w * 0.5;
      const cy = h * 0.58;

      ctx.clearRect(0, 0, w, h);

      // Deep architectural space background
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.7);
      bgGrad.addColorStop(0, '#101622');
      bgGrad.addColorStop(1, '#070a0e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Ground circular target grid
      ctx.save();
      ctx.strokeStyle = 'rgba(201, 168, 106, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 40; r <= 180; r += 35) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + 120, r, r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Skyscraper 3D Vertices (Parametric twisting tower)
      const floors = 22;
      const floorH = 14;
      const baseRadius = 85;

      const time = Date.now() * 0.002;

      for (let f = 0; f < floors; f++) {
        const fY = cy + 110 - f * floorH;
        // Subtle twisting ratio per floor
        const twist = this.angleY + f * 0.04;
        const radius = baseRadius * (1 - (f / floors) * 0.42);

        // 4 corners of floor plate
        const corners = [];
        for (let c = 0; c < 4; c++) {
          const cornerAngle = twist + (c * Math.PI) / 2;
          const px = cx + Math.cos(cornerAngle) * radius;
          const py = fY + Math.sin(cornerAngle) * (radius * 0.35);
          corners.push({ x: px, y: py });
        }

        // Draw floor plate slab
        ctx.save();
        ctx.fillStyle = f === floors - 1 ? 'rgba(201, 168, 106, 0.8)' : 'rgba(15, 23, 35, 0.85)';
        ctx.strokeStyle = f % 3 === 0 ? '#c9a86a' : 'rgba(201, 168, 106, 0.3)';
        ctx.lineWidth = f % 3 === 0 ? 1.5 : 0.8;

        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Facade vertical glass ribs connecting to floor above
        if (f < floors - 1) {
          const nextTwist = this.angleY + (f + 1) * 0.04;
          const nextRadius = baseRadius * (1 - ((f + 1) / floors) * 0.42);
          const nextY = cy + 110 - (f + 1) * floorH;

          ctx.strokeStyle = 'rgba(0, 210, 255, 0.35)';
          ctx.lineWidth = 1;
          for (let c = 0; c < 4; c++) {
            const nextAngle = nextTwist + (c * Math.PI) / 2;
            const nx = cx + Math.cos(nextAngle) * nextRadius;
            const ny = nextY + Math.sin(nextAngle) * (nextRadius * 0.35);

            ctx.beginPath();
            ctx.moveTo(corners[c].x, corners[c].y);
            ctx.lineTo(nx, ny);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // Vertical Laser Scan Beam sweeping
      const scanY = cy + 110 - ((Math.sin(time) + 1) / 2) * (floors * floorH);
      ctx.save();
      ctx.strokeStyle = '#00d2ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00d2ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(cx - 120, scanY);
      ctx.lineTo(cx + 120, scanY);
      ctx.stroke();

      // Scan HUD label
      ctx.fillStyle = '#00d2ff';
      ctx.font = '600 10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`3D REALTIME BIM SCAN: L${Math.floor(((cy + 110 - scanY)/(floors * floorH)) * floors)}`, cx + 130, scanY - 4);
      ctx.restore();
    }
  }

  // Export & Initialize
  window.InteractiveGlobe = InteractiveGlobe;
  window.Hero3DVisualizer = Hero3DVisualizer;

  $(document).ready(function() {
    window.globeApp = new InteractiveGlobe();
    window.hero3DApp = new Hero3DVisualizer();
  });

})(jQuery);
