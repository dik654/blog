import type { KeyboardEvent } from 'react';

type TabKey = 'ArrowRight' | 'ArrowDown' | 'ArrowLeft' | 'ArrowUp' | 'Home' | 'End';

export function handleTabKey(
  event: KeyboardEvent<HTMLElement>,
  currentIndex: number,
  itemCount: number,
  onSelect: (index: number) => void,
) {
  if (itemCount < 1) return;

  const key = event.key as TabKey;
  let nextIndex = currentIndex;
  if (key === 'ArrowRight' || key === 'ArrowDown') nextIndex = (currentIndex + 1) % itemCount;
  else if (key === 'ArrowLeft' || key === 'ArrowUp') nextIndex = (currentIndex - 1 + itemCount) % itemCount;
  else if (key === 'Home') nextIndex = 0;
  else if (key === 'End') nextIndex = itemCount - 1;
  else return;

  event.preventDefault();
  onSelect(nextIndex);

  const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(':scope > [role="tab"]');
  tabs?.[nextIndex]?.focus();
}
