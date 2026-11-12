import SceneShell from "./SceneShell";

/**
 * 본문 대응: #topdown — Accept(F) ⇔ h_old < h ≤ h_cache ∧ H = CacheHash(h).
 * 본문 예시: 마지막 commit 120, cache가 본 최신 높이 125, 후보 121.
 * hash 문자열은 그림용 가정이다.
 */
const H_OLD = 120;
const H_CACHE = 125;
const HEIGHTS = [118, 119, 120, 121, 122, 123, 124, 125, 126, 127] as const;

interface Proposal {
  h: number;
  hash: string;
  cacheHash: string | null;
  verdict: "승인" | "거절";
  failed: "old" | "cache" | "hash" | null;
}

const PROPOSALS: readonly Proposal[] = [
  { h: 120, hash: "0x4e…", cacheHash: "0x4e…", verdict: "거절", failed: "old" },
  { h: 121, hash: "0xa1…", cacheHash: "0xa1…", verdict: "승인", failed: null },
  { h: 121, hash: "0x7c…", cacheHash: "0xa1…", verdict: "거절", failed: "hash" },
  { h: 126, hash: "0x3d…", cacheHash: null, verdict: "거절", failed: "cache" },
];

const SCENES = [
  {
    label: "이미 commit한 높이",
    summary: "h = 120 → 거절",
    note: "120은 이미 commit한 높이라 첫 조건 h_old < h에서 막힙니다. 세 조건을 모두 만족해야 하므로 여기서 거절입니다.",
  },
  {
    label: "cache가 본 범위 안, hash 일치",
    summary: "h = 121 → 승인",
    note: "121은 120과 125 사이이고 hash도 cache와 같아 통과합니다. 설정된 부모 체인 조회 결과와 같다는 뜻일 뿐 부모 체인의 최종성 증명은 아닙니다.",
  },
  {
    label: "같은 높이, 다른 hash",
    summary: "h = 121 → 거절",
    note: "높이는 앞 장면과 같이 통과하지만 hash가 cache의 121 hash와 달라 validator가 거절합니다.",
  },
  {
    label: "cache가 아직 못 본 높이",
    summary: "h = 126 → 거절",
    note: "126은 cache가 확인한 최신 높이 125를 넘어 h ≤ h_cache에서 막힙니다. 비교할 cache hash도 아직 없습니다.",
  },
] as const;

const W = 360;
const H = 92;
const X0 = 18;
const STEP = (W - 2 * X0) / (HEIGHTS.length - 1);
const hx = (height: number) => X0 + (height - HEIGHTS[0]) * STEP;
const AXIS_Y = 50;

export default function ParentFinalityCheckViz() {
  return (
    <SceneShell
      eyebrow="Top-down · parent finality proposal 검사"
      title="제안된 parent 높이는 commit한 높이와 cache가 본 높이 사이에 있고 hash까지 같아야 합니다"
      description="가로줄은 parent chain의 block 높이입니다. 제안 F=(h, H)는 높이 h와 hash H입니다. 마지막 commit 높이 h_old=120과 cache가 본 최신 높이 h_cache=125는 본문 예시 값이고, CacheHash(h)는 cache가 높이 h에서 본 hash입니다. hash 문자열은 그림용 가정입니다."
      note="이 검사는 고정한 Fendermint finality provider의 proposal 검사를 따른 것입니다. TopDownFinalityFacet 자체는 이전보다 높은 높이만 저장합니다."
      ariaLabel="parent finality proposal의 높이와 hash 조건을 네 경우로 확인하는 장면"
      scenes={SCENES}
      render={(active) => {
        const p = PROPOSALS[active];
        const checks = [
          { key: "old", text: `h_old < h  (${H_OLD} < ${p.h})` },
          { key: "cache", text: `h ≤ h_cache  (${p.h} ≤ ${H_CACHE})` },
          { key: "hash", text: `H = CacheHash(h)  (${p.hash} vs ${p.cacheHash ?? "없음"})` },
        ];
        const failedAt = checks.findIndex((check) => check.key === p.failed);
        const status = (index: number) => (failedAt === -1 || index < failedAt ? "통과" : index === failedAt ? "실패" : "앞에서 거절");
        const accepted = p.verdict === "승인";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={X0 - 8} y={AXIS_Y - 10} width={hx(H_OLD) - X0 + 16} height={20} fill="#94a3b8" opacity={0.25} />
              <rect x={hx(H_OLD + 1) - 8} y={AXIS_Y - 10} width={hx(H_CACHE) - hx(H_OLD + 1) + 16} height={20} fill="#2563eb" opacity={0.15} />
              <text x={(X0 + hx(H_OLD)) / 2} y={AXIS_Y - 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#64748b">commit 완료</text>
              <text x={(hx(H_OLD + 1) + hx(H_CACHE)) / 2} y={AXIS_Y - 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#2563eb">후보 범위</text>
              <text x={(hx(H_CACHE + 1) + hx(127)) / 2} y={AXIS_Y - 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#94a3b8">cache 미확인</text>
              <line x1={X0 - 8} x2={W - X0 + 8} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {HEIGHTS.map((height) => {
                const isProposal = height === p.h;
                return (
                  <g key={height}>
                    <circle cx={hx(height)} cy={AXIS_Y} r={isProposal ? 6 : 3} fill={isProposal ? (accepted ? "#2563eb" : "#dc2626") : height > H_CACHE ? "#ffffff" : "#64748b"} stroke={height > H_CACHE ? "#94a3b8" : "none"} strokeWidth={1} />
                    <text x={hx(height)} y={AXIS_Y + 22} textAnchor="middle" fontSize={10.5} fontWeight={isProposal ? 700 : 400} fill={isProposal ? (accepted ? "#2563eb" : "#dc2626") : "#64748b"}>{height}</text>
                  </g>
                );
              })}
              <text x={hx(H_OLD)} y={AXIS_Y + 36} textAnchor="middle" fontSize={10} fill="#64748b">h_old</text>
              <text x={hx(H_CACHE)} y={AXIS_Y + 36} textAnchor="middle" fontSize={10} fill="#64748b">h_cache</text>
            </svg>
            <div className="mt-2 space-y-1">
              {checks.map((check, index) => (
                <p
                  key={check.key}
                  className={`flex items-center justify-between gap-2 rounded-md border px-2 py-0.5 font-mono text-[11px] sm:py-1 sm:text-xs ${
                    status(index) === "통과" ? "border-border" : status(index) === "실패" ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="min-w-0 break-all">{check.text}</span>
                  <span className="shrink-0 font-bold">{status(index)}</span>
                </p>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
