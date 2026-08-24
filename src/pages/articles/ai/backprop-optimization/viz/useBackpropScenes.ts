import { useEffect, useState, type KeyboardEvent } from "react";

export function useBackpropScenes(length: number) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % length), 2200);
    return () => window.clearInterval(timer);
  }, [length, playing]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActive((value) => (value + 1) % length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActive((value) => (value - 1 + length) % length);
    } else if (event.key === " ") {
      event.preventDefault();
      setPlaying((value) => !value);
    }
  };

  return { active, playing, setActive, setPlaying, onKeyDown };
}
