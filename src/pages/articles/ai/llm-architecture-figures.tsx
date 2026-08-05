import { useState } from 'react';
import type { CSSProperties } from 'react';

type Figure = {
  title: string;
  src: string;
  note: string;
};

const base = 'https://sebastianraschka.com';

export function ArchitectureFigureStrip({ figures }: { figures: Figure[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = figures[activeIndex] ?? figures[0];

  if (!active) return null;

  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
      data-architecture-figure-viewer
      data-viz-needs-pan="true"
    >
      <div className="border-b border-border bg-muted/15 p-3 sm:p-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,9rem),1fr))] gap-2" role="tablist" aria-label="대표 모델 구조도 선택">
          {figures.map((figure, index) => (
            <button
              key={figure.title}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls="architecture-figure-panel"
              onClick={() => setActiveIndex(index)}
              className={`min-h-11 border px-3 py-2 text-left text-xs font-bold leading-5 transition-colors ${activeIndex === index ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted'}`}
            >
              {String(index + 1).padStart(2, '0')} · {figure.title}
            </button>
          ))}
        </div>
      </div>

      <figure id="architecture-figure-panel" role="tabpanel" data-viz-canvas className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <a
          href={`${base}${active.src}`}
          target="_blank"
          rel="noopener noreferrer"
          className="grid min-h-[30rem] min-w-0 place-items-center overflow-hidden bg-white p-4 dark:bg-neutral-950 sm:min-h-[38rem] lg:min-h-[44rem]"
          aria-label={`${active.title} 구조도 원본 크기로 열기`}
        >
          <img
            key={active.src}
            src={`${base}${active.src}`}
            alt={`${active.title} architecture diagram`}
            className="h-auto max-h-[42rem] w-full object-contain"
            loading="lazy"
            data-viz-readable-target="true"
            style={{ '--article-viz-readable-width': '980px' } as CSSProperties}
          />
        </a>
        <figcaption className="border-t border-border bg-muted/20 p-5 text-sm leading-7 text-muted-foreground lg:border-l lg:border-t-0">
          <div className="font-mono text-xs font-bold text-primary">MODEL {String(activeIndex + 1).padStart(2, '0')}</div>
          <strong className="mt-2 block text-base text-foreground">{active.title}</strong>
          <span className="mt-3 block">{active.note}</span>
          <span className="mt-5 block border-t border-border pt-4 text-xs leading-6">
            Source: Sebastian Raschka LLM Architecture Gallery. 전체 구조를 먼저 본 뒤 세부 보기 또는 전체화면 확대에서 label을 확인한다.
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
