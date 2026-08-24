import { useEffect, useState, type KeyboardEvent } from "react";

export function useStory(length: number, interval = 2600) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setStep((value) => (value + 1) % length),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [interval, length, playing]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setStep((value) => (value + 1) % length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setStep((value) => (value - 1 + length) % length);
    }
    if (event.key === " ") {
      event.preventDefault();
      setPlaying((value) => !value);
    }
  };

  return { step, setStep, playing, setPlaying, onKeyDown };
}
