import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache-key-ttl-staleness — temperature가 key에 있으면 다른 칸, 없으면 같은 칸.
 * temperature 0과 0.7은 설명용 값(가정)이다.
 */
const SCENES = [
  { label: "temperature까지 key에 넣음", summary: "다른 key → miss → 새로 실행", note: "temperature가 달라 key도 다릅니다. 둘째 요청은 저장된 값을 찾지 못하고 새로 실행합니다." },
  { label: "temperature를 key에서 뺌", summary: "같은 key → 다른 조건의 응답", note: "빠진 옵션 때문에 두 요청의 key가 같아집니다. 둘째 요청은 temperature 0(가정)으로 만든 응답을 받습니다." },
] as const;

function KeyPanel({ full }: { full: boolean }) {
  const requests = [
    { name: "첫째 요청", temperature: "0", key: full ? "문자열·model·0" : "문자열·model" },
    { name: "둘째 요청", temperature: "0.7", key: full ? "문자열·model·0.7" : "문자열·model" },
  ];
  const slots = full
    ? [{ key: "문자열·model·0", value: "temperature 0 응답" }, { key: "문자열·model·0.7", value: "temperature 0.7 응답" }]
    : [{ key: "문자열·model", value: "temperature 0 응답" }, null];
  return (
    <div className="min-w-0 space-y-2">
      {requests.map((request, index) => {
        const hit = !full && index === 1;
        return (
          <div key={request.name} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2 rounded-lg border border-border bg-background p-2">
            <div className="min-w-0">
              <p className="text-xs font-bold">{request.name}</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{`temperature ${request.temperature}(가정)`}</p>
            </div>
            <div className="min-w-0">
              <p className={`break-keep font-mono text-xs leading-5 ${hit ? "font-bold text-red-700 dark:text-red-400" : ""}`}>{`key ${request.key}`}</p>
              <p className={`mt-1 text-xs font-bold leading-5 ${hit ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                {index === 0 ? "miss → 실행, 저장" : hit ? "hit → 첫째 응답 반환" : "miss → 실행, 저장"}
              </p>
            </div>
          </div>
        );
      })}
      <div className="pt-1">
        <p className="mb-1 text-xs font-semibold text-muted-foreground">{`저장된 칸 ${slots.filter(Boolean).length}개`}</p>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot, index) =>
            slot ? (
              <div key={index} className={`min-w-0 rounded-lg border p-2 ${full ? "border-border bg-background" : "border-red-600 bg-background"}`}>
                <p className="break-keep font-mono text-xs leading-5">{slot.key}</p>
                <p className="text-xs font-bold leading-5">{slot.value}</p>
              </div>
            ) : (
              <div key={index} className="flex min-w-0 items-center justify-center rounded-lg border border-dashed border-border/60 p-2 text-xs text-muted-foreground">빈 칸</div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function CacheKeySlotViz() {
  return (
    <SceneShell
      eyebrow="key에 넣는 조건"
      title="옵션 하나가 key에서 빠지면 두 요청이 한 칸을 씁니다"
      description="Cache key는 저장된 값을 다시 찾을 때 쓰는 식별자입니다. 두 요청의 문자열과 model은 같고, 빈 cache에 위에서 아래 순서로 들어옵니다(가정)."
      ariaLabel="temperature를 key에 넣을 때와 뺄 때 두 요청의 hit 여부 비교"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={[<KeyPanel key="full" full />, <KeyPanel key="short" full={false} />]} />}
    />
  );
}
