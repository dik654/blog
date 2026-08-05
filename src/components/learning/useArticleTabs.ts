import { useId, type KeyboardEvent } from 'react';

interface ArticleTabsOptions<Key extends string> {
  keys: readonly Key[];
  value: Key;
  onChange: (key: Key) => void;
}

export function useArticleTabs<Key extends string>({ keys, value, onChange }: ArticleTabsOptions<Key>) {
  const baseId = useId().replaceAll(':', '');
  const panelId = `${baseId}-panel`;

  const focusTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabs = event.currentTarget
      .closest('[role="tablist"]')
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[index]?.focus();
  };

  const getTabProps = (key: Key, index: number) => ({
    id: `${baseId}-tab-${key}`,
    role: 'tab' as const,
    'aria-selected': value === key,
    'aria-controls': panelId,
    tabIndex: value === key ? 0 : -1,
    onClick: () => onChange(key),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % keys.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + keys.length) % keys.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = keys.length - 1;
      else return;

      event.preventDefault();
      onChange(keys[nextIndex]);
      focusTab(event, nextIndex);
    },
  });

  return {
    getTabProps,
    panelProps: {
      id: panelId,
      role: 'tabpanel' as const,
      'aria-labelledby': `${baseId}-tab-${value}`,
      tabIndex: 0,
    },
  };
}
