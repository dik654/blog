import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case·#picture·#why — 선 용량을 시작 쪽 50 fF와 끝 쪽 50 fF로 나눈 근사 회로.
 * 시작 쪽 용량은 출력 저항 500 Ω만 거쳐 충전되고(500×50=25 ps),
 * 끝 쪽 50 fF와 입력 20 fF는 500+200 Ω을 거칩니다((500+200)×70=49 ps). 합 74 ps.
 * 전부 끝에 몰면 (500+200)×120=84 ps, 추가 항 200×50=10 ps.
 */
const SCENES = [
  { label: "시작 쪽 용량으로 가는 길", summary: "500 Ω × 50 fF = 25 ps", note: "선 시작 쪽에 모은 50 fF로 가는 전하는 출력 저항 500 Ω만 지납니다. 선의 200 Ω은 이 용량보다 뒤에 있어 이 길에 들어가지 않습니다." },
  { label: "끝 쪽 용량으로 가는 길", summary: "(500+200) Ω × 70 fF = 49 ps", note: "끝 쪽 배선 50 fF와 받는 입력 20 fF, 합계 70 fF로 가는 전하는 출력 저항과 선 저항을 모두 지납니다." },
  { label: "두 길을 더합니다", summary: "25 + 49 = 74 ps", note: "용량마다 자기가 거치는 저항을 곱해 더하면 74 ps입니다. 배선이 없을 때의 500×20=10 ps와 같은 방식의 시간 척도입니다." },
  { label: "전부 끝에 몰면", summary: "(500+200) × 120 = 84 ps", note: "시작 쪽 50 fF까지 끝에 옮겨 그리면 이 용량도 선 저항 200 Ω을 거친다고 세게 됩니다. 200 Ω × 50 fF = 10 ps가 더 붙어 84 ps가 됩니다." },
] as const;

const WIRE_Y = 60;
const PLATE_Y = 108;
const GROUND_Y = 136;
const NEUTRAL = "#94a3b8";
const TEXT = "#64748b";
const PATH = "#2563eb";
const WRONG = "#dc2626";

const START_X = 190;
const END_X = 322;
const LOAD_X = 392;
/** 저항 상자 안으로는 선을 긋지 않습니다. */
const SEGMENTS: readonly (readonly [number, number])[] = [[54, 84], [148, 226], [286, LOAD_X]];

function Capacitor({ x, top, bottom, active, faded = false }: { x: number; top: string; bottom: string; active: boolean; faded?: boolean }) {
  const stroke = active ? PATH : NEUTRAL;
  return (
    <g opacity={faded ? 0.3 : 1}>
      <line x1={x} x2={x} y1={WIRE_Y} y2={PLATE_Y} stroke={stroke} strokeWidth={active ? 1.25 : 1} strokeDasharray={faded ? "3 3" : undefined} />
      <line x1={x - 14} x2={x + 14} y1={PLATE_Y} y2={PLATE_Y} stroke={stroke} strokeWidth={1.25} />
      <line x1={x - 14} x2={x + 14} y1={PLATE_Y + 7} y2={PLATE_Y + 7} stroke={stroke} strokeWidth={1.25} />
      <line x1={x} x2={x} y1={PLATE_Y + 7} y2={GROUND_Y} stroke={NEUTRAL} strokeWidth={1} />
      <line x1={x - 9} x2={x + 9} y1={GROUND_Y} y2={GROUND_Y} stroke={NEUTRAL} strokeWidth={1} />
      <text x={x} y={156} textAnchor="middle" fontSize={13} fill={TEXT}>{top}</text>
      <text x={x} y={171} textAnchor="middle" fontSize={13} fontWeight={700} fill={active ? PATH : TEXT}>{bottom}</text>
    </g>
  );
}

function Resistor({ x, width, value, name, active }: { x: number; width: number; value: string; name: string; active: boolean }) {
  const stroke = active ? PATH : NEUTRAL;
  return (
    <g>
      <rect x={x} y={WIRE_Y - 9} width={width} height={18} rx={3} fill="none" stroke={stroke} strokeWidth={active ? 1.25 : 1} />
      <text x={x + width / 2} y={WIRE_Y - 16} textAnchor="middle" fontSize={14} fontWeight={700} fill={active ? PATH : TEXT}>{value}</text>
      <text x={x + width / 2} y={WIRE_Y + 25} textAnchor="middle" fontSize={13} fill={TEXT}>{name}</text>
    </g>
  );
}

export default function RcPathsViz() {
  return (
    <SceneShell
      eyebrow="충전 경로 세기"
      title="어느 용량이 어느 저항을 거쳐 충전되는지 따라갑니다"
      description="3절의 가정 수치입니다. 연속된 선의 용량 100 fF를 시작 쪽 50 fF와 끝 쪽 50 fF 두 점으로 모은 근사 회로이며, 아래 접지 기호는 전하가 저장되는 상대편입니다."
      note="Ω과 fF를 곱하면 시간이 됩니다(1 Ω·1 fF = 1 fs). 값은 시간 척도의 비교이며 실제 50% 도달 시각이 아닙니다."
      ariaLabel="출력 저항, 시작 쪽 용량, 선 저항, 끝 쪽 용량과 입력 용량의 충전 경로"
      scenes={SCENES}
      render={(active) => {
        const startOn = active === 0 || active === 2;
        const endOn = active >= 1;
        const lumped = active === 3;
        const pathEnd = endOn ? LOAD_X : START_X;
        return (
          <div className="w-full min-w-0 overflow-x-auto">
            <svg viewBox="0 0 430 200" className="mx-auto h-auto w-full min-w-[20rem] max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={6} y={WIRE_Y - 16} width={48} height={32} rx={4} fill="none" stroke={NEUTRAL} strokeWidth={1} />
              <text x={30} y={WIRE_Y + 4} textAnchor="middle" fontSize={13} fill={TEXT}>출력</text>
              {SEGMENTS.map(([from, to]) => (
                <g key={from}>
                  <line x1={from} x2={to} y1={WIRE_Y} y2={WIRE_Y} stroke={NEUTRAL} strokeWidth={1} />
                  {pathEnd > from && <line x1={from} x2={Math.min(to, pathEnd)} y1={WIRE_Y} y2={WIRE_Y} stroke={lumped ? WRONG : PATH} strokeWidth={1.25} />}
                </g>
              ))}
              <Resistor x={84} width={64} value="500 Ω" name="출력 저항" active />
              <Resistor x={226} width={60} value="200 Ω" name="선 저항" active={endOn} />
              <circle cx={START_X} cy={WIRE_Y} r={2.5} fill={TEXT} />
              <circle cx={END_X} cy={WIRE_Y} r={2.5} fill={TEXT} />
              <Capacitor x={START_X} top="시작 쪽" bottom="50 fF" active={startOn} faded={lumped} />
              <Capacitor x={END_X} top="끝 쪽" bottom={lumped ? "50+50 fF" : "50 fF"} active={endOn} />
              <Capacitor x={LOAD_X} top="입력" bottom="20 fF" active={endOn} />
              {lumped && (
                <g>
                  <line x1={START_X + 18} x2={END_X - 22} y1={124} y2={124} stroke={WRONG} strokeWidth={1} strokeDasharray="4 3" />
                  <path d={`M ${END_X - 22} 124 l -6 -4 v 8 z`} fill={WRONG} />
                  <text x={(START_X + END_X) / 2} y={118} textAnchor="middle" fontSize={13} fill={WRONG}>끝으로 옮김</text>
                  <text x={215} y={192} textAnchor="middle" fontSize={13} fontWeight={700} fill={WRONG}>200 Ω × 50 fF = 10 ps가 더 붙음</text>
                </g>
              )}
              {!lumped && (
                <text x={215} y={192} textAnchor="middle" fontSize={13} fill={TEXT}>
                  {active === 0 ? "선 저항 200 Ω은 이 길 밖" : active === 1 ? "끝 쪽 50 + 입력 20 = 70 fF" : "시작 25 ps + 끝 49 ps"}
                </text>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
