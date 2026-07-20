"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { store } from "@/lib/store";
import { ACT_WINDOWS, LAYERS } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- helpers ---------------- */
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
/** local act time 0..1 */
const actT = (p: number, i: number) => {
  const [a, b] = ACT_WINDOWS[i];
  return clamp01((p - a) / (b - a));
};
/** 0→1→0 presence envelope inside an act, with soft shoulders */
const env = (t: number, inS = 0.12, outS = 0.12) =>
  smooth(clamp01(t / inS)) * smooth(clamp01((1 - t) / outS));

const PLATINUM = 0xd6dbe4;

type Anno = { el: HTMLDivElement; left: boolean };

export default function Scene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      wrap.style.display = "none";
      return;
    }
    renderer.setClearColor(0x0b0c0e, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c0e, 0.055);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    /* ---------------- lights ---------------- */
    scene.add(new THREE.HemisphereLight(0x8fa3bf, 0x0b0c0e, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(4, 7, 6);
    scene.add(key);
    const accentLight = new THREE.PointLight(store.ral.hex, 26, 26, 1.6);
    accentLight.position.set(0, -1.4, 1.4);
    scene.add(accentLight);

    /* ---------------- materials ---------------- */
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: 0.92, roughness: 0.3 });
    const darkSteel = new THREE.MeshStandardMaterial({ color: 0x2e333b, metalness: 0.85, roughness: 0.55 });
    const zincMat = new THREE.MeshStandardMaterial({ color: 0xc6cdd6, metalness: 0.95, roughness: 0.22 });
    const primerMat = new THREE.MeshStandardMaterial({ color: 0x8d8f7a, metalness: 0.2, roughness: 0.8 });
    const coatedMat = new THREE.MeshStandardMaterial({ color: store.ral.hex, metalness: 0.35, roughness: 0.4 });
    const filmMat = new THREE.MeshStandardMaterial({ color: 0xdfe5ee, metalness: 0.1, roughness: 0.15, transparent: true, opacity: 0.26 });
    const serviceMat = new THREE.MeshStandardMaterial({ color: 0x5a5f68, metalness: 0.4, roughness: 0.7 });
    const lineMat = new THREE.LineBasicMaterial({ color: PLATINUM, transparent: true, opacity: 0.4 });

    /* ---------------- floor grid ---------------- */
    const grid = new THREE.GridHelper(90, 90, 0x232830, 0x161a20);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.33;
    grid.position.y = -2.3;
    scene.add(grid);

    /* ---------------- ACT 1–2 · the coil ---------------- */
    const coil = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.14, 72, 1, false), steelMat);
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.18, 40), darkSteel);
    coil.add(barrel, bore);
    // wound-strip spiral on both faces
    const spiralPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) {
      const t = i / 240;
      const a = t * Math.PI * 2 * 7;
      const r = 0.52 + (1.47 - 0.52) * t;
      spiralPts.push(new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)));
    }
    const spiralGeo = new THREE.BufferGeometry().setFromPoints(spiralPts);
    const faceA = new THREE.Line(spiralGeo, lineMat);
    faceA.position.y = 0.575;
    const faceB = faceA.clone();
    faceB.position.y = -0.575;
    coil.add(faceA, faceB);
    coil.rotation.z = Math.PI / 2; // axis → world X
    const coilPivot = new THREE.Group();
    coilPivot.add(coil);
    scene.add(coilPivot);

    /* ---------------- ACT 2 · ribbon ---------------- */
    const SEG = 160;
    const ribGeo = new THREE.BufferGeometry();
    const ribPos = new Float32Array((SEG + 1) * 2 * 3);
    ribGeo.setAttribute("position", new THREE.BufferAttribute(ribPos, 3));
    const ribIdx: number[] = [];
    for (let i = 0; i < SEG; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      ribIdx.push(a, b, c, b, d, c);
    }
    ribGeo.setIndex(ribIdx);
    const ribbon = new THREE.Mesh(
      ribGeo,
      new THREE.MeshStandardMaterial({ color: 0xb9c1cc, metalness: 0.9, roughness: 0.28, side: THREE.DoubleSide })
    );
    ribbon.visible = false;
    scene.add(ribbon);

    /* ---------------- ACT 3 · the seven-layer stack ---------------- */
    const TH = [0.07, 0.1, 0.07, 0.09, 0.46, 0.09, 0.08];
    const stackMats = [filmMat, coatedMat, primerMat, zincMat, steelMat, zincMat, serviceMat];
    const stack = new THREE.Group();
    const stackBoxes: THREE.Mesh[] = [];
    const totalTh = TH.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.4, TH[i], 1.95), stackMats[i]);
      stack.add(m);
      stackBoxes.push(m);
    }
    stack.position.set(9, 0.1, 0);
    stack.visible = false;
    scene.add(stack);

    /* ---------------- ACT 4–5 · strips + coating head ---------------- */
    const strips = new THREE.Group();
    const bareStrips: THREE.Mesh[] = [];
    const paintPivots: THREE.Group[] = [];
    for (let i = 0; i < 8; i++) {
      const bare = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.075, 1), steelMat);
      strips.add(bare);
      bareStrips.push(bare);
      const pivot = new THREE.Group();
      pivot.position.x = -1.7;
      const paint = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.085, 1), coatedMat);
      paint.position.x = 1.7;
      pivot.add(paint);
      pivot.scale.x = 0.0001;
      strips.add(pivot);
      paintPivots.push(pivot);
    }
    strips.position.set(10.6, 0, 0);
    strips.visible = false;
    scene.add(strips);

    const roller = new THREE.Group();
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.5, 40), darkSteel);
    drum.rotation.x = Math.PI / 2; // axis → Z
    const drumBand = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.2, 40), coatedMat);
    drumBand.rotation.x = Math.PI / 2;
    roller.add(drum, drumBand);
    roller.position.set(10.6, 0.52, 0);
    roller.visible = false;
    scene.add(roller);

    /* ---------------- ACT 6 · swarm → India ---------------- */
    // stylised India outline (x east, y north), same silhouette as the material's map work
    const OUTLINE: [number, number][] = [
      [116, 10], [183, 40], [232, 70], [222, 100], [261, 136], [309, 162], [386, 196], [415, 184],
      [463, 194], [512, 156], [545, 162], [558, 184], [518, 210], [469, 250], [471, 284], [444, 276],
      [409, 302], [367, 310], [332, 344], [290, 384], [251, 424], [236, 464], [238, 484], [224, 520],
      [183, 578], [158, 544], [133, 488], [108, 428], [95, 362], [91, 318], [83, 294], [54, 322],
      [23, 302], [10, 276], [21, 254], [56, 254], [37, 220], [60, 182], [104, 142], [126, 100], [114, 48],
    ];
    const inPoly = (x: number, y: number) => {
      let inside = false;
      for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
        const [xi, yi] = OUTLINE[i];
        const [xj, yj] = OUTLINE[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };
    const mapPts: [number, number][] = [];
    for (let gy = 10; gy <= 580; gy += 26) {
      for (let gx = 10; gx <= 560; gx += 26) {
        if (inPoly(gx, gy)) mapPts.push([gx, gy]);
      }
    }
    const COUNT = mapPts.length;
    const SW_X = 15.4, SW_SCALE = 5.6 / 580; // world height ≈ 5.6
    const indiaPos: THREE.Vector3[] = mapPts.map(
      ([x, y]) => new THREE.Vector3(SW_X + (x - 285) * SW_SCALE, (330 - y) * SW_SCALE, -0.6)
    );
    const gridPos: THREE.Vector3[] = mapPts.map((_, i) => {
      const col = i % 12, row = Math.floor(i / 12);
      return new THREE.Vector3(SW_X - 1.9 + col * 0.34, 2.1 - row * 0.34, -0.6);
    });
    const swarm = new THREE.InstancedMesh(
      new THREE.TorusGeometry(0.085, 0.032, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0xaab2bd, metalness: 0.9, roughness: 0.35 }),
      COUNT
    );
    swarm.visible = false;
    scene.add(swarm);
    // Delhi hub — the yard
    const hub = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.05, 10, 26),
      new THREE.MeshStandardMaterial({ color: store.ral.hex, emissive: store.ral.hex, emissiveIntensity: 1.4, metalness: 0.4, roughness: 0.3 })
    );
    // Delhi at outline coords ≈ (178,168)
    hub.position.set(SW_X + (178 - 285) * SW_SCALE, (330 - 168) * SW_SCALE, -0.55);
    hub.visible = false;
    scene.add(hub);

    /* ---------------- sparks ---------------- */
    const P_COUNT = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(P_COUNT * 3);
    const pSeed = new Float32Array(P_COUNT);
    for (let i = 0; i < P_COUNT; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 26;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      pSeed[i] = Math.random();
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const sparks = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x8b93a1, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false })
    );
    scene.add(sparks);

    /* ---------------- camera rail ---------------- */
    type WP = { p: number; pos: [number, number, number]; look: [number, number, number] };
    const RAIL: WP[] = [
      { p: 0.0, pos: [-0.2, 0.35, 6.6], look: [-1.35, 0.05, 0] },
      { p: ACT_WINDOWS[1][0], pos: [2.2, 0.55, 5.8], look: [1.6, -0.5, 0] },
      { p: ACT_WINDOWS[2][0], pos: [7.4, 0.7, 5.6], look: [7.9, -0.3, 0] },
      { p: ACT_WINDOWS[3][0], pos: [8.6, 0.5, 7.5], look: [8.35, 0.05, 0] },
      { p: ACT_WINDOWS[4][0], pos: [9.85, 0.9, 6.25], look: [10.75, 0.0, 0] },
      { p: ACT_WINDOWS[5][0], pos: [10.7, 0.75, 6.0], look: [10.7, 0.1, 0] },
      { p: 1.0, pos: [15.4, 0.5, 8.6], look: [15.4, 0.5, -0.6] },
    ];
    const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vLook = new THREE.Vector3();
    const camEval = (p: number) => {
      let s = 0;
      while (s < RAIL.length - 2 && p > RAIL[s + 1].p) s++;
      const a = RAIL[s], b = RAIL[s + 1];
      const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
      vA.set(...a.pos).lerp(vB.set(...b.pos), t);
      vLook.set(...a.look).lerp(vB.set(...b.look), t);
      if (camera.aspect < 0.85) vA.z *= 1.5; // phones see the whole station
      camera.position.copy(vA);
      camera.lookAt(vLook);
    };

    /* ---------------- annotation DOM ---------------- */
    const annos: Anno[] = annoRefs.current
      .map((el, i) => ({ el: el!, left: i % 2 === 1 }))
      .filter((a) => a.el);
    const chips = chipRefs.current.filter(Boolean) as HTMLDivElement[];
    const project = (v: THREE.Vector3) => {
      const p = v.clone().project(camera);
      return { x: (p.x * 0.5 + 0.5) * wrap.clientWidth, y: (-p.y * 0.5 + 0.5) * wrap.clientHeight, behind: p.z > 1 };
    };

    /* ---------------- store subscriptions ---------------- */
    const applyRal = () => {
      const c = new THREE.Color(store.ral.hex);
      gsap.to(coatedMat.color, { r: c.r, g: c.g, b: c.b, duration: 0.7, ease: "power2.out" });
      gsap.to(accentLight.color, { r: c.r, g: c.g, b: c.b, duration: 0.7 });
      const hm = hub.material as THREE.MeshStandardMaterial;
      gsap.to(hm.color, { r: c.r, g: c.g, b: c.b, duration: 0.7 });
      gsap.to(hm.emissive, { r: c.r, g: c.g, b: c.b, duration: 0.7 });
    };
    const applySlit = () => {
      const n = store.slit;
      const gapT = lastSlitGap; // keep current spread
      layoutStrips(n, gapT, true);
    };
    const unsub = store.subscribe(() => { applyRal(); applySlit(); });

    let lastSlitGap = 0;
    const layoutStrips = (n: number, gapT: number, animate = false) => {
      const totalW = 1.95;
      const gap = 0.16 * gapT;
      const w = (totalW - gap * (n - 1)) / n;
      for (let i = 0; i < 8; i++) {
        const on = i < n;
        bareStrips[i].visible = on;
        paintPivots[i].visible = on;
        if (!on) continue;
        const z = -totalW / 2 + w / 2 + i * (w + gap);
        const apply = (o: THREE.Object3D, sy: number) => {
          if (animate) gsap.to(o.position, { z, duration: 0.6, ease: "power3.out" });
          else o.position.z = z;
          o.scale.z = w;
        };
        apply(bareStrips[i], 0);
        apply(paintPivots[i], 0);
      }
    };
    layoutStrips(store.slit, 0);

    /* ---------------- film progress ---------------- */
    const st = ScrollTrigger.create({
      trigger: "#film",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => store.setFilmProgress(self.progress),
    });

    /* ---------------- resize ---------------- */
    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------------- choreography ---------------- */
    const dummy = new THREE.Object3D();
    let pSm = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      pSm += (store.filmProgress - pSm) * 0.12;
      const p = pSm;
      camEval(p);

      const t1 = actT(p, 0), t2 = actT(p, 1), t3 = actT(p, 2), t4 = actT(p, 3), t5 = actT(p, 4), t6 = actT(p, 5);

      /* — coil (acts 1–2) — */
      const coilOn = p < ACT_WINDOWS[2][0] + 0.03;
      coilPivot.visible = coilOn;
      if (coilOn) {
        coilPivot.rotation.y = -0.55 * (1 - smooth(clamp01(t2 * 1.6)));
        if (!reduce) coil.rotation.x -= dt * (0.25 + t2 * 2.2);
        const rad = lerp(1, 0.42, smooth(t2));
        barrel.scale.set(rad, 1, rad);
        faceA.scale.set(rad, 1, rad);
        faceB.scale.set(rad, 1, rad);
        coil.position.x = lerp(0, 1.2, smooth(t2));
      }

      /* — ribbon (act 2 → dissolves into act 3) — */
      const ribOn = t2 > 0.02 && t3 < 0.35;
      ribbon.visible = ribOn;
      if (ribOn) {
        const headX = lerp(coil.position.x + 0.2, 9.0, smooth(t2));
        const startX = coil.position.x;
        const yBase = -1.5 * lerp(1, 0.42, smooth(t2));
        for (let i = 0; i <= SEG; i++) {
          const u = i / SEG;
          const x = lerp(startX, headX, u);
          const sag = Math.sin(u * Math.PI) * 0.22 * (1 - t2 * 0.6);
          const y = yBase - sag + u * (0.1 - yBase); // rise toward stack height
          ribPos[i * 6] = x; ribPos[i * 6 + 1] = y; ribPos[i * 6 + 2] = -0.55;
          ribPos[i * 6 + 3] = x; ribPos[i * 6 + 4] = y; ribPos[i * 6 + 5] = 0.55;
        }
        ribGeo.attributes.position.needsUpdate = true;
        ribGeo.computeVertexNormals();
        (ribbon.material as THREE.MeshStandardMaterial).opacity = 1;
      }

      /* — stack (act 3) — */
      const stackOn = t3 > 0.02 && t4 < 0.3;
      stack.visible = stackOn;
      if (stackOn) {
        const appear = smooth(clamp01(t3 / 0.18));
        const explode = smooth(clamp01((t3 - 0.22) / 0.55));
        const gap = 0.34 * explode;
        let y = -(totalTh + gap * 6) / 2;
        for (let i = 6; i >= 0; i--) {
          const m = stackBoxes[i];
          m.position.y = y + TH[i] / 2;
          y += TH[i] + gap;
        }
        stack.rotation.y = -0.42 + t3 * 0.3;
        stack.scale.setScalar(lerp(0.6, 1, appear));
        // fold back together as act 4 approaches
        if (t4 > 0) stack.position.x = 9 + smooth(t4 / 0.3) * 1.6;
        else stack.position.x = 9;

        // annotations
        for (let i = 0; i < annos.length; i++) {
          const reveal = clamp01((explode - (0.18 + i * 0.09)) / 0.12);
          const a = annos[i];
          if (reveal <= 0.01 || !stackOn) { a.el.style.opacity = "0"; continue; }
          const side = a.left ? -2.15 : 2.15;
          vA.set(side, stackBoxes[i].position.y, 0);
          stack.localToWorld(vA);
          const s = project(vA);
          const x = a.left ? Math.max(s.x, 340) : Math.min(s.x, wrap.clientWidth - 250);
          a.el.style.opacity = String(reveal * env(t3, 0.1, 0.14));
          a.el.style.left = `${x}px`;
          a.el.style.top = `${s.y}px`;
        }
      } else {
        for (const a of annos) a.el.style.opacity = "0";
      }

      /* — hero chips (act 1) — */
      const chipOn = t1 > 0.05 && t2 < 0.25;
      for (let i = 0; i < chips.length; i++) {
        const c = chips[i];
        if (!chipOn) { c.style.opacity = "0"; continue; }
        vA.set(0, i === 0 ? 1.72 : -1.55, i === 0 ? 0.3 : 0.55).add(coil.position);
        const s = project(vA);
        c.style.opacity = String(env(t1, 0.25, 0.4) * (1 - t2 * 4 > 0 ? 1 : 0));
        c.style.left = `${s.x}px`;
        c.style.top = `${s.y}px`;
      }

      /* — strips + coating (acts 4–5) — */
      const stripsOn = t4 > 0.05 && t6 < 0.2;
      strips.visible = stripsOn;
      roller.visible = t5 > 0.04 && t6 < 0.15;
      if (stripsOn) {
        const spread = smooth(clamp01((t4 - 0.15) / 0.5));
        if (Math.abs(spread - lastSlitGap) > 0.002) {
          lastSlitGap = spread;
          layoutStrips(store.slit, spread);
        }
        strips.rotation.y = -0.24 + t4 * 0.12;
        const paintOn = t5 > 0.02;
        const paintP = smooth(clamp01((t5 - 0.12) / 0.6));
        for (let i = 0; i < 8; i++) {
          paintPivots[i].visible = paintOn && i < store.slit;
          paintPivots[i].scale.x = Math.max(0.0001, paintP);
        }
        if (roller.visible && !reduce) drum.rotation.z += dt * 3;
        roller.position.x = 10.6 + lerp(-1.7, 1.7, paintP) * 0.98;
        if (t5 > 0.1) {
          accentLight.position.set(roller.position.x, 0.5, 1.5);
          accentLight.intensity = 14 * env(t5, 0.15, 0.2) + 5;
        }
      }

      /* — swarm (act 6) — */
      const swarmOn = t6 > 0.02;
      swarm.visible = swarmOn;
      hub.visible = t6 > 0.55;
      if (swarmOn) {
        accentLight.position.set(hub.position.x, hub.position.y, 1.4);
        accentLight.intensity = 10 * smooth(clamp01((t6 - 0.5) / 0.3)) + 2;
      }
      if (swarmOn) {
        const morph = smooth(clamp01((t6 - 0.18) / 0.6));
        const appear = smooth(clamp01(t6 / 0.15));
        for (let i = 0; i < COUNT; i++) {
          const dly = (i % 23) / 23 * 0.25;
          const m = smooth(clamp01((morph - dly) / (1 - dly + 0.001)));
          vA.copy(gridPos[i]).lerp(indiaPos[i], m);
          dummy.position.copy(vA);
          dummy.scale.setScalar(appear * (0.7 + 0.3 * m));
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          swarm.setMatrixAt(i, dummy.matrix);
        }
        swarm.instanceMatrix.needsUpdate = true;
        if (hub.visible && !reduce) hub.scale.setScalar(1 + Math.sin(time * 2.4) * 0.12);
      }

      /* — sparks — */
      if (!reduce) {
        const px = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < P_COUNT; i++) {
          px[i * 3 + 1] += dt * (0.06 + pSeed[i] * 0.12);
          if (px[i * 3 + 1] > 4.2) px[i * 3 + 1] = -4.2;
        }
        pGeo.attributes.position.needsUpdate = true;
        sparks.position.x = camera.position.x;
      }

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(tick);

    return () => {
      renderer.setAnimationLoop(null);
      st.kill();
      unsub();
      window.removeEventListener("resize", resize);
      renderer.dispose();
      pmrem.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 hidden md:block">
        {LAYERS.map((l, i) => (
          <div
            key={i}
            ref={(el) => { annoRefs.current[i] = el; }}
            className={`anno ${i % 2 === 1 ? "anno--left" : ""}`}
          >
            <span className="a-name block">{l.name}</span>
            <span className="a-spec block">{l.spec}</span>
          </div>
        ))}
        <div ref={(el) => { chipRefs.current[0] = el; }} className="anno">
          <span className="a-name block">MASTER COIL</span>
          <span className="a-spec block">1,250 mm · wound at the mill</span>
        </div>
        <div ref={(el) => { chipRefs.current[1] = el; }} className="anno anno--left">
          <span className="a-name block">21 YEARS</span>
          <span className="a-spec block">on this exact job</span>
        </div>
      </div>
    </div>
  );
}
