/**
 * Scene 렌더러 design tokens.
 * production tone: claw-permissions EnforcerViz / ModeLayersViz 와 일치.
 *
 * 색 원칙: neutral base + 절제된 blue accent. 의미 없는 glow/gradient 는 쓰지 않는다.
 * 애니메이션 원칙: spring physics. linear easing 금지.
 */

export const CELL = {
  /** vector / matrix 셀 가로 */
  w: 50,
  /** 셀 세로 */
  h: 40,
  /** 셀 사이 gap */
  gap: 3,
  /** 셀 corner radius */
  r: 4,
  /** matrix 가로/세로 셀 수가 이거 넘으면 abbreviate (… 표시) */
  abbreviateAbove: 8,
};

export const SCALAR = {
  /** scalar 정사각형 한 변 */
  d: 50,
};

export const TOKEN = {
  w: 88,
  h: 40,
};

export const DIST = {
  /** distribution 막대 가로 셀당 */
  w: 40,
  /** 막대 최대 높이 */
  maxH: 64,
};

export const COL = {
  /** 같은 depth 안에서 object 끼리 세로 간격 — 화살표 routing 공간 포함 */
  vGap: 28,
  /** depth (column) 간 가로 간격 — 화살표 routing 공간 */
  hGap: 64,
  /** 좌/우 padding (viz 컨테이너 안) */
  padX: 20,
  /** 상/하 padding */
  padY: 20,
};

export const LABEL = {
  /** object 라벨 (헤더) 폰트 */
  fontSize: 14,
  /** description 폰트 */
  descSize: 12,
  /** 셀 안 값 폰트 */
  cellSize: 13,
  /** caption / narration 폰트 */
  captionSize: 13.5,
  /** label 이 object 위에 떠 있는 거리 */
  aboveGap: 7,
  /** label 영역 자체 높이 */
  height: 20,
};

/** Article accent drives the active transition without flattening role semantics. */
export const ACCENT = 'var(--foundation-accent, #2563eb)';
export const ACCENT_SOFT = 'color-mix(in oklch, var(--foundation-accent, #2563eb) 10%, var(--background))';
export const ACCENT_MUTED = 'color-mix(in oklch, var(--foundation-accent, #2563eb) 22%, transparent)';
export const FLOW_NEUTRAL = 'var(--muted-foreground)';

/**
 * role → 색 변동. monochrome 기본 위에 미세 차이.
 * input 은 살짝 진한 foreground, param 은 흐릿 (학습 가중치는 배경 역할),
 * intermediate / output 은 기본, output 은 더 진하게.
 */
export const ROLE_TINT = {
  input: '#0f766e',
  param: '#7c3aed',
  intermediate: '#2563eb',
  output: '#e11d48',
} as const;

export const ROLE_SOFT = {
  input: 'color-mix(in oklch, #0f766e 11%, var(--background))',
  param: 'color-mix(in oklch, #7c3aed 10%, var(--background))',
  intermediate: 'color-mix(in oklch, #2563eb 10%, var(--background))',
  output: 'color-mix(in oklch, #e11d48 10%, var(--background))',
} as const;

export const ROLE_OPACITY = {
  input: 1,
  param: 0.88,
  intermediate: 1,
  output: 1,
} as const;

/** spring 프리셋. framer-motion transition 으로 그대로 사용 */
export const SPRING = {
  /** object 등장 (scale + opacity) */
  appear: { type: 'spring' as const, stiffness: 220, damping: 22 },
  /** transition motion (arrow / value flow) */
  flow: { type: 'spring' as const, stiffness: 140, damping: 24 },
  /** stagger 안 풀어진 cubic-bezier 가 더 자연스러운 경우 */
  ease: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] as const },
};

/** 등장 stagger (같은 t 안에서) */
export const STAGGER = 0.08;

/** transition 1개 평균 duration (caption 표시 시간 계산용) */
export const STEP_DURATION_MS = 650;

/** caption / narration */
export const NARRATION = {
  /** viz 헤더 (title) 폰트 */
  titleSize: 13,
  /** phase title 폰트 */
  phaseSize: 11,
};
