import SceneShell from "./SceneShell";

/**
 * 본문 대응: #contribution — position 261은 subnet 2의 local bit 5로 contribution에 들어가고,
 * slot 101 proposer가 subnet 0·1·2·3의 128-bit 구간을 이어 붙일 때 다시 전체 bit 261이 된다.
 * 261 − 2 × 128 = 5, 2 × 128 + 5 = 261. Unique 목록 장면은 중복이 V37 하나뿐이라는 가정에서 512 − 1 = 511.
 */
const W = 360;
const H = 212;
const ROW_X = 78;
const ROW_R = 346;
const ROW_H = 12;
const rowY = (subnet: number) => 14 + subnet * 21;
const bitX = (local: number) => ROW_X + ((local + 0.5) / 128) * (ROW_R - ROW_X);
const STRIP_L = 14;
const STRIP_R = 346;
const STRIP_Y = 124;
const STRIP_H = 18;
const SEG = (STRIP_R - STRIP_L) / 4;
const gx = (position: number) => STRIP_L + ((position + 0.5) / 512) * (STRIP_R - STRIP_L);

const SCENES = [
  {
    label: "local bit",
    summary: "261 − 2 × 128 = 5 → local bit 5",
    note: "Subnet 2의 contribution은 128 bits입니다. Position 261에서 앞선 두 subnet의 256을 빼면 local bit 5가 켜집니다.",
  },
  {
    label: "128-bit × 4",
    summary: "contribution 4개 × 128 bits",
    note: "Slot 101 proposer는 slot 100·R100에 맞는 contribution 중 subnet마다 참여가 가장 많은 것을 고릅니다. 다른 position의 참여는 그리지 않았습니다.",
  },
  {
    label: "이어 붙이기",
    summary: "offset 2 × 128 = 256 → 256 + 5 = 261",
    note: "Proposer가 subnet 0·1·2·3 구간을 순서대로 이어 512 bits를 만듭니다. Subnet 2 구간은 256에서 시작하므로 local bit 5는 bit 261이 됩니다.",
  },
  {
    label: "서명 합치기",
    summary: "aggregate signature 4개 → BLS signature 1개",
    note: "네 contribution의 aggregate signatures도 한 BLS signature로 합쳐 bits와 함께 block 101의 SyncAggregate에 넣습니다.",
  },
  {
    label: "unique 압축",
    summary: "512 bits ↔ 511 keys (가정) → 어긋남",
    note: "두 자리를 가진 V37을 unique 목록으로 줄이면, 중복이 V37뿐이라 가정해도 key는 511개라 512 bits와 맞지 않습니다. 그래서 position ordering을 유지합니다.",
  },
] as const;

export default function BitOffsetViz() {
  return (
    <SceneShell
      eyebrow="Local bit와 전체 offset"
      title="Subnet 2의 local bit 5가 block 101에서 전체 bit 261로 돌아가는 길"
      description="위 네 줄은 subnet별 128-bit contribution, 아래 띠는 proposer가 이어 붙인 512 bits입니다. 주황색이 V37의 position입니다."
      note="V37·position 261·slot 100/101은 본문의 설명용 예입니다. 512 positions와 4 subnets는 mainnet preset 값입니다."
      ariaLabel="Subnet contribution의 local bit가 512-bit SyncAggregate의 전체 bit로 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const showAllRows = active >= 1;
        const showStrip = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 1, 2, 3].map((subnet) => {
              const visible = showAllRows || subnet === 2;
              if (!visible) return null;
              const y = rowY(subnet);
              return (
                <g key={subnet}>
                  <text x={14} y={y + 10} fontSize={12} fontWeight={subnet === 2 ? 700 : 400} className="fill-foreground">
                    subnet {subnet}
                  </text>
                  <rect x={ROW_X} y={y} width={ROW_R - ROW_X} height={ROW_H} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  {subnet === 0 && active === 4 && <rect x={bitX(5) - 2} y={y + 1} width={4} height={ROW_H - 2} fill="#d97706" />}
                  {subnet === 2 && (
                    <>
                      <rect x={bitX(5) - 2} y={y + 1} width={4} height={ROW_H - 2} fill="#d97706" />
                      {active === 0 && (
                        <text x={bitX(5) + 6} y={y + ROW_H + 13} fontSize={12} fontWeight={700} fill="#d97706">
                          local bit 5 (128칸 중)
                        </text>
                      )}
                    </>
                  )}
                  {showStrip && (
                    <line x1={ROW_X + (ROW_R - ROW_X) / 2} y1={y + ROW_H} x2={STRIP_L + subnet * SEG + SEG / 2} y2={STRIP_Y - 2} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                  )}
                </g>
              );
            })}
            {active === 0 && (
              <text x={ROW_X} y={rowY(2) + ROW_H + 40} fontSize={12} fill="#64748b">
                261 − 2 × 128 = 5
              </text>
            )}
            {showStrip && (
              <g>
                {[0, 1, 2, 3].map((subnet) => (
                  <g key={subnet}>
                    <rect x={STRIP_L + subnet * SEG} y={STRIP_Y} width={SEG} height={STRIP_H} fill="none" stroke="#94a3b8" strokeWidth={1} />
                    <text x={STRIP_L + subnet * SEG + 2} y={STRIP_Y + STRIP_H + 12} fontSize={10.5} fill="#64748b">
                      {subnet * 128}
                    </text>
                  </g>
                ))}
                <rect x={gx(261) - 2} y={STRIP_Y + 1} width={4} height={STRIP_H - 2} fill="#d97706" />
                {active === 4 && <rect x={gx(5) - 2} y={STRIP_Y + 1} width={4} height={STRIP_H - 2} fill="#d97706" />}
                <text x={gx(261)} y={STRIP_Y - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">
                  bit 261
                </text>
                {active === 4 && (
                  <text x={gx(5) + 4} y={STRIP_Y - 5} fontSize={12} fontWeight={700} fill="#d97706">
                    5
                  </text>
                )}
              </g>
            )}
            {active === 2 && (
              <text x={W / 2} y={H - 22} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
                512-bit sync_committee_bits · 2 × 128 + 5 = 261
              </text>
            )}
            {active === 3 && (
              <g>
                {[0, 1, 2, 3].map((subnet) => (
                  <g key={subnet}>
                    <rect x={24 + subnet * 52} y={168} width={44} height={20} rx={5} fill="none" stroke="#94a3b8" strokeWidth={1} />
                    <text x={46 + subnet * 52} y={182} textAnchor="middle" fontSize={11} className="fill-foreground">
                      σ sub{subnet}
                    </text>
                  </g>
                ))}
                <line x1={230} y1={178} x2={262} y2={178} stroke="#2563eb" strokeWidth={1.25} />
                <path d="M262 174 L268 178 L262 182 Z" fill="#2563eb" />
                <rect x={272} y={166} width={74} height={24} rx={6} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={309} y={182} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">
                  BLS 서명 1개
                </text>
              </g>
            )}
            {active === 4 && (
              <g>
                <rect x={STRIP_L} y={176} width={((STRIP_R - STRIP_L) * 511) / 512} height={STRIP_H} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={STRIP_L} y={170} fontSize={12} fontWeight={700} fill="#dc2626">
                  unique keys 511개 (가정: 중복은 V37뿐)
                </text>
                <text x={STRIP_R} y={H - 4} textAnchor="end" fontSize={11} fill="#dc2626">
                  512 bits와 511 keys가 1:1로 맞지 않음
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
