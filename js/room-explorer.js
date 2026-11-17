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
          name: 'লাক্সারি গ্র্যান্ড ড্রয়িং ও লিভিং লাউঞ্জ',
          category: 'গ্রাউন্ড লেভেল / প্রাইম জোন',
          image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '38%', y: '52%' },
          specs: [
            { label: 'আয়তন', val: '১,২৫০ Sq.Ft' },
            { label: 'সিলিং উচ্চতা', val: '১৩.৫ ফিট' },
            { label: 'ফ্লোরিং', val: 'ইতালিয়ান ক্যালাকাট্টা মার্বেল' },
            { label: 'লাইটিং', val: 'ডালি-স্মার্ট ডিমেবল' }
          ],
          features: [
            { top: '65%', left: '42%', text: 'ইতালিয়ান ক্যালাকাট্টা মার্বেল মেঝে' },
            { top: '48%', left: '26%', text: 'কাস্টম লেদার মডুলার সোফা' },
            { top: '24%', left: '55%', text: 'আর্কিটেকচারাল ব্রাস পেন্ড্যান্ট' }
          ]
        },
        dining: {
          id: 'dining',
          name: 'গ্র্যান্ড ব্যাঙ্কোয়েট ডাইনিং স্পেস',
          category: 'ফার্স্ট লেভেল / ডাইনিং জোন',
          image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '68%', y: '62%' },
          specs: [
            { label: 'আয়তন', val: '৮৫০ Sq.Ft' },
            { label: 'ক্যাপাসিটি', val: '১০ সিটার ডাইনিং' },
            { label: 'টেবিল টপ', val: 'সলিড আমেরিকান ভ্যালনাট' },
            { label: 'গ্লাস ভিউ', val: 'গার্ডেন টেরেস ফেসিং' }
          ],
          features: [
            { top: '62%', left: '50%', text: '১০ সিটের কাস্টম সলিড উড টেবিল' },
            { top: '28%', left: '52%', text: 'ব্রাশড ব্রাস আর্কিটেকচারাল ঝাড়বাতি' },
            { top: '44%', left: '80%', text: 'ব্যাকলিট প্রিমিয়াম ওয়াইন ক্যাবিনেট' }
          ]
        },
        bedroom: {
          id: 'bedroom',
          name: 'মাস্টার সুইট পেন্টহাউস বেডরুম',
          category: 'টপ ফ্লোর / প্রাইভেট হেভেন',
          image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '62%', y: '32%' },
          specs: [
            { label: 'আয়তন', val: '৯৫০ Sq.Ft' },
            { label: 'ফ্লোরিং', val: 'আমেরিকান ওক হার্ডউড' },
            { label: 'ব্যালকনি', val: 'প্রাইভেট স্কাইলাইন টেরেস' },
            { label: 'অ্যাকোস্টিক', val: 'সাউন্ডপ্রুফ ডাবল ওয়াল' }
          ],
          features: [
            { top: '60%', left: '48%', text: 'কিং সাইজ আল্ট্রা-লাক্সারি বেড' },
            { top: '35%', left: '78%', text: 'ফ্লোর-টু-সিলিং সিটি ভিউ উইন্ডো' },
            { top: '45%', left: '20%', text: 'হ্যান্ডক্রাফটেড অ্যাকোস্টিক হেডবোর্ড' }
          ]
        },
        kitchen: {
          id: 'kitchen',
          name: 'মডার্ন ওপেন শেফ কিচেন ও আইল্যান্ড',
          category: 'গ্রাউন্ড লেভেল / সার্ভিস জোন',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '22%', y: '72%' },
          specs: [
            { label: 'আয়তন', val: '৬৫০ Sq.Ft' },
            { label: 'কাউন্টারটপ', val: 'সিলিকন কোয়ার্টজ' },
            { label: 'ক্যাবিনেট', val: 'জার্মান সফট-ক্লোজ' },
            { label: 'অ্যাপ্লায়েন্স', val: 'ইন্টিগ্রেটেড হিডেন প্যানেল' }
          ],
          features: [
            { top: '62%', left: '46%', text: 'মার্বেল সেন্ট্রাল কিচেন আইল্যান্ড' },
            { top: '38%', left: '25%', text: 'সফট-ক্লোজ স্মার্ট ক্যাবিনেট্রি' },
            { top: '42%', left: '75%', text: 'বিল্ট-ইন ইনভার্টার ওভেন ও হাব' }
          ]
        },
        rooftop: {
          id: 'rooftop',
          name: 'রুফটপ ইনফিনিটি লাউঞ্জ ও স্কাই গার্ডেন',
          category: 'রুফটপ লেভেল / ওপেন এয়ার',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
          zoomOrigin: { x: '45%', y: '18%' },
          specs: [
            { label: 'আয়তন', val: '২,২০০ Sq.Ft' },
            { label: 'পুল', val: 'হিটেড ইনফিনিটি এজ' },
            { label: 'ডেকিং', val: 'ওয়েদারপ্রুফ টিক উড' },
            { label: 'ভিউ', val: '৩৬০° প্যানোরামিক স্কাইলাইন' }
          ],
          features: [
            { top: '70%', left: '38%', text: 'ইনফিনিটি এজ সুইমিং পুল' },
            { top: '55%', left: '72%', text: 'আউটডোর লাউঞ্জ সিটিং' },
            { top: '30%', left: '48%', text: 'বায়োফিলিক সানসেট স্কাই গার্ডেন' }
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
