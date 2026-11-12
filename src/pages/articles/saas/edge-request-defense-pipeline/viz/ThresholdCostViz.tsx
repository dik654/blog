import SceneShell from "./SceneShell";

/**
 * 본문 대응: #score-and-action 아래 식 C(τ) = c_fp·FP(τ) + c_fn·FN(τ).
 * 점수가 높을수록 자동화에 가깝고, 임계 τ 이상이면 확인·차단합니다. 임계를 올리면 정상이 막히는 비율(FP)은
 * 줄고 자동화가 통과하는 비율(FN)은 늘어난다는 본문 가정만 따릅니다.
 * 곡선 모양(로지스틱, 정상 중심 30·자동화 중심 70, 폭 8)과 단가 비 1:1, 1:10은 모두 설명용 가정입니다.
 * 최소점은 0~100 정수 τ에서 C를 직접 계산해 찾습니다.
 */
const TAUS = Array.from({ length: 101 }, (_, t) => t);
const fp = (t: number) => 1 / (1 + Math.exp((t - 30) / 8));
const fn = (t: number) => 1 / (1 + Math.exp(-(t - 70) / 8));
const cost = (t: number, cfn: number) => fp(t) + cfn * fn(t);
const argmin = (cfn: number) => TAUS.reduce<number>((best, t) => (cost(t, cfn) < cost(best, cfn) ? t : best), 0);

const DOCS = { name: "공개 문서", cfn: 1, color: "#16a34a" };
const LOGIN = { name: "로그인", cfn: 10, color: "#dc2626" };
const DOCS_TAU = argmin(DOCS.cfn);
const LOGIN_TAU = argmin(LOGIN.cfn);

const SCENES = [
  { label: "두 비율은 반대로", summary: "임계를 올리면 FP↓ · FN↑", note: "FP(τ)는 정상 클라이언트가 확인·차단을 받는 비율, FN(τ)는 자동화가 그대로 통과하는 비율입니다. 임계를 오른쪽으로 옮기면 정상은 덜 막히고 자동화는 더 통과합니다." },
  { label: "공개 문서", summary: "단가 비 1 : 1 (가정)", note: "자동화를 통과시켜도 대역폭만 조금 더 쓰는 경로라 두 오류의 단가를 같게 놓았습니다. 총비용 C(τ)는 앞 장면의 두 비율 곡선이 같아지는 가운데(이 가정에서 τ=50)에서 가장 낮습니다." },
  { label: "로그인", summary: "미탐 단가 10배 (가정)", note: "남용이 곧 피해인 경로라 미탐 단가를 10배로 놓았습니다. 같은 점수 분포인데 총비용이 가장 낮은 임계가 왼쪽으로, 더 많이 막는 쪽으로 옮겨 갑니다." },
  { label: "같은 모델, 다른 임계", summary: "임계는 단가의 비율이 정함", note: "점수 계산은 그대로 두고 단가 비만 바꿨는데 최적 임계가 갈렸습니다. 두 경로에 같은 임계를 쓰면 적어도 한쪽은 총비용이 가장 낮은 자리를 벗어납니다." },
] as const;

const W = 360;
const H = 176;
const L = 16;
const R = 344;
const TOP = 16;
const BASE = 140;
const x = (t: number) => L + (t / 100) * (R - L);
const yOf = (v: number, max: number) => BASE - (v / max) * (BASE - TOP);
const path = (f: (t: number) => number, max: number) => TAUS.map((t, i) => `${i === 0 ? "M" : "L"} ${x(t).toFixed(1)} ${yOf(f(t), max).toFixed(1)}`).join(" ");

const RATE_FP = "#2563eb";
const RATE_FN = "#d97706";
const AXIS = "#94a3b8";

function Marker({ tau, color, label, max, cfn, side }: { tau: number; color: string; label: string; max: number; cfn: number; side: "left" | "right" }) {
  return (
    <g>
      <line x1={x(tau)} x2={x(tau)} y1={TOP} y2={BASE} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
      <circle cx={x(tau)} cy={yOf(cost(tau, cfn), max)} r={3.5} fill={color} />
      <text x={x(tau) + (side === "left" ? -4 : 4)} y={TOP + 8} textAnchor={side === "left" ? "end" : "start"} fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function ThresholdCostViz() {
  return (
    <SceneShell
      eyebrow="임계 고르기"
      title="두 오류의 단가 비가 바뀌면 가장 싼 임계가 움직입니다"
      description="가로축은 임계 τ(점수 0~100, 높을수록 자동화에 가까움)입니다. 곡선 모양과 단가 비는 설명용 가정이라 세로축 값은 적지 않았고, 각 곡선은 자기 최댓값을 위 끝에 맞춘 상대 크기입니다."
      ariaLabel="임계에 따라 정상 차단 비율, 자동화 통과 비율, 경로별 총비용 곡선과 최소점이 바뀌는 모습"
      scenes={SCENES}
      render={(active) => {
        const showRates = active === 0;
        const showDocs = active === 1 || active === 3;
        const showLogin = active === 2 || active === 3;
        const maxDocs = cost(0, DOCS.cfn);
        const maxLogin = cost(100, LOGIN.cfn);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="임계별 비율과 총비용 곡선">
              <line x1={L} x2={R} y1={BASE} y2={BASE} stroke={AXIS} strokeWidth={1} />
              <text x={L} y={BASE + 14} fontSize={12} fill="#64748b">0 · 다 막음</text>
              <text x={R} y={BASE + 14} textAnchor="end" fontSize={12} fill="#64748b">100 · 다 통과</text>
              <text x={(L + R) / 2} y={BASE + 28} textAnchor="middle" fontSize={12} fill="#64748b">임계 τ →</text>
              {showRates && (
                <>
                  <path d={path(fp, 1)} fill="none" stroke={RATE_FP} strokeWidth={1.25} />
                  <path d={path(fn, 1)} fill="none" stroke={RATE_FN} strokeWidth={1.25} />
                  <text x={x(8)} y={yOf(fp(8), 1) + 14} fontSize={12} fontWeight={700} fill={RATE_FP}>FP 정상 막힘</text>
                  <text x={x(92)} y={yOf(fn(92), 1) + 14} textAnchor="end" fontSize={12} fontWeight={700} fill={RATE_FN}>FN 자동화 통과</text>
                </>
              )}
              {showDocs && (
                <>
                  <path d={path((t) => cost(t, DOCS.cfn), maxDocs)} fill="none" stroke={DOCS.color} strokeWidth={1.25} />
                  <Marker tau={DOCS_TAU} color={DOCS.color} label={`${DOCS.name} 최저`} max={maxDocs} cfn={DOCS.cfn} side="right" />
                </>
              )}
              {showLogin && (
                <>
                  <path d={path((t) => cost(t, LOGIN.cfn), maxLogin)} fill="none" stroke={LOGIN.color} strokeWidth={1.25} />
                  <Marker tau={LOGIN_TAU} color={LOGIN.color} label={`${LOGIN.name} 최저`} max={maxLogin} cfn={LOGIN.cfn} side="left" />
                </>
              )}
            </svg>
            <div className="mt-2 flex min-h-[1.25rem] flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              {showRates && (
                <>
                  <span><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: RATE_FP }} />FP(τ)</span>
                  <span><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: RATE_FN }} />FN(τ)</span>
                </>
              )}
              {showDocs && <span><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: DOCS.color }} />공개 문서 총비용 C(τ)</span>}
              {showLogin && <span><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: LOGIN.color }} />로그인 총비용 C(τ)</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
