import SceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #get-logs — logs Bloom은 없을 가능성을 거르는 색인일 뿐이고,
 * 일반 RPC provider 경로는 log가 가리키는 block의 receipt 전체를 받아 ordered receipts root를
 * header와 비교한 뒤, receipt 안에 같은 RLP log bytes가 있는지 확인한다.
 * Verifiable API 경로는 receipt별 MPT proof를 쓰며, 두 경로의 anchor는 receipts root다.
 * receipt 4개와 log가 tx 2에 있다는 배치는 설명용 가정.
 */

const W = 360;
const H = 200;
const RECEIPTS = [0, 1, 2, 3] as const;
const LOG_TX = 2;
const rx = (index: number) => 24 + index * 80;

const SCENES = [
  {
    label: "Bloom은 거르기만 합니다",
    summary: "없음은 확실 · 있음은 아마도",
    note: "Logs Bloom은 header에 들어 있는 작은 비트 요약입니다. 찾는 address나 topic이 이 block에 없을 가능성을 빠르게 거를 수 있지만, false positive가 가능해서 '있을 수도 있음'이라는 답은 log가 실제로 있다는 증명이 되지 않습니다.",
  },
  {
    label: "원격이 log를 돌려줍니다",
    summary: "log L → block H",
    note: "원격 provider가 log L을 돌려주면, Helios는 그 log가 가리키는 block을 확인 대상으로 삼습니다. 이 시점의 log L은 아직 원격의 주장입니다.",
  },
  {
    label: "그 block의 receipt 전체를 받습니다",
    summary: "receipt 0 … 3 전부",
    note: "Helios 0.11.1의 일반 RPC provider 경로는 log 하나만이 아니라 그 block의 receipt 전체를 가져옵니다. 반환된 log가 여러 block을 가리키면 block마다 같은 일을 합니다.",
  },
  {
    label: "Receipts root를 다시 계산해 비교합니다",
    summary: "다시 계산한 root = header의 root?",
    note: "받은 receipt를 순서대로 묶어 receipts root를 다시 계산하고, 검증된 header의 receipts root와 비교합니다.",
  },
  {
    label: "Receipt 안에서 log bytes를 찾습니다",
    summary: "log L bytes ∈ receipt 2",
    note: "마지막으로 해당 transaction receipt 안에 원격이 준 것과 같은 RLP log bytes가 실제로 있는지 확인합니다.",
  },
  {
    label: "두 경로, 같은 anchor",
    summary: "receipts root ≠ state root",
    note: "별도 Verifiable API provider는 receipt마다 MPT proof를 받을 수도 있습니다. 두 경로 모두 최종 anchor는 검증된 header의 receipts root입니다. State root는 account·storage를, receipts root는 execution 결과와 log를 묶으므로 서로 대신할 수 없습니다.",
  },
] as const;

const ON = "#2563eb";
const OFF = "#94a3b8";
const TEXT = "#334155";
const MUTED = "#64748b";

function Cell({ x, y, w, h, label, on, dashed = false }: { x: number; y: number; w: number; h: number; label: string; on: boolean; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={on ? "#dbeafe" : "#f8fafc"}
        stroke={on ? ON : OFF}
        strokeWidth={on ? 1.25 : 1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 500} fill={on ? "#1e3a8a" : TEXT}>
        {label}
      </text>
    </g>
  );
}

export default function LogReceiptRootViz() {
  return (
    <SceneShell
      eyebrow="eth_getLogs · 한 block"
      title="Log 하나를 믿기 전에 receipt 묶음 전체를 header에 맞춰 봅니다"
      description="위 칸은 이미 검증된 block header H의 세 필드이고, 가운데 칸은 그 block의 receipt입니다. Receipt 4개와 log L이 transaction 2에 있다는 배치는 설명을 위한 가정입니다."
      ariaLabel="logs Bloom, receipt 전체, receipts root 재계산과 log bytes 확인을 차례로 보여 주는 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const receiptsOn = active === 2 || active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={16} y={6} width={328} height={62} rx={6} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={26} y={22} fontSize={12} fontWeight={700} fill={TEXT}>
              검증된 header H
            </text>
            <Cell x={24} y={30} w={96} h={30} label="logs Bloom" on={active === 0} />
            <Cell x={128} y={30} w={104} h={30} label="receipts root" on={active >= 3} />
            <Cell x={240} y={30} w={96} h={30} label="state root" on={false} dashed={active === 5} />

            {active === 3 && (
              <g>
                <Cell x={128} y={76} w={104} h={22} label="다시 계산한 root" on />
                <text x={240} y={92} fontSize={12} fontWeight={700} fill={ON}>
                  같은가?
                </text>
                <line x1={180} x2={180} y1={60} y2={76} stroke={ON} strokeWidth={1.25} />
                {RECEIPTS.map((index) => (
                  <line key={index} x1={rx(index) + 36} x2={180} y1={106} y2={98} stroke={ON} strokeWidth={1} />
                ))}
              </g>
            )}
            {active === 5 && (
              <g>
                <text x={180} y={90} textAnchor="middle" fontSize={12} fill="#1e3a8a">
                  receipt·log를 묶음
                </text>
                <text x={288} y={90} textAnchor="middle" fontSize={12} fill={MUTED}>
                  account·storage
                </text>
                <line x1={180} x2={180} y1={60} y2={78} stroke={ON} strokeWidth={1} />
              </g>
            )}

            {RECEIPTS.map((index) => {
              const hasLog = index === LOG_TX;
              const focus = (active === 4 || active === 1) && hasLog;
              const on = receiptsOn || focus || active === 5;
              return (
                <g key={index} opacity={active === 0 ? 0.45 : 1}>
                  <rect
                    x={rx(index)}
                    y={106}
                    width={72}
                    height={46}
                    rx={4}
                    fill={on ? "#dbeafe" : "#f8fafc"}
                    stroke={on ? ON : OFF}
                    strokeWidth={focus ? 1.25 : 1}
                    strokeDasharray={active === 1 && !hasLog ? "4 3" : undefined}
                  />
                  <text x={rx(index) + 36} y={123} textAnchor="middle" fontSize={12} fontWeight={600} fill={TEXT}>
                    receipt {index}
                  </text>
                  {hasLog && active >= 1 && (
                    <g>
                      <rect x={rx(index) + 8} y={129} width={56} height={17} rx={3} fill={active === 4 ? "#fde68a" : "#ffffff"} stroke={active === 4 ? "#d97706" : OFF} strokeWidth={1} />
                      <text x={rx(index) + 36} y={141} textAnchor="middle" fontSize={10} fill={TEXT}>
                        log bytes
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {active === 0 && (
              <g>
                <rect x={24} y={164} width={150} height={26} rx={4} fill="#ffffff" stroke={ON} strokeWidth={1} />
                <text x={99} y={181} textAnchor="middle" fontSize={12} fill={TEXT}>
                  찾는 address·topic
                </text>
                <line x1={100} x2={100} y1={164} y2={60} stroke={ON} strokeWidth={1} strokeDasharray="3 3" />
                <text x={184} y={175} fontSize={12} fontWeight={700} fill="#16a34a">
                  없음 → 확실히 제외
                </text>
                <text x={184} y={190} fontSize={12} fontWeight={700} fill="#b45309">
                  있음 → 아마도(오탐 가능)
                </text>
              </g>
            )}
            {active >= 1 && active <= 4 && (
              <g>
                <rect x={24} y={164} width={312} height={26} rx={4} fill={active === 4 ? "#fde68a" : "#ffffff"} stroke={active === 4 ? "#d97706" : OFF} strokeWidth={1} />
                <text x={180} y={181} textAnchor="middle" fontSize={12} fontWeight={600} fill={TEXT}>
                  {active === 4 ? "원격이 준 log L bytes와 같은가?" : "원격이 준 log L → block H를 가리킴"}
                </text>
                {active === 4 && <line x1={rx(LOG_TX) + 36} x2={rx(LOG_TX) + 36} y1={146} y2={164} stroke="#d97706" strokeWidth={1.25} />}
              </g>
            )}
            {active === 5 && (
              <text x={180} y={182} textAnchor="middle" fontSize={12} fill={TEXT}>
                일반 경로: receipt 전체 · Verifiable API: receipt별 proof
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
