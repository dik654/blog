import ResidueRing from "./ResidueRing";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 5를 반복해 곱하고 23으로 나눈 나머지.
 * 5² → 2, 5⁴ → 4, 5⁶ → 8, 5¹⁵ → 19. 0을 뺀 22개 값 위를 돕니다.
 */
const ALICE = "#2563eb";
const BOB = "#b45309";
const START = "#475569";

const SCENES = [
  { label: "곱하고 나머지만 남깁니다", summary: "5×5=25 → 나머지 2", note: "칸 하나를 나아갈 때마다 5를 한 번 곱하고 23으로 나눈 나머지만 남깁니다. 맨 위 1이 곱하기 전 출발점이고, 칸 밖의 번호가 곱한 횟수입니다." },
  { label: "Alice는 6번 곱합니다", summary: "숨긴 6 → 공개값 8", note: "2번째 칸의 2와 4번째 칸의 4를 곱하면 6번째 칸의 8입니다. Alice가 밖으로 보내는 값은 도착한 칸의 8이고, 곱한 횟수 6은 숨깁니다." },
  { label: "Bob은 15번 곱합니다", summary: "숨긴 15 → 공개값 19", note: "같은 고리를 15칸 나아가면 19입니다. Bob도 19만 보내고 15는 보내지 않습니다." },
  { label: "칸이 22개뿐입니다", summary: "0을 뺀 값 22개", note: "22번 곱하면 다시 1로 돌아옵니다. 관찰자가 1부터 칸을 세어 8이나 19를 만나면 곱한 횟수가 나오므로 비밀을 금방 찾습니다. 23은 손으로 계산하기 위한 작은 수이며 실제 보안 설정이 아닙니다." },
] as const;

const range = (end: number) => Array.from({ length: end + 1 }, (_, index) => index);
const numbered = (positions: readonly number[]) => Object.fromEntries(positions.slice(1).map((position) => [position, String(position)]));

export default function RepeatMultiplyViz() {
  return (
    <SceneShell
      eyebrow="반복 곱셈"
      title="5를 거듭 곱하면 나머지가 22칸 고리를 돕니다"
      description="동그라미 하나가 지금까지의 나머지입니다. 5와 23은 설명용 설정입니다(가정)."
      ariaLabel="5를 반복해 곱한 나머지가 22개 값을 차례로 도는 고리와 Alice 6번, Bob 15번의 도착 칸"
      scenes={SCENES}
      render={(active) => {
        const shared = { ariaLabel: `${SCENES[active].label}: ${SCENES[active].summary}` };
        if (active === 0) return <ResidueRing {...shared} chain={range(2)} chainColor={START} marks={{ 0: START, 1: START, 2: START }} outer={numbered(range(2))} center={["5 × 5 = 25", "25 ÷ 23 = 1 … 나머지 2"]} />;
        if (active === 1) return <ResidueRing {...shared} chain={range(6)} chainColor={ALICE} marks={{ 0: START, 2: ALICE, 4: ALICE, 6: ALICE }} outer={numbered(range(6))} center={["6번 곱함", "4 × 2 = 8"]} />;
        if (active === 2) return <ResidueRing {...shared} chain={range(15)} chainColor={BOB} marks={{ 0: START, 15: BOB }} outer={numbered(range(15))} center={["15번 곱함", "도착 칸 19"]} />;
        return <ResidueRing {...shared} chain={[...range(21), 0]} chainColor="#94a3b8" marks={{ 0: START, 6: ALICE, 15: BOB }} outer={{ 6: "6", 15: "15", 0: "0·22" }} center={["칸 22개", "22번 곱하면 다시 1"]} />;
      }}
    />
  );
}
