/**
 * Viz 박스 컴포넌트 — 용도별 5가지 타입
 *
 * 1. ModuleBox  — 시스템 모듈/컴포넌트 (Stage, EVM, StateDB 등)
 * 2. DataBox    — 데이터/객체 (Block, TX, Receipt 등)
 * 3. ActionBox  — 동작/프로세스 (검증, 실행, 저장 등)
 * 4. StatusBox  — 상태/진행률 (완료, 진행 중, 체크포인트)
 * 5. AlertBox   — 문제/경고 (병목, 크래시, 오류)
 */

interface BoxProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  color: string;
}

interface AnnotationBoxProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  color?: string;
  eyebrow?: string;
}

/** 단계별 해설 카드 — 도표 옆에 긴 설명을 안전하게 배치 */
export function AnnotationBox({
  x,
  y,
  w = 104,
  h = 64,
  label,
  color = "#6366f1",
  eyebrow = "현재 단계",
}: AnnotationBoxProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={color}
        fillOpacity={0.055}
        stroke="var(--border)"
        strokeWidth={0.8}
      />
      <rect
        x={x + 9}
        y={y + 10}
        width={1.5}
        height={h - 20}
        rx={0.75}
        fill={color}
        opacity={0.9}
      />
      <foreignObject
        x={x + 16}
        y={y + 8}
        width={w - 23}
        height={h - 16}
        pointerEvents="none"
      >
        <div className="flex h-full min-w-0 flex-col justify-center overflow-visible">
          <span
            className="text-[7px] font-bold"
            style={{ color }}
          >
            {eyebrow}
          </span>
          <span className="mt-1 break-keep text-[9px] font-semibold leading-[1.35] text-foreground">
            {label}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}

function SvgBoxLabel({
  x,
  y,
  w,
  h,
  label,
  sub,
  color,
  compact = false,
}: Required<Pick<BoxProps, "x" | "y" | "w" | "h" | "label" | "color">> &
  Pick<BoxProps, "sub"> & { compact?: boolean }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h} pointerEvents="none">
      <div className="flex h-full w-full min-w-0 flex-col items-center justify-center px-2 text-center">
        <span
          className={`${compact ? "text-[9px]" : "text-[10px]"} max-w-full break-keep font-bold leading-[1.25]`}
          style={{ color }}
        >
          {label}
        </span>
        {sub && (
          <span className="mt-0.5 max-w-full break-keep text-[8px] leading-tight text-muted-foreground">
            {sub}
          </span>
        )}
      </div>
    </foreignObject>
  );
}

/** 상단 컬러 바 카드 — 시스템 모듈 표현 */
let _moduleId = 0;
export function ModuleBox({
  x,
  y,
  w = 90,
  h = 48,
  label,
  sub,
  color,
}: BoxProps) {
  const clipId = `mb-${_moduleId++}`;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={w} height={h} rx={7} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={color}
        opacity={0.045}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill="transparent"
        stroke="var(--border)"
        strokeWidth={0.8}
      />
      {/* 컬러 바를 clipPath 안에서 맨 위에 렌더 — border를 덮음 */}
      <rect
        x={x}
        y={y}
        width={w}
        height={2}
        fill={color}
        opacity={0.9}
        clipPath={`url(#${clipId})`}
      />
      <SvgBoxLabel
        x={x}
        y={y + 2}
        w={w}
        h={h - 2}
        label={label}
        sub={sub}
        color="var(--foreground)"
      />
    </g>
  );
}

/** 둥근 필(pill) 뱃지 — 데이터/객체 표현 */
export function DataBox({
  x,
  y,
  w = 65,
  h = 32,
  label,
  sub,
  color,
  outlined,
}: BoxProps & { outlined?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={color}
        fillOpacity={0.08}
        stroke={outlined ? color : "var(--border)"}
        strokeWidth={outlined ? 1 : 0.75}
      />
      <SvgBoxLabel
        x={x}
        y={y}
        w={w}
        h={h}
        label={label}
        sub={sub}
        color={color}
        compact
      />
    </g>
  );
}

/** 왼쪽 액센트 바 — 동작/프로세스 표현 */
let _actionId = 0;
export function ActionBox({
  x,
  y,
  w = 85,
  h = 38,
  label,
  sub,
  color,
}: BoxProps) {
  const clipId = `ab-${_actionId++}`;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={w} height={h} rx={7} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={color}
        opacity={0.035}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill="transparent"
        stroke="var(--border)"
        strokeWidth={0.8}
      />
      <rect
        x={x}
        y={y}
        width={2}
        height={h}
        fill={color}
        clipPath={`url(#${clipId})`}
      />
      <SvgBoxLabel
        x={x + 2}
        y={y}
        w={w - 2}
        h={h}
        label={label}
        sub={sub}
        color="var(--foreground)"
      />
    </g>
  );
}

/** 프로그레스 바 카드 — 상태/진행 표현 */
export function StatusBox({
  x,
  y,
  w = 100,
  h = 50,
  label,
  sub,
  color,
  progress = 1,
}: BoxProps & { progress?: number }) {
  const barW = w - 20;
  const barY = y + h - 7;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={color}
        opacity={0.035}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill="transparent"
        stroke="var(--border)"
        strokeWidth={0.8}
      />
      <SvgBoxLabel
        x={x + 3}
        y={y + 1}
        w={w - 6}
        h={h - 10}
        label={label}
        sub={sub}
        color="var(--foreground)"
        compact={h < 42}
      />
      <rect
        x={x + 10}
        y={barY}
        width={barW}
        height={3}
        rx={1.5}
        fill="var(--border)"
        opacity={0.3}
      />
      <rect
        x={x + 10}
        y={barY}
        width={barW * progress}
        height={3}
        rx={1.5}
        fill={color}
      />
    </g>
  );
}

/** 점선 경고 박스 — 문제/오류 표현 */
export function AlertBox({
  x,
  y,
  w = 90,
  h = 48,
  label,
  sub,
  color,
}: BoxProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={color}
        fillOpacity={0.055}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="5 3"
      />
      <SvgBoxLabel
        x={x}
        y={y}
        w={w}
        h={h}
        label={label}
        sub={sub}
        color={color}
      />
    </g>
  );
}
