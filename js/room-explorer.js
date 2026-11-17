/**
 * ==========================================================================
 * AURA ARCHITECTS - IN-STAGE ROOM FLY-IN & INTERIOR GLIDE EXPLORER
 * Click a hotspot to fly through the window directly into the room!
 * NO generic popup modal - full in-place spatial architectural navigation!
 * ==========================================================================
 */

(function($) {
  'use strict';

  class RoomExplorer {
    constructor() {
      this.$stage = $('#buildingStageWrapper');
      this.$exterior = $('#buildingExteriorView');
      this.$interior = $('#roomInteriorView');
      this.$interiorImg = $('#roomInteriorImg');
      this.$interiorTitle = $('#interiorTitleBadge');
      this.$interiorSubtitle = $('#interiorSubtitleBadge');
      this.$interiorSpecs = $('#interiorSpecsRow');
      this.$interiorHotspots = $('#interiorHotspotsLayer');

      this.currentRoom = null;
      this.isInside = false;

      // Real 3D Interior Rooms Database with Hotspots & Specs
      this.rooms = {
        drawing: {
          id: 'drawing',
          name: 'Grand Drawing & Formal Living Lounge',
          category: 'Ground Level / Primary Entertaining',
          image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '38%', y: '52%' },
          specs: [
            { label: 'Area', val: '1,250 Sq.Ft' },
            { label: 'Ceiling Height', val: '13.5 Feet' },
            { label: 'Flooring', val: 'Italian Calacatta Marble' },
            { label: 'Lighting', val: 'DALI Smart Dimmable' }
          ],
          features: [
            { top: '65%', left: '42%', text: 'Bookmatched Calacatta Marble' },
            { top: '48%', left: '26%', text: 'Custom Modular Italian Leather Lounge' },
            { top: '24%', left: '55%', text: 'Architectural Brushed Brass Pendants' }
          ]
        },
        dining: {
          id: 'dining',
          name: 'Grand Banquet Dining Hall',
          category: 'First Level / Dining Zone',
          image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '68%', y: '62%' },
          specs: [
            { label: 'Area', val: '850 Sq.Ft' },
            { label: 'Capacity', val: '10-Seater Dining' },
            { label: 'Tabletop', val: 'Solid American Walnut' },
            { label: 'Orientation', val: 'Garden Terrace Facing' }
          ],
          features: [
            { top: '62%', left: '50%', text: 'Solid American Walnut Table' },
            { top: '28%', left: '52%', text: 'Brushed Brass Chandelier' },
            { top: '44%', left: '80%', text: 'Backlit Climate-Controlled Wine Cellar' }
          ]
        },
        bedroom: {
          id: 'bedroom',
          name: 'Master Suite Penthouse Bedroom',
          category: 'Top Floor / Private Sanctuary',
          image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '62%', y: '32%' },
          specs: [
            { label: 'Area', val: '950 Sq.Ft' },
            { label: 'Flooring', val: 'American White Oak Hardwood' },
            { label: 'Balcony', val: 'Private Skyline Terrace' },
            { label: 'Acoustics', val: 'Sound-Isolated Double Envelope' }
          ],
          features: [
            { top: '60%', left: '48%', text: 'King-Size Upholstered Platform Bed' },
            { top: '35%', left: '78%', text: 'Floor-to-Ceiling Skyline Glazing' },
            { top: '45%', left: '20%', text: 'Handcrafted Fluted Acoustic Headboard' }
          ]
        },
        kitchen: {
          id: 'kitchen',
          name: 'Modern Open Chef Kitchen & Island',
          category: 'Ground Level / Culinary Studio',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '22%', y: '72%' },
          specs: [
            { label: 'Area', val: '650 Sq.Ft' },
            { label: 'Countertop', val: 'Calacatta Silestone Quartz' },
            { label: 'Cabinetry', val: 'German Soft-Close Matte Lacquer' },
            { label: 'Appliances', val: 'Miele Integrated Hidden Panels' }
          ],
          features: [
            { top: '62%', left: '46%', text: 'Waterfall Quartz Central Island' },
            { top: '38%', left: '25%', text: 'Smart Handleless Cabinetry' },
            { top: '42%', left: '75%', text: 'Integrated Induction Hob & Steam Oven' }
          ]
        },
        rooftop: {
          id: 'rooftop',
          name: 'Rooftop Infinity Lounge & Sky Deck',
          category: 'Rooftop Level / Open Sky Terrace',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '45%', y: '18%' },
          specs: [
            { label: 'Area', val: '2,200 Sq.Ft' },
            { label: 'Pool', val: 'Heated Infinity Edge Pool' },
            { label: 'Decking', val: 'Weatherproof Teak Hardwood' },
            { label: 'Panoramas', val: '360° Unobstructed Skyline' }
          ],
          features: [
            { top: '70%', left: '38%', text: 'Cantilevered Infinity Pool' },
            { top: '55%', left: '72%', text: 'Sunken Lounge Firepit' },
            { top: '30%', left: '48%', text: 'Biophilic Sunset Sky Garden' }
          ]
        }
      };

      this.bindEvents();
    }

    flyIntoRoom(roomId) {
      const room = this.rooms[roomId];
      if (!room) return;

      const self = this;
      this.currentRoom = roomId;

      // Update pills
      $('.room-pill-btn').removeClass('active');
      $(`.room-pill-btn[data-room="${roomId}"]`).addClass('active');
      $('.interior-nav-tab').removeClass('active');
      $(`.interior-nav-tab[data-room="${roomId}"]`).addClass('active');

      if (!this.isInside) {
        // --- TRANSITION FROM EXTERIOR BUILDING INTO INTERIOR ROOM ---
        this.isInside = true;

        // 1. Set zoom transform origin to the clicked hotspot position
        this.$exterior.css({
          'transform-origin': `${room.zoomOrigin.x} ${room.zoomOrigin.y}`,
          'transform': 'scale(3.5)',
          'opacity': '0',
          'filter': 'blur(4px)'
        });

        // 2. Prepare interior room
        this.populateRoomData(room);
        this.$interior.css({
          'opacity': '1',
          'transform': 'scale(1)',
          'pointer-events': 'auto'
        });

        // 3. Play subtle sound FX
        if (window.soundFX) window.soundFX.playClick();

      } else {
        // --- GLIDE DIRECTLY BETWEEN ROOMS (CAMERA SLIDE TRANSITION) ---
        this.$interior.addClass('gliding');
        
        setTimeout(() => {
          self.populateRoomData(room);
          self.$interior.removeClass('gliding');
        }, 300);

        if (window.soundFX) window.soundFX.playClick();
      }
    }

    populateRoomData(room) {
      this.$interiorImg.attr('src', room.image);
      this.$interiorImg.attr('alt', room.name);
      this.$interiorTitle.text(room.name);
      this.$interiorSubtitle.text(room.category);

      // Specs
      this.$interiorSpecs.empty();
      room.specs.forEach(s => {
        this.$interiorSpecs.append(`
          <div class="interior-spec-cell">
            <span>${s.label}:</span>
            <strong>${s.val}</strong>
          </div>
        `);
      });

      // Internal Features Hotspots
      this.$interiorHotspots.empty();
      room.features.forEach(f => {
        this.$interiorHotspots.append(`
          <div class="interior-feature-pin" style="top: ${f.top}; left: ${f.left};">
            <div class="feature-pin-dot"></div>
            <div class="feature-pin-label">${f.text}</div>
          </div>
        `);
      });
    }

    flyOutToBuilding() {
      if (!this.isInside) return;
      this.isInside = false;
      this.currentRoom = null;

      // Smooth zoom back out to exterior building view
      this.$interior.css({
        'opacity': '0',
        'transform': 'scale(0.95)',
        'pointer-events': 'none'
      });

      this.$exterior.css({
        'transform': 'scale(1)',
        'opacity': '1',
        'filter': 'blur(0px)'
      });

      $('.room-pill-btn').removeClass('active');
      if (window.soundFX) window.soundFX.playClick();
    }

    bindEvents() {
      const self = this;

      // Click on Hotspot Beacons on exterior building
      $('.building-hotspot').on('click', function(e) {
        e.stopPropagation();
        const room = $(this).data('room');
        self.flyIntoRoom(room);
      });

      // Click on Top Navigation Pills
      $('.room-pill-btn').on('click', function() {
        const room = $(this).data('room');
        self.flyIntoRoom(room);
      });

      // Click on Interior Floating Switcher Buttons
      this.$stage.on('click', '.interior-nav-tab', function() {
        const room = $(this).data('room');
        self.flyIntoRoom(room);
      });

      // Back to Building Exterior Button
      $('#backToBuildingBtn').on('click', function() {
        self.flyOutToBuilding();
      });
    }
  }

  window.RoomExplorer = RoomExplorer;
  $(document).ready(function() {
    window.roomExplorerApp = new RoomExplorer();
  });

})(jQuery);
