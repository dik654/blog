import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pipeline — AlgorithmBlock의 일곱 단계를 가상의 문서 여덟 개로 추적한다.
 * 문서 구성과 결과는 모두 설명용 가정이다. 남는 수 8 → 7 → 7 → 4 → 3 → 3 → 3.
 */
const DOCS = [
  { id: 1, source: "웹", text: "글, 깨진 인코딩·전각 숫자", removedAt: null, reason: "" },
  { id: 2, source: "웹", text: "스팸 키워드 과다", removedAt: 1, reason: "품질 미달" },
  { id: 3, source: "웹", text: "문서 1을 그대로 복사", removedAt: 3, reason: "완전 중복" },
  { id: 4, source: "웹", text: "문서 1과 광고 한 줄만 다름", removedAt: 3, reason: "거의 중복" },
  { id: 5, source: "코드", text: "코드 저장소 설명", removedAt: null, reason: "" },
  { id: 6, source: "코드", text: "문서 5와 뜻만 같음", removedAt: 3, reason: "뜻 중복" },
  { id: 7, source: "웹", text: "평가 문항과 같은 문구", removedAt: 4, reason: "평가 겹침" },
  { id: 8, source: "논문", text: "학술 논문 본문", removedAt: null, reason: "" },
] as const;

const SCENES = [
  { label: "원본 문서", summary: "8개", note: "웹·코드·논문 source에서 모은 원본입니다. 저품질 문서, 겹치는 문서, 평가 문항이 든 문서가 섞여 있습니다." },
  { label: "Filtering", summary: "8 → 7", note: "언어 식별·휴리스틱 규칙으로 저품질 문서를 고치지 않고 통째로 지웁니다." },
  { label: "Cleaning·정규화", summary: "7 → 7", note: "문서 수는 그대로입니다. 깨진 인코딩을 고치고 전각 숫자 같은 표기를 표준 형식으로 맞춰 이후 비교를 안정시킵니다. 문서 1의 사본인 3과 4도 같은 내용을 담고 있어 함께 고쳐집니다." },
  { label: "Dedup", summary: "7 → 4", note: "exact(똑같음), near-duplicate(거의 같음), semantic(표현이 달라도 뜻이 같음) 세 층위로 겹치는 문서를 지웁니다." },
  { label: "Contamination 검사", summary: "4 → 3", note: "내부 중복이 아니라 평가 benchmark 문항과 겹치는 문서를 걸러 냅니다." },
  { label: "Annotation", summary: "3개에 label", note: "남은 문서에 학습에 쓸 label을 붙입니다. 문서 수는 줄지 않습니다." },
  { label: "Mixture·Curriculum", summary: "1 → 5 → 8 → 8", note: "도메인 목표 비율로 빈도를, 쉬운 데이터부터 순서를 정합니다. 논문을 두 번 보인다는 것과 이 순서는 가정입니다." },
] as const;

const SEQUENCE = [1, 5, 8, 8];
/** 문서 3·4는 문서 1의 사본이므로 같은 결함을 함께 고친다. */
const FIXED_AT_CLEANING: readonly number[] = [1, 3, 4];

function statusOf(doc: (typeof DOCS)[number], active: number) {
  if (doc.removedAt !== null && doc.removedAt < active) return { tone: "gone", text: "제거됨" } as const;
  if (doc.removedAt === active) return { tone: "now", text: doc.reason } as const;
  if (active === 2 && FIXED_AT_CLEANING.includes(doc.id)) return { tone: "fixed", text: "고침" } as const;
  if (doc.removedAt === null && active >= 5) return { tone: "fixed", text: "label 있음" } as const;
  return { tone: "plain", text: "남음" } as const;
}

export default function DocumentTraceViz() {
  return (
    <SceneShell
      eyebrow="문서 여덟 개 추적"
      title="각 단계는 문서를 지우거나 고치거나 순서를 정합니다"
      description="한 줄이 문서 하나입니다. 여덟 문서와 그 결과는 단계 차이를 보이려는 가정이며 실제 비율이 아닙니다."
      ariaLabel="가상의 문서 여덟 개가 filtering, cleaning, dedup, contamination 검사, annotation, mixture를 지나는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <ul className="space-y-1">
            {DOCS.map((doc) => {
              const status = statusOf(doc, active);
              return (
                <li
                  key={doc.id}
                  className={`grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-2 py-0.5 text-xs sm:text-sm ${
                    status.tone === "now" ? "border-red-600 bg-background" : status.tone === "fixed" ? "border-blue-600 bg-blue-500/10" : status.tone === "gone" ? "border-dashed border-border/40 opacity-45" : "border-border bg-background"
                  }`}
                >
                  <span className="font-mono font-bold">{doc.id}</span>
                  <span className={`min-w-0 ${status.tone === "gone" ? "line-through" : ""}`}>
                    <span className="text-muted-foreground">{doc.source} · </span>
                    {doc.text}
                  </span>
                  <span className={`text-right text-[11px] font-bold sm:text-xs ${status.tone === "now" ? "text-red-700 dark:text-red-400" : status.tone === "fixed" ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>{status.text}</span>
                </li>
              );
            })}
          </ul>
          <div className={`mt-3 flex items-center justify-center gap-1.5 text-xs ${active === 6 ? "" : "invisible"}`}>
            <span className="font-bold">학습 순서</span>
            {SEQUENCE.map((id, index) => (
              <span key={index} className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-600 bg-blue-500/10 font-mono font-bold">{id}</span>
            ))}
          </div>
        </div>
      )}
    />
  );
}
