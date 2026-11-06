import { useEffect, useRef, useState, type ReactNode } from "react";
import type * as ThreeNS from "three";

export type Three = typeof ThreeNS;
export type Vec3 = readonly [number, number, number];

export interface Scene3DLabel {
  text: string;
  at: Vec3;
  tone?: "default" | "accent";
}

export interface Scene3DContent {
  /** 움직일 것이 있으면 프레임마다 호출합니다. 없으면 정지 화면 한 장만 그립니다. */
  tick?: (seconds: number) => void;
}

interface Scene3DCanvasProps {
  /** 현재 장면의 물체를 root에 넣습니다. sceneKey가 바뀌면 root를 비우고 다시 호출합니다. */
  build: (three: Three, root: ThreeNS.Group) => Scene3DContent;
  sceneKey: string | number;
  labels?: readonly Scene3DLabel[];
  ariaLabel: string;
  /** WebGL을 쓸 수 없을 때 같은 결론을 보여 줄 2D 그림입니다. */
  fallback: ReactNode;
  reducedMotion?: boolean;
  /** 기본 시점의 수평 각도(라디안)입니다. */
  azimuth?: number;
  elevation?: number;
  distance?: number;
  className?: string;
}

function disposeTree(root: ThreeNS.Object3D) {
  root.traverse((node) => {
    const mesh = node as ThreeNS.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material as ThreeNS.Material | ThreeNS.Material[] | undefined;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else material?.dispose();
  });
}

/**
 * 블로그의 3D Viz 공통 틀입니다.
 * - three.js는 화면 가까이 왔을 때 처음 불러옵니다.
 * - 프레임은 화면 안 + 탭 표시 + 움직임 허용 + tick 있음일 때만 그립니다.
 * - unmount하면 frame, observer, listener, GPU 자원을 모두 해제합니다.
 */
export default function Scene3DCanvas({
  build,
  sceneKey,
  labels = [],
  ariaLabel,
  fallback,
  reducedMotion = false,
  azimuth = -0.6,
  elevation = 0.32,
  distance = 9.5,
  className = "h-[230px] sm:h-[340px]",
}: Scene3DCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  const latest = useRef({ build, labels, reducedMotion });
  latest.current = { build, labels, reducedMotion };
  const rebuildRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let disposed = false;
    let teardown: (() => void) | null = null;

    const start = async () => {
      let THREE: Three;
      try {
        THREE = await import("three");
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (disposed) return;

      let renderer: ThreeNS.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      const root = new THREE.Group();
      scene.add(root);

      let content: Scene3DContent = {};
      let yaw = azimuth;
      let frame = 0;
      let inView = true;
      const startedAt = performance.now();

      const drawLabels = () => {
        const rect = host.getBoundingClientRect();
        const point = new THREE.Vector3();
        latest.current.labels.forEach((label, index) => {
          const element = labelRefs.current[index];
          if (!element) return;
          point.set(label.at[0], label.at[1], label.at[2]).project(camera);
          const halfW = element.offsetWidth / 2 + 2;
          const halfH = element.offsetHeight / 2 + 2;
          // 좁은 화면에서도 글자가 틀 밖으로 잘리지 않게 안쪽으로 밀어 넣습니다.
          const x = Math.min(rect.width - halfW, Math.max(halfW, ((point.x + 1) / 2) * rect.width));
          const y = Math.min(rect.height - halfH, Math.max(halfH, ((1 - point.y) / 2) * rect.height));
          element.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        });
      };

      const draw = (seconds: number) => {
        // 좁은 화면에서는 가로 폭이 들어오도록 물러납니다.
        const fit = distance * Math.max(1, 1.6 / camera.aspect);
        camera.position.set(
          Math.sin(yaw) * Math.cos(elevation) * fit,
          Math.sin(elevation) * fit,
          Math.cos(yaw) * Math.cos(elevation) * fit,
        );
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
        content.tick?.(seconds);
        renderer.render(scene, camera);
        drawLabels();
      };

      const animates = () =>
        Boolean(content.tick) && !latest.current.reducedMotion && inView && !document.hidden;

      const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
      };
      const loop = () => {
        frame = 0;
        if (!animates()) return;
        draw((performance.now() - startedAt) / 1000);
        frame = requestAnimationFrame(loop);
      };
      const refresh = () => {
        stop();
        draw(latest.current.reducedMotion ? 0 : (performance.now() - startedAt) / 1000);
        if (animates()) frame = requestAnimationFrame(loop);
      };

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        refresh();
      };

      rebuildRef.current = () => {
        disposeTree(root);
        root.clear();
        content = latest.current.build(THREE, root);
        refresh();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      const viewObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) refresh();
        else stop();
      });
      viewObserver.observe(host);
      const onVisibility = () => {
        if (document.hidden) stop();
        else refresh();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onContextLost = (event: Event) => {
        event.preventDefault();
        stop();
        setFailed(true);
      };
      canvas.addEventListener("webglcontextlost", onContextLost);

      // 가로로 끌면 돌리고 세로 움직임은 페이지 스크롤에 맡깁니다.
      let dragX: number | null = null;
      const onDown = (event: PointerEvent) => {
        dragX = event.clientX;
        canvas.setPointerCapture(event.pointerId);
      };
      const onMove = (event: PointerEvent) => {
        if (dragX === null) return;
        yaw -= (event.clientX - dragX) * 0.008;
        dragX = event.clientX;
        if (!frame) draw(latest.current.reducedMotion ? 0 : (performance.now() - startedAt) / 1000);
      };
      const onUp = () => {
        dragX = null;
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);

      resize();
      rebuildRef.current();

      teardown = () => {
        stop();
        rebuildRef.current = null;
        resizeObserver.disconnect();
        viewObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        disposeTree(root);
        renderer.dispose();
        renderer.forceContextLoss();
      };
    };

    // 화면 가까이 온 뒤에만 three.js를 받습니다.
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearObserver.disconnect();
        void start();
      },
      { rootMargin: "300px" },
    );
    nearObserver.observe(host);

    return () => {
      disposed = true;
      nearObserver.disconnect();
      teardown?.();
    };
  }, [azimuth, elevation, distance]);

  useEffect(() => {
    rebuildRef.current?.();
  }, [sceneKey, reducedMotion]);

  if (failed) return <div className={className}>{fallback}</div>;

  return (
    <div ref={hostRef} className={`relative min-w-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      />
      {labels.map((label, index) => (
        <span
          key={`${label.text}-${index}`}
          ref={(element) => {
            labelRefs.current[index] = element;
          }}
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded bg-background/85 px-1.5 py-0.5 text-xs font-semibold ${
            label.tone === "accent" ? "text-primary" : "text-foreground"
          }`}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}
