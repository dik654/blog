import BankGrid from "./BankGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #padding — tile[32][33], word=33×행+열. tile[lane][3]의 bank는 (lane+3) mod 32.
 * tile[5][3]은 word 168, bank 8. 4096 → 4224 B, block당 128 B 증가.
 */
const PAD = Array.from({ length: 32 }, (_, row) => 33 * row + 32);
const COLUMN_3 = Array.from({ length: 32 }, (_, lane) => 33 * lane + 3);
const SCENES = [
  { label: "행마다 한 칸 더", summary: "tile[32][33] · 다음 행은 33칸 뒤", note: "회색 칸이 쓰지 않는 여분(padding)입니다. 각 행의 끝에 한 칸씩 끼워 다음 행의 시작을 33 word 뒤로 옮깁니다. 값의 논리적 좌표는 그대로입니다." },
  { label: "같은 열 읽기", summary: "(lane+3) mod 32 → 32개 bank", note: "같은 tile[lane][3]인데 word가 3, 36, 69…로 33칸씩 떨어집니다. 32개 lane이 서로 다른 bank를 읽어 요청이 한 줄에 몰리지 않습니다." },
  { label: "고른 값과 비용", summary: "word 168 · bank 8 · +128 B", note: "33×5+3=168, bank 8이고 출력 229번은 그대로입니다. 4096바이트가 4224바이트로 늘어 한 SM에 머무는 block 수가 줄 수 있으므로 전체 실행 시간도 함께 확인합니다." },
] as const;

export default function BankPaddingViz() {
  return (
    <SceneShell
      eyebrow="여분 한 칸"
      title="행마다 한 칸을 더하면 같은 열이 대각선으로 흩어집니다"
      description="앞 그림과 같은 격자입니다. 세로줄 하나가 bank 하나이고, 주황 칸이 한 warp가 읽는 word입니다."
      ariaLabel="padding을 넣은 tile의 word 배치와 bank 분산"
      scenes={SCENES}
      render={(active) => {
        const label = `${SCENES[active].label}: ${SCENES[active].summary}`;
        if (active === 0) return <BankGrid rows={33} reads={[]} padding={PAD} ariaLabel={label} />;
        if (active === 1) return <BankGrid rows={33} reads={COLUMN_3} padding={PAD} ariaLabel={label} />;
        return <BankGrid rows={33} reads={COLUMN_3} padding={PAD} mark={{ word: 168, text: "bank 8" }} ariaLabel={label} />;
      }}
    />
  );
}
