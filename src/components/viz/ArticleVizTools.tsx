import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, RotateCcw, ScanSearch, Shrink, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  articleRef: RefObject<HTMLElement | null>;
}

const MIN_VISUAL_WIDTH = 180;
const MIN_VISUAL_HEIGHT = 80;
const MIN_READABLE_TEXT_HEIGHT = 15;
const MAX_READABLE_VISUAL_WIDTH = 1600;

function visualElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('svg[viewBox], canvas, img'))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width >= MIN_VISUAL_WIDTH && rect.height >= MIN_VISUAL_HEIGHT;
    });
}

function hasVisualTrait(element: HTMLElement) {
  if (element.matches('[data-article-viz], [data-scene], [data-step-viz], [data-viz-canvas]')) {
    return true;
  }
  return Array.from(element.attributes).some(({ name }) => (
    /^data-.+(?:-lab|-viz|-viewer|-explorer|-diagram|-timeline|-map|-flow|-stack)$/.test(name)
  ));
}

function presentationPanels(article: HTMLElement) {
  if (article.dataset.articleVizSystem !== 'technical') return [];
  const candidates = Array.from(article.querySelectorAll<HTMLElement>('.not-prose')).filter((element) => {
    if (
      element.matches('pre, a, [role="math"], [data-formula-pair], [data-formula-note], [data-learning-question], [data-concept-primer]')
      || element.closest('[data-formula-note]')
    ) return false;
    const isFigure = element.matches('figure');
    const isExplicitExplorer = element.classList.contains('foundation-viz-explorer');
    const hasPurposefulGraphic = Boolean(element.querySelector('svg[role="img"], canvas'));
    const isFramedExplainer = element.classList.contains('overflow-hidden')
      && element.classList.contains('border')
      && element.classList.contains('rounded-md');
    return isFigure || isExplicitExplorer || hasVisualTrait(element) || hasPurposefulGraphic || isFramedExplainer;
  });

  return candidates.filter((candidate) => (
    !candidates.some((parent) => parent !== candidate && parent.contains(candidate))
  ));
}

function findSurfaces(article: HTMLElement): HTMLElement[] {
  const candidates = [
    ...presentationPanels(article),
    ...Array.from(article.querySelectorAll<HTMLElement>('.not-prose'))
      .filter((element) => element.hasAttribute('data-scene') || visualElements(element).length > 0),
  ];
  const unique = Array.from(new Set(candidates));

  return unique.filter((candidate) => (
    !unique.some((nested) => nested !== candidate && candidate.contains(nested))
  ));
}

function sameElements(a: HTMLElement[], b: HTMLElement[]) {
  return a.length === b.length && a.every((element, index) => element === b[index]);
}

function directHeadingBefore(surface: HTMLElement, article: HTMLElement): HTMLElement | null {
  const section = surface.closest('section');
  const sectionHeading = section?.querySelector<HTMLElement>(':scope > h2, :scope > h3');
  if (sectionHeading) return sectionHeading;

  let anchor: HTMLElement | null = surface;
  while (anchor && anchor !== article) {
    let previous = anchor.previousElementSibling;
    while (previous) {
      if (previous instanceof HTMLElement && previous.matches('h2, h3')) return previous;
      const nested = previous.querySelector<HTMLElement>('h2, h3');
      if (nested) return nested;
      previous = previous.previousElementSibling;
    }
    anchor = anchor.parentElement;
  }
  return null;
}

function decoratePresentationPanels(article: HTMLElement) {
  const panels = presentationPanels(article);
  panels.forEach((panel, index) => {
    const sequence = `V${String(index + 1).padStart(2, '0')}`;
    panel.setAttribute('data-article-viz', 'true');
    if (article.classList.contains('foundation-article')) {
      panel.setAttribute('data-foundation-viz', 'true');
    } else {
      panel.removeAttribute('data-foundation-viz');
    }
    panel.setAttribute('data-viz-sequence', sequence);
    const heading = directHeadingBefore(panel, article)?.textContent?.trim();
    if (heading) panel.setAttribute('data-viz-title', heading);

    const caption = panel.querySelector<HTMLElement>(':scope > figcaption');
    if (caption) {
      panel.setAttribute('data-viz-has-caption', 'true');
      caption.setAttribute('data-viz-sequence', sequence);
    } else {
      panel.removeAttribute('data-viz-has-caption');
    }

    const hasControls = Boolean(panel.querySelector('[role="tablist"], input[type="range"]'));
    const hasGraphic = Boolean(panel.querySelector('svg[role="img"], canvas'));
    const rowCount = Array.from(panel.children)
      .filter((child) => child.classList.contains('border-b')).length;
    panel.setAttribute(
      'data-viz-kind',
      hasControls ? 'interactive' : hasGraphic ? 'diagram' : rowCount >= 3 ? 'matrix' : 'flow',
    );
  });
  return panels;
}

function visualContextFor(heading: string): string {
  if (/(공격|방어|위협|취약|완화|보안)/i.test(heading)) {
    return `${heading}: 공격 표면에서 어떤 상태가 바뀌고, 방어 경계가 어디서 작동하는지 연결해 본다.`;
  }
  if (/(비교|차이|vs\.?|trade-?off)/i.test(heading)) {
    return `${heading}: 두 경로가 처음 갈라지는 지점과 그 차이가 최종 결과에 미치는 영향을 찾는다.`;
  }
  if (/(수식|계산|공식|손실|확률|점수|비용|요금|수익)/i.test(heading)) {
    return `${heading}: 각 입력값이 어느 항에 들어가고, 최종 값에 얼마나 영향을 주는지 추적한다.`;
  }
  if (/(흐름|과정|절차|파이프라인|생명주기|라이프사이클|실행|처리)/i.test(heading)) {
    return `${heading}: 입력이 어떤 중간 상태를 거쳐 출력으로 바뀌는지 순서대로 따라간다.`;
  }
  if (/(구조|아키텍처|계층|구성|스택|모듈|컴포넌트)/i.test(heading)) {
    return `${heading}: 구성 요소가 무엇을 주고받으며, 각 책임의 경계가 어디인지 먼저 구분한다.`;
  }
  return `${heading}: 핵심 입력, 내부 상태 변화, 결과를 구분해 전체 연결을 먼저 본다.`;
}

function calibrateNarrativeContext(surface: HTMLElement, article: HTMLElement) {
  if (surface.querySelector(':scope > figcaption')) {
    surface.removeAttribute('data-viz-context');
    return;
  }
  if (surface.querySelector('[data-scene-question], [data-step-viz-narrative], :scope > header')) {
    surface.removeAttribute('data-viz-context');
    return;
  }
  const heading = directHeadingBefore(surface, article)?.textContent?.trim();
  if (heading && article.classList.contains('foundation-article')) {
    surface.setAttribute('data-viz-context', heading);
  } else if (heading) surface.setAttribute('data-viz-context', visualContextFor(heading));
  else surface.removeAttribute('data-viz-context');
}

function calibrateLegibility(surface: HTMLElement) {
  const hasNativeHeader = Boolean(surface.querySelector(':scope > header'));
  if (hasNativeHeader) surface.setAttribute('data-viz-native-header', 'true');
  else surface.removeAttribute('data-viz-native-header');

  if (surface.querySelector('[data-viz-canvas], :scope > figcaption') || hasNativeHeader) {
    surface.removeAttribute('data-viz-toolbar-rail');
    if (surface.querySelector(':scope > figcaption')) {
      surface.setAttribute('data-viz-integrated-toolbar', 'true');
    }
  } else {
    surface.setAttribute('data-viz-toolbar-rail', 'true');
    surface.removeAttribute('data-viz-integrated-toolbar');
  }

  const svgs = visualElements(surface)
    .filter((element) => element.tagName.toLowerCase() === 'svg')
    .sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return br.width * br.height - ar.width * ar.height;
    });

  svgs.forEach((svg) => {
    const isScene = surface.hasAttribute('data-scene');
    if (svg.hasAttribute('data-viz-fit') && !isScene) return;
    if (svg.hasAttribute('data-viz-readable-target')) return;

    const heights = Array.from(svg.querySelectorAll<SVGTextElement>('text'))
      .map((text) => text.getBoundingClientRect().height)
      .filter((height) => height > 0)
      .sort((a, b) => a - b);
    if (heights.length === 0) return;

    const median = heights[Math.floor(heights.length / 2)];
    if (median >= MIN_READABLE_TEXT_HEIGHT) return;

    const width = svg.getBoundingClientRect().width;
    const readableWidth = Math.min(
      MAX_READABLE_VISUAL_WIDTH,
      Math.ceil(width * (MIN_READABLE_TEXT_HEIGHT / median)),
    );
    if (readableWidth <= width + 24) return;

    surface.setAttribute('data-viz-needs-pan', 'true');
    svg.setAttribute('data-viz-readable-target', 'true');
    svg.style.setProperty('--article-viz-readable-width', `${readableWidth}px`);
  });
}

function zoomTarget(surface: HTMLElement): HTMLElement | null {
  if (surface.matches('[data-viz-canvas]')) return surface;

  const marked = surface.querySelector<HTMLElement>('[data-viz-canvas]');
  if (marked) return marked;

  const visuals = visualElements(surface);
  return visuals.sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return br.width * br.height - ar.width * ar.height;
  })[0] ?? null;
}

export default function ArticleVizTools({ articleRef }: Props) {
  const [surfaces, setSurfaces] = useState<HTMLElement[]>([]);
  const [expanded, setExpanded] = useState<HTMLElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [detailSurfaces, setDetailSurfaces] = useState<Set<HTMLElement>>(() => new Set());

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    let frame = 0;
    const scan = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = findSurfaces(article);
        decoratePresentationPanels(article);
        next.forEach((surface) => {
          calibrateLegibility(surface);
          calibrateNarrativeContext(surface, article);
        });
        setSurfaces((current) => sameElements(current, next) ? current : next);
      });
    };

    scan();
    article.addEventListener('load', scan, true);
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(article, { childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(scan);
    resizeObserver.observe(article);

    return () => {
      cancelAnimationFrame(frame);
      article.removeEventListener('load', scan, true);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      presentationPanels(article).forEach((panel) => {
        panel.removeAttribute('data-article-viz');
        panel.removeAttribute('data-foundation-viz');
        panel.removeAttribute('data-viz-sequence');
        panel.removeAttribute('data-viz-title');
        panel.removeAttribute('data-viz-kind');
        panel.removeAttribute('data-viz-has-caption');
        panel.querySelector(':scope > figcaption')?.removeAttribute('data-viz-sequence');
      });
    };
  }, [articleRef]);

  useEffect(() => {
    surfaces.forEach((surface) => surface.classList.add('article-viz-surface'));
    return () => surfaces.forEach((surface) => {
      surface.classList.remove('article-viz-surface');
      surface.removeAttribute('data-viz-needs-pan');
      surface.removeAttribute('data-viz-inline-detail');
      surface.removeAttribute('data-viz-toolbar-rail');
      surface.removeAttribute('data-viz-integrated-toolbar');
      surface.removeAttribute('data-viz-context');
      surface.removeAttribute('data-viz-native-header');
      surface.querySelectorAll<HTMLElement>('[data-viz-readable-target]')
        .forEach((element) => {
          element.removeAttribute('data-viz-readable-target');
          element.style.removeProperty('--article-viz-readable-width');
        });
    });
  }, [surfaces]);

  useEffect(() => {
    if (!expanded) return;

    const rect = expanded.getBoundingClientRect();
    const placeholder = document.createElement('div');
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.className = 'article-viz-placeholder';
    placeholder.style.height = `${rect.height}px`;
    expanded.before(placeholder);

    const target = zoomTarget(expanded);
    target?.setAttribute('data-viz-zoom-target', 'true');
    expanded.classList.add('article-viz-expanded');
    document.body.classList.add('article-viz-modal-open');

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      target?.removeAttribute('data-viz-zoom-target');
      expanded.removeAttribute('data-viz-zoomed');
      expanded.style.removeProperty('--article-viz-zoom');
      expanded.classList.remove('article-viz-expanded');
      document.body.classList.remove('article-viz-modal-open');
      placeholder.remove();
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    expanded.style.setProperty('--article-viz-zoom', `${Math.round(zoom * 100)}%`);
    expanded.setAttribute('data-viz-zoomed', zoom > 1 ? 'true' : 'false');

    const frame = requestAnimationFrame(() => {
      const horizontalRange = Math.max(0, expanded.scrollWidth - expanded.clientWidth);
      if (horizontalRange > 0) expanded.scrollLeft = horizontalRange / 2;
    });

    return () => cancelAnimationFrame(frame);
  }, [expanded, zoom]);

  const open = (surface: HTMLElement) => {
    const readableTarget = surface.querySelector<HTMLElement>('[data-viz-readable-target="true"]');
    const readableWidth = Number.parseFloat(
      readableTarget?.style.getPropertyValue('--article-viz-readable-width') ?? '',
    );
    const availableWidth = Math.max(280, window.innerWidth - 48);
    const mobileReadableZoom = Number.isFinite(readableWidth)
      ? Math.min(3, Math.max(1.5, readableWidth / availableWidth))
      : 2;
    const isMobile = window.innerWidth <= 640;

    setZoom(
      isMobile && surface.hasAttribute('data-scene')
        ? 1.5
        : isMobile && surface.hasAttribute('data-viz-needs-pan')
          ? mobileReadableZoom
          : 1,
    );
    setExpanded(surface);
  };

  const close = () => {
    setExpanded(null);
    setZoom(1);
  };

  const toggleInlineDetail = (surface: HTMLElement) => {
    setDetailSurfaces((current) => {
      const next = new Set(current);
      if (next.has(surface)) {
        next.delete(surface);
        surface.removeAttribute('data-viz-inline-detail');
      } else {
        next.add(surface);
        surface.setAttribute('data-viz-inline-detail', 'true');
      }
      return next;
    });
  };

  return (
    <>
      {surfaces.map((surface, index) => {
        const inlineDetail = detailSurfaces.has(surface);
        return createPortal(expanded === surface ? (
          <div key={`expanded-${index}`} className="article-viz-modal-tool fixed right-5 top-5 z-[100] flex items-center gap-1 rounded-md border border-border bg-background/95 p-1 shadow-lg backdrop-blur">
            <button type="button" onClick={() => setZoom((value) => Math.max(0.75, value - 0.25))}
              className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-35"
              disabled={zoom <= 0.75} aria-label="축소" title="축소">
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-xs font-medium tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((value) => Math.min(4, value + 0.25))}
              className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-35"
              disabled={zoom >= 4} aria-label="확대" title="확대">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setZoom(1)}
              className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="배율 초기화" title="배율 초기화">
              <RotateCcw className="h-4 w-4" />
            </button>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            <button type="button" onClick={close} autoFocus
              className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="전체화면 닫기" title="전체화면 닫기">
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div key={`inline-${index}`} className="article-viz-inline-tool absolute right-2 top-2 z-30 flex items-center gap-1">
            {surface.hasAttribute('data-viz-needs-pan') && (
              <button type="button" onClick={() => toggleInlineDetail(surface)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border/80 bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-foreground focus-visible:opacity-100"
                aria-pressed={inlineDetail}
                aria-label={inlineDetail ? '전체 구조 보기' : '세부 보기'}
                title={inlineDetail ? '전체 구조 보기' : '세부 보기'}>
                {inlineDetail ? <Shrink className="h-4 w-4" /> : <ScanSearch className="h-4 w-4" />}
              </button>
            )}
            <button type="button" onClick={() => open(surface)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border/80 bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-foreground focus-visible:opacity-100"
              aria-label="시각화 전체화면으로 보기" title="시각화 전체화면으로 보기">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        ),
        surface,
      )})}

      {expanded && createPortal(
        <button type="button" className="fixed inset-0 z-[70] cursor-default bg-foreground/20 backdrop-blur-[1px]"
          onClick={close} aria-label="전체화면 닫기" />,
        document.body,
      )}
    </>
  );
}
