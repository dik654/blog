import SceneShell from "./SceneShell";

/**
 * 본문 대응: #attention-metadata — B=4의 R2. block table [5,9], 새 위치 4~7의 slot mapping [36,37,38,39], 위치 6 = 9×4+2 = 38.
 * query 시작 경계 [0,4], 길이 [8]. 큰 사례: 위치 2500 = 논리 block 156의 4번째 → 913×16+4 = 14612.
 */
const SCENES = [
  { label: "논리 위치와 block table", summary: "[5, 9]", note: "위치 0~7을 네 칸씩 묶습니다. block table은 각 묶음의 물리 block을 적은 목록입니다. 앞 묶음은 재사용한 block 5, 뒤 묶음은 새로 배정한 block 9입니다(가정)." },
  { label: "새로 쓸 주소", summary: "slot mapping [36, 37, 38, 39]", note: "slot mapping은 이번에 새로 쓸 위치의 실제 주소입니다. 위치 6은 9×4+2=38입니다. 저장된 0~3은 이번 새 쓰기 목록에 없습니다." },
  { label: "읽는 범위", summary: "query 시작 [0, 4] · 길이 [8]", note: "새로 계산하는 위치 하나가 query 하나이고, 시작 경계 [0, 4]는 그 수가 4개라는 뜻입니다. 파란 칸이 위치 6의 query가 보는 범위이며, block 9를 가리켜도 미래의 7은 계산에 쓰지 않습니다." },
  { label: "큰 사례의 위치 2500", summary: "913 × 16 + 4 = 14612", note: "B=16에서 2500은 논리 block 156의 네 칸 뒤입니다. 물리 913을 배정했다면(가정) 주소는 14612입니다. 이 query의 과거 0~2500은 157개 block에 걸치지만 157회 메모리 거래라는 뜻은 아닙니다." },
];

const AMBER = "#b45309";
const GREEN = "#15803d";
const SLATE = "#64748b";
const X = (position: number) => 16 + position * 37 + (position >= 4 ? 8 : 0);

function Cell({ x, y, text, stroke, strong = false, muted = false }: { x: number; y: number; text: string | number; stroke: string; strong?: boolean; muted?: boolean }) {
  return (
    <g opacity={muted ? 0.4 : 1}>
      <rect x={x} y={y} width={34} height={26} rx={3} fill="none" stroke={stroke} strokeWidth={strong ? 1.25 : 1} />
      <text x={x + 17} y={y + 17} textAnchor="middle" fontSize={11} fontWeight={strong ? 700 : 400} fill="currentColor">{text}</text>
    </g>
  );
}

function SmallCase({ index }: { index: number }) {
  const positions = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg viewBox="0 0 330 186" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
      <text x={16} y={13} fontSize={11} fontWeight={700} fill="currentColor">요청 안의 위치</text>
      {positions.map((p) => {
        const future = index === 2 && p === 7;
        const reading = index === 2 && p <= 6;
        return <Cell key={p} x={X(p)} y={20} text={p} stroke={p === 6 && index >= 2 ? "#dc2626" : reading ? "#2563eb" : p < 4 ? GREEN : AMBER} strong={p === 6 && index >= 2} muted={future} />;
      })}
      {index === 2 && <text x={X(7) + 17} y={60} textAnchor="middle" fontSize={11} fill="#dc2626">미래</text>}
      {index === 2 && <text x={X(6) + 17} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">query</text>}
      <path d="M85 46V76M238 46V76" fill="none" stroke="#94a3b8" strokeWidth={1} />
      <text x={16} y={72} fontSize={11} fontWeight={700} fill="currentColor">table</text>
      <rect x={60} y={76} width={50} height={24} rx={3} fill="none" stroke={GREEN} strokeWidth={1.25} />
      <text x={85} y={92} textAnchor="middle" fontSize={12} fontWeight={700} fill={GREEN}>5</text>
      <rect x={213} y={76} width={50} height={24} rx={3} fill="none" stroke={AMBER} strokeWidth={1.25} />
      <text x={238} y={92} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>9</text>
      <path d="M85 100V124M238 100V124" fill="none" stroke="#94a3b8" strokeWidth={1} />
      <text x={16} y={120} fontSize={11} fontWeight={700} fill="currentColor">실제 주소</text>
      {positions.map((p) => {
        const address = p < 4 ? 20 + p : 36 + (p - 4);
        return <Cell key={p} x={X(p)} y={126} text={address} stroke={p === 6 && index === 1 ? "#dc2626" : p < 4 ? GREEN : AMBER} strong={p >= 4 && index === 1} muted={index === 1 && p < 4} />;
      })}
      <text x={X(0)} y={170} fontSize={11} fill={SLATE}>{index === 1 ? "새 쓰기 목록에 없음" : "5×4 + 0~3"}</text>
      <text x={X(4)} y={170} fontSize={11} fontWeight={index === 1 ? 700 : 400} fill={index === 1 ? AMBER : SLATE}>{index === 1 ? "새로 쓰는 4칸 · 9×4 + 0~3" : "9×4 + 0~3"}</text>
    </svg>
  );
}

function BigCase() {
  const cells = Array.from({ length: 16 }, (_, i) => i);
  const x = (i: number) => 8 + i * 19.5;
  return (
    <svg viewBox="0 0 330 186" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="위치 2500을 물리 주소 14612로 옮기는 계산">
      <text x={8} y={13} fontSize={11} fontWeight={700} fill="currentColor">논리 block 156 · 위치 2496~2511</text>
      {cells.map((i) => (
        <g key={i}>
          <rect x={x(i)} y={20} width={17} height={26} rx={2} fill={i === 4 ? "#2563eb" : "none"} stroke={i === 4 ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
          <text x={x(i) + 8.5} y={37} textAnchor="middle" fontSize={9} fontWeight={i === 4 ? 700 : 400} fill={i === 4 ? "#ffffff" : "#64748b"}>{i}</text>
        </g>
      ))}
      <text x={x(4) + 8.5} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">위치 2500</text>
      <text x={210} y={62} fontSize={11} fill={SLATE}>2500 = 156×16 + 4</text>
      <path d={`M${x(4) + 8.5} 68V92`} stroke="#94a3b8" strokeWidth={1} fill="none" />
      <text x={x(4) + 18} y={85} fontSize={11} fill={SLATE}>table[156] = 913 (가정), 같은 칸 번호 4</text>
      <text x={8} y={108} fontSize={11} fontWeight={700} fill="currentColor">물리 block 913 · 주소 14608부터</text>
      {cells.map((i) => (
        <g key={i}>
          <rect x={x(i)} y={115} width={17} height={26} rx={2} fill={i === 4 ? AMBER : "none"} stroke={i === 4 ? AMBER : "#94a3b8"} strokeWidth={1} />
          <text x={x(i) + 8.5} y={132} textAnchor="middle" fontSize={9} fontWeight={i === 4 ? 700 : 400} fill={i === 4 ? "#ffffff" : "#64748b"}>{i}</text>
        </g>
      ))}
      <text x={165} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>913 × 16 + 4 = 14612</text>
    </svg>
  );
}

export default function SlotMappingViz() {
  return (
    <SceneShell
      eyebrow="(가정) 위치에서 주소로"
      title="요청 안의 위치는 block table을 거쳐 실제 주소가 됩니다"
      description="앞 세 장면은 B=4의 R2, 마지막 장면은 B=16의 큰 사례입니다. 윗줄이 요청 안의 위치, 가운데가 block table, 아랫줄이 실제 저장 주소입니다. 초록은 재사용, 주황은 이번에 새로 계산하는 자리입니다."
      ariaLabel="block table과 slot mapping으로 논리 위치를 실제 주소로 옮기는 과정"
      scenes={SCENES}
      render={(index) => (index === 3 ? <BigCase /> : <SmallCase index={index} />)}
    />
  );
}
