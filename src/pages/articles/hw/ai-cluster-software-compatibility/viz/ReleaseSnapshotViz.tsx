import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 같은 DGX OS 7 문서 안에서 current repository 값과 release 고정 행이 다르다.
 * 위 줄 = 움직이는 저장소(current repository), 아래 줄 = DGX OS 7.6.0 release snapshot.
 * 값: 7.6.0(2026-09-14) driver 580.178.04, current 580.196.07(2026-10-27 갱신, 2026-11-02 확인).
 * 저장소의 2026-09-14 당시 값과 이후 값은 본문에 없으므로 적지 않는다.
 */
const SLOTS = ["2026-09-14", "2026-10-27", "2026-11-02 확인", "이후"] as const;

const SCENES = [
  {
    label: "release 7.6.0이 행을 고정합니다",
    summary: "driver 580.178.04",
    note: "2026년 9월 14일 공개된 DGX OS 7.6.0 release snapshot은 kernel·driver·CUDA·NCCL·DOCA OFED 값을 한 행으로 고정합니다. 이 행은 이후 날짜에도 바뀌지 않습니다.",
  },
  {
    label: "저장소는 앞으로 움직입니다",
    summary: "current 580.196.07 ≠ 580.178.04",
    note: "2026년 10월 27일 갱신된 current repository의 GPU driver는 580.196.07입니다. 11월 2일 같은 문서를 보면 ‘지금 저장소가 주는 값’과 ‘7.6.0이 검증한 고정 행’이 이미 다릅니다.",
  },
  {
    label: "승인한 조합을 되살리는 기록",
    summary: "확인일 + release ID + snapshot·manifest·digest",
    note: "저장소가 또 움직이면 위 줄의 다음 값은 지금 알 수 없습니다. 제안서에는 확인일과 release ID를, 운영 배포에는 repository snapshot·host manifest·container digest를 남겨야 어느 조합을 시험하고 승인했는지 되살릴 수 있습니다.",
  },
] as const;

const W = 330;
const H = 150;
const X0 = 42;
const STEP = 86;
const sx = (slot: number) => X0 + slot * STEP;
const REPO_Y = 44;
const SNAP_Y = 106;

export default function ReleaseSnapshotViz() {
  return (
    <SceneShell
      eyebrow="움직이는 값과 고정 행"
      title="같은 문서 안에서도 저장소 값과 release 행이 갈라집니다"
      description="가로는 날짜 순서이며 간격은 실제 기간에 비례하지 않습니다. 위 줄은 지금 설치하면 받는 current repository, 아래 줄은 release가 함께 검증한 고정 행입니다."
      ariaLabel="DGX OS 7.6.0 release snapshot과 current repository의 GPU driver 값 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {SLOTS.map((slot, index) => (
              <g key={slot}>
                <line x1={sx(index)} x2={sx(index)} y1={22} y2={126} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
                <text x={sx(index)} y={142} textAnchor="middle" fontSize={10} fill="#64748b">{slot}</text>
              </g>
            ))}
            <text x={4} y={REPO_Y - 14} fontSize={10.5} fontWeight={700} fill="#64748b">current repository</text>
            <text x={4} y={SNAP_Y - 14} fontSize={10.5} fontWeight={700} fill="#64748b">DGX OS 7.6.0 고정 행</text>

            {/* 고정 행: 처음부터 끝까지 같은 값 */}
            <line x1={sx(0)} x2={sx(3)} y1={SNAP_Y} y2={SNAP_Y} stroke="#2563eb" strokeWidth={1.25} />
            {SLOTS.map((slot, index) => (
              <circle key={`snap-${slot}`} cx={sx(index)} cy={SNAP_Y} r={3.5} fill="#2563eb" />
            ))}
            <rect x={sx(0) - 38} y={SNAP_Y + 6} width={76} height={16} rx={3} fill="#eff6ff" stroke="#2563eb" strokeWidth={1} />
            <text x={sx(0)} y={SNAP_Y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1d4ed8">580.178.04</text>
            <text x={sx(3)} y={SNAP_Y + 18} textAnchor="middle" fontSize={10} fill="#1d4ed8">580.178.04</text>

            {/* 움직이는 저장소: 본문에 있는 값만 */}
            <g opacity={active >= 1 ? 1 : 0.25}>
              <line x1={sx(0)} x2={sx(1)} y1={REPO_Y} y2={REPO_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={sx(0)} y={REPO_Y + 4} textAnchor="middle" fontSize={10} fill="#94a3b8">?</text>
              <line x1={sx(1)} x2={sx(2)} y1={REPO_Y} y2={REPO_Y} stroke="#d97706" strokeWidth={1.25} />
              <circle cx={sx(1)} cy={REPO_Y} r={3.5} fill="#d97706" />
              <circle cx={sx(2)} cy={REPO_Y} r={3.5} fill="#d97706" />
              <rect x={(sx(1) + sx(2)) / 2 - 38} y={REPO_Y + 6} width={76} height={16} rx={3} fill="#fffbeb" stroke="#d97706" strokeWidth={1} />
              <text x={(sx(1) + sx(2)) / 2} y={REPO_Y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">580.196.07</text>
            </g>
            <g opacity={active === 2 ? 1 : 0.2}>
              <line x1={sx(2)} x2={sx(3)} y1={REPO_Y} y2={REPO_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={sx(3)} y={REPO_Y + 4} textAnchor="middle" fontSize={10} fill="#94a3b8">?</text>
            </g>
            {active >= 1 && (
              <g>
                <line x1={sx(2)} x2={sx(2)} y1={REPO_Y + 22} y2={SNAP_Y - 6} stroke="#dc2626" strokeWidth={1} />
                <text x={sx(2) + 5} y={(REPO_Y + SNAP_Y) / 2 + 6} fontSize={9} fontWeight={700} fill="#dc2626">≠</text>
              </g>
            )}
          </svg>
          <div className={`mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 transition-opacity duration-300 motion-reduce:transition-none ${active === 2 ? "opacity-100" : "opacity-35"}`}>
            {["확인일 · release ID", "repository snapshot", "host manifest", "container digest"].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-background px-2 py-2 text-center font-semibold">{item}</div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
