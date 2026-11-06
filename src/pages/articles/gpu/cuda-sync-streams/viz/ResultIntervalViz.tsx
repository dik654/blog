import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #streams — 첫 결과 지연 9ms, 두 결과 전체 14ms, 결과 간격 5ms를 한 시계에서 구별한다.
 * 2+5+2 = 9. 9·14·19·24ms. 순서대로면 묶음마다 9ms라 네 묶음은 4 × 9 = 36ms(본문 숫자에서 계산).
 */
const SCENES = [
  { label: "첫 결과", summary: "2 + 5 + 2 = 9ms", note: "첫 결과는 보내기·계산·가져오기를 모두 지나야 합니다. 이 9ms가 첫 결과 지연입니다." },
  { label: "가장 긴 단계", summary: "max(2, 5, 2) = 5ms", note: "그다음 결과의 간격은 세 단계의 합이 아니라 가장 오래 걸리는 단계가 정합니다. 계산 자리 하나가 5ms씩 쓰이기 때문입니다." },
  { label: "두 결과", summary: "9 + 5 = 14ms", note: "두 결과가 모두 필요한 요청은 14ms에 끝납니다. 9ms·14ms·5ms는 서로 다른 질문의 답이라 섞어 읽지 않습니다." },
  { label: "네 결과", summary: "9 · 14 · 19 · 24ms", note: "결과가 5ms 간격으로 나와 네 묶음은 24ms입니다. 5ms는 전체 지연이 아니라 결과 사이의 간격입니다." },
  { label: "순서대로와 비교", summary: "36ms → 24ms", note: "하나씩 끝내면 묶음마다 9ms라 4 × 9 = 36ms입니다. 겹치는 시간표는 같은 조건에서 24ms지만, 장치가 허용하는 겹침을 확인하기 전에는 실제 GPU의 보장이 아닙니다." },
] as const;

const FIRST = { from: 0, to: 9, label: "9", tone: "send" } as const;

function lanes(index: number): LaneRow[] {
  if (index === 0) return [{ name: "첫 결과", segs: [FIRST] }];
  if (index === 1) {
    return [
      { name: "보내기", segs: [{ from: 0, to: 2, label: "2", tone: "send" }] },
      { name: "계산", segs: [{ from: 0, to: 5, label: "5 ← 최대", tone: "run" }] },
      { name: "가져오기", segs: [{ from: 0, to: 2, label: "2", tone: "fetch" }] },
    ];
  }
  const gaps = [
    { from: 9, to: 14, label: "5", tone: "fetch" },
    { from: 14, to: 19, label: "5", tone: "fetch" },
    { from: 19, to: 24, label: "5", tone: "fetch" },
  ] as const;
  if (index === 2) return [{ name: "첫 결과", segs: [FIRST] }, { name: "결과 간격", segs: gaps.slice(0, 1) }, { name: "두 결과", segs: [{ from: 0, to: 14, label: "14", tone: "run" }] }];
  if (index === 3) return [{ name: "첫 결과", segs: [FIRST] }, { name: "결과 간격", segs: gaps }, { name: "네 결과", segs: [{ from: 0, to: 24, label: "24", tone: "run" }] }];
  return [{ name: "겹쳐서", segs: [{ from: 0, to: 24, label: "24", tone: "run" }] }, { name: "순서대로", segs: [0, 1, 2, 3].map((n) => ({ from: n * 9, to: (n + 1) * 9, label: "9", tone: "idle" as const })) }];
}

const TICKS = [[0, 9], [0, 2, 5], [0, 9, 14], [0, 9, 14, 19, 24], [0, 9, 18, 27, 36]] as const;

export default function ResultIntervalViz() {
  return (
    <SceneShell
      eyebrow="세 가지 시간"
      title="9ms, 14ms, 5ms는 각각 무엇을 잰 값일까요"
      description="둘째 장면만 단계를 비교하려고 0–9ms로 확대했고 나머지는 같은 0–36ms 축입니다. 2·5·2ms, 독립된 복사 통로, 계산 자리 하나, 충분한 buffer는 글의 가정입니다."
      ariaLabel="첫 결과 지연, 가장 긴 단계, 두 결과와 네 결과의 전체 시간, 순서대로 처리한 시간을 같은 축에서 비교"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={lanes(index)} max={index === 1 ? 9 : 36} ticks={TICKS[index]} unit="ms" />}
    />
  );
}
