import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { flushSync } from "react-dom";

function isTextEditingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement &&
      target.isContentEditable)
  );
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest('button, a, [role="button"], [role="link"]'))
  );
}

const CONTROLS = "[data-viz-controls]";

function findStableStage(root: HTMLElement | null) {
  if (!root) return null;
  const figure = root.closest("figure");
  const controls = root.querySelector<HTMLElement>(CONTROLS) ?? figure?.querySelector<HTMLElement>(CONTROLS);
  if (!controls) return null;
  return { root, controls };
}

/** 현재 장면의 조작부 위치와 장면 높이를, 앞서 예약한 값을 지운 자연 상태로 잽니다. */
function measureNaturalStage(root: HTMLElement, controls: HTMLElement) {
  root.style.minHeight = "";
  controls.style.marginTop = "";
  // sticky가 canvas 끝에 붙들린 위치가 아니라 문서 흐름의 위치를 잽니다.
  controls.style.position = "static";
  const rootRect = root.getBoundingClientRect();
  const natural = {
    controlsTop: controls.getBoundingClientRect().top - rootRect.top,
    height: rootRect.height,
  };
  controls.style.position = "";
  return natural;
}

export function useAnimatedScenes(
  length: number,
  intervalMs = 2400,
  options: {
    loop?: boolean;
    autoPlay?: boolean;
    keyboardPlayback?: boolean;
    /** 장면 루트에 이미 앵커 id가 있으면 그 id를 넘겨 두 번째 id 없이 재사용합니다. */
    playbackId?: string;
  } = {},
) {
  const {
    loop = true,
    autoPlay = false,
    keyboardPlayback = true,
  } = options;
  const [active, setActiveState] = useState(0);
  const [playing, setPlayingState] = useState(autoPlay);
  const [reducedMotion, setReducedMotion] = useState(false);
  const generatedPlaybackId = useId();
  const playbackId = options.playbackId ?? generatedPlaybackId;
  const activeRef = useRef(active);
  const reservedRef = useRef({ controlsTop: 0, height: 0 });

  /** 현재 장면이 짧아도 조작부와 frame이 가장 큰 장면의 자리에 머물도록 빈 공간을 예약합니다. */
  const reserveStage = useCallback(() => {
    const stage = findStableStage(document.getElementById(playbackId));
    if (!stage) return;
    const { root, controls } = stage;
    const natural = measureNaturalStage(root, controls);
    const reserved = reservedRef.current;
    // 동기 측정에 잡히지 않는 장면(exit 애니메이션 뒤 mount 등)을 만나면 기준을 올립니다.
    reserved.controlsTop = Math.max(reserved.controlsTop, natural.controlsTop);
    reserved.height = Math.max(reserved.height, natural.height);
    const gap = reserved.controlsTop - natural.controlsTop;
    if (gap > 0.5) {
      const margin = Number.parseFloat(getComputedStyle(controls).marginTop) || 0;
      controls.style.marginTop = `${margin + gap}px`;
      // margin은 앞 요소의 아래 여백과 상쇄될 수 있어 실제 위치로 한 번 더 맞춥니다.
      controls.style.position = "static";
      const moved = controls.getBoundingClientRect().top - root.getBoundingClientRect().top;
      controls.style.position = "";
      const remaining = reserved.controlsTop - moved;
      if (Math.abs(remaining) > 0.5) controls.style.marginTop = `${margin + gap + remaining}px`;
    }
    root.style.minHeight = `${reserved.height}px`;
  }, [playbackId]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useLayoutEffect(reserveStage, [active, reserveStage]);

  useEffect(() => {
    const root = document.getElementById(playbackId);
    const stage = findStableStage(root);
    if (!root || !stage || length < 2 || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let measured = false;
    let measuredWidth = 0;
    let disposed = false;
    const measureAllScenes = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = root.getBoundingClientRect().width;
        if (disposed || width === 0) return;
        const current = activeRef.current;
        const reserved = { controlsTop: 0, height: 0 };
        // rAF 안의 동기 렌더라 그려지기 전에 원래 장면으로 돌아옵니다.
        for (let scene = 0; scene < length; scene += 1) {
          flushSync(() => setActiveState(scene));
          const natural = measureNaturalStage(root, stage.controls);
          reserved.controlsTop = Math.max(reserved.controlsTop, natural.controlsTop);
          reserved.height = Math.max(reserved.height, natural.height);
        }
        reservedRef.current = reserved;
        flushSync(() => setActiveState(current));
        reserveStage();
        measured = true;
        measuredWidth = width;
      });
    };

    const nearViewport = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearViewport.disconnect();
        measureAllScenes();
        void document.fonts?.ready.then(() => {
          if (!disposed) measureAllScenes();
        });
      },
      { rootMargin: "1500px 0px" },
    );
    nearViewport.observe(root);
    const resize = new ResizeObserver(() => {
      if (measured && Math.abs(root.getBoundingClientRect().width - measuredWidth) > 1) measureAllScenes();
    });
    resize.observe(root);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      nearViewport.disconnect();
      resize.disconnect();
    };
  }, [length, playbackId, reserveStage]);

  const setPlaying = useCallback((value: boolean) => {
    if (value && !loop && active >= length - 1) setActiveState(0);
    setPlayingState(value);
  }, [active, length, loop]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlayingState(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const containerElement = document.getElementById(playbackId);
    if (!containerElement || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPlayingState(false);
      },
      { threshold: 0.05 },
    );
    observer.observe(containerElement);
    return () => observer.disconnect();
  }, [playbackId]);

  useEffect(() => {
    const stopWhenHidden = () => {
      if (document.hidden) setPlayingState(false);
    };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => document.removeEventListener("visibilitychange", stopWhenHidden);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    if (!loop && active >= length - 1) return;
    const timer = window.setTimeout(
      () => {
        if (!loop && active >= length - 2) {
          setActiveState(length - 1);
          setPlayingState(false);
          return;
        }
        setActiveState((value) => (value + 1) % length);
      },
      intervalMs,
    );
    return () => window.clearTimeout(timer);
  }, [active, intervalMs, length, loop, playing, reducedMotion]);

  useLayoutEffect(() => {
    const sceneRoot = document.getElementById(playbackId);
    const scrollRegion = sceneRoot?.parentElement?.closest("[data-viz-canvas]");
    if (scrollRegion instanceof HTMLElement && scrollRegion !== sceneRoot) {
      scrollRegion.scrollTop = 0;
    }
  }, [active, playbackId]);

  const setActive = (value: number) => {
    setActiveState(
      loop
        ? (value + length) % length
        : Math.max(0, Math.min(length - 1, value)),
    );
    setPlayingState(false);
  };

  const move = (offset: number) => setActive(active + offset);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isTextEditingTarget(event.target) || isInteractiveTarget(event.target)) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === " ") {
      if (!keyboardPlayback) return;
      event.preventDefault();
      if (!reducedMotion) setPlaying(!playing);
    }
  };

  return {
    playbackId,
    active,
    playing,
    reducedMotion,
    setActive,
    setPlaying,
    onKeyDown,
  };
}
