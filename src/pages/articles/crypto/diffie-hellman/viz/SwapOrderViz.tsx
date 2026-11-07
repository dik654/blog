import ResidueRing from "./ResidueRing";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #protocol — 19를 6번 적용하는 일과 8을 15번 적용하는 일은 모두 5를 90번 곱한 칸에 닿습니다.
 * 19 = 15칸 → 15·8·1·16·9·2번 칸 / 8 = 6칸 → 6·12·18·2·…·2번 칸. 90 = 22×4 + 2.
 */
const ALICE = "#2563eb";
const BOB = "#b45309";
const DONE = "#047857";
const LAPS = 22;
const hops = (step: number, count: number) =>
  Array.from({ length: count + 1 }, (_, index) => (index * step) % LAPS);

const ALICE_HOPS = hops(15, 6);
const BOB_HOPS = hops(6, 15);
const hopLabels = (positions: readonly number[]) =>
  positions.slice(1).reduce<Record<number, string>>((labels, position, index) => {
    labels[position] = labels[position] ? `${labels[position]}·${index + 1}` : String(index + 1);
    return labels;
  }, {});

const SCENES = [
  { label: "Alice: 19를 6번", summary: "15칸 × 6번 = 90칸", note: "19는 5를 15번 곱해 나온 칸이므로 19를 곱하면 15칸을 건너뜁니다. 칸 밖 번호가 건너뛴 차례입니다. 2번째 칸 16과 4번째 칸 3을 곱한 48의 나머지가 6번째 칸의 2입니다." },
  { label: "Bob: 8을 15번", summary: "6칸 × 15번 = 90칸", note: "8은 6칸 건너뛰기입니다. 11번째에 출발점으로 돌아와 12번째부터 같은 칸을 다시 지납니다. 1·2·4·8번째 칸의 8·18·2·4를 곱해도 나머지는 2입니다." },
  { label: "같은 90칸, 같은 칸", summary: "90 = 22×4 + 2 → 2", note: "건너뛰는 폭과 횟수가 뒤바뀌어도 총 90칸입니다. 22칸마다 제자리이므로 네 바퀴를 돌고 2칸 더 간 자리, 5⁹⁰의 나머지 2에 양쪽이 닿습니다." },
] as const;

const X0 = 10;
const UNIT = 320 / 90;

function Strip({ y, label, size, count, color, tail = 0, on }: { y: number; label: string; size: number; count: number; color: string; tail?: number; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.22}>
      <text x={X0} y={y - 3} fontSize={10.5} fontWeight={600} fill="#64748b">{label}</text>
      {Array.from({ length: count }, (_, index) => (
        <rect key={index} x={X0 + index * size * UNIT} y={y} width={size * UNIT - 1} height={9} rx={1.5} fill={color} fillOpacity={index % 2 === 0 ? 0.85 : 0.5} />
      ))}
      {tail > 0 && <rect x={X0 + count * size * UNIT} y={y} width={tail * UNIT - 1} height={9} rx={1.5} fill={DONE} />}
    </g>
  );
}

export default function SwapOrderViz() {
  return (
    <SceneShell
      eyebrow="곱하는 순서"
      title="15칸씩 6번과 6칸씩 15번은 같은 칸에 닿습니다"
      description="3절의 22칸 고리를 그대로 씁니다. 칸 하나가 5를 한 번 곱한 것이고, 아래 띠의 전체 길이가 곱한 횟수 90번입니다."
      ariaLabel="19를 6번 곱하는 경로와 8을 15번 곱하는 경로가 모두 90칸을 지나 값 2에 도착하는 고리"
      scenes={SCENES}
      render={(active) => (
        <div>
          {active === 0 && <ResidueRing sizeClass="max-w-[300px]" ariaLabel="19를 6번 곱하는 경로" chain={ALICE_HOPS} chainColor={ALICE} marks={{ 15: ALICE, 8: ALICE, 16: ALICE, 2: DONE }} outer={hopLabels(ALICE_HOPS)} center={["19 = 15칸", "6번 → 2"]} />}
          {active === 1 && <ResidueRing sizeClass="max-w-[300px]" ariaLabel="8을 15번 곱하는 경로" chain={BOB_HOPS} chainColor={BOB} marks={{ 6: BOB, 12: BOB, 4: BOB, 2: DONE }} outer={hopLabels(BOB_HOPS)} center={["8 = 6칸", "15번 → 2"]} />}
          {active === 2 && <ResidueRing sizeClass="max-w-[300px]" ariaLabel="네 바퀴를 돈 뒤 2칸 더 간 자리" chain={[0, 1, 2]} chainColor={DONE} marks={{ 2: DONE }} outer={{ 0: "4바퀴 뒤", 2: "+2칸" }} center={["90칸", "도착 칸 2"]} />}
          <svg viewBox="0 0 340 86" className="mx-auto mt-1 h-auto w-full max-w-[420px]" role="img" aria-label="90칸을 15칸씩, 6칸씩, 22칸씩 나눈 세 개의 띠">
            <Strip y={14} label="Alice: 15칸 × 6" size={15} count={6} color={ALICE} on={active !== 1} />
            <Strip y={44} label="Bob: 6칸 × 15" size={6} count={15} color={BOB} on={active !== 0} />
            <Strip y={74} label="고리: 22칸 × 4바퀴 + 2칸" size={22} count={4} color="#64748b" tail={2} on={active === 2} />
          </svg>
        </div>
      )}
    />
  );
}
