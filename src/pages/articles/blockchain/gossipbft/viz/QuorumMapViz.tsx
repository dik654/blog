import SceneShell from "./SceneShell";

/**
 * 본문 대응: #quorum-phase
 * - QuorumOverlapViz: 80 + 80 − 120 = 40. 전체 120 줄 위에 두 정족수를 겹침이 가장 작아지게 놓습니다.
 * - RoundStructureViz: round 0은 QUALITY→PREPARE→COMMIT, round 1부터는 CONVERGE→PREPARE→COMMIT,
 *   DECIDE는 round loop 바깥입니다. COMMIT(⊥) 정족수는 다음 round를, 값의 COMMIT 정족수는 DECIDE를 엽니다.
 */
const W = 120;
const Q = 80;
const LEFT = 20;
const RIGHT = 340;
const px = (power: number) => LEFT + ((RIGHT - LEFT) * power) / W;
const OVERLAP_START = W - Q;

const OVERLAP_SCENES = [
  {
    label: "첫 정족수 Q₁",
    summary: "120 중 80",
    note: "줄 전체가 위원회 투표권 120입니다. 첫 정족수 Q₁이 그중 80을 차지합니다. 왼쪽에 몰아 그린 것은 설명을 위한 배치일 뿐입니다.",
  },
  {
    label: "둘째 정족수 Q₂",
    summary: "80 + 80 − 120 = 40",
    note: "Q₂도 80이 필요합니다. Q₁ 바깥에는 40만 남아 있으므로 Q₂를 최대한 오른쪽으로 밀어도 나머지 40은 Q₁ 안에서 가져와야 합니다. 더 겹치게 놓을 수는 있어도 40보다 덜 겹치게 놓을 수는 없습니다.",
  },
  {
    label: "겹침 안의 정직한 투표권",
    summary: "Byzantine < 40 = W/3",
    note: "Byzantine 참여자는 규칙을 어기고 임의로 행동할 수 있는 참여자입니다. 전제는 그들의 투표권 합이 W/3, 즉 40보다 작다는 것입니다. 그러면 최소 40인 겹침을 Byzantine 투표권만으로 채울 수 없어서 겹침에는 정직한 투표권이 반드시 들어 있습니다.",
  },
  {
    label: "충돌 인증서가 막히는 이유",
    summary: "산술 + 단계 규칙",
    note: "Q₁이 값 X를, Q₂가 값 Y를 지지하려면 겹침의 정직한 참여자가 양쪽에 서명해야 합니다. 정직한 참여자는 단계 규칙상 충돌 표를 만들지 않으므로 두 인증서가 함께 생기지 않습니다. 겹침 산술만으로는 이 결론이 나오지 않습니다.",
  },
] as const;

export function QuorumOverlapViz() {
  return (
    <SceneShell
      eyebrow="두 정족수의 최소 교집합"
      title="80짜리 두 정족수는 120 안에서 적어도 40을 공유합니다"
      description="줄 길이가 투표권입니다. 정족수(quorum)는 같은 라운드·단계·값에 모여야 하는 최소 투표권이고, W=120에서 80입니다."
      ariaLabel="전체 투표권 120 위에서 80짜리 두 정족수가 최소 40을 공유하는 과정"
      scenes={OVERLAP_SCENES}
      render={(active) => {
        const showQ2 = active >= 1;
        const showOverlap = active >= 1;
        const showValues = active >= 3;
        return (
          <svg viewBox="0 0 360 172" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${OVERLAP_SCENES[active].label}: ${OVERLAP_SCENES[active].summary}`}>
            <rect x={LEFT} y={22} width={RIGHT - LEFT} height={12} rx={2} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT} y={14} fontSize={12} fill="#64748b">위원회 전체 W = 120</text>
            {showOverlap && (
              <rect x={px(OVERLAP_START)} y={44} width={px(Q) - px(OVERLAP_START)} height={84} fill="#f59e0b" fillOpacity={0.18} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
            )}
            <rect x={px(0)} y={50} width={px(Q) - px(0)} height={26} rx={3} fill="#2563eb" fillOpacity={0.85} />
            <text x={px(0) + 8} y={67} fontSize={13} fontWeight={700} fill="#ffffff">
              {showValues ? "Q₁ · 80 · 값 X" : "Q₁ · 80"}
            </text>
            {showQ2 && (
              <>
                <rect x={px(OVERLAP_START)} y={96} width={px(W) - px(OVERLAP_START)} height={26} rx={3} fill="#0f766e" fillOpacity={0.85} />
                <text x={px(W) - 8} y={113} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">
                  {showValues ? "값 Y · 80 · Q₂" : "80 · Q₂"}
                </text>
              </>
            )}
            {showOverlap && (
              <text x={(px(OVERLAP_START) + px(Q)) / 2} y={90} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">
                {showValues ? "X·Y 둘 다 서명?" : active === 2 ? "정직한 몫 포함" : "겹침 ≥ 40"}
              </text>
            )}
            {[0, 40, 80, 120].map((tick) => (
              <g key={tick}>
                <line x1={px(tick)} x2={px(tick)} y1={136} y2={142} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(tick)} y={156} textAnchor="middle" fontSize={12} fill="#64748b">{tick}</text>
              </g>
            ))}
            <line x1={LEFT} x2={RIGHT} y1={136} y2={136} stroke="#94a3b8" strokeWidth={1} />
            <text x={RIGHT} y={170} textAnchor="end" fontSize={10} fill="#64748b">투표권</text>
          </svg>
        );
      }}
    />
  );
}

const ROUND_SCENES = [
  {
    label: "round 0",
    summary: "QUALITY → PREPARE → COMMIT",
    note: "첫 round는 QUALITY로 시작합니다. QUALITY는 입력 체인의 어느 접두사까지 충분히 지지받는지 찾아 후보 집합을 만들고, 이어서 PREPARE와 COMMIT 투표를 모읍니다.",
  },
  {
    label: "COMMIT(⊥) → 다음 round",
    summary: "r → r + 1",
    note: "bottom(⊥)은 “이번 round에는 특정 후보를 결정하지 않겠다”는 표입니다. COMMIT(⊥)이 strong quorum에 도달하면 결정 없이 같은 loop의 처음으로 돌아가 다음 round를 엽니다.",
  },
  {
    label: "round 1부터",
    summary: "CONVERGE → PREPARE → COMMIT",
    note: "round 1부터는 QUALITY 자리에 CONVERGE가 들어갑니다. 정당한 후보 가운데 투표권으로 보정한 ticket이 가장 좋은 제안을 골라 흩어진 시각을 좁힙니다. PREPARE와 COMMIT은 그대로 이어집니다.",
  },
  {
    label: "loop 바깥의 DECIDE",
    summary: "값의 COMMIT 정족수 → DECIDE",
    note: "어떤 round에서든 값에 대한 strong COMMIT quorum이 생기면 round loop를 빠져나와 DECIDE로 갑니다. DECIDE는 같은 값의 DECIDE strong quorum을 따로 모아 반환할 인증서를 만듭니다.",
  },
] as const;

function Phase({ name, on, dim = false }: { name: string; on: boolean; dim?: boolean }) {
  return (
    <div
      className={`flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-md border px-1 text-center text-[11px] font-bold sm:text-sm ${
        on ? "border-[#2563eb] bg-[#2563eb] text-white" : dim ? "border-dashed border-border text-muted-foreground/50" : "border-border bg-background text-muted-foreground"
      }`}
    >
      {name}
    </div>
  );
}

function Arrow({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`shrink-0 text-sm font-bold ${on ? "text-[#2563eb]" : "text-muted-foreground/50"}`}>
      →
    </span>
  );
}

export function RoundStructureViz() {
  return (
    <SceneShell
      eyebrow="다섯 단계 이름의 자리"
      title="round loop 안의 세 칸과 loop 바깥의 DECIDE"
      description="점선 상자가 round 하나를 되풀이하는 loop입니다. 첫 칸만 round 번호에 따라 QUALITY 또는 CONVERGE로 바뀝니다."
      ariaLabel="GossiPBFT의 round loop 구조와 DECIDE 위치"
      scenes={ROUND_SCENES}
      render={(active) => {
        const inRound = active <= 2;
        // DECIDE 장면(3)은 round 0을 포함한 어느 round에서든 나갈 수 있으므로 두 첫 칸을 모두 흐리지 않습니다.
        const qualityDim = active === 2;
        const convergeDim = active === 0;
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-lg border border-dashed border-[#64748b] p-3">
              <p className="text-xs font-bold text-muted-foreground">round loop · 현재 {active === 0 ? "r = 0" : active === 1 ? "r = 0 → 1" : active === 2 ? "r ≥ 1" : "빠져나옴"}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Phase name="QUALITY" on={active === 0} dim={qualityDim} />
                  <Phase name="CONVERGE" on={active === 2} dim={convergeDim} />
                </div>
                <Arrow on={inRound} />
                <Phase name="PREPARE" on={active === 0 || active === 2} />
                <Arrow on={inRound} />
                <Phase name="COMMIT" on />
              </div>
              <div className={`mt-3 rounded-md border px-2 py-2 text-center text-xs font-semibold leading-5 ${active === 1 ? "border-[#d97706] bg-[#f59e0b]/10 text-[#b45309]" : "border-border text-muted-foreground/60"}`}>
                ↩ COMMIT(⊥) strong quorum → r + 1, 첫 칸(CONVERGE)으로
              </div>
            </div>
            <div className={`text-center text-xs font-semibold ${active === 3 ? "text-[#2563eb]" : "text-muted-foreground/50"}`}>↓ 값에 대한 COMMIT strong quorum</div>
            <div className="flex items-center gap-1.5">
              <Phase name="DECIDE (loop 바깥)" on={active === 3} />
              <Arrow on={active === 3} />
              <Phase name="결정 + 인증서" on={active === 3} />
            </div>
          </div>
        );
      }}
    />
  );
}
