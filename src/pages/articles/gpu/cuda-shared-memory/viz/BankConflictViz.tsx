import BankGrid from "./BankGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bank-conflict — tile[32][32], word=32×행+열, bank=word mod 32.
 * tile[lane][3]은 32×lane+3이라 모두 bank 3. tile[5][3]은 word 163, 모든 lane이 같은 주소면 broadcast입니다.
 */
const FIRST_ROW = Array.from({ length: 33 }, (_, word) => word);
const COLUMN_3 = Array.from({ length: 32 }, (_, lane) => 32 * lane + 3);
const SCENES = [
  { label: "word를 차례로", summary: "word mod 32 = bank", note: "32비트 word를 32 banks에 차례로 놓는 모형입니다(시작 bank 0). word 31 다음 word 32는 다시 bank 0이라 32칸 떨어진 word는 같은 세로줄입니다." },
  { label: "같은 열 읽기", summary: "tile[lane][3] → 모두 bank 3", note: "tile의 한 행이 정확히 32 word이므로 같은 열은 3, 35, 67…로 32칸씩 떨어집니다. 서로 다른 32개 주소가 bank 3 하나에 몰려 요청을 나눠 처리해야 합니다." },
  { label: "같은 칸 읽기", summary: "tile[5][3] 하나 → broadcast", note: "모든 lane이 같은 word만 읽으면 값을 나눠 받을 수 있고 이를 broadcast라 합니다. 다른 주소가 몰린 경우와 구분하며, 같은 주소 동시 쓰기의 정답까지 보장한다는 뜻은 아닙니다." },
] as const;

export default function BankConflictViz() {
  return (
    <SceneShell
      eyebrow="shared memory의 bank"
      title="32칸씩 떨어진 word는 같은 bank에 몰립니다"
      description="세로줄 하나가 bank 하나입니다. 파란 칸은 word가 놓이는 순서, 주황 칸은 한 warp가 읽는 word이고, 위 막대는 읽기 요청이 있는 bank별 서로 다른 주소 수입니다."
      ariaLabel="word 번호와 bank의 대응, 같은 열 읽기와 broadcast"
      scenes={SCENES}
      render={(active) => {
        const label = `${SCENES[active].label}: ${SCENES[active].summary}`;
        if (active === 0) return <BankGrid rows={32} reads={FIRST_ROW} sequential ariaLabel={label} />;
        if (active === 1) return <BankGrid rows={32} reads={COLUMN_3} ariaLabel={label} />;
        return <BankGrid rows={32} reads={[163]} ariaLabel={label} />;
      }}
    />
  );
}
