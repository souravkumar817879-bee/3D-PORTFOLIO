/**
 * ==============================================================================
 * SOURAV KUMAR - 3D PORTFOLIO JAVASCRIPT
 * Multi-Stage 3D Universe with the Beloved 3D Robot Coder & Section Morphing:
 *   1. Stage 1 (Hero & About): Interactive 3D Robot Coder
 *      - Head & pupils track cursor in real-time (yaw, pitch, roll)
 *      - Natural cartoon blinking eyelids
 *      - Cyber glasses, cyberpunk headphones with glowing earcups & mic
 *      - Laptop with illuminated screen & typing hands
 *      - 4 floating 3D tech badges (</>, { }, AI, 4K)
 *      - Anchored in Hero Right Stage for Laptop & Centered on Mobile
 *   2. Stage 2 (Skills): Serene 3D Cyber Constellation & Holographic Matrix
 *   3. Stage 3 (Contact): Zen Horizon Concentric Geometry (Calm Backdrop)
 *   4. Ambient Stardust: Gentle, non-intrusive celestial drift (Eye-comfort)
 *   5. Minimalist Cursor, Typewriter, Nav Spy & Contact Mailto/Copy Handler
 * ==============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================================
     1. PREFERS-REDUCED-MOTION CHECK
     ============================================================================ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================================
     2. THREE.JS 3D MULTI-STAGE UNIVERSE
     ============================================================================ */
  const canvas = document.getElementById('webgl-canvas');

  let renderer, scene, camera;

  // STAGE 1: 3D ROBOT CODER CHARACTER
  let characterGroup, bodyGroup, headGroup;
  let leftArm, rightArm;
  let leftPupil, rightPupil;
  let leftEyelid, rightEyelid;
  let headphoneGlowLeft, headphoneGlowRight;
  let floatingBadges = [];

  // Blinking animation state
  let blinkTimer = 0;
  let isBlinking = false;
  let blinkElapsed = 0;
  const blinkDuration = 0.18;

  // STAGE 2: SKILLS (Serene 3D Cyber Constellation)
  let skillsGroup;
  let constellationNodes = [];
  let constellationLines;
  let skillsBaseSpeed = 0.08;
  let skillsCurrentSpeed = 0.08;

  // STAGE 3: CONTACT (Zen Horizon Geometry)
  let contactGroup;
  let horizonRings = [];

  // AMBIENT STARDUST
  let stardustSystem, stardustPositions, stardustOrigins;

  // EYE-COMFORT CLICK POP RIPPLES
  const activePops = [];

  // SECTION MORPHING WEIGHTS (0 to 1)
  let sectionWeights = { hero: 1, skills: 0, contact: 0 };

  // MOUSE & SCROLL STATE (Smooth lerp for eye comfort)
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;
  let targetScrollY = 0;
  let animationFrameId;

  // Detect Mobile Viewport
  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);

  function isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // Soft Particle Glow Texture in memory
  function createStardustTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext('2d');

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.35, 'rgba(165, 180, 252, 0.7)');
    gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(8, 9, 14, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(pCanvas);
  }

  // Clean, eye-comfort Badge Texture
  function createBadgeTexture(text, bgColor, textColor, borderColor) {
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 256;
    bCanvas.height = 128;
    const ctx = bCanvas.getContext('2d');

    // Rounded background box
    ctx.fillStyle = bgColor;
    ctx.roundRect(10, 10, 236, 108, 24);
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = borderColor || 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 5;
    ctx.roundRect(10, 10, 236, 108, 24);
    ctx.stroke();

    // Centered label text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 44px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    return new THREE.CanvasTexture(bCanvas);
  }

  // --------------------------------------------------------------------------
  // A. STAGE 1: 3D ROBOT CODER CHARACTER (Hero Stage Anchor)
  // --------------------------------------------------------------------------
  function buildRobotCoder() {
    characterGroup = new THREE.Group();

    // Materials Palette (Stylized Cartoon & High-Tech)
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdfc4,
      roughness: 0.55,
      metalness: 0.05
    });

    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b, // Deep Cyber Indigo
      roughness: 0.65,
      metalness: 0.15
    });

    const hoodieAccentMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Soft Indigo Collar
      roughness: 0.4,
      metalness: 0.2
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark Slate
      roughness: 0.4
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x181829, // Cool Anime Black/Navy
      roughness: 0.5,
      metalness: 0.1
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const periwinkleGlowMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });

    // 1. BODY & TORSO GROUP
    bodyGroup = new THREE.Group();

    // Hoodie Torso (Smooth tapered cylinder)
    const torsoGeom = new THREE.CylinderGeometry(1.4, 1.85, 2.8, 32);
    const torso = new THREE.Mesh(torsoGeom, hoodieMat);
    torso.position.y = 0.9;
    bodyGroup.add(torso);

    // Hoodie Kangaroo Pocket
    const pocketGeom = new THREE.BoxGeometry(1.5, 0.9, 0.4);
    const pocket = new THREE.Mesh(pocketGeom, hoodieMat);
    pocket.position.set(0, 0.5, 1.25);
    pocket.rotation.x = -0.05;
    bodyGroup.add(pocket);

    // Hoodie Strings
    const stringGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    const stringMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
    const stringL = new THREE.Mesh(stringGeom, stringMat);
    stringL.position.set(-0.35, 1.6, 1.15);
    stringL.rotation.z = -0.1;
    const stringR = new THREE.Mesh(stringGeom, stringMat);
    stringR.position.set(0.35, 1.6, 1.15);
    stringR.rotation.z = 0.1;
    bodyGroup.add(stringL, stringR);

    // Hoodie Collar Ring
    const collarGeom = new THREE.TorusGeometry(1.2, 0.28, 16, 32);
    const collar = new THREE.Mesh(collarGeom, hoodieAccentMat);
    collar.position.set(0, 2.3, 0);
    collar.rotation.x = Math.PI / 2;
    bodyGroup.add(collar);

    // Shoulders
    const shoulderGeom = new THREE.SphereGeometry(0.65, 20, 20);
    const shoulderL = new THREE.Mesh(shoulderGeom, hoodieMat);
    shoulderL.position.set(-1.6, 1.8, 0);
    const shoulderR = new THREE.Mesh(shoulderGeom, hoodieMat);
    shoulderR.position.set(1.6, 1.8, 0);
    bodyGroup.add(shoulderL, shoulderR);

    // Arms (Angled forward working at laptop)
    const armGeom = new THREE.CylinderGeometry(0.42, 0.38, 1.5, 20);

    // Left Arm
    leftArm = new THREE.Group();
    const lUpper = new THREE.Mesh(armGeom, hoodieMat);
    lUpper.position.set(0, -0.6, 0.4);
    lUpper.rotation.x = 0.6;
    lUpper.rotation.z = -0.2;
    leftArm.position.set(-1.6, 1.7, 0);
    leftArm.add(lUpper);

    // Left Hand (Cartoon mitten)
    const handGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const handL = new THREE.Mesh(handGeom, skinMat);
    handL.position.set(-0.2, -1.2, 1.0);
    leftArm.add(handL);
    bodyGroup.add(leftArm);

    // Right Arm
    rightArm = new THREE.Group();
    const rUpper = new THREE.Mesh(armGeom, hoodieMat);
    rUpper.position.set(0, -0.6, 0.4);
    rUpper.rotation.x = 0.6;
    rUpper.rotation.z = 0.2;
    rightArm.position.set(1.6, 1.7, 0);
    rightArm.add(rUpper);

    // Right Hand
    const handR = new THREE.Mesh(handGeom, skinMat);
    handR.position.set(0.2, -1.2, 1.0);
    rightArm.add(handR);
    bodyGroup.add(rightArm);

    // 2. DEVELOPER 3D LAPTOP
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.45, 1.6);
    laptopGroup.rotation.x = 0.25;

    // Laptop Base
    const baseGeom = new THREE.BoxGeometry(2.4, 0.1, 1.6);
    const baseMesh = new THREE.Mesh(baseGeom, darkMat);
    laptopGroup.add(baseMesh);

    // Keyboard keys glow area
    const keysGeom = new THREE.PlaneGeometry(2.0, 1.1);
    const keysMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
    const keysMesh = new THREE.Mesh(keysGeom, keysMat);
    keysMesh.rotation.x = -Math.PI / 2;
    keysMesh.position.set(0, 0.06, 0.1);
    laptopGroup.add(keysMesh);

    // Laptop Screen
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.05, -0.8);
    screenGroup.rotation.x = -0.45;

    const screenLidGeom = new THREE.BoxGeometry(2.4, 1.5, 0.08);
    const screenLid = new THREE.Mesh(screenLidGeom, darkMat);
    screenLid.position.set(0, 0.75, 0);
    screenGroup.add(screenLid);

    // Glowing Screen Display (Electric Cyan glow)
    const displayGeom = new THREE.PlaneGeometry(2.2, 1.3);
    const displayMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.95
    });
    const displayMesh = new THREE.Mesh(displayGeom, displayMat);
    displayMesh.position.set(0, 0.75, 0.05);
    screenGroup.add(displayMesh);

    // Laptop upward glow light illuminating robot's face
    const laptopLight = new THREE.PointLight(0x38bdf8, 2.0, 6);
    laptopLight.position.set(0, 0.9, 0.4);
    screenGroup.add(laptopLight);

    laptopGroup.add(screenGroup);
    bodyGroup.add(laptopGroup);

    characterGroup.add(bodyGroup);

    // 3. HEAD GROUP (Pivot point at neck base for natural tracking)
    headGroup = new THREE.Group();
    headGroup.position.set(0, 2.4, 0);

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.55, 0.65, 0.8, 20);
    const neck = new THREE.Mesh(neckGeom, skinMat);
    neck.position.set(0, 0.35, 0);
    headGroup.add(neck);

    // Head Mesh
    const headGeom = new THREE.SphereGeometry(1.4, 32, 32);
    headGeom.scale(1.0, 1.08, 1.05);
    const head = new THREE.Mesh(headGeom, skinMat);
    head.position.set(0, 1.5, 0);
    headGroup.add(head);

    // Ears
    const earGeom = new THREE.SphereGeometry(0.35, 16, 16);
    earGeom.scale(0.5, 1.0, 0.8);
    const earL = new THREE.Mesh(earGeom, skinMat);
    earL.position.set(-1.42, 1.5, 0);
    earL.rotation.y = -0.2;
    const earR = new THREE.Mesh(earGeom, skinMat);
    earR.position.set(1.42, 1.5, 0);
    earR.rotation.y = 0.2;
    headGroup.add(earL, earR);

    // Stylized Anime Hair
    const hairGroup = new THREE.Group();
    hairGroup.position.set(0, 1.5, 0);

    const hairCapGeom = new THREE.SphereGeometry(1.46, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const hairCap = new THREE.Mesh(hairCapGeom, hairMat);
    hairCap.rotation.x = -0.15;
    hairGroup.add(hairCap);

    // Spiky front bangs
    const spikeGeom = new THREE.ConeGeometry(0.35, 0.9, 8);
    const spikesData = [
      { x: -0.6, y: 1.1, z: 1.1, rotZ: 0.4, rotX: 0.5 },
      { x: -0.2, y: 1.25, z: 1.2, rotZ: 0.1, rotX: 0.6 },
      { x: 0.3, y: 1.2, z: 1.15, rotZ: -0.3, rotX: 0.55 },
      { x: 0.7, y: 1.05, z: 1.05, rotZ: -0.5, rotX: 0.45 },
      { x: 0.0, y: 1.35, z: 0.9, rotZ: 0.0, rotX: 0.3 }
    ];

    spikesData.forEach(s => {
      const spike = new THREE.Mesh(spikeGeom, hairMat);
      spike.position.set(s.x, s.y, s.z);
      spike.rotation.z = s.rotZ;
      spike.rotation.x = s.rotX;
      hairGroup.add(spike);
    });
    headGroup.add(hairGroup);

    // Eyes
    const eyeWhiteGeom = new THREE.SphereGeometry(0.32, 24, 24);
    eyeWhiteGeom.scale(1.0, 1.25, 0.45);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const eyeL = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
    eyeL.position.set(-0.48, 1.52, 1.32);
    eyeL.rotation.y = -0.08;

    const eyeR = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
    eyeR.position.set(0.48, 1.52, 1.32);
    eyeR.rotation.y = 0.08;
    headGroup.add(eyeL, eyeR);

    // Pupils / Irises (Track cursor inside eyes)
    const pupilGeom = new THREE.SphereGeometry(0.16, 20, 20);
    pupilGeom.scale(1.0, 1.1, 0.4);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });

    leftPupil = new THREE.Mesh(pupilGeom, pupilMat);
    leftPupil.position.set(-0.48, 1.52, 1.45);
    headGroup.add(leftPupil);

    rightPupil = new THREE.Mesh(pupilGeom, pupilMat);
    rightPupil.position.set(0.48, 1.52, 1.45);
    headGroup.add(rightPupil);

    // Eye Sparkle Glints
    const glintGeom = new THREE.SphereGeometry(0.05, 12, 12);
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const glintL = new THREE.Mesh(glintGeom, glintMat);
    glintL.position.set(-0.42, 1.58, 1.48);
    const glintR = new THREE.Mesh(glintGeom, glintMat);
    glintR.position.set(0.54, 1.58, 1.48);
    headGroup.add(glintL, glintR);

    // Eyelids for Cartoon Blinking
    const eyelidGeom = new THREE.SphereGeometry(0.35, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    eyelidGeom.scale(1.02, 1.27, 0.5);

    leftEyelid = new THREE.Mesh(eyelidGeom, skinMat);
    leftEyelid.position.set(-0.48, 1.54, 1.33);
    leftEyelid.scale.set(1, 0.01, 1);
    headGroup.add(leftEyelid);

    rightEyelid = new THREE.Mesh(eyelidGeom, skinMat);
    rightEyelid.position.set(0.48, 1.54, 1.33);
    rightEyelid.scale.set(1, 0.01, 1);
    headGroup.add(rightEyelid);

    // Eyebrows
    const browGeom = new THREE.BoxGeometry(0.4, 0.08, 0.1);
    const browMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const browL = new THREE.Mesh(browGeom, browMat);
    browL.position.set(-0.48, 1.95, 1.38);
    browL.rotation.z = 0.08;
    const browR = new THREE.Mesh(browGeom, browMat);
    browR.position.set(0.48, 1.95, 1.38);
    browR.rotation.z = -0.08;
    headGroup.add(browL, browR);

    // Cute Smile
    const smileGeom = new THREE.TorusGeometry(0.24, 0.045, 12, 24, Math.PI);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0xc2410c });
    const smile = new THREE.Mesh(smileGeom, smileMat);
    smile.position.set(0, 1.15, 1.4);
    smile.rotation.x = 0.1;
    smile.rotation.z = Math.PI;
    headGroup.add(smile);

    // Cyber Developer Glasses
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 1.52, 1.42);

    const frameGeom = new THREE.TorusGeometry(0.38, 0.05, 12, 24);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2
    });
    const lensL = new THREE.Mesh(frameGeom, frameMat);
    lensL.position.x = -0.48;
    const lensR = new THREE.Mesh(frameGeom, frameMat);
    lensR.position.x = 0.48;

    const bridgeGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
    const bridge = new THREE.Mesh(bridgeGeom, frameMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.05, 0);

    glassesGroup.add(lensL, lensR, bridge);
    headGroup.add(glassesGroup);

    // Cyberpunk Headphones
    const headphonesGroup = new THREE.Group();
    headphonesGroup.position.set(0, 1.5, 0);

    const bandGeom = new THREE.TorusGeometry(1.62, 0.12, 16, 32, Math.PI);
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.3 });
    const band = new THREE.Mesh(bandGeom, bandMat);
    band.rotation.z = Math.PI;
    headphonesGroup.add(band);

    const earcupGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 24);
    earcupGeom.rotateZ(Math.PI / 2);
    const cupL = new THREE.Mesh(earcupGeom, darkMat);
    cupL.position.set(-1.62, 0, 0);
    const cupR = new THREE.Mesh(earcupGeom, darkMat);
    cupR.position.set(1.62, 0, 0);
    headphonesGroup.add(cupL, cupR);

    // Glowing Neon Rings on Earcups
    const glowRingGeom = new THREE.TorusGeometry(0.42, 0.06, 16, 24);
    glowRingGeom.rotateY(Math.PI / 2);

    headphoneGlowLeft = new THREE.Mesh(glowRingGeom, cyanGlowMat);
    headphoneGlowLeft.position.set(-1.8, 0, 0);

    headphoneGlowRight = new THREE.Mesh(glowRingGeom, periwinkleGlowMat);
    headphoneGlowRight.position.set(1.8, 0, 0);
    headphonesGroup.add(headphoneGlowLeft, headphoneGlowRight);

    // Microphone Boom
    const micRodGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8);
    const micRod = new THREE.Mesh(micRodGeom, darkMat);
    micRod.position.set(-1.5, -0.3, 0.45);
    micRod.rotation.x = 0.7;
    micRod.rotation.z = -0.3;
    headphonesGroup.add(micRod);

    const micTipGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const micTip = new THREE.Mesh(micTipGeom, cyanGlowMat);
    micTip.position.set(-1.25, -0.65, 0.8);
    headphonesGroup.add(micTip);

    headGroup.add(headphonesGroup);
    characterGroup.add(headGroup);

    // 4. FLOATING 3D TECH BADGES (Eye-comfort colors)
    const badgesInfo = [
      { text: '</>', bg: 'rgba(99, 102, 241, 0.85)', color: '#ffffff', border: '#818cf8', x: -3.8, y: 3.2, z: 0.5, speed: 1.2 },
      { text: '{ }', bg: 'rgba(129, 140, 248, 0.85)', color: '#ffffff', border: '#a5b4fc', x: 3.8, y: 3.5, z: 0.2, speed: 1.5 },
      { text: 'AI', bg: 'rgba(14, 165, 233, 0.85)', color: '#ffffff', border: '#38bdf8', x: -3.5, y: 0.8, z: 1.0, speed: 1.3 },
      { text: '4K', bg: 'rgba(168, 85, 247, 0.85)', color: '#ffffff', border: '#c084fc', x: 3.6, y: 1.0, z: 0.8, speed: 1.1 }
    ];

    badgesInfo.forEach(info => {
      const badgeTex = createBadgeTexture(info.text, info.bg, info.color, info.border);
      const bGeom = new THREE.PlaneGeometry(1.6, 0.8);
      const bMat = new THREE.MeshBasicMaterial({
        map: badgeTex,
        transparent: true,
        side: THREE.DoubleSide
      });
      const badgeMesh = new THREE.Mesh(bGeom, bMat);
      badgeMesh.position.set(info.x, info.y, info.z);
      badgeMesh.userData = {
        baseY: info.y,
        speed: info.speed
      };

      floatingBadges.push(badgeMesh);
      characterGroup.add(badgeMesh);
    });

    scene.add(characterGroup);
  }

  // --------------------------------------------------------------------------
  // B. STAGE 2: SKILLS (Serene 3D Cyber Constellation & Matrix)
  // --------------------------------------------------------------------------
  function buildConstellationMatrix() {
    skillsGroup = new THREE.Group();
    skillsGroup.position.set(0, 0, -1);
    skillsGroup.scale.set(0.001, 0.001, 0.001); // Morphs in smoothly on scroll

    const nodeCount = 32;
    const radius = isMobile ? 3.4 : 5.2;
    const heightSpan = 14;

    const nodeGeom = new THREE.IcosahedronGeometry(0.2, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,      // Soft Periwinkle
      transparent: true,
      opacity: 0.85
    });

    const positions = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = (i / nodeCount) * Math.PI * 2;
      const y = ((i / nodeCount) - 0.5) * heightSpan;
      const r = radius * (0.8 + 0.4 * Math.sin(phi * 2));
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.set(x, y, z);
      node.userData = {
        initialScale: 1,
        basePos: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2
      };
      skillsGroup.add(node);
      constellationNodes.push(node);
      positions.push(new THREE.Vector3(x, y, z));
    }

    // Connect neighbouring nodes with fine starlight threads
    const linePoints = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const d = positions[i].distanceTo(positions[j]);
        if (d < 4.2) {
          linePoints.push(positions[i]);
          linePoints.push(positions[j]);
        }
      }
    }

    const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,      // Calm Indigo
      transparent: true,
      opacity: 0.28
    });
    constellationLines = new THREE.LineSegments(lineGeom, lineMat);
    skillsGroup.add(constellationLines);

    // Central Floating Polyhedral Diamond
    const centerGeom = new THREE.OctahedronGeometry(1.6, 0);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x0f121d,
      roughness: 0.25,
      metalness: 0.8,
      flatShading: true
    });
    const centerMesh = new THREE.Mesh(centerGeom, centerMat);
    centerMesh.userData = { isCenter: true };
    skillsGroup.add(centerMesh);

    const centerWire = new THREE.Mesh(centerGeom, new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    }));
    centerMesh.add(centerWire);

    scene.add(skillsGroup);
  }

  // --------------------------------------------------------------------------
  // C. STAGE 3: CONTACT (Zen Horizon Geometry)
  // --------------------------------------------------------------------------
  function buildHorizonGeometry() {
    contactGroup = new THREE.Group();
    contactGroup.position.set(0, 0, -2);
    contactGroup.scale.set(0.001, 0.001, 0.001); // Morphs in on Contact section

    // 3 Sleek, Concentric Zen Rings
    const ringConfigs = [
      { radius: 4.0, tube: 0.028, color: 0x6366f1, opacity: 0.55, rotSpeed: 0.04 },
      { radius: 5.6, tube: 0.022, color: 0x818cf8, opacity: 0.40, rotSpeed: -0.03 },
      { radius: 7.2, tube: 0.018, color: 0x475569, opacity: 0.25, rotSpeed: 0.02 }
    ];

    ringConfigs.forEach((cfg) => {
      const ringGeom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      ring.userData = { rotSpeed: cfg.rotSpeed };
      horizonRings.push(ring);
      contactGroup.add(ring);
    });

    scene.add(contactGroup);
  }

  // --------------------------------------------------------------------------
  // D. AMBIENT STARDUST FIELD (Non-intrusive, Gentle Drift)
  // --------------------------------------------------------------------------
  function buildStardustField() {
    const count = isMobile ? 180 : 380;
    const geom = new THREE.BufferGeometry();

    stardustPositions = new Float32Array(count * 3);
    stardustOrigins = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0xa5b4fc); // Soft periwinkle
    const c2 = new THREE.Color(0xf1f5f9); // Gentle moonlight silver

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 55;
      const y = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 35 - 3;

      stardustPositions[i * 3]     = x;
      stardustPositions[i * 3 + 1] = y;
      stardustPositions[i * 3 + 2] = z;

      stardustOrigins[i * 3]     = x;
      stardustOrigins[i * 3 + 1] = y;
      stardustOrigins[i * 3 + 2] = z;

      const chosenColor = i % 2 === 0 ? c1 : c2;
      colors[i * 3]     = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(stardustPositions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.45 : 0.65,
      map: createStardustTexture(),
      transparent: true,
      opacity: 0.65,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    stardustSystem = new THREE.Points(geom, pMat);
    scene.add(stardustSystem);
  }

  // --------------------------------------------------------------------------
  // EYE-COMFORT POP ANIMATION SYSTEM (On-Click / Touch Anywhere)
  // --------------------------------------------------------------------------
  function triggerEyeComfortPop(clientX, clientY) {
    // 1. DOM Soft Luminous Ripple
    const ripple = document.createElement('div');
    ripple.className = 'click-pop-ripple';
    ripple.style.left = `${clientX}px`;
    ripple.style.top = `${clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 600);

    // 2. Cursor Outline Micro-Pulse
    if (cursorOutline) {
      cursorOutline.classList.add('cursor-pop');
      setTimeout(() => cursorOutline.classList.remove('cursor-pop'), 220);
    }

    // 3. 3D Ethereal Ring & Micro-Stardust Dispersal
    if (!scene || !camera) return;

    const ndcX = (clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const spawnPos = camera.position.clone().add(dir.multiplyScalar(distance));

    const popGroup = new THREE.Group();
    popGroup.position.copy(spawnPos);

    // Ethereal Soft Torus Ring
    const ringGeom = new THREE.TorusGeometry(0.38, 0.02, 16, 40);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8, // Soft Periwinkle
      transparent: true,
      opacity: 0.75
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    popGroup.add(ringMesh);

    // 6 Micro-stardust motes radiating outward
    const sparks = [];
    const sparkGeom = new THREE.SphereGeometry(0.042, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xf1f5f9, // Soft Moonlight
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < 6; i++) {
      const spark = new THREE.Mesh(sparkGeom, sparkMat);
      const angle = (i / 6) * Math.PI * 2;
      spark.userData = {
        vx: Math.cos(angle) * (1.2 + Math.random() * 0.4),
        vy: Math.sin(angle) * (1.2 + Math.random() * 0.4)
      };
      popGroup.add(spark);
      sparks.push(spark);
    }

    popGroup.userData = {
      opacity: 0.75,
      sparks: sparks,
      age: 0,
      maxAge: 0.52
    };

    activePops.push(popGroup);
    scene.add(popGroup);

    // 4. Robot Coder Cute Micro-Reaction
    if (headGroup) {
      headGroup.rotation.x += 0.07;
      isBlinking = true;
      blinkTimer = 0;
      blinkElapsed = 0;
    }
  }

  // --------------------------------------------------------------------------
  // E. RESPONSIVE POSITIONING & SCROLL TRACKER
  // --------------------------------------------------------------------------
  function updateSectionWeights() {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const skillsEl = document.getElementById('skills');
    const contactEl = document.getElementById('contact');

    const skillsTop = skillsEl ? skillsEl.offsetTop - 320 : 1600;
    const contactTop = contactEl ? contactEl.offsetTop - 320 : 2600;

    if (scroll < skillsTop) {
      // Hero & About: Robot Coder Active
      sectionWeights.hero = 1;
      sectionWeights.skills = 0;
      sectionWeights.contact = 0;
    } else if (scroll >= skillsTop && scroll < contactTop) {
      // Skills Stage: Serene 3D Cyber Constellation
      sectionWeights.hero = 0;
      sectionWeights.skills = 1;
      sectionWeights.contact = 0;
    } else {
      // Contact Stage: Zen Horizon Rings
      sectionWeights.hero = 0;
      sectionWeights.skills = 0;
      sectionWeights.contact = 1;
    }
  }

  function updateCoreStagePosition() {
    if (!characterGroup || !camera) return;

    const width = window.innerWidth;
    const isMobileDevice = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const stage = document.getElementById('hero-3d-stage');

    if (isMobileDevice) {
      characterGroup.userData.targetX = 0;
      characterGroup.userData.targetY = -0.5;
      characterGroup.userData.baseScale = 0.78;
    } else if (isTablet) {
      characterGroup.userData.targetX = 5.2;
      characterGroup.userData.targetY = -2.6;
      characterGroup.userData.baseScale = 0.95;
    } else {
      let targetX = width > 1300 ? 8.2 : 7.8;
      let targetY = -3.2;

      if (stage) {
        const rect = stage.getBoundingClientRect();
        const screenX = rect.left + rect.width * 0.52;
        const screenY = rect.top + rect.height * 0.60;

        const ndcX = (screenX / window.innerWidth) * 2 - 1;
        const ndcY = -(screenY / window.innerHeight) * 2 + 1;

        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

        targetX = Math.max(7.2, worldPos.x);
        targetY = worldPos.y - 2.0;
      }

      characterGroup.userData.targetX = targetX;
      characterGroup.userData.targetY = targetY;
      characterGroup.userData.baseScale = 1.18;
    }
  }

  // --------------------------------------------------------------------------
  // F. INITIALIZE 3D UNIVERSE
  // --------------------------------------------------------------------------
  function init3D() {
    if (!canvas || !isWebGLAvailable() || typeof THREE === 'undefined') {
      console.warn('Three.js or WebGL not available. Running fallback mode.');
      return;
    }

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090e, 0.018);

    camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 16);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    // Refined, Eye-Comfort Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x181c38, 2.6);
    scene.add(ambientLight);

    // Key Light (Soft Indigo)
    const keyLight = new THREE.DirectionalLight(0x818cf8, 1.8);
    keyLight.position.set(10, 15, 12);
    scene.add(keyLight);

    // Rim Light (Deep Indigo)
    const rimLight = new THREE.DirectionalLight(0x4338ca, 1.4);
    rimLight.position.set(-8, -6, 6);
    scene.add(rimLight);

    // Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.9);
    fillLight.position.set(0, 10, -10);
    scene.add(fillLight);

    // Build the 3 Section Stages & Ambient Field
    buildRobotCoder();          // Stage 1: Hero & About (The Beloved 3D Character)
    buildConstellationMatrix(); // Stage 2: Skills
    buildHorizonGeometry();     // Stage 3: Contact
    buildStardustField();       // Ambient Field

    updateCoreStagePosition();
    updateSectionWeights();

    if (characterGroup && characterGroup.userData.targetX !== undefined) {
      characterGroup.position.set(characterGroup.userData.targetX, characterGroup.userData.targetY, 0);
    }

    animate3D();
  }

  // --------------------------------------------------------------------------
  // G. ANIMATION RENDER LOOP (Robot Character & Section Morphing)
  // --------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate3D() {
    animationFrameId = requestAnimationFrame(animate3D);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    const motionFactor = prefersReducedMotion ? 0.6 : 1.0;

    // Smooth, responsive mouse & scroll interpolation (Zero sluggish lag)
    mouse.x += (mouse.targetX - mouse.x) * 0.22;
    mouse.y += (mouse.targetY - mouse.y) * 0.22;
    scrollY += (targetScrollY - scrollY) * 0.08;

    // Smooth section transition weights
    const wHero = sectionWeights.hero;
    const wSkills = sectionWeights.skills;
    const wContact = sectionWeights.contact;

    // ========================================================
    // 1. STAGE 1: HERO & ABOUT (3D Robot Coder)
    // ========================================================
    if (characterGroup) {
      const baseScale = characterGroup.userData.baseScale || 1.18;
      const targetScale = baseScale * wHero;
      characterGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      characterGroup.visible = characterGroup.scale.x > 0.01;

      if (characterGroup.visible) {
        const targetX = characterGroup.userData.targetX !== undefined ? characterGroup.userData.targetX : (isMobile ? 0 : 7.8);
        const targetY = characterGroup.userData.targetY !== undefined ? characterGroup.userData.targetY : (isMobile ? -0.5 : -3.2);

        // Dynamic Position Parallax (Robot visibly shifts and floats towards cursor)
        const parallaxX = mouse.x * 0.9 * motionFactor;
        const parallaxY = mouse.y * 0.55 * motionFactor;
        const breath = Math.sin(elapsedTime * 2.2) * 0.14;

        characterGroup.position.x += ((targetX + parallaxX) - characterGroup.position.x) * 0.18;
        characterGroup.position.y += ((targetY + breath + parallaxY) - characterGroup.position.y) * 0.18;

        // Whole character 3D tilt towards cursor
        const charTiltY = mouse.x * 0.35 * motionFactor;
        const charTiltX = -mouse.y * 0.22 * motionFactor;
        characterGroup.rotation.y += (charTiltY - characterGroup.rotation.y) * 0.18;
        characterGroup.rotation.x += (charTiltX - characterGroup.rotation.x) * 0.18;

        // Head tracking mouse cursor in real-time (yaw, pitch, roll) - HIGH SENSITIVITY
        if (headGroup) {
          const targetRotY = mouse.x * 1.45 * motionFactor;
          headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.25;

          const targetRotX = -mouse.y * 1.15 * motionFactor;
          headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.25;

          const targetRotZ = mouse.x * -0.22 * motionFactor;
          headGroup.rotation.z += (targetRotZ - headGroup.rotation.z) * 0.20;
        }

        // Eye pupils tracking cursor with full responsive travel
        if (leftPupil && rightPupil) {
          const pupilShiftX = Math.max(-0.16, Math.min(0.16, mouse.x * 0.18)) * motionFactor;
          const pupilShiftY = Math.max(-0.14, Math.min(0.14, mouse.y * 0.16)) * motionFactor;

          leftPupil.position.x = -0.48 + pupilShiftX;
          leftPupil.position.y = 1.52 + pupilShiftY;

          rightPupil.position.x = 0.48 + pupilShiftX;
          rightPupil.position.y = 1.52 + pupilShiftY;
        }

        // Cartoon Blinking Animation
        blinkTimer += delta;
        if (blinkTimer > 3.8) {
          isBlinking = true;
          blinkTimer = 0;
          blinkElapsed = 0;
        }

        if (isBlinking && leftEyelid && rightEyelid) {
          blinkElapsed += delta;
          const progress = blinkElapsed / blinkDuration;

          if (progress <= 0.5) {
            const closeScale = (progress / 0.5);
            leftEyelid.scale.y = Math.max(0.01, closeScale);
            rightEyelid.scale.y = Math.max(0.01, closeScale);
          } else if (progress <= 1.0) {
            const openScale = 1.0 - ((progress - 0.5) / 0.5);
            leftEyelid.scale.y = Math.max(0.01, openScale);
            rightEyelid.scale.y = Math.max(0.01, openScale);
          } else {
            isBlinking = false;
            leftEyelid.scale.y = 0.01;
            rightEyelid.scale.y = 0.01;
          }
        }

        // Body follows cursor dynamically
        if (bodyGroup) {
          const bodyYaw = mouse.x * 0.55 * motionFactor;
          const bodyPitch = -mouse.y * 0.28 * motionFactor;
          bodyGroup.rotation.y += (bodyYaw - bodyGroup.rotation.y) * 0.20;
          bodyGroup.rotation.x += (bodyPitch - bodyGroup.rotation.x) * 0.20;

          // Subtle typing hands jitter
          if (leftArm && rightArm) {
            leftArm.rotation.x = Math.sin(elapsedTime * 6) * 0.03;
            rightArm.rotation.x = Math.cos(elapsedTime * 6) * 0.03;
          }
        }

        // Headphone glow subtle pulse
        if (headphoneGlowLeft && headphoneGlowRight) {
          const glowScale = 1.0 + Math.sin(elapsedTime * 3) * 0.05;
          headphoneGlowLeft.scale.set(glowScale, glowScale, glowScale);
          headphoneGlowRight.scale.set(glowScale, glowScale, glowScale);
        }

        // Floating Badges
        floatingBadges.forEach(badge => {
          badge.position.y = badge.userData.baseY + 
            Math.sin(elapsedTime * badge.userData.speed) * 0.22 * motionFactor;
          badge.rotation.y = Math.sin(elapsedTime * 0.8) * 0.15;
        });
      }
    }

    // ========================================================
    // 2. STAGE 2: SKILLS (Serene 3D Cyber Constellation)
    // ========================================================
    if (skillsGroup) {
      const targetScale = (isMobile ? 0.75 : 1.0) * wSkills;
      skillsGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
      skillsGroup.visible = skillsGroup.scale.x > 0.01;

      if (skillsGroup.visible) {
        skillsCurrentSpeed += (skillsBaseSpeed - skillsCurrentSpeed) * 0.05;

        // Slow celestial rotation
        skillsGroup.rotation.y += skillsCurrentSpeed * delta * motionFactor;
        skillsGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08 + (-mouse.y * 0.15);

        // Nodes gentle twinkle
        constellationNodes.forEach((node) => {
          const pulse = 1.0 + Math.sin(elapsedTime * 1.5 + node.userData.phase) * 0.12;
          node.scale.set(pulse, pulse, pulse);
        });

        // Rotate central diamond
        const center = skillsGroup.children.find(c => c.userData && c.userData.isCenter);
        if (center) {
          center.rotation.y = elapsedTime * 0.15 * motionFactor;
          center.rotation.x = elapsedTime * 0.10 * motionFactor;
        }
      }
    }

    // ========================================================
    // 3. STAGE 3: CONTACT (Zen Horizon Geometry)
    // ========================================================
    if (contactGroup) {
      const targetScale = (isMobile ? 0.75 : 1.05) * wContact;
      contactGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
      contactGroup.visible = contactGroup.scale.x > 0.01;

      if (contactGroup.visible) {
        contactGroup.rotation.x = -mouse.y * 0.15;
        contactGroup.rotation.y = mouse.x * 0.15;

        // Slow harmonic counter-rotation of concentric rings
        horizonRings.forEach(ring => {
          ring.rotation.z += ring.userData.rotSpeed * delta * motionFactor;
        });
      }
    }

    // ========================================================
    // 4. AMBIENT STARDUST FIELD (Non-jarring Brownian Drift)
    // ========================================================
    if (stardustSystem && stardustPositions && stardustOrigins) {
      const count = stardustPositions.length / 3;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const ox = stardustOrigins[idx];
        const oy = stardustOrigins[idx + 1];
        const oz = stardustOrigins[idx + 2];

        const driftX = Math.sin(elapsedTime * 0.2 + i) * 0.35;
        const driftY = Math.cos(elapsedTime * 0.25 + i * 0.7) * 0.35;

        stardustPositions[idx]     = ox + driftX;
        stardustPositions[idx + 1] = oy + driftY;
        stardustPositions[idx + 2] = oz;
      }
      stardustSystem.geometry.attributes.position.needsUpdate = true;
      stardustSystem.rotation.y = elapsedTime * 0.008 * motionFactor;
    }

    // ========================================================
    // 5. ANIMATE EYE-COMFORT 3D POPS
    // ========================================================
    for (let i = activePops.length - 1; i >= 0; i--) {
      const pop = activePops[i];
      pop.userData.age += delta;
      const progress = pop.userData.age / pop.userData.maxAge;

      if (progress >= 1.0) {
        scene.remove(pop);
        activePops.splice(i, 1);
      } else {
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentScale = 0.5 + ease * 2.6;
        pop.scale.set(currentScale, currentScale, 1);

        const currentOpacity = (1 - ease) * pop.userData.opacity;
        pop.children.forEach(child => {
          if (child.material) child.material.opacity = Math.max(0, currentOpacity);
        });

        pop.userData.sparks.forEach(spark => {
          spark.position.x = spark.userData.vx * ease * 1.4;
          spark.position.y = spark.userData.vy * ease * 1.4;
        });
      }
    }

    // Soft Camera Scroll Tracking
    camera.position.y = -(scrollY * 0.006);

    renderer.render(scene, camera);
  }

  // --------------------------------------------------------------------------
  // H. WINDOW RESIZE & SCREEN ADAPTATION
  // --------------------------------------------------------------------------
  window.addEventListener('resize', () => {
    if (!renderer || !camera) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));

    updateCoreStagePosition();
    updateSectionWeights();
  });

  window.addEventListener('load', () => {
    updateCoreStagePosition();
    updateSectionWeights();
  });

  // Dynamic Mouse & Touch Coordinate Tracker with Enhanced Robot Sensitivity
  function updateMouseCoordinates(clientX, clientY) {
    const stage = document.getElementById('hero-3d-stage');
    if (stage && window.innerWidth >= 768) {
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.55;
      // Relative offset from Robot's actual on-screen anchor
      const rawX = (clientX - centerX) / (window.innerWidth * 0.38);
      const rawY = -(clientY - centerY) / (window.innerHeight * 0.38);
      mouse.targetX = Math.max(-1.4, Math.min(1.4, rawX));
      mouse.targetY = Math.max(-1.4, Math.min(1.4, rawY));
    } else {
      // Screen-centered for mobile / fallback
      const rawX = (clientX / window.innerWidth) * 2 - 1;
      const rawY = -(clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = Math.max(-1.4, Math.min(1.4, rawX * 1.35));
      mouse.targetY = Math.max(-1.4, Math.min(1.4, rawY * 1.35));
    }
  }

  // Track cursor movement (Desktop)
  window.addEventListener('mousemove', (e) => {
    updateMouseCoordinates(e.clientX, e.clientY);
  });

  // Track touch movement (Mobile / Tablet)
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      updateMouseCoordinates(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      updateMouseCoordinates(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  // Track scroll position for Section-Morphing
  window.addEventListener('scroll', () => {
    targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
    updateSectionWeights();
  }, { passive: true });

  // Eye-Comfort Click & Touch Pop Animation Listeners
  window.addEventListener('click', (e) => {
    // Skip if clicking inside text inputs so typing is comfortable
    if (e.target.closest('input, textarea, select')) return;
    triggerEyeComfortPop(e.clientX, e.clientY);
  });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      if (touch.target.closest('input, textarea, select')) return;
      triggerEyeComfortPop(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  // Interactive Skill Cards link to 3D Constellation
  const skillCardsList = document.querySelectorAll('.skill-card');
  skillCardsList.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (skillsGroup) {
        skillsCurrentSpeed = 0.28;
        constellationNodes.forEach(node => {
          node.scale.set(1.4, 1.4, 1.4);
          setTimeout(() => node.scale.set(1, 1, 1), 350);
        });
      }
    });
  });

  // Launch 3D World!
  init3D();


  /* ============================================================================
     3. CUSTOM MINIMALIST CURSOR FOLLOWER
     ============================================================================ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline && !isMobile && !prefersReducedMotion) {
    let mousePos = { x: -100, y: -100 };
    let outlinePos = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;

      cursorDot.style.left = `${mousePos.x}px`;
      cursorDot.style.top = `${mousePos.y}px`;
    });

    function renderCursor() {
      outlinePos.x += (mousePos.x - outlinePos.x) * 0.18;
      outlinePos.y += (mousePos.y - outlinePos.y) * 0.18;

      cursorOutline.style.left = `${outlinePos.x}px`;
      cursorOutline.style.top = `${outlinePos.y}px`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, .glass-card, .filter-btn, .social-icon-btn, .social-circle-btn'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });
  }


  /* ============================================================================
     4. DYNAMIC TYPEWRITER EFFECT (Hero Tagline)
     ============================================================================ */
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'Coder',
    'Video Editor',
    'Web Developer',
    'AI Automation Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();


  /* ============================================================================
     5. NAVBAR: SCROLL EFFECT & MOBILE DRAWER TOGGLE
     ============================================================================ */
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }


  /* ============================================================================
     6. ACTIVE NAVIGATION SPY (Intersection Observer)
     ============================================================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  /* ============================================================================
     7. SKILLS FILTER TABS
     ============================================================================ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ============================================================================
     8. CONTACT FORM HANDLER (Direct Mailto + Copy Message Feature)
     ============================================================================ */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formNotification = document.getElementById('form-notification');
  const copyMessageBtn = document.getElementById('copy-message-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  function showNotification(message, type = 'success') {
    if (!formNotification) return;

    formNotification.textContent = message;
    formNotification.className = `form-notification ${type}`;
    formNotification.style.display = 'flex';

    setTimeout(() => {
      formNotification.style.display = 'none';
    }, 5000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const service = document.getElementById('service-select').value;
      const subject = document.getElementById('sender-subject').value.trim() || `Inquiry from ${name} (${service})`;
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        showNotification('Please fill in all required fields (Name, Email, Message).', 'error');
        return;
      }

      const emailBody = 
`Hi Sourav,

Name: ${name}
Email: ${email}
Interested Service: ${service}

Message:
${message}

--------------------------
Sent via portfolio website.`;

      const mailtoUrl = `mailto:souravkumar817879@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      showNotification('Opening your default email application... Please send the message!', 'success');
      window.location.href = mailtoUrl;
    });
  }

  if (copyMessageBtn) {
    copyMessageBtn.addEventListener('click', () => {
      const name = document.getElementById('sender-name').value.trim() || 'Client';
      const email = document.getElementById('sender-email').value.trim() || 'Not specified';
      const service = document.getElementById('service-select').value;
      const message = document.getElementById('sender-message').value.trim();

      if (!message) {
        showNotification('Please write a message before copying.', 'error');
        return;
      }

      const formattedText = 
`To: souravkumar817879@gmail.com
Subject: Inquiry regarding ${service}
From: ${name} (${email})

${message}`;

      navigator.clipboard.writeText(formattedText).then(() => {
        showNotification('Message copied to clipboard! You can paste it into Gmail/Outlook.', 'success');
      }).catch(() => {
        showNotification('Could not copy automatically. Please copy the text manually.', 'error');
      });
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailAddress = 'souravkumar817879@gmail.com';
      navigator.clipboard.writeText(emailAddress).then(() => {
        const originalIcon = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #34d399;"></i>';
        showNotification('Email address copied to clipboard: souravkumar817879@gmail.com', 'success');
        
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalIcon;
        }, 2500);
      }).catch(() => {
        showNotification('Failed to copy. Email is: souravkumar817879@gmail.com', 'error');
      });
    });
  }


  /* ============================================================================
     9. DYNAMIC FOOTER CURRENT YEAR
     ============================================================================ */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
