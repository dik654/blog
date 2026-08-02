/**
 * Viz 박스 컴포넌트 — 용도별 5가지 타입
 *
 * 1. ModuleBox  — 시스템 모듈/컴포넌트 (Stage, EVM, StateDB 등)
 * 2. DataBox    — 데이터/객체 (Block, TX, Receipt 등)
 * 3. ActionBox  — 동작/프로세스 (검증, 실행, 저장 등)
 * 4. StatusBox  — 상태/진행률 (완료, 진행 중, 체크포인트)
 * 5. AlertBox   — 문제/경고 (병목, 크래시, 오류)
 *
 * autoFit prop: w 를 **최소 폭**으로 해석하고, label/sub 길이에 맞춰 자동으로 확장.
 * 새 Viz 는 autoFit 을 기본으로 사용해 overflow 를 구조적으로 제거한다.
 */

interface BoxProps {
  x: number; y: number; w?: number; h?: number;
  label: string; sub?: string; color: string;
  autoFit?: boolean;
}

// SVG sans-serif 한 글자의 대략적 폭. 한글은 영문의 ~2배 → len() 으로 환산.
function visualLen(s: string | undefined): number {
  if (!s) return 0;
  let n = 0;
  for (const ch of s) {
    // 한글·CJK·전각: 2, 그 외: 1
    const code = ch.codePointAt(0) ?? 0;
    const wide =
      (code >= 0x1100 && code <= 0x11ff) ||  // Hangul Jamo
      (code >= 0x3000 && code <= 0x9fff) ||  // CJK
      (code >= 0xac00 && code <= 0xd7af) ||  // Hangul Syllables
      (code >= 0xf900 && code <= 0xfaff) ||  // CJK Compat
      (code >= 0xff00 && code <= 0xff60);    // Fullwidth
    n += wide ? 2 : 1;
  }
  return n;
}

// autoFit 시 실제 폭: max(passed w, 텍스트가 필요로 하는 폭).
function fitW(
  w: number, label: string, sub: string | undefined,
  labelFs: number, subFs: number, hPadding: number,
): number {
  const labelW = visualLen(label) * labelFs * 0.55 + hPadding * 2;
  const subW = visualLen(sub) * subFs * 0.55 + hPadding * 2;
  return Math.max(w, Math.ceil(labelW), Math.ceil(subW));
}

/** 상단 컬러 바 카드 — 시스템 모듈 표현 */
let _moduleId = 0;
export function ModuleBox({ x, y, w = 90, h = 48, label, sub, color, autoFit }: BoxProps) {
  const clipId = `mb-${_moduleId++}`;
  const fw = autoFit ? fitW(w, label, sub, 11, 9, 8) : w;
  return (
    <g>
      <defs>
        <clipPath id={clipId}><rect x={x} y={y} width={fw} height={h} rx={8} /></clipPath>
      </defs>
      <rect x={x} y={y} width={fw} height={h} rx={8} fill="var(--card)" />
      <rect x={x} y={y} width={fw} height={h} rx={8} fill="transparent" stroke="var(--border)" strokeWidth={0.5} />
      {/* 컬러 바를 clipPath 안에서 맨 위에 렌더 — border를 덮음 */}
      <rect x={x} y={y} width={fw} height={5} fill={color} opacity={0.85} clipPath={`url(#${clipId})`} />
      <text x={x + fw / 2} y={y + h / 2 + (sub ? 0 : 4)} textAnchor="middle"
        fontSize={11} fontWeight={700} fill="var(--foreground)">{label}</text>
      {sub && <text x={x + fw / 2} y={y + h / 2 + 14} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">{sub}</text>}
    </g>
  );
}

/** 둥근 필(pill) 뱃지 — 데이터/객체 표현 */
export function DataBox({ x, y, w = 65, h = 32, label, sub, color, outlined, autoFit }: BoxProps & { outlined?: boolean }) {
  const fw = autoFit ? fitW(w, label, sub, 10, 9, 10) : w;
  return (
    <g>
      <rect x={x} y={y} width={fw} height={h} rx={h / 2} fill="var(--card)" />
      <rect x={x} y={y} width={fw} height={h} rx={h / 2}
        fill={`${color}12`} stroke={outlined ? color : 'var(--border)'} strokeWidth={outlined ? 1 : 0.5} />
      <text x={x + fw / 2} y={y + h / 2 + (sub ? -1 : 4)} textAnchor="middle"
        fontSize={10} fontWeight={600} fill={color}>{label}</text>
      {sub && <text x={x + fw / 2} y={y + h / 2 + 11} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">{sub}</text>}
    </g>
  );
}

/** 왼쪽 액센트 바 — 동작/프로세스 표현 */
let _actionId = 0;
export function ActionBox({ x, y, w = 85, h = 38, label, sub, color, autoFit }: BoxProps) {
  const clipId = `ab-${_actionId++}`;
  const fw = autoFit ? fitW(w, label, sub, 10, 9, 10) : w;
  return (
    <g>
      <defs>
        <clipPath id={clipId}><rect x={x} y={y} width={fw} height={h} rx={6} /></clipPath>
      </defs>
      <rect x={x} y={y} width={fw} height={h} rx={6} fill="var(--card)" />
      <rect x={x} y={y} width={fw} height={h} rx={6} fill="transparent" stroke="var(--border)" strokeWidth={0.5} />
      <rect x={x} y={y} width={3.5} height={h} fill={color} clipPath={`url(#${clipId})`} />
      <text x={x + fw / 2 + 2} y={y + h / 2 + (sub ? -2 : 4)} textAnchor="middle"
        fontSize={10} fontWeight={600} fill="var(--foreground)">{label}</text>
      {sub && <text x={x + fw / 2 + 2} y={y + h / 2 + 11} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">{sub}</text>}
    </g>
  );
}

/** 프로그레스 바 카드 — 상태/진행 표현 */
export function StatusBox({ x, y, w = 100, h = 50, label, sub, color, progress = 1, autoFit }: BoxProps & { progress?: number }) {
  const fw = autoFit ? fitW(w, label, sub, 10, 9, 10) : w;
  const barW = fw - 20;
  return (
    <g>
      <rect x={x} y={y} width={fw} height={h} rx={8} fill="var(--card)" />
      <rect x={x} y={y} width={fw} height={h} rx={8} fill="transparent" stroke="var(--border)" strokeWidth={0.5} />
      <text x={x + fw / 2} y={y + 18} textAnchor="middle"
        fontSize={10} fontWeight={600} fill="var(--foreground)">{label}</text>
      <rect x={x + 10} y={y + 26} width={barW} height={5} rx={2.5} fill="var(--border)" opacity={0.3} />
      <rect x={x + 10} y={y + 26} width={barW * progress} height={5} rx={2.5} fill={color} />
      {sub && <text x={x + fw / 2} y={y + 43} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">{sub}</text>}
    </g>
  );
}

/** 점선 경고 박스 — 문제/오류 표현 */
export function AlertBox({ x, y, w = 90, h = 48, label, sub, color, autoFit }: BoxProps) {
  const fw = autoFit ? fitW(w, label, sub, 10, 9, 10) : w;
  return (
    <g>
      <rect x={x} y={y} width={fw} height={h} rx={8} fill="var(--card)" />
      <rect x={x} y={y} width={fw} height={h} rx={8}
        fill={`${color}06`} stroke={color} strokeWidth={0.8} strokeDasharray="4 3" />
      <text x={x + fw / 2} y={y + h / 2 + (sub ? -3 : 4)} textAnchor="middle"
        fontSize={10} fontWeight={600} fill={color}>{label}</text>
      {sub && <text x={x + fw / 2} y={y + h / 2 + 11} textAnchor="middle"
        fontSize={9} fill={color} opacity={0.7}>{sub}</text>}
    </g>
  );
}
