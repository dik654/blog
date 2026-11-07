import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #acceptance-length — 버퍼, 검증 출력, 실제로 보낸 출력은 다른 길이다.
 * 첫 거부 [A,B,A,−1,−1] → 수락 2, 검증 출력 3. 전부 수락 [A,B,B,A,B] → 수락 4, 검증 출력 5.
 */
interface Scene extends ShellScene {
  buffer: readonly string[];
  verified: readonly string[];
  sent: readonly string[];
  accepted: number;
}

const SCENES: readonly Scene[] = [
  { label: "첫 거부 경로", summary: "수락 2 + 교체 1 = 3", buffer: ["A", "B", "A", "−1", "−1"], verified: ["A", "B", "A"], sent: ["A", "B", "A"], accepted: 2, note: "앞의 실제 값 [0,1,0,−1,−1]입니다. −1은 빈 자리 표시이고 parse_output이 걸러 세 개를 돌려줍니다. 버퍼 다섯 칸을 확정 토큰 다섯 개로 세면 안 됩니다. 여기서는 종료 토큰과 최대 길이에 닿지 않았다고 둡니다." },
  { label: "전부 수락 경로", summary: "수락 4 + 보너스 1 = 5", buffer: ["A", "B", "B", "A", "B"], verified: ["A", "B", "B", "A", "B"], sent: ["A", "B", "B", "A", "B"], accepted: 4, note: "후보 네 개가 전부 수락되고 보너스가 B인 경우입니다(가정). 두 경로 모두 종료 처리 전에는 검증 출력 수가 수락 수보다 하나 많습니다." },
  { label: "종료 뒤 절단", summary: "검증 5 · 보낸 2", buffer: ["A", "B", "B", "A", "B"], verified: ["A", "B", "B", "A", "B"], sent: ["A", "B"], accepted: 4, note: "B가 종료 토큰이고 둘째 위치에서 멈춘다고 합시다(가정). 다섯 개짜리 검증 결과를 모두 내보내지 않습니다. 지표가 어느 처리 뒤의 길이를 세는지 확인해야 합니다." },
];

const SLOTS = [0, 1, 2, 3, 4];

function Row({ title, values, count, tone }: { title: string; values: readonly string[]; count: string; tone: string }) {
  return (
    <div className="grid min-w-0 grid-cols-[4.2rem_minmax(0,1fr)_2.2rem] items-center gap-2 sm:grid-cols-[6rem_minmax(0,1fr)_3rem]">
      <span className="text-xs font-bold leading-4">{title}</span>
      <div className="grid min-w-0 grid-cols-5 gap-1">
        {SLOTS.map((slot) => {
          const value = values[slot];
          const blank = value === undefined || value === "−1";
          return (
            <span
              key={slot}
              className={`flex h-9 items-center justify-center rounded-md border font-mono text-xs font-bold ${blank ? "border-dashed border-border text-muted-foreground" : tone}`}
            >
              {value ?? ""}
            </span>
          );
        })}
      </div>
      <span className="text-right font-mono text-sm font-bold">{count}</span>
    </div>
  );
}

export default function BufferLengthViz() {
  return (
    <SceneShell
      eyebrow="K=4 · 세 가지 길이"
      title="버퍼는 다섯 칸이어도 세는 길이는 셋으로 갈립니다"
      description="글자는 토큰(A는 ID 0, B는 ID 1)이고, 오른쪽 숫자는 그 줄에서 세는 개수입니다."
      ariaLabel="출력 버퍼, 검증 출력, 실제로 보낸 출력의 길이 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <Row title="버퍼" values={scene.buffer} count="5칸" tone="border-[#64748b] bg-[#64748b]/15" />
            <Row title="검증 출력" values={scene.verified} count={`${scene.verified.length}`} tone="border-[#2563eb] bg-[#2563eb]/15" />
            <Row title="보낸 출력" values={scene.sent} count={`${scene.sent.length}`} tone="border-[#16a34a] bg-[#16a34a]/15" />
            <p className="border-t border-border pt-2 text-xs tabular-nums text-muted-foreground">
              수락 수 {scene.accepted} → 검증 출력 수 = {scene.accepted} + 1 = {scene.verified.length}
            </p>
          </div>
        );
      }}
    />
  );
}
