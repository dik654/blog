import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 재원 조달·위험 풀·구매와 본인부담, 그리고 기관 배치의 두 경우.
 * 여러 기관 장면의 '세 기관'은 나누는 경우를 하나 그린 것이다(가정).
 */
const FN = "#2563eb";
const PATIENT = "#d97706";
const ORG = "#7c3aed";

const SCENES = [
  { label: "재원 조달", summary: "돈을 모으는 일", on: [0], org: 0, note: "보험료와 세금 등으로 돈을 모으는 일입니다. B절 그림의 '건강할 때 미리 냅니다'에 해당합니다." },
  { label: "위험 풀 형성", summary: "모은 돈을 함께 관리", on: [1], org: 0, note: "여러 사람의 돈을 함께 관리해 아픈 사람의 부담을 나눕니다. 2절 그림의 묶음이 곧 풀입니다." },
  { label: "구매", summary: "무엇을 얼마에 지불할지", on: [2], org: 0, note: "의료기관에 어떤 서비스를 얼마에 지불할지 정합니다. 여기서 구매는 물건을 사는 일이 아니라 의료 서비스의 값을 치르는 결정입니다." },
  { label: "본인부담은 다른 길입니다", summary: "2만 원 ≠ 총지급 10만 원", on: [3], org: 0, note: "창구에서 개인이 내는 몫입니다(사례 2만 원). 이 몫과 총지급 10만 원을 구별해야 제도 전체 비용을 셀 수 있습니다." },
  { label: "한 기관이 함께 맡는 경우", summary: "세 기능 · 기관 하나", on: [0, 1, 2], org: 1, note: "세 기능은 한 기관이 함께 맡을 수 있습니다." },
  { label: "여러 기관이 나누는 경우", summary: "세 기능 · 기관 여럿", on: [0, 1, 2], org: 3, note: "여러 기관이 나눌 수도 있습니다. 그림은 셋으로 나눈 경우이고(가정), 어느 쪽이든 하는 일은 같은 세 기능입니다." },
] as const;

const ITEMS = [
  { x: 8, title: "재원 조달" },
  { x: 106, title: "위험 풀" },
  { x: 204, title: "구매" },
] as const;

export default function ThreeFunctionsViz() {
  return (
    <SceneShell
      eyebrow="세 기능"
      title="돈이 병원까지 가는 길을 세 기능으로 자릅니다"
      description="앞의 돈 경로에 공식 이름을 붙인 그림입니다. 점선 틀은 그 일을 맡은 기관입니다."
      ariaLabel="재원 조달, 위험 풀, 구매 세 기능과 본인부담, 한 기관 또는 여러 기관이 맡는 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lit: readonly number[] = scene.on;
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.org === 1 && (
              <g>
                <rect x={2} y={14} width={292} height={64} rx={8} fill="none" stroke={ORG} strokeWidth={1} strokeDasharray="4 3" />
                <text x={8} y={10} fontSize={11} fontWeight={700} fill={ORG}>기관 하나</text>
              </g>
            )}
            {scene.org === 3 && ITEMS.map((item, index) => (
              <g key={item.x}>
                <rect x={item.x - 5} y={14} width={94} height={64} rx={8} fill="none" stroke={ORG} strokeWidth={1} strokeDasharray="4 3" />
                <text x={item.x - 1} y={10} fontSize={11} fontWeight={700} fill={ORG}>기관 {index + 1}</text>
              </g>
            ))}
            {ITEMS.map((item, index) => (
              <Box key={item.x} x={item.x} y={24} w={84} h={44} title={item.title} color={FN} on={lit.includes(index)} />
            ))}
            <Arrow x1={92} y1={46} x2={104} y2={46} color={FN} on={lit.includes(0) && lit.includes(1)} />
            <Arrow x1={190} y1={46} x2={202} y2={46} color={FN} on={lit.includes(1) && lit.includes(2)} />
            <Box x={306} y={24} w={50} h={124} title="병원" on={active === 2 || active === 3} />
            <Arrow x1={288} y1={46} x2={304} y2={46} color={FN} on={lit.includes(2)} />
            <Box x={8} y={112} w={84} h={36} title="환자" color={PATIENT} on={active === 3} />
            <Arrow x1={94} y1={130} x2={304} y2={130} color={PATIENT} on={active === 3} />
            <text x={198} y={123} textAnchor="middle" fontSize={11} fill="currentColor" opacity={active === 3 ? 1 : 0.5}>본인부담 (창구)</text>
          </svg>
        );
      }}
    />
  );
}
