import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 장부의 기록 넷(지각 1·추론 1·비교 1·증언 1).
 * 나이야는 지각·추론·비교·증언을 네 통로로 구분한다. 디그나가·다르마키르티의 불교 인식론은 지각과 추론 둘을 중심에 두고
 * 증언이 주는 지식도 추론 관계 속에서 설명한다. 비교 기록을 어디에 두는지는 이 절이 말하지 않으므로 빈칸으로 남긴다.
 */
const RECORDS: readonly { name: string; detail: string }[] = [
  { name: "지각", detail: "표지를 직접 봄" },
  { name: "추론", detail: "짐을 보고 예상" },
  { name: "비교", detail: "표식을 지난번과 맞춤" },
  { name: "증언", detail: "상인의 말" },
];

const SCENES = [
  { label: "장부에는 기록이 넷입니다", summary: "1 + 1 + 1 + 1 = 기록 4", note: "같은 결론(내일 시장이 열린다)을 가리키는 기록을 네 개 적었습니다. 아직 이 넷이 각각 독립된 프라마나(참된 인식을 낳는 지식 통로)인지는 정하지 않았습니다." },
  { label: "나이야: 기록마다 제 통로가 있습니다", summary: "통로 4", note: "나이야 전통은 지각·추론·비교·증언을 네 통로로 구분합니다. 기록 넷이 통로 넷에 하나씩 들어갑니다." },
  { label: "불교 인식론: 두 통로가 중심입니다", summary: "통로 2", note: "디그나가와 다르마키르티는 지각과 추론 둘을 중심에 두고, 증언이 주는 지식도 추론 관계 속에서 설명합니다. 비교 기록을 어디에 두는지는 이 절에서 다루지 않아 빈칸으로 남겼습니다." },
] as const;

function Bin({ title, children, tone = "plain" }: { title: string; children?: ReactNode; tone?: "plain" | "muted" }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${tone === "muted" ? "border-dashed border-border text-muted-foreground" : "border-primary/70"}`}>
      <span className="block text-xs font-bold text-primary">{title}</span>
      <div className="mt-1 space-y-1 text-sm leading-5">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="block rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold sm:text-sm">{children}</span>;
}

function Bins({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="grid min-h-[7.5rem] place-items-center rounded-lg border border-dashed border-border px-3 text-center text-sm text-muted-foreground">
        아직 통로로 나누지 않았습니다
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RECORDS.map((record) => (
          <Bin key={record.name} title={`통로: ${record.name}`}>
            <Chip>{record.name} 기록</Chip>
          </Bin>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Bin title="통로: 지각">
        <Chip>지각 기록</Chip>
      </Bin>
      <Bin title="통로: 추론">
        <Chip>추론 기록</Chip>
        <Chip>증언 기록</Chip>
        <span className="block text-[11px] leading-4 text-muted-foreground">증언도 추론 관계로 설명</span>
      </Bin>
      <div className="col-span-2">
        <Bin title="비교 기록" tone="muted">
          <span className="block text-xs leading-5">이 절은 어느 통로에 두는지 말하지 않습니다</span>
        </Bin>
      </div>
    </div>
  );
}

export default function FourRecordsSortViz() {
  return (
    <SceneShell
      eyebrow="기록 수와 통로 수"
      title="같은 기록 넷을 두 학파가 다르게 나눕니다"
      description="위 칸은 3절 설명용 장부의 기록 넷이고, 아래 칸은 그 기록을 받는 지식 통로입니다."
      ariaLabel="지각, 추론, 비교, 증언 기록 넷을 나이야는 네 통로로, 디그나가와 다르마키르티의 불교 인식론은 두 통로 중심으로 나누는 세 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RECORDS.map((record) => (
              <div key={record.name} className="min-w-0 rounded-lg border border-border px-2 py-2 text-center">
                <span className="block text-sm font-semibold">{record.name} 1</span>
                <span className="block text-xs text-muted-foreground">{record.detail}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground" aria-hidden>
            ↓ 통로로 나누기
          </p>
          <Bins index={active} />
        </div>
      )}
    />
  );
}
