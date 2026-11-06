import SceneShell from "./SceneShell";
import { StackBar, type BarPart } from "./StackBar";

/**
 * 본문 대응: #case — 정수·운영 60 + 배관 교체 30 = 비용 90, 가구 80 + 정부 10 = 지급 90.
 * 같은 요금을 대신 낸 10은 비용에 다시 더하지 않고, 실제로 추가 자원이 들었을 때만 비용이 100이 된다.
 */
const SLATE = "#475569";
const BLUE = "#2563eb";
const GREEN = "#15803d";
const RED = "#dc2626";
const AMBER = "#b45309";

const COST: readonly BarPart[] = [
  { value: 60, label: "정수·운영 60", fill: SLATE },
  { value: 30, label: "배관 교체 30", fill: "#64748b" },
];
const PAY: readonly BarPart[] = [
  { value: 80, label: "가구 80", fill: BLUE },
  { value: 10, label: "10", fill: GREEN },
];

const SCENES = [
  { label: "무엇이 드는가", summary: "60 + 30 = 90", note: "한 해 서비스에 드는 자원을 먼저 셉니다. 숫자는 이 글의 가정입니다." },
  { label: "누가 내는가", summary: "80 + 10 = 90", note: "같은 90을 지급자별로 다시 나눕니다. 정부가 취약 가구를 대신해 낸 10은 초록 칸입니다. 두 막대는 같은 90을 다른 기준으로 자른 것입니다." },
  { label: "두 번 세면", summary: "90 + 10 = 100 (틀림)", note: "초록 10이 같은 요금을 대신 내는 돈이라면 이미 90 안에 있습니다. 비용 막대에 다시 붙이면 지급자만 바뀐 돈을 자원처럼 두 번 셉니다." },
  { label: "실제로 더 들었다면", summary: "60 + 30 + 10 = 100", note: "별도 연결 공사나 지원 행정에 실제로 10이 들었다면 그때는 추가 자원 비용입니다. 이 10을 누가 낼지는 사례가 정하지 않아 지급 쪽을 점선으로 남겼습니다." },
] as const satisfies readonly { label: string; summary: string; note: string }[];

const x = (value: number) => 20 + value * 3;

export default function BillLedgerViz() {
  return (
    <SceneShell
      eyebrow="(가정) 한 해의 장부"
      title="같은 요금을 대신 낸 10은 비용에 다시 더하지 않습니다"
      description="위 막대는 드는 자원, 아래 막대는 내는 사람입니다. 두 막대의 축척은 같습니다."
      ariaLabel="서비스 비용 90과 지급자 구성, 지원금을 두 번 세는 잘못"
      scenes={SCENES}
      render={(index) => {
        const cost: readonly BarPart[] =
          index === 2
            ? [...COST, { value: 10, label: "10", fill: RED, dashed: true }]
            : index === 3
              ? [...COST, { value: 10, label: "10", fill: AMBER }]
              : COST;
        const pay: readonly BarPart[] = index === 3 ? [...PAY, { value: 10, label: "?", fill: "#64748b", dashed: true }] : PAY;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <text x={20} y={20} fontSize={12} fontWeight={700} fill="currentColor">드는 자원</text>
            <StackBar y={28} parts={cost} />
            <text x={x(90)} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">90</text>
            {index >= 2 && (
              <text x={x(100)} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill={index === 2 ? RED : AMBER}>
                {index === 2 ? "100?" : "100"}
              </text>
            )}
            {index === 2 && <text x={x(100)} y={82} textAnchor="end" fontSize={11} fontWeight={700} fill={RED}>같은 10을 또 더함</text>}
            {index === 3 && <text x={x(100)} y={82} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>실제로 든 연결 공사·행정</text>}
            {index >= 1 && (
              <>
                <text x={20} y={108} fontSize={12} fontWeight={700} fill="currentColor">내는 사람</text>
                <StackBar y={116} parts={pay} />
                <text x={x(90)} y={108} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">90</text>
                <text x={x(90)} y={170} textAnchor="end" fontSize={11} fontWeight={700} fill={GREEN}>정부가 대신 낸 요금 10</text>
              </>
            )}
            <line x1={x(90)} x2={x(90)} y1={24} y2={70} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            {index >= 1 && <line x1={x(90)} x2={x(90)} y1={112} y2={158} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />}
            {index === 3 && <text x={x(100)} y={186} textAnchor="end" fontSize={11} fill="#64748b">추가 10의 지급자는 정하지 않음</text>}
          </svg>
        );
      }}
    />
  );
}
