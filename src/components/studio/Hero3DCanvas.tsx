"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!mountRef.current || typeof window === "undefined") return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported or context error", e);
      setIsSupported(false);
      return;
    }

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 8, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffc93c, 1.8, 15);
    pointLight.position.set(-3, 3, 4);
    scene.add(pointLight);

    // 3. Materials
    const inkMat = new THREE.MeshToonMaterial({ color: 0x1b1b2f });
    const paperMat = new THREE.MeshToonMaterial({ color: 0xfffcf5 });
    const yellowMat = new THREE.MeshToonMaterial({ color: 0xffc93c });
    const coralMat = new THREE.MeshToonMaterial({ color: 0xff6b6b });
    const tealMat = new THREE.MeshToonMaterial({ color: 0x2ec4b6 });
    const blueMat = new THREE.MeshToonMaterial({ color: 0x4d96ff });
    const goldMat = new THREE.MeshToonMaterial({ color: 0xf59e0b });
    const woodMat = new THREE.MeshToonMaterial({ color: 0xd97706 });
    const pinkMat = new THREE.MeshToonMaterial({ color: 0xf472b6 });
    const silverMat = new THREE.MeshToonMaterial({ color: 0xc4b5fd });

    // Root Group for Mouse Parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ==========================================
    // OBJECT A: OPEN 3D BOOK (Top Left)
    // ==========================================
    const bookGroup = new THREE.Group();
    bookGroup.position.set(-3.2, 2.2, 0);

    const leftCover = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.08), coralMat);
    leftCover.position.set(-0.8, 0, -0.05);
    leftCover.rotation.y = 0.25;

    const rightCover = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.08), coralMat);
    rightCover.position.set(0.8, 0, -0.05);
    rightCover.rotation.y = -0.25;

    const leftPages = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.05, 0.14), paperMat);
    leftPages.position.set(-0.75, 0, 0.05);
    leftPages.rotation.y = 0.25;

    const rightPages = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.05, 0.14), paperMat);
    rightPages.position.set(0.75, 0, 0.05);
    rightPages.rotation.y = -0.25;

    bookGroup.add(leftCover, rightCover, leftPages, rightPages);
    worldGroup.add(bookGroup);

    // ==========================================
    // OBJECT B: WOODEN 3D PENCIL (Top Right)
    // ==========================================
    const pencilGroup = new THREE.Group();
    pencilGroup.position.set(3.4, 2.5, 0);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.2, 6), yellowMat);
    const coneWood = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 6), woodMat);
    coneWood.position.y = -1.4;
    coneWood.rotation.x = Math.PI;

    const graphiteTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 6), inkMat);
    graphiteTip.position.y = -1.6;
    graphiteTip.rotation.x = Math.PI;

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.35, 12), silverMat);
    ferrule.position.y = 1.25;

    const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.45, 12), pinkMat);
    eraser.position.y = 1.55;

    pencilGroup.add(shaft, coneWood, graphiteTip, ferrule, eraser);
    pencilGroup.rotation.z = -0.65;
    pencilGroup.rotation.x = 0.35;
    worldGroup.add(pencilGroup);

    // ==========================================
    // OBJECT C: TERRESTRIAL GLOBE (Bottom Left)
    // ==========================================
    const globeGroup = new THREE.Group();
    globeGroup.position.set(-3.4, -2.4, 0);

    const globeSphere = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 24), tealMat);
    
    // Equator ring / Stand
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.08, 12, 36), goldMat);
    ring.rotation.x = Math.PI / 2.3;

    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12), goldMat);
    standPole.position.y = -1.6;

    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.2, 16), inkMat);
    standBase.position.y = -2.2;

    globeGroup.add(globeSphere, ring, standPole, standBase);
    worldGroup.add(globeGroup);

    // ==========================================
    // OBJECT D: GRADUATION CAP (Bottom Right)
    // ==========================================
    const capGroup = new THREE.Group();
    capGroup.position.set(3.2, -2.2, 0);

    const capMortar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 2.2), inkMat);
    capMortar.rotation.y = 0.78; // 45 deg diamond

    const capSkull = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 0.55, 16), inkMat);
    capSkull.position.y = -0.3;

    const capButton = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), goldMat);
    capButton.position.y = 0.06;

    // Tassel
    const tasselCord = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), goldMat);
    tasselCord.position.set(0.45, -0.2, 0.45);
    tasselCord.rotation.z = -0.4;

    const tasselTuft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.35, 8), goldMat);
    tasselTuft.position.set(0.75, -0.55, 0.5);

    capGroup.add(capMortar, capSkull, capButton, tasselCord, tasselTuft);
    capGroup.rotation.x = 0.35;
    capGroup.rotation.z = -0.25;
    worldGroup.add(capGroup);

    // ==========================================
    // OBJECT E: FRIENDLY MASCOT "EDI" (Center)
    // ==========================================
    const mascotGroup = new THREE.Group();
    mascotGroup.position.set(0, 0.2, 0.5);

    // Round body
    const bodyGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, yellowMat);

    // Big expressive cartoon eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const eyePupilGeo = new THREE.SphereGeometry(0.2, 16, 16);

    const leftEye = new THREE.Mesh(eyeWhiteGeo, paperMat);
    leftEye.position.set(-0.55, 0.25, 1.35);

    const leftPupil = new THREE.Mesh(eyePupilGeo, inkMat);
    leftPupil.position.set(-0.55, 0.25, 1.55);

    const rightEye = new THREE.Mesh(eyeWhiteGeo, paperMat);
    rightEye.position.set(0.55, 0.25, 1.35);

    const rightPupil = new THREE.Mesh(eyePupilGeo, inkMat);
    rightPupil.position.set(0.55, 0.25, 1.55);

    // Rosy Blush Cheeks
    const cheekGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const leftCheek = new THREE.Mesh(cheekGeo, coralMat);
    leftCheek.position.set(-0.95, -0.08, 1.25);

    const rightCheek = new THREE.Mesh(cheekGeo, coralMat);
    rightCheek.position.set(0.95, -0.08, 1.25);

    // Cute sprout / antenna on head
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8), inkMat);
    stem.position.y = 1.7;

    const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), tealMat);
    leaf1.position.set(-0.15, 1.95, 0);
    leaf1.scale.set(1.4, 0.5, 0.8);
    leaf1.rotation.z = 0.5;

    const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), tealMat);
    leaf2.position.set(0.15, 1.95, 0);
    leaf2.scale.set(1.4, 0.5, 0.8);
    leaf2.rotation.z = -0.5;

    // Small floating hands
    const handGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const leftHand = new THREE.Mesh(handGeo, yellowMat);
    leftHand.position.set(-1.8, -0.4, 0.3);

    const rightHand = new THREE.Mesh(handGeo, yellowMat);
    rightHand.position.set(1.8, -0.4, 0.3);

    mascotGroup.add(
      bodyMesh,
      leftEye,
      leftPupil,
      rightEye,
      rightPupil,
      leftCheek,
      rightCheek,
      stem,
      leaf1,
      leaf2,
      leftHand,
      rightHand
    );
    worldGroup.add(mascotGroup);

    // ==========================================
    // FLOATING STARS / SPARKLES
    // ==========================================
    const sparklesCount = 18;
    const sparkleMeshes: THREE.Mesh[] = [];
    const sparkleColors = [0xffc93c, 0xff6b6b, 0x2ec4b6, 0x4d96ff, 0x8e6cef];

    for (let i = 0; i < sparklesCount; i++) {
      const spGeo = new THREE.OctahedronGeometry(0.12 + Math.random() * 0.15);
      const spMat = new THREE.MeshToonMaterial({
        color: sparkleColors[i % sparkleColors.length],
      });
      const spMesh = new THREE.Mesh(spGeo, spMat);
      spMesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 4
      );
      sparkleMeshes.push(spMesh);
      worldGroup.add(spMesh);
    }

    // 4. Mouse Move Tracking (Cursor-following parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // 5. Responsive Resize
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    // 6. Animation Loop with Sine Wave Floating Physics
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      const elapsed = clock.getElapsedTime();

      // Smooth cursor parallax lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      worldGroup.rotation.y = targetX * 0.25;
      worldGroup.rotation.x = -targetY * 0.2;

      // Mascot eye pupil cursor tracking
      const pupilOffsetLimit = 0.12;
      leftPupil.position.x = -0.55 + targetX * pupilOffsetLimit;
      leftPupil.position.y = 0.25 + targetY * pupilOffsetLimit;
      rightPupil.position.x = 0.55 + targetX * pupilOffsetLimit;
      rightPupil.position.y = 0.25 + targetY * pupilOffsetLimit;

      // Mascot gentle breathing & bobbing
      mascotGroup.position.y = 0.2 + Math.sin(elapsed * 2) * 0.12;
      leftHand.position.y = -0.4 + Math.sin(elapsed * 2.5) * 0.08;
      rightHand.position.y = -0.4 + Math.cos(elapsed * 2.5) * 0.08;

      // Book gentle flapping
      bookGroup.position.y = 2.2 + Math.sin(elapsed * 1.5 + 1) * 0.18;
      bookGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.2;
      bookGroup.rotation.z = Math.cos(elapsed * 1.2) * 0.1;

      // Pencil drifting and tilting
      pencilGroup.position.y = 2.5 + Math.cos(elapsed * 1.7 + 2) * 0.2;
      pencilGroup.rotation.y = elapsed * 0.5;

      // Globe continuous rotation
      globeSphere.rotation.y = elapsed * 0.4;
      globeGroup.position.y = -2.4 + Math.sin(elapsed * 1.3) * 0.15;

      // Graduation cap floating
      capGroup.position.y = -2.2 + Math.cos(elapsed * 1.6 + 3) * 0.18;
      capGroup.rotation.y = 0.78 + Math.sin(elapsed * 1.1) * 0.2;

      // Sparkles orbiting & rotating
      sparkleMeshes.forEach((sp, idx) => {
        sp.rotation.x += 0.02;
        sp.rotation.y += 0.03;
        sp.position.y += Math.sin(elapsed * 2 + idx) * 0.006;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (renderer?.domElement?.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center bg-[#FFF8EE] rounded-3xl border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F]">
        <div className="space-y-3">
          <span className="text-4xl">🎓</span>
          <p className="font-heading font-bold text-lg text-[#1B1B2F]">Welcome to EdWorld Co.</p>
          <p className="font-studio text-sm text-[#4A4A68]">Interactive 3D canvas active in WebGL browsers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] select-none">
      <div ref={mountRef} className="w-full h-full pointer-events-auto" />
      {/* Floating Pill indicator on 3D scene */}
      <div className="absolute bottom-3 left-4 sm:left-6 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border-2 border-[#1B1B2F] text-[11px] font-heading font-bold text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] flex items-center gap-1.5 select-none pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#6BCB77] animate-ping" />
        <span>Meet Edi &bull; Move your cursor to explore</span>
      </div>
    </div>
  );
}
