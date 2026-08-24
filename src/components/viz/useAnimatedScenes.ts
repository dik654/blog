import { useEffect, useState, type KeyboardEvent } from "react";

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function useAnimatedScenes(length: number, intervalMs = 2400) {
  const [active, setActiveState] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(
      () => setActiveState((value) => (value + 1) % length),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [intervalMs, length, playing, reducedMotion]);

  const setActive = (value: number) => {
    setActiveState((value + length) % length);
    setPlaying(false);
  };

  const move = (offset: number) => setActive(active + offset);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isEditableTarget(event.target)) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === " ") {
      event.preventDefault();
      if (!reducedMotion) setPlaying((value) => !value);
    }
  };

  return {
    active,
    playing,
    reducedMotion,
    setActive,
    setPlaying,
    onKeyDown,
  };
}
