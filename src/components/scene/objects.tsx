/**
 * Object kind 별 SVG 렌더러.
 * v4 변경:
 *  - matrix 값이 없거나 shape > 4×4 → abstract block (aspect ratio 반영 rect + shape 라벨)
 *  - vector 값 없으면 → 단일 bar + shape 라벨
 *  - `dim` 옵션: 현재 step 에 관여 안 하는 object 흐리게
 *  - `active` 옵션: 얇은 blue outline + 옅은 surface fill
 */

/* eslint-disable react-refresh/only-export-components -- SVG renderer dispatch and components share object primitives. */

import type { PlacedObject, GroupBound } from './layout';
import {
  CELL,
  SCALAR,
  TOKEN,
  DIST,
  LABEL,
  ROLE_OPACITY,
  ROLE_SOFT,
  ROLE_TINT,
  ACCENT,
  ACCENT_SOFT,
} from './tokens';
import { formatPlainMath } from '@/lib/plainMath';

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2);
}

function svgLabel(value: string): string {
  return formatPlainMath(value).replace(/\\/g, '');
}

interface RenderOpts {
  active?: boolean;
  /** 현재 step 에 안 쓰임 — 흐리게 */
  dim?: boolean;
}

const DIM_OP = 0.65;

function effOpacity(role: string | undefined, dim?: boolean): number {
  const base = ROLE_OPACITY[(role ?? 'intermediate') as keyof typeof ROLE_OPACITY];
  return dim ? Math.min(base, DIM_OP) : base;
}

function roleTone(role: string | undefined) {
  const key = (role ?? 'intermediate') as keyof typeof ROLE_TINT;
  return { color: ROLE_TINT[key], soft: ROLE_SOFT[key] };
}

function ObjectLabelAbove({ p, active }: { p: PlacedObject; active?: boolean }) {
  if (!p.obj.label) return null;
  const tone = roleTone(p.obj.role);
  return (
    <text
      x={p.x + p.w / 2}
      y={p.y - LABEL.aboveGap}
      textAnchor="middle"
      fontSize={LABEL.fontSize}
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontWeight={active ? 700 : 600}
      fill={active ? ACCENT : tone.color}
    >
      {svgLabel(p.obj.label)}
    </text>
  );
}

function ObjectScalar({ p, active, dim }: { p: PlacedObject; active?: boolean; dim?: boolean }) {
  const cx = p.x + p.w / 2;
  const cy = p.y + SCALAR.d / 2;
  const v = typeof p.obj.values === 'number' ? p.obj.values : null;
  const tone = roleTone(p.obj.role);
  return (
    <g opacity={effOpacity(p.obj.role, dim)}>
      <ObjectLabelAbove p={p} active={active} />
      <rect x={p.x} y={p.y} width={SCALAR.d} height={SCALAR.d} rx={6}
        fill={active ? ACCENT_SOFT : tone.soft}
        stroke={active ? ACCENT : tone.color}
        strokeOpacity={active ? 1 : 0.46}
        strokeWidth={active ? 1.6 : 1} />
      <text x={cx} y={cy + 3} textAnchor="middle"
        fontSize={LABEL.cellSize} fontFamily="ui-monospace, monospace"
        fontWeight={active ? 600 : 400} fill="var(--foreground)">
        {v !== null ? fmtNum(v) : ''}
      </text>
    </g>
  );
}

function ObjectVector({ p, active, dim }: { p: PlacedObject; active?: boolean; dim?: boolean }) {
  const d = p.obj.shape?.[0] ?? 1;
  const hasVals = Array.isArray(p.obj.values) && (p.obj.values as number[]).length > 0;
  const vals = hasVals ? (p.obj.values as number[]) : [];
  const tone = roleTone(p.obj.role);

  // 값 있고 shape 작으면 → 셀로
  if (hasVals && d <= CELL.abbreviateAbove) {
    const cells = [];
    for (let i = 0; i < d; i++) {
      const cx = p.x + i * (CELL.w + CELL.gap);
      const v = vals[i];
      cells.push(
        <g key={i}>
          <rect x={cx} y={p.y} width={CELL.w} height={CELL.h} rx={CELL.r}
            fill={active ? ACCENT_SOFT : tone.soft}
            stroke={active ? ACCENT : tone.color}
            strokeOpacity={active ? 1 : 0.46}
            strokeWidth={active ? 1.4 : 1} />
          {v !== undefined && (
            <text x={cx + CELL.w / 2} y={p.y + CELL.h / 2 + 4} textAnchor="middle"
              fontSize={LABEL.cellSize} fontFamily="ui-monospace, monospace"
              fontWeight={active ? 600 : 400} fill="var(--foreground)">
              {fmtNum(v)}
            </text>
          )}
        </g>
      );
    }
    return (
      <g opacity={effOpacity(p.obj.role, dim)}>
        <ObjectLabelAbove p={p} active={active} />
        {cells}
      </g>
    );
  }

  // 값 없으면 → 추상 bar
  return (
    <g opacity={effOpacity(p.obj.role, dim)}>
      <ObjectLabelAbove p={p} active={active} />
      <rect x={p.x} y={p.y} width={p.w} height={CELL.h} rx={CELL.r}
        fill={active ? ACCENT_SOFT : tone.soft}
        stroke={active ? ACCENT : tone.color}
        strokeOpacity={active ? 1 : 0.46}
        strokeWidth={active ? 1.4 : 1} />
      <text x={p.x + p.w / 2} y={p.y + CELL.h / 2 + 4} textAnchor="middle"
        fontSize={LABEL.cellSize - 1} fontFamily="ui-monospace, monospace"
        fill="var(--muted-foreground)">
        [{d}]
      </text>
    </g>
  );
}

function ObjectMatrix({ p, active, dim }: { p: PlacedObject; active?: boolean; dim?: boolean }) {
  const [r = 1, c = 1] = p.obj.shape ?? [1, 1];
  const hasVals = Array.isArray(p.obj.values) && Array.isArray((p.obj.values as number[][])[0]);
  const useAbstract = !hasVals || r > 4 || c > 4;
  const tone = roleTone(p.obj.role);

  if (!useAbstract) {
    const vals = p.obj.values as number[][];
    const cells = [];
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const cx = p.x + j * (CELL.w + CELL.gap);
        const cy = p.y + i * (CELL.h + CELL.gap);
        const v = vals[i]?.[j];
        cells.push(
          <g key={`${i}-${j}`}>
            <rect x={cx} y={cy} width={CELL.w} height={CELL.h} rx={CELL.r}
              fill={active ? ACCENT_SOFT : tone.soft}
              stroke={active ? ACCENT : tone.color}
              strokeOpacity={active ? 1 : 0.46}
              strokeWidth={active ? 1.4 : 1} />
            {v !== undefined && (
              <text x={cx + CELL.w / 2} y={cy + CELL.h / 2 + 4} textAnchor="middle"
                fontSize={LABEL.cellSize} fontFamily="ui-monospace, monospace"
                fontWeight={active ? 600 : 400} fill="var(--foreground)">
                {fmtNum(v)}
              </text>
            )}
          </g>
        );
      }
    }
    return (
      <g opacity={effOpacity(p.obj.role, dim)}>
        <ObjectLabelAbove p={p} active={active} />
        {cells}
      </g>
    );
  }

  // abstract block
  return (
    <g opacity={effOpacity(p.obj.role, dim)}>
      <ObjectLabelAbove p={p} active={active} />
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={4}
        fill={active ? ACCENT_SOFT : tone.soft}
        stroke={active ? ACCENT : tone.color}
        strokeOpacity={active ? 1 : 0.46}
        strokeWidth={active ? 1.5 : 1} />
      {/* grid hint - 4 horizontal lines */}
      {Array.from({ length: 3 }).map((_, i) => (
        <line key={i}
          x1={p.x + 4} x2={p.x + p.w - 4}
          y1={p.y + (p.h * (i + 1)) / 4} y2={p.y + (p.h * (i + 1)) / 4}
          stroke="var(--muted-foreground)" strokeOpacity={0.25} strokeWidth={0.5} />
      ))}
      <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 4} textAnchor="middle"
        fontSize={LABEL.cellSize} fontFamily="ui-monospace, monospace"
        fill="var(--muted-foreground)">
        [{r}×{c}]
      </text>
    </g>
  );
}

function ObjectToken({ p, active, dim }: { p: PlacedObject; active?: boolean; dim?: boolean }) {
  const tone = roleTone(p.obj.role);
  return (
    <g opacity={effOpacity(p.obj.role, dim)}>
      <rect x={p.x} y={p.y} width={p.w} height={TOKEN.h} rx={6}
        fill={active ? ACCENT_SOFT : tone.soft}
        stroke={active ? ACCENT : tone.color}
        strokeOpacity={active ? 1 : 0.46}
        strokeWidth={active ? 1.5 : 1} />
      <text x={p.x + p.w / 2} y={p.y + TOKEN.h / 2 + 4} textAnchor="middle"
        fontSize={LABEL.cellSize} fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={600}
        fill="var(--foreground)">
        {svgLabel(p.obj.label ?? p.obj.id)}
      </text>
    </g>
  );
}

function ObjectDistribution({ p, active, dim }: { p: PlacedObject; active?: boolean; dim?: boolean }) {
  const d = p.obj.shape?.[0] ?? 1;
  const vals = Array.isArray(p.obj.values) ? (p.obj.values as number[]) : [];
  const hasVals = vals.length > 0;
  const maxV = hasVals ? Math.max(...vals, 0.01) : 1;
  const tone = roleTone(p.obj.role);

  // values 없으면 abstract placeholder — 일정 height 의 막대 윤곽 + 위쪽 점선으로 분포 형태 암시
  const bars = [];
  for (let i = 0; i < d; i++) {
    const v = vals[i] ?? 0;
    const bx = p.x + i * DIST.w;
    if (hasVals) {
      const h = (v / maxV) * DIST.maxH;
      bars.push(
        <g key={i}>
          <line x1={bx + 2} y1={p.y + DIST.maxH} x2={bx + DIST.w - 2} y2={p.y + DIST.maxH}
            stroke="var(--border)" strokeWidth={0.6} />
          <rect x={bx + 3} y={p.y + DIST.maxH - h} width={DIST.w - 6} height={h} rx={CELL.r}
            fill={active ? ACCENT : tone.color} opacity={active ? 0.88 : 0.68} />
          {v > 0 && (
            <text x={bx + DIST.w / 2} y={p.y + DIST.maxH + 12} textAnchor="middle"
              fontSize={9} fontFamily="ui-monospace, monospace" fill="var(--muted-foreground)">
              {fmtNum(v)}
            </text>
          )}
        </g>
      );
    } else {
      // placeholder: 가운데가 가장 큰 dome 모양 (균등하지 않게)
      const norm = 1 - Math.abs(i - (d - 1) / 2) / Math.max(1, (d - 1) / 2);
      const h = DIST.maxH * (0.35 + norm * 0.55);
      bars.push(
        <rect key={i} x={bx + 3} y={p.y + DIST.maxH - h} width={DIST.w - 6} height={h} rx={CELL.r}
          fill={active ? ACCENT : tone.color}
          opacity={active ? 0.82 : 0.56} />
      );
    }
  }
  return (
    <g opacity={effOpacity(p.obj.role, dim)}>
      <ObjectLabelAbove p={p} active={active} />
      {bars}
    </g>
  );
}

function ObjectLabelOnly({ p, dim }: { p: PlacedObject; dim?: boolean }) {
  return (
    <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 4} textAnchor="middle"
      fontSize={LABEL.fontSize} fontFamily="ui-monospace, monospace"
      fill="var(--muted-foreground)" opacity={dim ? DIM_OP : 1}>
      {svgLabel(p.obj.label ?? p.obj.id)}
    </text>
  );
}

export function renderObject(p: PlacedObject, opts: RenderOpts = {}) {
  switch (p.obj.kind) {
    case 'scalar':       return <ObjectScalar key={p.obj.id} p={p} active={opts.active} dim={opts.dim} />;
    case 'vector':       return <ObjectVector key={p.obj.id} p={p} active={opts.active} dim={opts.dim} />;
    case 'matrix':       return <ObjectMatrix key={p.obj.id} p={p} active={opts.active} dim={opts.dim} />;
    case 'token':        return <ObjectToken key={p.obj.id} p={p} active={opts.active} dim={opts.dim} />;
    case 'distribution': return <ObjectDistribution key={p.obj.id} p={p} active={opts.active} dim={opts.dim} />;
    case 'label':        return <ObjectLabelOnly key={p.obj.id} p={p} dim={opts.dim} />;
    case 'group':        return null;
  }
}

export function GroupFrame({ g, dim }: { g: GroupBound; dim?: boolean }) {
  return (
    <g opacity={dim ? DIM_OP : 1}>
      <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={6}
        fill="var(--muted)" fillOpacity={0.2}
        stroke="var(--border)" strokeWidth={1} />
      {/* group label 은 렌더 안 함 — 위 객체와 y 겹침 방지. bracket 자체로 그룹 표시 충분 */}
    </g>
  );
}
