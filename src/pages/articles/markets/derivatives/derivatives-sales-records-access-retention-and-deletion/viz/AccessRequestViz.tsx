import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단, 기한 구조는 #source (8절, 금융소비자보호법 제28조 ④·⑤).
 * 요구받은 날부터 10일이 법률의 상한이고, 실제 기간은 그 안에서 대통령령이 정합니다.
 * 대통령령 일수는 본문에 없으므로 막대 위 위치를 찍지 않습니다.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  step: number;
}

const STEPS = ["요구 접수", "자료 찾기", "본인·제3자 구분", "제공 또는 제한·거절", "처리 뒤 보존"] as const;

const SCENES: readonly Scene[] = [
  { label: "열람 요구가 들어옵니다", summary: "분쟁조정·소송 목적 · 기한 시작", step: 0, note: "고객이 분쟁 목적으로 판매 자료 열람을 요구합니다. 8절의 기한은 요구받은 날부터 셉니다." },
  { label: "사건번호로 자료를 모읍니다", summary: "고객정보 · 설명서 3판 · 녹취 · 주문", step: 1, note: "7절 첫 문단에서 한 사건번호 아래 묶어 둔 자료가 있으면 관련 자료를 한 번에 찾을 수 있습니다." },
  { label: "본인 정보와 제3자 정보를 나눕니다", summary: "제3자 정보 → 가림(마스킹)", step: 2, note: "찾은 자료에 고객 본인이 아닌 사람의 정보(제3자 정보)가 들어 있으면 본인 자료와 구분해 제공 범위를 정합니다. 6절의 열람 통제가 말하는 마스킹이 이 자리에서 쓰입니다." },
  { label: "기한 안에 제공하거나 제한·거절합니다", summary: "상한 10일 · 실제 기간은 대통령령", step: 3, note: "법률은 요구받은 날부터 10일 이내의 범위만 정하고, 그 안의 실제 기간은 대통령령이 정합니다. 열람을 제한하거나 거절할 수 있는 사유는 제5항에 있습니다." },
  { label: "처리 기록도 따로 남깁니다", summary: "제공본 · 감사기록 → 별도 보존 근거", step: 4, note: "열람을 처리하면 제공한 사본과 누가 언제 무엇을 제공했는지의 감사기록이 새로 생깁니다. 이 기록의 보존 근거도 따로 관리합니다." },
];

function Deadline({ active }: { active: boolean }) {
  return (
    <div className={`mt-4 ${active ? "" : "opacity-40"}`}>
      <div className="flex justify-between text-[11px] text-muted-foreground sm:text-xs">
        <span>요구받은 날</span>
        <span>10일 (법률 상한)</span>
      </div>
      <div className="mt-1 h-3 rounded-sm border border-sky-600 bg-sky-600/15" />
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs">
        이 범위 안에서 대통령령이 정한 기간에 열람하게 합니다. 이 글은 대통령령의 일수를 적지 않습니다.
      </p>
    </div>
  );
}

export default function AccessRequestViz() {
  return (
    <SceneShell
      eyebrow="분쟁 목적 열람"
      title="열람 요구 한 건은 다섯 단계와 기한 하나로 처리됩니다"
      description="위 칸은 처리 순서이고, 아래 막대는 8절에서 확인하는 기한의 구조입니다. 막대 길이는 상한만 나타냅니다."
      ariaLabel="열람 요구 접수부터 자료 찾기, 제3자 정보 구분, 기한 안의 제공 또는 제한·거절, 처리 기록 보존까지"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <ol className="grid gap-1.5 sm:grid-cols-5">
              {STEPS.map((name, i) => {
                const isActive = i === scene.step;
                const done = i < scene.step;
                return (
                  <li
                    key={name}
                    className={`rounded-lg border px-2 py-1.5 text-xs leading-5 sm:text-center ${
                      isActive ? "border-primary bg-primary/10 font-bold" : done ? "border-border" : "border-dashed border-border/60 text-muted-foreground"
                    }`}
                  >
                    {i + 1}. {name}
                    {i === 3 ? (
                      <span className={`block font-normal ${isActive ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>제한·거절 사유: 제5항</span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
            {/* 기한은 요구받은 날부터 흐르므로 자료 찾기·구분 단계(1·2)에서도 켜 둡니다. */}
            <Deadline active={scene.step <= 3} />
          </div>
        );
      }}
    />
  );
}
