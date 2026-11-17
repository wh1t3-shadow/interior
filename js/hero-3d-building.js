/**
 * ==========================================================================
 * AURA ARCHITECTS - REAL WEBGL 3D ARCHITECTURAL VILLA & INTERIOR SCENE
 * True 3D Geometry, PBR Materials, Glass Transparency, Shadows & OrbitControls
 * ==========================================================================
 */

(function($) {
  'use strict';

  class RealHero3DScene {
    constructor() {
      this.container = document.getElementById('hero3DContainer');
      this.canvas = document.getElementById('heroReal3DCanvas');
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.isNight = false;
      this.autoRotate = true;

      this.initScene();
      this.buildArchitecturalModel();
      this.setupLighting();
      this.bindControls();
      this.animate();
    }

    initScene() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width || 600;
      this.height = rect.height || 480;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf8fafc);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 1000);
      this.camera.position.set(18, 12, 22);

      // 3. Renderer with Real Shadows & PBR Tone Mapping
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;

      // 4. OrbitControls (Full 360° Drag to Orbit, Zoom, Pan)
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below ground
        this.controls.minDistance = 6;
        this.controls.maxDistance = 45;
        this.controls.target.set(0, 3, 0);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.8;
      }
    }

    buildArchitecturalModel() {
      this.buildingGroup = new THREE.Group();
      this.interiorGroup = new THREE.Group();
      this.lightsGroup = new THREE.Group();

      // --- MATERIALS ---
      // 1. Concrete Smooth Slab
      this.concreteMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.4,
        metalness: 0.05
      });

      // 2. Warm American Walnut Wood
      this.woodMat = new THREE.MeshStandardMaterial({
        color: 0x8b5a2b,
        roughness: 0.35,
        metalness: 0.1
      });

      // 3. Dark Charcoal Architectural Steel
      this.steelMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.25,
        metalness: 0.85
      });

      // 4. Ultra-Clear Architectural Glass
      this.glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.88,
        ior: 1.5,
        reflectivity: 0.9
      });

      // 5. Italian White Marble (Living Floor)
      this.marbleMat = new THREE.MeshStandardMaterial({
        color: 0xfafafa,
        roughness: 0.15,
        metalness: 0.1
      });

      // 6. Translucent Pool Water
      this.waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        transmission: 0.7,
        ior: 1.33
      });

      // 7. Lawn Grass
      this.lawnMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.8
      });

      // --- 1. BASEMENT & SITE PLATFORM ---
      const groundGeo = new THREE.BoxGeometry(32, 0.5, 26);
      const ground = new THREE.Mesh(groundGeo, this.lawnMat);
      ground.position.y = -0.25;
      ground.receiveShadow = true;
      this.buildingGroup.add(ground);

      // Wooden Deck Patio
      const deckGeo = new THREE.BoxGeometry(16, 0.4, 12);
      const deck = new THREE.Mesh(deckGeo, this.woodMat);
      deck.position.set(2, 0.2, 3);
      deck.receiveShadow = true;
      this.buildingGroup.add(deck);

      // Modern Infinity Pool
      const poolFrameGeo = new THREE.BoxGeometry(8, 0.6, 5);
      const poolFrame = new THREE.Mesh(poolFrameGeo, this.concreteMat);
      poolFrame.position.set(-6, 0.2, 4);
      poolFrame.receiveShadow = true;
      this.buildingGroup.add(poolFrame);

      const waterGeo = new THREE.BoxGeometry(7.4, 0.2, 4.4);
      const water = new THREE.Mesh(waterGeo, this.waterMat);
      water.position.set(-6, 0.45, 4);
      this.buildingGroup.add(water);

      // --- 2. GROUND FLOOR LIVING & DINING WING ---
      // Floor Slab
      const floorSlabGeo = new THREE.BoxGeometry(14, 0.4, 10);
      const floorSlab = new THREE.Mesh(floorSlabGeo, this.marbleMat);
      floorSlab.position.set(0, 0.4, -2);
      floorSlab.receiveShadow = true;
      this.buildingGroup.add(floorSlab);

      // Ceiling / Floor 1 Dividing Slab
      const midSlabGeo = new THREE.BoxGeometry(15, 0.5, 11);
      const midSlab = new THREE.Mesh(midSlabGeo, this.concreteMat);
      midSlab.position.set(0, 4.5, -2);
      midSlab.castShadow = true;
      midSlab.receiveShadow = true;
      this.buildingGroup.add(midSlab);

      // Rear Wall (Fluted Walnut Wood)
      const rearWallGeo = new THREE.BoxGeometry(14, 4, 0.4);
      const rearWall = new THREE.Mesh(rearWallGeo, this.woodMat);
      rearWall.position.set(0, 2.4, -7);
      rearWall.castShadow = true;
      rearWall.receiveShadow = true;
      this.buildingGroup.add(rearWall);

      // Side Wall Left
      const leftWallGeo = new THREE.BoxGeometry(0.4, 4, 10);
      const leftWall = new THREE.Mesh(leftWallGeo, this.concreteMat);
      leftWall.position.set(-7, 2.4, -2);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      this.buildingGroup.add(leftWall);

      // Front Floor-to-Ceiling Glass Walls
      const glassFrontGeo = new THREE.BoxGeometry(13.8, 3.8, 0.1);
      const glassFront = new THREE.Mesh(glassFrontGeo, this.glassMat);
      glassFront.position.set(0, 2.4, 2.8);
      this.buildingGroup.add(glassFront);

      // Structural Steel Columns
      const colGeo = new THREE.BoxGeometry(0.3, 4, 0.3);
      for (let x of [-6.5, 0, 6.5]) {
        const col = new THREE.Mesh(colGeo, this.steelMat);
        col.position.set(x, 2.4, 2.8);
        col.castShadow = true;
        this.buildingGroup.add(col);
      }

      // --- 3. FIRST FLOOR CANTILEVER MASTER SUITE ---
      // Cantilever Box extending to right
      const upperBoxGeo = new THREE.BoxGeometry(12, 3.8, 9);
      const upperBox = new THREE.Mesh(upperBoxGeo, this.concreteMat);
      upperBox.position.set(2, 6.6, -2);
      upperBox.castShadow = true;
      upperBox.receiveShadow = true;
      this.buildingGroup.add(upperBox);

      // Upper Front Glass Balcony
      const upperGlassGeo = new THREE.BoxGeometry(10, 3.2, 0.1);
      const upperGlass = new THREE.Mesh(upperGlassGeo, this.glassMat);
      upperGlass.position.set(2, 6.6, 2.4);
      this.buildingGroup.add(upperGlass);

      // Upper Roof Slab
      const roofSlabGeo = new THREE.BoxGeometry(13, 0.4, 10);
      const roofSlab = new THREE.Mesh(roofSlabGeo, this.concreteMat);
      roofSlab.position.set(2, 8.6, -2);
      roofSlab.castShadow = true;
      this.buildingGroup.add(roofSlab);

      // Wooden Architectural Louvers / Vertical Slats on Upper Suite
      const louverGeo = new THREE.BoxGeometry(0.12, 3.4, 0.4);
      for (let lx = -2; lx <= 5; lx += 0.6) {
        const louver = new THREE.Mesh(louverGeo, this.woodMat);
        louver.position.set(lx, 6.6, 2.6);
        louver.castShadow = true;
        this.buildingGroup.add(louver);
      }

      // --- 4. REAL INTERIOR FURNITURE (VISIBLE INSIDE GLASS) ---
      // A. Modern Designer Sectional Sofa
      const sofaBaseGeo = new THREE.BoxGeometry(4.5, 0.6, 2);
      const sofaMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
      const sofaBase = new THREE.Mesh(sofaBaseGeo, sofaMat);
      sofaBase.position.set(-2, 0.9, -1);
      sofaBase.castShadow = true;
      this.interiorGroup.add(sofaBase);

      const sofaBackGeo = new THREE.BoxGeometry(4.5, 0.8, 0.5);
      const sofaBack = new THREE.Mesh(sofaBackGeo, sofaMat);
      sofaBack.position.set(-2, 1.4, -2);
      sofaBack.castShadow = true;
      this.interiorGroup.add(sofaBack);

      // Golden Cushions
      const cushionMat = new THREE.MeshStandardMaterial({ color: 0xb89047, roughness: 0.4 });
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), cushionMat);
      c1.position.set(-3.2, 1.4, -1.6);
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), cushionMat);
      c2.position.set(-0.8, 1.4, -1.6);
      this.interiorGroup.add(c1);
      this.interiorGroup.add(c2);

      // B. Calacatta Marble Coffee Table
      const tableGeo = new THREE.BoxGeometry(2.4, 0.35, 1.2);
      const coffeeTable = new THREE.Mesh(tableGeo, this.marbleMat);
      coffeeTable.position.set(-2, 0.75, 0.8);
      coffeeTable.castShadow = true;
      this.interiorGroup.add(coffeeTable);

      // C. Modern Dining Table & Chairs on Right
      const diningTable = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 1.8), this.woodMat);
      diningTable.position.set(3.5, 1.5, -1);
      diningTable.castShadow = true;
      this.interiorGroup.add(diningTable);

      // D. Modern Geometric Chandelier (Emissive Lighting)
      this.chandelierMat = new THREE.MeshStandardMaterial({
        color: 0xfffbeb,
        emissive: 0xd4af37,
        emissiveIntensity: 0.6,
        roughness: 0.1
      });
      const chanGeo = new THREE.TorusGeometry(1, 0.06, 16, 32);
      const chandelier = new THREE.Mesh(chanGeo, this.chandelierMat);
      chandelier.rotation.x = Math.PI / 2;
      chandelier.position.set(0, 3.8, -1);
      this.interiorGroup.add(chandelier);

      // E. Architectural Indoor Tree / Olive Plant
      const potGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.2, 16);
      const pot = new THREE.Mesh(potGeo, this.concreteMat);
      pot.position.set(5.5, 1.1, 1.5);
      pot.castShadow = true;
      this.interiorGroup.add(pot);

      const plantGeo = new THREE.DodecahedronGeometry(0.9);
      const plantMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.7 });
      const plant = new THREE.Mesh(plantGeo, plantMat);
      plant.position.set(5.5, 2.2, 1.5);
      plant.castShadow = true;
      this.interiorGroup.add(plant);

      this.buildingGroup.add(this.interiorGroup);
      this.scene.add(this.buildingGroup);
    }

    setupLighting() {
      // 1. Ambient & Hemisphere Light
      this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.85);
      this.scene.add(this.hemiLight);

      // 2. Main Golden Sun (Directional Light with Soft Shadows)
      this.sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
      this.sunLight.position.set(16, 24, 18);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 2048;
      this.sunLight.shadow.mapSize.height = 2048;
      this.sunLight.shadow.camera.near = 0.5;
      this.sunLight.shadow.camera.far = 80;
      this.sunLight.shadow.camera.left = -18;
      this.sunLight.shadow.camera.right = 18;
      this.sunLight.shadow.camera.top = 18;
      this.sunLight.shadow.camera.bottom = -18;
      this.sunLight.shadow.bias = -0.0005;
      this.scene.add(this.sunLight);

      // 3. Interior Warm Cove Light
      this.interiorLight = new THREE.PointLight(0xffedd5, 1.2, 16);
      this.interiorLight.position.set(0, 3.5, -1);
      this.interiorLight.castShadow = true;
      this.scene.add(this.interiorLight);

      // 4. Pool Underwater Cyan Glow
      this.poolLight = new THREE.PointLight(0x38bdf8, 1.0, 10);
      this.poolLight.position.set(-6, 0.5, 4);
      this.scene.add(this.poolLight);
    }

    setDayNight(isNight) {
      this.isNight = isNight;

      if (!isNight) {
        // Day Mode
        this.scene.background = new THREE.Color(0xf8fafc);
        this.hemiLight.color.setHex(0xffffff);
        this.hemiLight.groundColor.setHex(0xe2e8f0);
        this.hemiLight.intensity = 0.85;

        this.sunLight.intensity = 1.4;
        this.sunLight.color.setHex(0xfff7ed);

        this.interiorLight.intensity = 0.8;
        this.chandelierMat.emissiveIntensity = 0.5;
        this.poolLight.intensity = 0.8;
      } else {
        // Night Mode
        this.scene.background = new THREE.Color(0x090d16);
        this.hemiLight.color.setHex(0x1e293b);
        this.hemiLight.groundColor.setHex(0x020617);
        this.hemiLight.intensity = 0.25;

        this.sunLight.intensity = 0.15;
        this.sunLight.color.setHex(0x38bdf8);

        this.interiorLight.intensity = 2.4;
        this.chandelierMat.emissiveIntensity = 2.0;
        this.poolLight.intensity = 2.8;
      }
    }

    setCameraPreset(preset) {
      if (!this.controls) return;
      const self = this;

      let targetPos, targetLook;
      if (preset === 'exterior') {
        targetPos = { x: 18, y: 12, z: 22 };
        targetLook = { x: 0, y: 3, z: 0 };
      } else if (preset === 'interior') {
        // Fly directly through glass into living room!
        targetPos = { x: -1, y: 2.2, z: 5 };
        targetLook = { x: -1.5, y: 1.5, z: -1 };
      } else if (preset === 'rooftop') {
        // Rooftop Pool & Upper Suite Angle
        targetPos = { x: -12, y: 11, z: 12 };
        targetLook = { x: -3, y: 3, z: 2 };
      }

      if (targetPos) {
        // Smooth camera tween
        const startPos = { ...self.camera.position };
        const startTime = performance.now();
        const duration = 800;

        function animateCam(now) {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);
          // EaseInOutCubic
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          self.camera.position.x = startPos.x + (targetPos.x - startPos.x) * ease;
          self.camera.position.y = startPos.y + (targetPos.y - startPos.y) * ease;
          self.camera.position.z = startPos.z + (targetPos.z - startPos.z) * ease;

          self.controls.target.x = targetLook.x;
          self.controls.target.y = targetLook.y;
          self.controls.target.z = targetLook.z;

          if (t < 1) {
            requestAnimationFrame(animateCam);
          }
        }
        requestAnimationFrame(animateCam);
      }
    }

    bindControls() {
      const self = this;

      // Day / Night Switcher
      $('#hero3DDayNightBtn').on('click', function() {
        self.setDayNight(!self.isNight);
        $(this).toggleClass('active', self.isNight);
        $(this).html(self.isNight ? '<i class="fas fa-sun"></i> ডে মোড' : '<i class="fas fa-moon"></i> নাইট মোড');
        if (window.soundFX) window.soundFX.playClick();
      });

      // Auto Rotate Switcher
      $('#hero3DAutoRotateBtn').on('click', function() {
        self.autoRotate = !self.autoRotate;
        if (self.controls) self.controls.autoRotate = self.autoRotate;
        $(this).toggleClass('active', self.autoRotate);
        if (window.soundFX) window.soundFX.playClick();
      });

      // Camera Angle Presets
      $('.hero-preset-btn').on('click', function() {
        $('.hero-preset-btn').removeClass('active');
        $(this).addClass('active');
        const preset = $(this).data('preset');
        self.setCameraPreset(preset);
        if (window.soundFX) window.soundFX.playClick();
      });

      // Window Resize
      window.addEventListener('resize', () => {
        const rect = self.canvas.getBoundingClientRect();
        self.width = rect.width;
        self.height = rect.height;
        self.camera.aspect = self.width / self.height;
        self.camera.updateProjectionMatrix();
        self.renderer.setSize(self.width, self.height);
      });
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      if (this.controls) {
        this.controls.update();
      }

      // Water gentle wave animation
      const time = performance.now() * 0.0015;
      if (this.buildingGroup) {
        // Subtle ambient elevation
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.RealHero3DScene = RealHero3DScene;
  $(document).ready(function() {
    window.hero3DApp = new RealHero3DScene();
  });

})(jQuery);
