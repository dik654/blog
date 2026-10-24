import { useCallback, useEffect, useId, useState, type KeyboardEvent } from "react";

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

export function useAnimatedScenes(
  length: number,
  intervalMs = 2400,
  options: {
    loop?: boolean;
    autoPlay?: boolean;
    keyboardPlayback?: boolean;
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
  const playbackId = useId();

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
    if (isTextEditingTarget(event.target)) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === " ") {
      if (!keyboardPlayback || isInteractiveTarget(event.target)) return;
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
