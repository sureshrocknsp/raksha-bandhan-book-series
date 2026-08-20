/**
 * Three.js WebGL 3D Cinema Viewport Component
 * Enhances the 3D animated images with real-time dynamic golden embers,
 * stardust particles, camera breathing motion, and subtle perspective parallax.
 */

export class ThreeViewport {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.pointLight = null;
    this.animId = null;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.time = 0;

    this.init();
  }

  init() {
    if (!this.container || typeof THREE === 'undefined') return;

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
    this.scene.add(ambientLight);

    // Dynamic Volumetric Point Light
    this.pointLight = new THREE.PointLight(0xf59e0b, 2.5, 15);
    this.pointLight.position.set(0, 1, 3);
    this.scene.add(this.pointLight);

    // Golden Embers Particle System (750 particles)
    const particleCount = 750;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      cols[i * 3] = 0.95 + Math.random() * 0.05;
      cols[i * 3 + 1] = 0.65 + Math.random() * 0.3;
      cols[i * 3 + 2] = 0.1 + Math.random() * 0.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);

    // Parallax Interaction
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      this.mouse.targetX = Math.max(-1, Math.min(1, nx));
      this.mouse.targetY = Math.max(-1, Math.min(1, ny));
    });

    this.animate();

    window.addEventListener('resize', () => {
      if (!this.container || !this.camera || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w === 0 || h === 0) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  loadPageImage(imageSrc, palette = {}, particleType = 'golden-dust') {
    if (this.pointLight && palette.primary) {
      this.pointLight.color.set(palette.primary);
    }
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    this.time += 0.015;

    // Smooth Parallax Interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Camera Breathing & Parallax
    if (this.camera) {
      this.camera.position.x = this.mouse.x * 0.35 + Math.sin(this.time * 0.5) * 0.04;
      this.camera.position.y = -this.mouse.y * 0.25 + Math.cos(this.time * 0.6) * 0.04;
      this.camera.lookAt(0, 0, 0);
    }

    // Dynamic Embers Drift
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += 0.005; // float upward
        pos[i] += Math.sin(this.time + i) * 0.002;
        if (pos[i + 1] > 4) pos[i + 1] = -4;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
