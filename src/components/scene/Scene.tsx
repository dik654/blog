/**
 * Scene 컴포넌트 — spec 받아서 SVG 로 렌더.
 *
 * 레이아웃 v6 — viewport zoom:
 *  - SVG container 는 fixed aspect ratio. 크기는 width:100% + maxHeight:65vh
 *  - viewBox 가 step 별 focus 영역으로 부드럽게 animate
 *    - step 0: 전체 scene
 *    - step k: 현재 step 에 관여하는 object 들 + caption 슬롯 bbox + padding
 *  - 비참여 object 는 viewBox 밖으로 잘려서 안 보임 (별도 dim 불필요)
 *  - step 단위 = distinct t. 같은 t 의 transition 평행
 */

import { useEffect, useId, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, ZoomOut } from 'lucide-react';
import 'katex/dist/katex.min.css';
import type { Scene as SceneSpec, ObjectId } from './types';
import { layoutScene, type PlacedObject, type SceneLayout } from './layout';
import { renderObject, GroupFrame } from './objects';
import { SPRING, ACCENT, FLOW_NEUTRAL, LABEL } from './tokens';
import TeX from './TeX';
import { formatPlainMath } from '@/lib/plainMath';

export interface SceneProps {
  spec: SceneSpec;
}

function edgeOf(id: ObjectId, lay: SceneLayout, side: 'right' | 'left'): { x: number; y: number } | null {
  const p = lay.placed.get(id);
  if (p) {
    return {
      x: side === 'right' ? p.x + p.w : p.x,
      y: p.y + p.h / 2,
    };
  }
  const g = lay.groups.find((g) => g.obj.id === id);
  if (g) {
    return {
      x: side === 'right' ? g.x + g.w : g.x,
      y: g.y + g.h / 2,
    };
  }
  return null;
}

// zoom focus box 를 SVG 박스의 실제 aspect (containerBoxAspect) 에 맞춰 확장 —
// letterbox 없이 콘텐츠가 컨테이너 전 영역을 채우게.
function fitToAspect(
  box: { x: number; y: number; w: number; h: number },
  desired: number,
  bounds?: { x: number; y: number; w: number; h: number }
): { x: number; y: number; w: number; h: number } {
  const cur = box.w / box.h;
  let { x, y, w, h } = box;
  if (cur < desired) {
    const newW = h * desired;
    x -= (newW - w) / 2;
    w = newW;
  } else if (cur > desired) {
    const newH = w / desired;
    y -= (newH - h) / 2;
    h = newH;
  }
  if (bounds) {
    if (x < bounds.x) x = bounds.x;
    if (y < bounds.y) y = bounds.y;
    if (x + w > bounds.x + bounds.w) x = bounds.x + bounds.w - w;
    if (y + h > bounds.y + bounds.h) y = bounds.y + bounds.h - h;
  }
  return { x, y, w, h };
}

function computeFullBox(lay: SceneLayout): { x: number; y: number; w: number; h: number } {
  let minX = 0;
  let minY = 0;
  let maxX = lay.totalW;
  let maxY = lay.totalH;

  for (const placed of lay.placed.values()) {
    const bounds = placedContentBounds(placed);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.w);
    maxY = Math.max(maxY, bounds.y + bounds.h);
  }
  for (const group of lay.groups) {
    minX = Math.min(minX, group.x);
    minY = Math.min(minY, group.y);
    maxX = Math.max(maxX, group.x + group.w);
    maxY = Math.max(maxY, group.y + group.h);
  }

  const pad = 24;
  return {
    x: minX - pad,
    y: minY - pad,
    w: maxX - minX + pad * 2,
    h: maxY - minY + pad * 2,
  };
}

function placedContentBounds(p: PlacedObject) {
  const hasLabelAbove = p.obj.kind !== 'token' && p.obj.kind !== 'label';
  const overhang = hasLabelAbove ? Math.max(0, (p.labelW - p.w) / 2) : 0;
  const top = hasLabelAbove ? p.y - LABEL.height - LABEL.aboveGap : p.y;
  return {
    x: p.x - overhang,
    y: top,
    w: p.w + overhang * 2,
    h: p.y + p.h - top,
  };
}

export function Scene({ spec }: SceneProps) {
  const markerKey = useId().replace(/:/g, '');
  const lay = useMemo(() => layoutScene(spec), [spec]);
  const sortedT = useMemo(
    () => spec.transitions.slice().sort((a, b) => a.t - b.t),
    [spec.transitions]
  );

  const tValues = useMemo(() => {
    const set = new Set<number>();
    for (const tr of sortedT) set.add(tr.t);
    return [...set].sort((a, b) => a - b);
  }, [sortedT]);
  const totalSteps = tValues.length;
  const overviewSteps = useMemo(() => (
    tValues.map((t, index) => {
      const transitions = sortedT.filter((transition) => transition.t === t);
      const operations = [...new Set(transitions.map((transition) => transition.op))];
      return {
        index: index + 1,
        operations: operations.join(' + '),
        caption: transitions.find((transition) => transition.caption)?.caption
          ?? transitions[0]?.why
          ?? operations.join(' + '),
      };
    })
  ), [sortedT, tValues]);

  const [step, setStep] = useState(0);
  const [zoomedId, setZoomedId] = useState<ObjectId | null>(null);

  // step 바뀌면 zoom 해제 — step 의 의도된 focus 우선
  useEffect(() => { setZoomedId(null); }, [step]);

  // zoom 상태에서 prev/next 로 이동할 객체 순서 — layout 의 column → object 순서
  const zoomOrder = useMemo(() => [...lay.placed.keys()], [lay]);

  const moveZoom = (delta: number) => {
    if (!zoomedId) return false;
    const idx = zoomOrder.indexOf(zoomedId);
    if (idx < 0) return false;
    const next = zoomOrder[idx + delta];
    if (next) { setZoomedId(next); return true; }
    return false;
  };

  // 키보드 navigation — zoom 시 화살표로 객체 이동, ESC 로 zoom out
  useEffect(() => {
    if (!zoomedId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setZoomedId(null); e.preventDefault(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (moveZoom(1)) e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (moveZoom(-1)) e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedId, zoomOrder]);

  const currentTransitions = useMemo(() => {
    if (step === 0) return [];
    const t = tValues[step - 1];
    return sortedT.filter((tr) => tr.t === t);
  }, [sortedT, tValues, step]);

  const objAppearsAt = useMemo(() => {
    const m = new Map<ObjectId, number>();
    for (const obj of spec.objects) m.set(obj.id, 0);
    for (const tr of sortedT) {
      const tIdx = tValues.indexOf(tr.t);
      const produces = Array.isArray(tr.produces) ? tr.produces : [tr.produces];
      for (const p of produces) m.set(p, tIdx + 1);
    }
    return m;
  }, [spec.objects, sortedT, tValues]);

  // 현재 step 의 모든 input — 화살표 / active 표시에 사용
  const inputIds = useMemo(() => {
    const s = new Set<ObjectId>();
    for (const tr of currentTransitions) {
      for (const ref of tr.inputs) {
        const id = typeof ref === 'string' ? ref : ref.object;
        s.add(id);
        const obj = spec.objects.find((o) => o.id === id);
        if (obj?.kind === 'group' && obj.children) {
          for (const c of obj.children) s.add(c);
        }
      }
    }
    return s;
  }, [currentTransitions, spec.objects]);

  const produceIds = useMemo(() => {
    const s = new Set<ObjectId>();
    for (const tr of currentTransitions) {
      const ps = Array.isArray(tr.produces) ? tr.produces : [tr.produces];
      for (const p of ps) s.add(p);
    }
    return s;
  }, [currentTransitions]);

  const visibleIds = useMemo(() => {
    if (zoomedId) {
      const ids = new Set<ObjectId>([zoomedId]);
      const group = spec.objects.find((object) => object.id === zoomedId && object.kind === 'group');
      for (const child of group?.children ?? []) ids.add(child);
      return ids;
    }
    if (step === 0) return new Set(spec.objects.map((object) => object.id));
    return new Set([...inputIds, ...produceIds]);
  }, [zoomedId, step, spec.objects, inputIds, produceIds]);

  // Step 화면은 전체 graph 좌표를 잘라 쓰지 않고 현재 subgraph를 다시 배치한다.
  // 전체 graph에서 멀리 떨어진 두 객체만 남아 과도한 빈 공간이 생기는 것을 막는다.
  const displayLay = useMemo(() => {
    if (step === 0) return lay;
    const stepIds = new Set([...inputIds, ...produceIds]);
    const objects = spec.objects.filter((object) => (
      stepIds.has(object.id)
      || (object.kind === 'group' && object.children?.some((id) => stepIds.has(id)))
    ));
    return layoutScene({
      ...spec,
      objects,
      transitions: currentTransitions,
      phases: undefined,
    });
  }, [step, lay, inputIds, produceIds, spec, currentTransitions]);

  const fullBox = useMemo(() => computeFullBox(lay), [lay]);

  const zoomFocusBox = useMemo(() => {
    if (!zoomedId) return null;

    const p = displayLay.placed.get(zoomedId);
    if (p) {
      const padX = 44, padY = 44;
      const content = placedContentBounds(p);
      const box = {
        x: content.x - padX,
        y: content.y - padY,
        w: content.w + padX * 2,
        h: content.h + padY * 2,
      };
      const targetAspect = Math.min(1.8, Math.max(0.9, box.w / box.h));
      return fitToAspect(box, targetAspect);
    }
    const g = displayLay.groups.find((g) => g.obj.id === zoomedId);
    if (g) {
      const padX = 24, padY = 30;
      const box = {
        x: g.x - padX,
        y: g.y - padY,
        w: g.w + padX * 2,
        h: g.h + padY * 2,
      };
      const targetAspect = Math.min(1.8, Math.max(0.9, box.w / box.h));
      return fitToAspect(box, targetAspect);
    }
    return null;
  }, [zoomedId, displayLay]);

  const stepFocusBox = useMemo(() => {
    if (step === 0 || inputIds.size + produceIds.size === 0) return null;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const id of new Set([...inputIds, ...produceIds])) {
      const p = displayLay.placed.get(id);
      if (p) {
        const bounds = placedContentBounds(p);
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.w);
        maxY = Math.max(maxY, bounds.y + bounds.h);
      }
      const group = displayLay.groups.find((item) => item.obj.id === id);
      if (group) {
        minX = Math.min(minX, group.x);
        minY = Math.min(minY, group.y);
        maxX = Math.max(maxX, group.x + group.w);
        maxY = Math.max(maxY, group.y + group.h);
      }
    }

    for (const transition of currentTransitions) {
      const width = Math.max(54, transition.op.length * 7 + 16);
      const produces = Array.isArray(transition.produces)
        ? transition.produces
        : [transition.produces];
      for (const id of produces) {
        const p = displayLay.placed.get(id);
        if (!p) continue;
        const centerX = p.x + p.w / 2;
        const top = p.y - LABEL.height - LABEL.aboveGap - 30;
        minX = Math.min(minX, centerX - width / 2);
        minY = Math.min(minY, top);
        maxX = Math.max(maxX, centerX + width / 2);
      }
    }
    if (minX === Infinity) return null;

    const padX = 54, padY = 54;
    const box = {
      x: minX - padX,
      y: minY - padY,
      w: maxX - minX + padX * 2,
      h: maxY - minY + padY * 2,
    };
    const targetAspect = Math.min(2.2, Math.max(1.15, box.w / box.h));
    return fitToAspect(box, targetAspect);
  }, [step, inputIds, produceIds, currentTransitions, displayLay]);

  const focusBox = zoomFocusBox ?? stepFocusBox ?? fullBox;

  // animated viewBox via motion values
  const vbX = useMotionValue(fullBox.x);
  const vbY = useMotionValue(fullBox.y);
  const vbW = useMotionValue(fullBox.w);
  const vbH = useMotionValue(fullBox.h);
  const viewBoxStr = useTransform(
    [vbX, vbY, vbW, vbH],
    ([x, y, w, h]) => `${x} ${y} ${w} ${h}`
  );

  useEffect(() => {
    const t = { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] as const };
    const ctrls = [
      animate(vbX, focusBox.x, t),
      animate(vbY, focusBox.y, t),
      animate(vbW, focusBox.w, t),
      animate(vbH, focusBox.h, t),
    ];
    return () => ctrls.forEach((c) => c.stop());
  }, [focusBox, vbX, vbY, vbW, vbH]);

  // flow arrows — 같은 produces 로 가는 여러 input 의 도착점 y 를 객체 height 안에 분산
  // 해서 화살표 끝이 모이지 않게.
  const flowArrows = useMemo(() => {
    const arrows: { key: string; from: { x: number; y: number }; to: { x: number; y: number }; toId: ObjectId; op: string }[] = [];
    if (zoomedId) return arrows;
    if (step === 0 && spec.overviewArrows === false) return arrows;
    const transitions = step === 0 ? sortedT : currentTransitions;
    for (const tr of transitions) {
      const produces = Array.isArray(tr.produces) ? tr.produces : [tr.produces];
      for (const pid of produces) {
        const toEdge = edgeOf(pid, displayLay, 'left');
        if (!toEdge) continue;
        for (const ref of tr.inputs) {
          const id = typeof ref === 'string' ? ref : ref.object;
          const fromEdge = edgeOf(id, displayLay, 'right');
          if (!fromEdge) continue;
          if (fromEdge.x >= toEdge.x - 4) continue;
          arrows.push({
            key: `${id}->${pid}-${tr.t}`,
            from: fromEdge,
            to: toEdge,
            toId: pid,
            op: tr.op,
          });
        }
      }
    }
    return arrows;
  }, [step, sortedT, currentTransitions, displayLay, spec.overviewArrows, zoomedId]);

  // op label per produces — 화살표 중점 아니라 produces 객체 위 (라벨 위) 에 표시.
  // 한 produces 당 1 개. 화살표 위에 z-order.
  const opLabels = useMemo(() => {
    if (step === 0) return [];
    const labels: { key: string; x: number; y: number; op: string }[] = [];
    const seen = new Set<string>();
    for (const tr of currentTransitions) {
      const produces = Array.isArray(tr.produces) ? tr.produces : [tr.produces];
      for (const pid of produces) {
        if (seen.has(pid)) continue;
        seen.add(pid);
        const p = displayLay.placed.get(pid);
        if (!p) continue;
        labels.push({
          key: `op-${pid}-${tr.t}`,
          x: p.x + p.w / 2,
          y: p.y - LABEL.height - LABEL.aboveGap - 8,
          op: tr.op,
        });
      }
    }
    return labels;
  }, [step, currentTransitions, displayLay]);

  const zoomObject = zoomedId
    ? spec.objects.find((object) => object.id === zoomedId)
    : undefined;
  const sceneQuestion = spec.question
    ?? `${spec.title ?? '이 계산'}에서는 어떤 입력이 어떤 출력으로 바뀌며, 이 순서가 왜 필요할까?`;
  const finalTransition = sortedT[sortedT.length - 1];
  const sceneTakeaway = spec.takeaway
    ?? spec.overview
    ?? finalTransition?.why;

  return (
    <div
      className="scene-viz not-prose my-10 overflow-hidden rounded-lg border border-border bg-card"
      data-scene
      data-scene-has-takeaway={sceneTakeaway ? 'true' : 'false'}
    >
      <div className="scene-viz__header grid grid-cols-[3.5rem_minmax(0,1fr)] border-b border-border/60" data-scene-question>
        <div className="scene-viz__index flex min-h-[6.5rem] flex-col items-center justify-center border-r border-border/60">
          <span className="font-mono text-xs font-bold uppercase text-muted-foreground">Step</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-1 font-mono text-2xl font-black tabular-nums"
            >
              {String(step).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="min-w-0 px-4 py-4 pr-20 sm:px-5">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            이 장면이 답할 질문
          </div>
          <div className="text-[15px] font-bold leading-relaxed text-foreground sm:text-base">
            <TeX text={sceneQuestion} />
          </div>
        </div>
      </div>
      <div className="scene-viz__meta flex items-baseline justify-between gap-3 border-b border-border/60 py-2.5 pl-4 pr-20">
        <div className="font-mono text-xs uppercase text-muted-foreground">
          scene · {spec.id}
        </div>
        {spec.title && (
          <div className="truncate text-right text-[12px] font-medium text-foreground">
            <TeX text={spec.title} />
          </div>
        )}
      </div>

      {spec.caption && (
        <div className="border-b border-border/40 px-4 py-2 text-xs leading-relaxed text-muted-foreground">
          <TeX text={spec.caption} />
        </div>
      )}

      {step === 0 && (spec.overview || spec.legend?.length) && (
        <div className="border-b border-border/40 bg-background/40 px-4 py-2.5 sm:px-5">
          {spec.overview && (
            <div className="text-sm leading-relaxed text-muted-foreground">
              <span className="mr-2 font-mono text-xs font-semibold uppercase text-foreground/70">
                핵심
              </span>
              <TeX text={spec.overview} />
            </div>
          )}
          {spec.legend?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {spec.legend.map((item) => (
                <span
                  key={`${item.label}-${item.description}`}
                  className="inline-flex max-w-full items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1 text-xs leading-relaxed text-muted-foreground"
                >
                  <span className="font-semibold text-foreground/80">{item.label}</span>
                  <span className="min-w-0"><TeX text={item.description} /></span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {step === 0 && overviewSteps.length > 0 && (
        <div className="scene-mobile-overview border-b border-border/60 bg-background sm:hidden" data-scene-mobile-overview>
          <div className="border-b border-border/50 px-4 py-3">
            <div className="text-xs font-semibold text-muted-foreground">전체 흐름</div>
            <div className="mt-1 text-sm leading-relaxed text-foreground">
              입력에서 시작해 중간 상태를 거쳐 결과가 만들어지는 순서다.
            </div>
          </div>
          <div>
            {overviewSteps.map((item) => (
              <button
                key={item.index + '-' + item.operations}
                type="button"
                onClick={() => setStep(item.index)}
                className="flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-left last:border-b-0 hover:bg-muted/30"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border bg-muted/40 font-mono text-xs font-semibold text-foreground">
                  {item.index}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-xs font-semibold text-muted-foreground">{item.operations}</span>
                  <span className="mt-0.5 block text-sm font-medium leading-relaxed text-foreground">
                    <TeX text={item.caption} />
                  </span>
                </span>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={'scene-viz__stage scene-canvas px-3 py-5 sm:px-5 sm:py-7 ' + (step === 0 && overviewSteps.length > 0 ? 'hidden sm:block' : 'block')}
        data-viz-canvas
      >
        <motion.svg
          data-viz-fit="true"
          data-scene-target-viewbox={`${focusBox.x} ${focusBox.y} ${focusBox.w} ${focusBox.h}`}
          viewBox={viewBoxStr}
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto block max-w-full min-w-0"
          onDoubleClick={() => setZoomedId(null)}
          style={{
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            height: 'auto',
            maxHeight: 'min(88dvh, calc(100dvh - 140px))',
            cursor: zoomedId ? 'zoom-out' : 'default',
          }}
        >
          <defs>
            <marker id={`arr-active-${markerKey}`} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
            </marker>
            <marker id={`arr-overview-${markerKey}`} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill={FLOW_NEUTRAL} />
            </marker>
          </defs>

          {/* phase bands — only visible at step 0 */}
          {step === 0 && !zoomedId && lay.phaseBands.map((b, i) => (
            <g key={b.id}>
              <line x1={b.x} x2={b.x + b.w} y1={34} y2={34}
                stroke="var(--border)" strokeWidth={1} />
              <text x={b.x + 8} y={24}
                fontSize={12} fontFamily="ui-monospace, monospace"
                fill="var(--muted-foreground)">
                {String(i + 1).padStart(2, '0')}
              </text>
              <text x={b.x + 34} y={24}
                fontSize={13} fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight={600} fill="var(--foreground)">
                {formatPlainMath(b.title)}
              </text>
            </g>
          ))}

          {/* group frames */}
          {displayLay.groups.map((g) => {
            const anyVisible = visibleIds.has(g.obj.id)
              || g.obj.children?.some((id) => visibleIds.has(id));
            if (!anyVisible) return null;
            return (
              <g
                key={g.obj.id}
                data-scene-group-id={g.obj.id}
                onDoubleClick={(e) => { e.stopPropagation(); setZoomedId(g.obj.id); }}
                style={{ cursor: zoomedId === g.obj.id ? 'zoom-out' : 'zoom-in' }}
              >
                <GroupFrame g={g} />
              </g>
            );
          })}

          {/* flow arrows */}
          <AnimatePresence>
            {flowArrows.map((a, i) => {
              const dx = a.to.x - a.from.x;
              const ctrlX = a.from.x + dx / 2;
              const path = `M ${a.from.x} ${a.from.y} C ${ctrlX} ${a.from.y}, ${ctrlX} ${a.to.y}, ${a.to.x} ${a.to.y}`;
              return (
                <g key={a.key}>
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={step === 0 ? FLOW_NEUTRAL : ACCENT}
                    strokeWidth={step === 0 ? 1 : 1.5}
                    strokeOpacity={step === 0 ? 0.34 : 0.9}
                    markerEnd={`url(#arr-${step === 0 ? 'overview' : 'active'}-${markerKey})`}
                    initial={step === 0 ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: step === 0 ? 0.72 : 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.12, delay: 0 } }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                  />
                </g>
              );
            })}
          </AnimatePresence>

          {/* op labels — produces 객체 위에 그려서 화살표 / 다른 객체와 겹치지 않음 */}
          <AnimatePresence>
            {opLabels.map((l) => {
              const labelW = Math.max(54, l.op.length * 7 + 16);
              return (
                <motion.g
                  key={l.key}
                  data-scene-operation
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.1, delay: 0 } }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <rect x={l.x - labelW / 2} y={l.y - 14} width={labelW} height={18} rx={4}
                    fill="var(--background)" stroke="var(--border)" strokeWidth={1} />
                  <text x={l.x} y={l.y - 1} textAnchor="middle"
                    fontSize={12} fontFamily="ui-monospace, monospace"
                    fontWeight={600} fill={ACCENT}>
                    {l.op}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* overview 에서는 전체 구조, step/zoom 에서는 현재 계산에 필요한 객체만 표시한다. */}
          {[...displayLay.placed.values()].filter((p) => visibleIds.has(p.obj.id)).map((p) => {
            const appearsAt = objAppearsAt.get(p.obj.id) ?? 0;
            const notYet = appearsAt > step;
            const isProduce = produceIds.has(p.obj.id);
            const isInput = inputIds.has(p.obj.id);
            const isZoomed = zoomedId === p.obj.id;
            const justAppeared = isProduce && appearsAt === step;
            const dim = !isZoomed && notYet;
            return (
              <motion.g
                key={p.obj.id}
                data-scene-object-id={p.obj.id}
                initial={justAppeared ? { opacity: 0, scale: 0.85 } : false}
                animate={{ opacity: dim ? 0.72 : 1, scale: 1 }}
                transition={{
                  ...SPRING.appear,
                  delay: justAppeared ? 1.1 : 0,
                }}
                onClick={(e) => {
                  // zoom 상태에서 다른 객체 click 으로 zoom 이동
                  if (zoomedId && zoomedId !== p.obj.id) {
                    e.stopPropagation();
                    setZoomedId(p.obj.id);
                  }
                }}
                onDoubleClick={(e) => { e.stopPropagation(); setZoomedId(p.obj.id); }}
                style={{
                  transformOrigin: `${p.x + p.w / 2}px ${p.y + p.h / 2}px`,
                  cursor: zoomedId === p.obj.id ? 'zoom-out' : 'zoom-in',
                }}
              >
                {renderObject(p, { active: isZoomed || (!notYet && (isProduce || isInput)), dim })}
              </motion.g>
            );
          })}

        </motion.svg>
      </div>

      {zoomObject && (zoomObject.description || zoomObject.why || zoomObject.notes?.length) && (
        <div className="border-t border-border/60 bg-muted/10 px-4 py-3 sm:px-5">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-mono text-xs font-semibold text-foreground">{zoomObject.id}</span>
            {zoomObject.description && (
              <span className="text-sm text-foreground/90"><TeX text={zoomObject.description} /></span>
            )}
          </div>
          {zoomObject.why && (
            <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              <TeX text={zoomObject.why} />
            </div>
          )}
          {zoomObject.notes?.length ? (
            <ul className="mt-2 space-y-1 border-l-2 border-border pl-3">
              {zoomObject.notes.map((note, index) => (
                <li key={index} className="text-xs leading-relaxed text-muted-foreground">
                  <span className="mr-1.5 font-medium text-foreground"><TeX text={note.tex} /></span>
                  <TeX text={note.note} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {!zoomObject && currentTransitions.length > 0 && (
        <div className="border-t border-border/60 bg-muted/10 px-4 py-3 sm:px-5">
          <div className="space-y-3">
            {currentTransitions.map((transition, index) => (
              <div key={`${transition.t}-${transition.op}-${index}`} className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
                    {transition.op}
                  </span>
                  {transition.caption && (
                    <span className="min-w-0 text-sm font-medium text-foreground"><TeX text={transition.caption} /></span>
                  )}
                </div>
                {transition.why && (
                  <div className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    <TeX text={transition.why} />
                  </div>
                )}
                {transition.notes?.length ? (
                  <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                    {transition.notes.map((note, noteIndex) => (
                      <li key={noteIndex} className="min-w-0 border-l-2 border-border pl-2 text-xs leading-relaxed text-muted-foreground">
                        <span className="mr-1 font-medium text-foreground"><TeX text={note.tex} /></span>
                        <TeX text={note.note} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {!zoomObject && step === totalSteps && sceneTakeaway && (
        <div className="border-t border-border/60 bg-background px-4 py-4 sm:px-5" data-scene-takeaway>
          <div className="mb-1 text-xs font-semibold text-muted-foreground">이 장면의 결론</div>
          <div className="text-sm font-medium leading-relaxed text-foreground">
            <TeX text={sceneTakeaway} />
          </div>
        </div>
      )}

      {/* navigation */}
      <div className="scene-viz__controls flex min-w-0 items-center gap-2 border-t border-border/60 px-3 py-3 sm:px-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
          aria-label="이전 단계" title="이전 단계"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
          disabled={step === totalSteps}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
          aria-label="다음 단계" title="다음 단계"
        >
          <ChevronRight size={14} />
        </button>

        <div className="ml-2 hidden flex-wrap items-center sm:flex">
          {Array.from({ length: totalSteps + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className="flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-muted/60"
              style={{
                color: i <= step ? ACCENT : 'var(--muted-foreground)',
                opacity: i <= step ? 0.95 : 0.55,
              }}
              aria-label={`step ${i}`}
            >
              <span
                className="block h-1.5 rounded-full bg-current"
                style={{ width: i === step ? 22 : 6 }}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <div className="ml-1 min-w-0 flex-1 break-words font-mono text-xs leading-5 text-muted-foreground sm:ml-3">
          {zoomedId ? (
            <span>
              zoom · <span className="font-semibold text-foreground/85">{zoomedId}</span>
            </span>
          ) : step === 0 ? (
            <span>step 0 · overview</span>
          ) : (
            <span>
              step {step} / {totalSteps}
              {currentTransitions.length > 0 && (
                <>
                  {' · '}
                  <span className="font-semibold text-foreground/85">
                    {currentTransitions.length === 1
                      ? currentTransitions[0].op
                      : `${currentTransitions[0].op} ×${currentTransitions.length}`}
                  </span>
                </>
              )}
            </span>
          )}
        </div>

        {zoomedId && (
          <button
            type="button"
            onClick={() => setZoomedId(null)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted"
            aria-label="선택 항목에서 전체 구조로 돌아가기" title="전체 구조로 돌아가기"
          >
            <ZoomOut size={14} />
          </button>
        )}

        {step > 0 && !zoomedId && (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted"
            aria-label="첫 단계로 초기화" title="첫 단계로 초기화"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Scene;
