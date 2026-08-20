/**
 * Hero / Prologue Screen
 * "రక్షాబంధన్ — ఒక దారం చెప్పే మాట"
 * Features 3D floating glowing Rakhi with WebGL particle vortex,
 * camera zoom-in, and cinematic title reveal.
 */

import { soundEngine } from '../audio/soundEngine.js';

export class HeroComponent {
  constructor(container, onStartCallback) {
    this.container = container;
    this.onStart = onStartCallback;
    this.threeScene = null;
    this.threeCamera = null;
    this.threeRenderer = null;
    this.rakhiMesh = null;
    this.particleSystem = null;
    this.animId = null;

    this.render();
    this.initThreeAnimation();
  }

  render() {
    this.container.innerHTML = `
      <div class="hero-overlay" id="heroOverlay">
        <!-- 3D WebGL Opening Canvas -->
        <div class="hero-3d-bg" id="heroThreeBg"></div>
        <div class="hero-backdrop-glow"></div>

        <div class="hero-content">
          <div class="hero-badge">
            <span class="sparkle-icon">✨</span>
            <span>3D సినిమాటిక్ తెలుగు డిజిటల్ కథా పుస్తకం</span>
          </div>

          <h1 class="hero-title" id="heroTitle">
            రక్షాబంధన్
          </h1>

          <div class="hero-divider">
            <span class="thread-line"></span>
            <span class="sacred-knot">✤</span>
            <span class="thread-line"></span>
          </div>

          <p class="hero-subtitle">
            "ఒక దారం చెప్పే మాట"
          </p>

          <p class="hero-quote-highlight">
            బంధం అంటే రక్షించడం మాత్రమే కాదు… తోడుగా ఉండడం.
          </p>

          <p class="hero-author-tag">
            రచన: సురేష్ తోట (By Suresh Thota)
          </p>

          <div class="hero-actions">
            <button class="hero-start-btn" id="heroStartBtn">
              <span class="btn-icon">📖</span>
              <span class="btn-text">పుస్తకం ప్రారంభించండి</span>
              <span class="btn-arrow">→</span>
            </button>

            <button class="hero-audio-btn" id="heroAudioToggle">
              <span class="audio-icon" id="heroAudioIcon">🎵</span>
              <span id="heroAudioText">సంగీతంతో చదవండి</span>
            </button>
          </div>

          <div class="hero-footer-notes">
            <span>26 సినిమాటిక్ అధ్యాయాలు</span> • 
            <span>స్వచ్ఛమైన తెలుగు రచన</span> • 
            <span>3D సినిమాటిక్ అనుభూతి</span>
          </div>
        </div>
      </div>
    `;

    const startBtn = document.getElementById('heroStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        soundEngine.startMusic();
        soundEngine.playPageTurn();
        this.dismiss();
      });
    }

    const audioToggle = document.getElementById('heroAudioToggle');
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        const isPlaying = soundEngine.toggleMusic();
        const icon = document.getElementById('heroAudioIcon');
        const text = document.getElementById('heroAudioText');
        if (icon && text) {
          icon.textContent = isPlaying ? '🔊' : '🔇';
          text.textContent = isPlaying ? 'సంగీతం ఆన్ చేయబడింది' : 'సంగీతం మ్యూట్ చేయబడింది';
        }
      });
    }
  }

  initThreeAnimation() {
    const bgContainer = document.getElementById('heroThreeBg');
    if (!bgContainer || typeof THREE === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.threeScene = new THREE.Scene();
    this.threeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.threeCamera.position.z = 10;

    this.threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.threeRenderer.setSize(width, height);
    this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bgContainer.appendChild(this.threeRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    this.threeScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 3, 20);
    pointLight.position.set(0, 0, 4);
    this.threeScene.add(pointLight);

    // 3D Rakhi Group
    const rakhiGroup = new THREE.Group();

    const gemGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.25, 24);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0xb45309,
      roughness: 0.2,
      metalness: 0.85
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.rotation.x = Math.PI / 2;
    rakhiGroup.add(gem);

    const petalRingGeo = new THREE.TorusGeometry(0.85, 0.15, 16, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      roughness: 0.3,
      metalness: 0.95
    });
    const petalRing = new THREE.Mesh(petalRingGeo, goldMat);
    rakhiGroup.add(petalRing);

    const threadGeo = new THREE.CylinderGeometry(0.04, 0.04, 8, 12);
    const threadMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b,
      roughness: 0.4
    });
    const thread = new THREE.Mesh(threadGeo, threadMat);
    thread.rotation.z = Math.PI / 2;
    thread.position.z = -0.05;
    rakhiGroup.add(thread);

    this.rakhiMesh = rakhiGroup;
    this.threeScene.add(this.rakhiMesh);

    // 500 Floating Stardust Particles
    const particleCount = 500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      pCols[i * 3] = 0.95 + Math.random() * 0.05;
      pCols[i * 3 + 1] = 0.65 + Math.random() * 0.25;
      pCols[i * 3 + 2] = 0.15 + Math.random() * 0.15;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCols, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(pGeo, pMat);
    this.threeScene.add(this.particleSystem);

    let time = 0;
    const animate = () => {
      this.animId = requestAnimationFrame(animate);
      time += 0.015;

      if (this.rakhiMesh) {
        this.rakhiMesh.rotation.y = time * 0.4;
        this.rakhiMesh.rotation.x = Math.sin(time * 0.5) * 0.15;
        this.rakhiMesh.position.y = Math.sin(time * 0.8) * 0.15;
      }

      if (this.particleSystem) {
        this.particleSystem.rotation.y = time * 0.05;
      }

      if (this.threeCamera && this.threeCamera.position.z > 5.5) {
        this.threeCamera.position.z -= 0.008;
      }

      this.threeRenderer.render(this.threeScene, this.threeCamera);
    };

    animate();

    window.addEventListener('resize', () => {
      if (!this.threeCamera || !this.threeRenderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.threeCamera.aspect = w / h;
      this.threeCamera.updateProjectionMatrix();
      this.threeRenderer.setSize(w, h);
    });
  }

  dismiss() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const overlay = document.getElementById('heroOverlay');
    if (overlay) {
      overlay.classList.add('hero-fade-out');
      setTimeout(() => {
        if (this.container) {
          this.container.innerHTML = '';
        }
        if (this.onStart) {
          this.onStart();
        }
      }, 700);
    }
  }
}
