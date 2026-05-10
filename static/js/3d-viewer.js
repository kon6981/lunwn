// static/js/3d-viewer.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log('🟢 3D Viewer script loaded (red & green balls)');

class Product3DViewer {
  constructor(cardElement, productIndex) {
    this.card = cardElement;
    this.productIndex = productIndex;
    this.canvas = cardElement.querySelector('.three-canvas');
    this.imgWrapper = cardElement.querySelector('.product-img-wrapper');
    this.isActive = false;

    if (!this.canvas) {
      console.warn('No canvas found in card');
      return;
    }
    this.initThree();
  }

  initThree() {
    console.log(`🎨 Init 3D for product index ${this.productIndex}`);

    // 纯白背景，最显眼
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    const width = this.canvas.clientWidth || 350;
    const height = this.canvas.clientHeight || 260;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 3;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.target.set(0, 0, 0);

    // 创建红绿两个小球
    this.createBalls();

    // 动画循环
    this.renderer.setAnimationLoop(() => {
      if (this.isActive) {
        this.controls.update();
        if (this.redBall) this.redBall.rotation.y += 0.02;
        if (this.greenBall) this.greenBall.rotation.x += 0.02;
        this.renderer.render(this.scene, this.camera);
      }
    });
  }

  createBalls() {
    // 红色球（左）
    const redGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.redBall = new THREE.Mesh(redGeo, redMat);
    this.redBall.position.set(-0.8, 0, 0);
    this.scene.add(this.redBall);

    // 绿色球（右）
    const greenGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.greenBall = new THREE.Mesh(greenGeo, greenMat);
    this.greenBall.position.set(0.8, 0, 0);
    this.scene.add(this.greenBall);

    // 淡灰色旋转轨道圆环
    const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
  }

  show() {
    console.log('🔴🟢 Show balls');
    if (!this.canvas) return;

    // 用 !important 强制覆盖所有样式，确保 canvas 可见且满铺
    this.canvas.style.cssText = 'display: block !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; z-index: 999 !important;';
    if (this.imgWrapper) this.imgWrapper.style.display = 'none';
    this.isActive = true;

    // 等待浏览器完成布局后获取真实尺寸并渲染
    requestAnimationFrame(() => {
      const rect = this.canvas.getBoundingClientRect();
      let w = rect.width;
      let h = rect.height;
      if (w === 0 || h === 0) {
        w = 350;
        h = 260;
      }
      console.log(`✅ Canvas size: ${w} x ${h}`);
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera);
    });
  }

  hide() {
    console.log('⏹️ Hide balls');
    if (!this.canvas) return;
    this.isActive = false;
    this.canvas.style.display = 'none';
    if (this.imgWrapper) this.imgWrapper.style.display = 'flex';
  }

  resize() {
    if (!this.canvas || !this.isActive) return;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 350;
    const h = rect.height || 260;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}

// 自动初始化
function initAllProductCards() {
  console.log('🔍 Initializing product 3D viewers');
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card, index) => {
    const viewer = new Product3DViewer(card, index);
    card.addEventListener('mouseenter', () => viewer.show());
    card.addEventListener('mouseleave', () => viewer.hide());
    card._viewer = viewer;
  });
}

window.addEventListener('resize', () => {
  document.querySelectorAll('.product-card').forEach(card => {
    if (card._viewer) card._viewer.resize();
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllProductCards);
} else {
  initAllProductCards();
}