/**
 * Scene 의존 그래프 → 자동 layout.
 *
 * 알고리즘 v3:
 *  1. 각 transition 으로 "produced ← inputs" 의존 관계 구축
 *  2. depth(o) = max(depth of deps) + 1. source 는 0
 *  3. 설명은 SVG 밖 detail panel에서 렌더하고, graph에는 object만 배치
 *  4. 좌→우 column flow. 각 column 안 객체는 column vertical center 기준
 *  5. group 객체는 children 의 bbox 로 자동 둘러쌈
 */

import type { Scene, SceneObject, Transition, ObjectId } from './types';
import { CELL, SCALAR, TOKEN, DIST, COL, LABEL } from './tokens';
import { formatPlainMath } from '@/lib/plainMath';

/** 기본 caption 폭 — text 가 없거나 매우 짧은 경우의 fallback */
export const CAPTION_W = 220;
export const CAPTION_GAP = 14;
/** caption + why 두 줄용 최소 높이 */
export const CAPTION_MIN_H = 100;

/**
 * caption block 의 폭을 텍스트 길이에 비례해 결정.
 * 목표: caption block 의 width × height 가 정사각형에 가깝게 → viewBox 가 정사각형에 가까워 글씨 scale 큼.
 *
 * 글자 ≈ 9px wide, 줄 높이 ≈ 18px 이라고 가정.
 * lines = len / (W/9), height = lines × 18 = 162 × len / W.
 * width = height → W = √(162 × len).
 */
export function chooseCaptionW(totalChars: number): number {
  if (totalChars === 0) return 0;
  const target = Math.sqrt(162 * totalChars);
  return Math.max(190, Math.min(330, Math.round(target)));
}

export interface PlacedObject {
  obj: SceneObject;
  /** 시각(셀) 영역 top-left */
  x: number;
  y: number;
  /** 셀 영역 폭/높이 (label 제외) */
  w: number;
  h: number;
  /** SVG label 의 예상 폭. visual 폭보다 길 때 column 폭과 focus bbox 에 반영한다. */
  labelW: number;
  /** 전체 row 높이 (label + visual) */
  fullH: number;
  /** dependency depth (column index) */
  depth: number;
  /** 이 object 를 produces 한 transition (caption 표시용) */
  producedBy?: Transition;
  /** caption block 폭 — object 별 동적, 정사각형 비율 목표. 0 이면 caption 없음. */
  capW: number;
}

function plainLabel(obj: SceneObject): string {
  return formatPlainMath(obj.label ?? obj.id).replace(/\\/g, '');
}

/**
 * SVG text 는 layout 전에 실제 bbox 를 알 수 없다. 한글/CJK는 전각, 라틴/숫자는
 * 평균 0.62em으로 잡고 여유를 더해, 긴 라벨이 다음 column과 겹치거나 잘리지 않게 한다.
 */
function labelWidthOf(obj: SceneObject): number {
  const units = [...plainLabel(obj)].reduce((width, char) => (
    width + ((char.codePointAt(0) ?? 128) <= 127 ? 0.62 : 1.02)
  ), 0);
  return Math.ceil(units * LABEL.fontSize + 12);
}

export interface GroupBound {
  obj: SceneObject;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PhaseBand {
  /** phase id */
  id: string;
  title: string;
  narration?: string;
  /** 이 phase 의 transition 들이 산출한 object 들이 들어있는 depth 범위 */
  fromDepth: number;
  toDepth: number;
  /** 그리는 x 범위 (column 시작/끝) */
  x: number;
  w: number;
}

export interface SceneLayout {
  placed: Map<ObjectId, PlacedObject>;
  groups: GroupBound[];
  phaseBands: PhaseBand[];
  /** SVG viewBox 의 폭/높이 */
  totalW: number;
  totalH: number;
}

function sizeOf(obj: SceneObject): { w: number; visualH: number } {
  switch (obj.kind) {
    case 'scalar':
      return { w: SCALAR.d, visualH: SCALAR.d };
    case 'vector': {
      const d = obj.shape?.[0] ?? 1;
      const hasVals = Array.isArray(obj.values) && (obj.values as number[]).length > 0;
      if (hasVals && d <= CELL.abbreviateAbove) {
        const w = d * CELL.w + (d - 1) * CELL.gap;
        return { w, visualH: CELL.h };
      }
      return { w: 110, visualH: CELL.h };
    }
    case 'matrix': {
      const [r = 1, c = 1] = obj.shape ?? [1, 1];
      const hasVals = Array.isArray(obj.values) && Array.isArray((obj.values as number[][])[0]);
      const useAbstract = !hasVals || r > 4 || c > 4;
      if (!useAbstract) {
        const w = c * CELL.w + (c - 1) * CELL.gap;
        const visH = r * CELL.h + (r - 1) * CELL.gap;
        return { w, visualH: visH };
      }
      const MAX = 160, MIN = 70;
      let w: number, h: number;
      if (c >= r) {
        w = MAX;
        h = Math.max(MIN, Math.round(MAX * r / c));
      } else {
        h = MAX;
        w = Math.max(MIN, Math.round(MAX * c / r));
      }
      return { w, visualH: h };
    }
    case 'token':
      return { w: Math.max(TOKEN.w, labelWidthOf(obj) + 18), visualH: TOKEN.h };
    case 'distribution': {
      const d = obj.shape?.[0] ?? 1;
      const w = d * DIST.w;
      return { w, visualH: DIST.maxH };
    }
    case 'group':
      return { w: 0, visualH: 0 };
    case 'label':
      return { w: Math.max(60, labelWidthOf(obj)), visualH: LABEL.height };
  }
}

function footprintWidthOf(obj: SceneObject): number {
  const size = sizeOf(obj);
  if (obj.kind === 'token' || obj.kind === 'label') return size.w;
  return Math.max(size.w, labelWidthOf(obj));
}

function rolePriority(role?: string): number {
  switch (role) {
    case 'input': return 0;
    case 'param': return 1;
    case 'intermediate': return 2;
    case 'output': return 3;
    default: return 4;
  }
}

export function layoutScene(scene: Scene): SceneLayout {
  const objMap = new Map<ObjectId, SceneObject>();
  for (const obj of scene.objects) objMap.set(obj.id, obj);

  // 각 object 를 produce 한 transition 매핑
  const producedBy = new Map<ObjectId, Transition>();
  for (const tr of scene.transitions) {
    const ps = Array.isArray(tr.produces) ? tr.produces : [tr.produces];
    for (const p of ps) producedBy.set(p, tr);
  }

  // 의존성 expand (group inputs → children)
  const depsByProduced = new Map<ObjectId, ObjectId[]>();
  for (const tr of scene.transitions) {
    const ps = Array.isArray(tr.produces) ? tr.produces : [tr.produces];
    const inputs: ObjectId[] = [];
    for (const ref of tr.inputs) {
      const id = typeof ref === 'string' ? ref : ref.object;
      const o = objMap.get(id);
      if (o && o.kind === 'group' && o.children) {
        inputs.push(...o.children, id);
      } else {
        inputs.push(id);
      }
    }
    for (const p of ps) {
      const existing = depsByProduced.get(p) ?? [];
      depsByProduced.set(p, [...existing, ...inputs]);
    }
  }

  // depth 계산
  const depth = new Map<ObjectId, number>();
  const visiting = new Set<ObjectId>();
  function depthOf(id: ObjectId): number {
    if (depth.has(id)) return depth.get(id)!;
    if (visiting.has(id)) {
      console.warn(`[scene] cycle involving ${id}`);
      return 0;
    }
    visiting.add(id);
    const obj = objMap.get(id);
    if (!obj) {
      depth.set(id, 0);
      visiting.delete(id);
      return 0;
    }
    if (obj.kind === 'group' && obj.children?.length) {
      const d = Math.max(0, ...obj.children.map(depthOf));
      depth.set(id, d);
      visiting.delete(id);
      return d;
    }
    const deps = depsByProduced.get(id);
    if (!deps || deps.length === 0) {
      depth.set(id, 0);
      visiting.delete(id);
      return 0;
    }
    const d = Math.max(...deps.map(depthOf)) + 1;
    depth.set(id, d);
    visiting.delete(id);
    return d;
  }
  for (const obj of scene.objects) depthOf(obj.id);

  // columns
  const columns = new Map<number, SceneObject[]>();
  for (const obj of scene.objects) {
    if (obj.kind === 'group') continue;
    const d = depth.get(obj.id) ?? 0;
    if (!columns.has(d)) columns.set(d, []);
    columns.get(d)!.push(obj);
  }
  for (const arr of columns.values()) {
    arr.sort((a, b) => {
      const pa = rolePriority(a.role);
      const pb = rolePriority(b.role);
      if (pa !== pb) return pa - pb;
      return a.id.localeCompare(b.id);
    });
  }

  const fullHeightOf = (obj: SceneObject): number => (
    sizeOf(obj).visualH + LABEL.aboveGap + LABEL.height
  );

  // 객체별 caption block 폭 — description + why 포함. notes 는 zoom 만 보이므로 제외.
  const objCapText = (obj: SceneObject) =>
    (obj.description?.length ?? 0) + (obj.why?.length ?? 0);
  const trCapText = (tr?: Transition) =>
    tr ? (tr.caption?.length ?? 0) + (tr.why?.length ?? 0) : 0;
  const capWOf = (obj: SceneObject): number => {
    const len = Math.max(objCapText(obj), trCapText(producedBy.get(obj.id)));
    return chooseCaptionW(len);
  };

  const sortedDepths = [...columns.keys()].sort((a, b) => a - b);
  const SUB_COL_GAP = 24;
  // Overview 가 세로로 길어지면 전체 구조와 글자가 동시에 작아진다.
  // 긴 dependency column 만 2~3개 lane 으로 접어 overview 높이를 제한한다.
  const TARGET_COLUMN_H = 560;

  // column 별 sub-column 분배 — 객체 수 많으면 wrap.
  // 각 column 의 single-col total height 를 먼저 계산해 가장 큰 column 의 height 를
  // 기준으로 target h 결정. 다른 column 의 single-h 가 그 보다 크면 wrap.
  type ColPlan = { subCols: SceneObject[][]; subColWidths: number[]; colW: number; colH: number };
  const colPlan = new Map<number, ColPlan>();
  for (const d of sortedDepths) {
    const objs = columns.get(d)!;
    let singleH = 0;
    for (const obj of objs) {
      singleH += fullHeightOf(obj) + COL.vGap;
    }
    singleH = Math.max(0, singleH - COL.vGap);

    const laneCount = Math.min(
      3,
      objs.length,
      Math.max(1, Math.ceil(singleH / TARGET_COLUMN_H)),
    );
    const subCols = Array.from({ length: laneCount }, () => [] as SceneObject[]);
    const subColHeights = Array.from({ length: laneCount }, () => 0);

    // 현재 가장 짧은 lane 에 다음 object 를 넣어 높이를 균등하게 맞춘다.
    for (const obj of objs) {
      let lane = 0;
      for (let index = 1; index < laneCount; index += 1) {
        if (subColHeights[index] < subColHeights[lane]) lane = index;
      }
      subCols[lane].push(obj);
      subColHeights[lane] += fullHeightOf(obj) + COL.vGap;
    }

    const actualHeights = subCols.map((items) => (
      Math.max(0, items.reduce((sum, obj) => sum + fullHeightOf(obj) + COL.vGap, 0) - COL.vGap)
    ));
    const subColWidths = subCols.map((items) => (
      Math.max(0, ...items.map(footprintWidthOf))
    ));
    const colWidth = subColWidths.reduce((sum, width) => sum + width, 0)
      + SUB_COL_GAP * Math.max(0, laneCount - 1);

    colPlan.set(d, {
      subCols,
      subColWidths,
      colW: colWidth,
      colH: Math.max(0, ...actualHeights),
    });
  }

  const colW = new Map<number, number>();
  const colH = new Map<number, number>();
  for (const d of sortedDepths) {
    const plan = colPlan.get(d)!;
    colW.set(d, plan.colW);
    colH.set(d, plan.colH);
  }

  // phase narration band 높이 — phase 있으면 SVG 상단에 + 32px
  const phaseBandH = scene.phases?.length ? 38 : 0;

  // 단순 column-wise 한 row 배치 — 좌→우 depth 순.
  const colX = new Map<number, number>();
  const maxColH = sortedDepths.length ? Math.max(...sortedDepths.map(d => colH.get(d) ?? 0)) : 0;
  let cursorX = COL.padX;
  for (const d of sortedDepths) {
    colX.set(d, cursorX);
    cursorX += (colW.get(d) ?? 0) + COL.hGap;
  }
  const totalW = Math.max(cursorX - COL.hGap + COL.padX, 200);
  const totalH = maxColH + COL.padY * 2 + phaseBandH;

  // 배치 — column 안 객체 vertical stack (sub-col 없음)
  const placed = new Map<ObjectId, PlacedObject>();
  for (const d of sortedDepths) {
    const plan = colPlan.get(d)!;
    const cH = colH.get(d) ?? 0;
    const startYBase = phaseBandH + COL.padY + (maxColH - cH) / 2;
    const x0 = colX.get(d) ?? 0;
    let subColX = x0;
    plan.subCols.forEach((sc, subColIndex) => {
      const subColHActual = Math.max(0, sc.reduce((s, o) => s + fullHeightOf(o) + COL.vGap, 0) - COL.vGap);
      let y = startYBase + (cH - subColHActual) / 2;
      const laneWidth = plan.subColWidths[subColIndex] ?? 0;
      for (const obj of sc) {
        const sz = sizeOf(obj);
        const sx = subColX + (laneWidth - sz.w) / 2;
        const visualY = y + LABEL.height + LABEL.aboveGap;
        placed.set(obj.id, {
          obj, x: sx, y: visualY, w: sz.w, h: sz.visualH,
          labelW: labelWidthOf(obj),
          fullH: fullHeightOf(obj),
          depth: d,
          producedBy: producedBy.get(obj.id),
          capW: capWOf(obj),
        });
        y += fullHeightOf(obj) + COL.vGap;
      }
      subColX += laneWidth + SUB_COL_GAP;
    });
  }

  // group bounds
  const groups: GroupBound[] = [];
  for (const obj of scene.objects) {
    if (obj.kind !== 'group' || !obj.children?.length) continue;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const cid of obj.children) {
      const p = placed.get(cid);
      if (!p) continue;
      const labelOverhang = Math.max(0, (p.labelW - p.w) / 2);
      minX = Math.min(minX, p.x - labelOverhang);
      minY = Math.min(minY, p.y - LABEL.height - LABEL.aboveGap);
      maxX = Math.max(maxX, p.x + p.w + labelOverhang);
      maxY = Math.max(maxY, p.y + p.h);
    }
    if (minX === Infinity) continue;
    const pad = 8;
    groups.push({
      obj,
      x: minX - pad,
      y: minY - pad,
      w: maxX - minX + pad * 2,
      h: maxY - minY + pad * 2,
    });
  }

  // phase bands — phase 별로 그 phase 의 transition 들이 produce 한 object 의 column 범위
  const phaseBands: PhaseBand[] = [];
  if (scene.phases?.length) {
    for (const ph of scene.phases) {
      const producedInPhase = new Set<ObjectId>();
      for (const tr of scene.transitions) {
        if (tr.phase !== ph.id) continue;
        const ps = Array.isArray(tr.produces) ? tr.produces : [tr.produces];
        for (const p of ps) producedInPhase.add(p);
      }
      let fromDepth = Infinity, toDepth = -Infinity;
      for (const pid of producedInPhase) {
        const d = depth.get(pid);
        if (d === undefined) continue;
        fromDepth = Math.min(fromDepth, d);
        toDepth = Math.max(toDepth, d);
      }
      if (fromDepth === Infinity) continue;
      const x = colX.get(fromDepth) ?? 0;
      const lastCol = colX.get(toDepth) ?? 0;
      const lastColW = colW.get(toDepth) ?? 0;
      const w = lastCol + lastColW - x;
      phaseBands.push({
        id: ph.id,
        title: ph.title,
        narration: ph.narration,
        fromDepth,
        toDepth,
        x,
        w,
      });
    }
  }

  return { placed, groups, phaseBands, totalW, totalH };
}
