/**
 * 본문 대응: #probability-flow — reverse SDE와 probability-flow ODE를 같은 장난감 분포에서 실행한 경로.
 * 가정: 데이터는 x=−1, x=+1 두 점(각 절반), f=0, g=1(본문 LearningTerm 예시의 f·g 값).
 * 그러면 p_t = ½N(−1,t)+½N(+1,t)이고 score = (−x + tanh(x/t)) / t 입니다.
 * 역방향 한 step(시간 간격 h, t → t−h):
 *   SDE: x + h·g²·score + √h·z      (drift f − g²·score를 dt=−h로 적분)
 *   ODE: x + h·½g²·score             (Brownian 항 없음)
 * 같은 seed의 시작점 10개를 두 방법에 똑같이 넣습니다. 80 step Euler 근사입니다.
 */
export const T_START = 4;
export const T_END = 0.02;
export const STEPS = 80;
export const PARTICLES = 10;

export const score = (x: number, t: number) => (-x + Math.tanh(x / t)) / t;

export const density = (x: number, t: number) =>
  (0.5 / Math.sqrt(2 * Math.PI * t)) *
  (Math.exp(-((x - 1) ** 2) / (2 * t)) + Math.exp(-((x + 1) ** 2) / (2 * t)));

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussians(seed: number, count: number) {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const u = Math.max(rand(), 1e-12);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  });
}

const RATIO = (T_END / T_START) ** (1 / STEPS);
export const TIMES = Array.from({ length: STEPS + 1 }, (_, i) => T_START * RATIO ** i);

const startSigns = gaussians(11, PARTICLES);
const startNoise = gaussians(23, PARTICLES);
export const STARTS = startSigns.map((s, i) => (s < 0 ? -1 : 1) + Math.sqrt(T_START) * startNoise[i]);

function run(x0: number, stochastic: boolean, seed: number) {
  const noise = gaussians(seed, STEPS);
  return TIMES.slice(1).reduce<number[]>(
    (path, tNext, i) => {
      const t = TIMES[i];
      const h = t - tNext;
      const x = path[path.length - 1];
      const next = stochastic
        ? x + h * score(x, t) + Math.sqrt(h) * noise[i]
        : x + h * 0.5 * score(x, t);
      return [...path, next];
    },
    [x0],
  );
}

export const SDE_PATHS = STARTS.map((x0, i) => run(x0, true, 101 + i));
export const ODE_PATHS = STARTS.map((x0) => run(x0, false, 0));

export const DIFFERENT_END = STARTS.map(
  (_, i) => Math.sign(SDE_PATHS[i][STEPS]) !== Math.sign(ODE_PATHS[i][STEPS]),
);
export const ENDPOINT_DIFFERENT = DIFFERENT_END.filter(Boolean).length;
