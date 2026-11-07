import type { ReactNode } from "react";
import BitCells from "./BitCells";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 5번 자리에 1을 두면 2⁵=32=0x20이고, 같은 값을 어느 주소에 쓰는지가 동작을 정한다.
 * 0x01에서 시작하는 값은 다른 자리가 유지되는지 보이려는 가정이다: 0x01|0x20=0x21, 0x21에서 5번을 내리면 0x01.
 */
const FIVE = 0x20;
const POSITIONS = [7, 6, 5, 4, 3, 2, 1, 0];

interface Scene {
  label: string;
  summary: string;
  note: string;
  write?: { address: string; name: string; before: number; after: number };
}

const SCENES: readonly Scene[] = [
  {
    label: "오른쪽 끝이 0번",
    summary: "5번 자리에만 1",
    note: "칸 하나가 값의 한 자리(비트)입니다. 오른쪽 끝을 0번으로 세면 여섯 번째 칸이 5번입니다. 이 번호는 칩의 GPIO(범용 외부 연결점) 번호이며 보드 커넥터의 다섯 번째 핀을 뜻하지 않습니다.",
  },
  {
    label: "자리값으로 읽기",
    summary: "2⁵ = 32",
    note: "왼쪽으로 한 칸 갈 때마다 자리값이 두 배가 됩니다. 1이 있는 칸은 5번 하나뿐이므로 값 전체가 그 칸의 자리값 32입니다.",
  },
  {
    label: "16진수로 묶기",
    summary: "32 = 0x20",
    note: "16진수 한 글자는 네 칸을 나타냅니다. 왼쪽 네 칸 0010은 2, 오른쪽 네 칸 0000은 0이라 0x20이라고 적습니다.",
  },
  {
    label: "높이는 주소에 쓰기",
    summary: "0xD0000014 ← 0x20",
    note: "기능과 출력 허용을 준비한 뒤(가정) 이 주소에 0x20을 쓰면 5번에 저장한 출력 값이 1이 됩니다. 0으로 쓴 자리는 유지되므로 0번의 1은 그대로입니다. 0번의 1은 유지를 보이려는 가정입니다.",
    write: { address: "0xD0000014", name: "높이는 주소", before: 0x01, after: 0x21 },
  },
  {
    label: "낮추는 주소에 쓰기",
    summary: "0xD0000018 ← 0x20",
    note: "보낸 값은 똑같이 0x20인데 5번에 저장한 값은 0이 됩니다. 값 하나가 늘 같은 동작을 뜻하지 않고, 어느 주소에 보냈는지가 동작을 정합니다. 주소와 비트의 대응은 RP2040의 규칙입니다.",
    write: { address: "0xD0000018", name: "낮추는 주소", before: 0x21, after: 0x01 },
  },
];

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export default function BitValueViz() {
  return (
    <SceneShell
      eyebrow="값의 한 자리로 핀을 고르기"
      title="5번 자리에 1을 두면 값은 0x20입니다"
      description="32비트 값의 아래 여덟 칸입니다. 위쪽 24칸(31~8번)은 이 값에서 모두 0이라 생략했습니다."
      ariaLabel="5번 비트에서 0x20이 나오는 과정과 같은 값을 두 주소에 쓴 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="max-w-xl space-y-2">
            <Row label="자리 번호">
              <div className="grid grid-cols-8 gap-1 text-center font-mono text-xs text-muted-foreground">
                {POSITIONS.map((position) => (
                  <span key={position} className={position === 5 ? "font-bold text-amber-700 dark:text-amber-400" : ""}>{position}</span>
                ))}
              </div>
            </Row>
            <Row label="보내는 값">
              <BitCells value={FIVE} focus={FIVE} />
            </Row>
            {active === 1 && (
              <Row label="자리값">
                <div className="grid grid-cols-8 gap-1 text-center font-mono text-xs text-muted-foreground">
                  {POSITIONS.map((position) => (
                    <span key={position} className={position === 5 ? "font-bold text-amber-700 dark:text-amber-400" : ""}>{2 ** position}</span>
                  ))}
                </div>
              </Row>
            )}
            {active === 2 && (
              <Row label="16진수">
                <div className="grid grid-cols-2 gap-1 text-center font-mono text-sm font-bold">
                  <span className="rounded border border-border py-1">2</span>
                  <span className="rounded border border-border py-1">0</span>
                </div>
              </Row>
            )}
            {scene.write && (
              <>
                <p className="py-1 text-center font-mono text-xs font-bold text-primary sm:text-sm">↓ {scene.write.name} {scene.write.address}에 쓰기</p>
                <Row label="저장값 전">
                  <BitCells value={scene.write.before} focus={FIVE} />
                </Row>
                <Row label="저장값 뒤">
                  <BitCells value={scene.write.after} focus={FIVE} />
                </Row>
              </>
            )}
          </div>
        );
      }}
    />
  );
}
