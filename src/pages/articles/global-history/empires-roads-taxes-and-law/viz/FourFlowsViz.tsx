import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 명령·세금·병력·정보 네 흐름과, 도로가 끊기거나 숫자가 바뀔 때 달라지는 것.
 * 화살표 길이는 거리나 속도가 아니다. 본문은 속도가 다르다고만 하고 일수를 주지 않는다.
 */
const CMD = "#2563eb";
const TAX = "#16a34a";
const TROOP = "#7c3aed";
const INFO = "#d97706";
const CUT = "#dc2626";

const SCENES = [
  { label: "명령이 내려갑니다", summary: "수도 → 지방", note: "수도에서 법과 임명장이 내려갑니다. 나머지 세 흐름은 흐리게 두었습니다." },
  { label: "세금이 올라갑니다", summary: "지방 → 수도", note: "지방에서는 곡물·동전·노동이 올라갑니다. 명령과 방향이 반대이고, 옮기는 것도 문서가 아니라 물자와 사람입니다." },
  { label: "병력은 길을 따라 움직입니다", summary: "변경·도로를 지킴", note: "병력은 변경(제국의 바깥 경계)과 도로를 지키며 이동합니다. 그래서 길을 따라 그렸습니다." },
  { label: "정보는 늦게 돌아옵니다", summary: "지방 → 수도, 늦게", note: "수확량·반란·재판 정보는 보고서와 사절을 통해 늦게 돌아옵니다. 그래서 점선으로 그렸습니다. 며칠이 걸렸는지는 글에 없습니다." },
  { label: "도로가 끊기면", summary: "명령은 남고 실제가 달라짐", note: "수도의 명령은 그대로 남아 있어도 실제 세입과 통제는 달라집니다. X는 글이 짚은 세입과 통제에 닿는 세금·명령에만 표시했고, 병력과 정보가 멀쩡하다는 뜻은 아닙니다. 얼마나 줄어드는지는 글에 수치가 없어 크기로 그리지 않았습니다." },
  { label: "현지 관리가 숫자를 바꾸면", summary: "길은 멀쩡해도 달라짐", note: "도로가 온전해도 실제 세입과 통제는 달라집니다. 제국 행정이 명령문보다 전달과 번역의 사슬에 달려 있다는 뜻입니다." },
] as const;

const ROAD_Y = 104;

function Lane({ x, name, detail, color, up, on, dashed, cut }: { x: number; name: string; detail: string; color: string; up: boolean; on: boolean; dashed?: boolean; cut?: boolean }) {
  const top = 42;
  const bottom = 166;
  return (
    <g>
      {up ? (
        <>
          <Arrow x1={x} y1={bottom} x2={x} y2={ROAD_Y + 10} color={color} on={on} dashed={dashed} head={false} />
          <Arrow x1={x} y1={ROAD_Y - 10} x2={x} y2={top} color={cut ? "#94a3b8" : color} on={on} dashed={dashed || cut} />
        </>
      ) : (
        <>
          <Arrow x1={x} y1={top} x2={x} y2={ROAD_Y - 10} color={color} on={on} dashed={dashed} head={false} />
          <Arrow x1={x} y1={ROAD_Y + 10} x2={x} y2={bottom} color={cut ? "#94a3b8" : color} on={on} dashed={dashed || cut} />
        </>
      )}
      <g opacity={on ? 1 : 0.5}>
        <text x={x + 7} y={66} fontSize={13} fontWeight={on ? 700 : 500} fill={color}>{name}</text>
        <text x={x + 7} y={80} fontSize={11.5} fill="currentColor">{detail}</text>
      </g>
    </g>
  );
}

export default function FourFlowsViz() {
  return (
    <SceneShell
      eyebrow="수도와 지방 사이"
      title="수도와 지방 사이에는 네 가지가 따로 움직입니다"
      description="제국 하나를 단순하게 그린 약도입니다(가정). 칸 크기와 화살표 길이는 실제 거리나 속도를 뜻하지 않습니다."
      ariaLabel="명령, 세금, 병력, 정보 네 흐름과 도로 단절, 숫자 변경의 영향"
      scenes={SCENES}
      render={(active) => {
        const cut = active === 4;
        const altered = active === 5;
        const all = cut || altered;
        return (
          <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={8} y={8} w={344} h={32} title={all ? "수도 — 명령문은 그대로 남아 있음" : "수도"} on={active === 0 || all} />
            <Box x={8} y={168} w={226} h={36} title={altered ? "지방 — 현지 관리가 숫자를 바꿈" : "지방·촌락"} color={altered ? CUT : "#64748b"} on={active === 1 || active === 3 || altered} />
            <Box x={250} y={168} w={102} h={36} title="변경" on={active === 2} />

            <rect x={8} y={ROAD_Y - 7} width={344} height={14} rx={3} fill="#94a3b8" fillOpacity={0.18} stroke="#94a3b8" strokeWidth={1} />
            <text x={346} y={ROAD_Y + 4} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.75}>도로</text>

            <Lane x={24} name="명령" detail="법·임명장" color={CMD} up={false} on={active === 0 || all} cut={cut} />
            <Lane x={108} name="세금" detail="곡물·동전·노동" color={TAX} up on={active === 1 || all} cut={cut} />
            <Lane x={214} name="정보" detail="수확량·반란·재판" color={INFO} up on={active === 3 || altered} dashed />

            <Arrow x1={190} y1={ROAD_Y} x2={318} y2={ROAD_Y} color={TROOP} on={active === 2} head={false} />
            <Arrow x1={318} y1={ROAD_Y} x2={318} y2={166} color={TROOP} on={active === 2} />
            <g opacity={active === 2 ? 1 : 0.5}>
              <text x={311} y={130} textAnchor="end" fontSize={12} fontWeight={active === 2 ? 700 : 500} fill={TROOP}>병력</text>
              <text x={311} y={144} textAnchor="end" fontSize={11.5} fill="currentColor">변경·도로 경비</text>
            </g>

            {cut && (
              <g stroke={CUT} strokeWidth={1.25}>
                {[24, 108].map((x) => (
                  <g key={x}>
                    <line x1={x - 7} y1={ROAD_Y - 7} x2={x + 7} y2={ROAD_Y + 7} />
                    <line x1={x - 7} y1={ROAD_Y + 7} x2={x + 7} y2={ROAD_Y - 7} />
                  </g>
                ))}
              </g>
            )}
            {cut && <text x={148} y={ROAD_Y + 4} fontSize={11} fontWeight={700} fill={CUT}>끊김</text>}
          </svg>
        );
      }}
    />
  );
}
