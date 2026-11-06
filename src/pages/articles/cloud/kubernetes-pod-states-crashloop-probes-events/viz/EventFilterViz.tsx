import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #events — Event의 세 제약. 칸 하나가 event 하나다.
 * 사라짐: EventTTL 1시간. 묶임: 완전히 같으면 count(x15), 메시지만 다르면 10개를 넘을 때 하나로 합침.
 * 걸러짐: 처음 25개 뒤에는 300초에 1개. 시간축은 축척이 없는 개념도다.
 */
const SCENES = [
  { label: "첫째 · 1시간 뒤 사라집니다", summary: "EventTTL 1시간", note: "kube-apiserver의 EventTTL 기본값이 1시간이라 etcd에서 지워집니다. 그래서 어제 밤의 원인은 오늘 아침 kubectl로 볼 수 없고, 장애 직후에 받아 두거나 로그 저장소로 흘려 두어야 합니다." },
  { label: "둘째 · 완전히 같으면 count만", summary: "x15 over 3m", note: "완전히 같은 event는 새로 만들지 않고 count만 올립니다. 그래서 15번 일어난 일이 describe에는 한 줄로 보입니다." },
  { label: "둘째 · 메시지만 달라도 합칩니다", summary: "10분 안에 10개를 넘으면", note: "kubelet 같은 보내는 쪽은 source·object·type·reason이 같고 메시지만 다른 event가 10분 안에 10개를 넘으면 하나로 합칩니다. 합친 줄의 메시지 앞에는 (combined from similar events):가 붙습니다." },
  { label: "셋째 · 25개 뒤엔 5분에 하나", summary: "처음 25개 · 그 뒤 300초에 1개", note: "한 source가 한 객체에 대해 처음 25개는 바로 보내지만 그 뒤로는 300초에 1개씩만 통과합니다. 두 시간째 죽고 있는 컨테이너의 BackOff event가 5분에 한 번만 갱신되는 이유입니다." },
] as const;

const CELL = "h-4 min-w-0 rounded-sm border";
const LABEL = "mb-1 text-xs font-semibold text-muted-foreground";

function Cells({ count, className }: { count: number; className: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`${CELL} ${className}`} />
      ))}
    </>
  );
}

function Ttl() {
  return (
    <div className="space-y-3 text-xs leading-5">
      <div>
        <p className={LABEL}>어제 밤 장애 직후</p>
        <p className="rounded border border-primary bg-background px-2 py-1.5 font-mono [overflow-wrap:anywhere]">Back-off restarting failed container</p>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>1시간 뒤 etcd에서 삭제</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div>
        <p className={LABEL}>오늘 아침 kubectl get events</p>
        <p className="rounded border border-dashed border-border px-2 py-1.5 text-muted-foreground">그 event 없음</p>
      </div>
    </div>
  );
}

function Same() {
  return (
    <div>
      <p className={LABEL}>일어난 일 15번(모두 같은 내용)</p>
      <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-0.5">
        <Cells count={15} className="border-primary bg-primary/30" />
      </div>
      <p className={`${LABEL} mt-4`}>describe에 보이는 것</p>
      <p className="rounded border border-primary bg-background px-2 py-1.5 font-mono text-xs [overflow-wrap:anywhere]">x15 over 3m</p>
    </div>
  );
}

function Merged() {
  return (
    <div>
      <p className={LABEL}>메시지만 다른 같은 종류(10분 안)</p>
      <div className="grid grid-cols-[repeat(10,minmax(0,1fr))_auto_repeat(3,minmax(0,1fr))] items-center gap-0.5">
        <Cells count={10} className="border-border bg-muted" />
        <span className="mx-1 h-6 border-l border-dashed border-[#b45309]" aria-hidden="true" />
        <Cells count={3} className="border-[#b45309] bg-[#b45309]/30" />
      </div>
      <p className="mt-1 text-right text-xs font-semibold text-[#b45309]">점선까지 10개</p>
      <p className={`${LABEL} mt-3`}>넘어간 쪽은 하나로</p>
      <p className="rounded border border-[#b45309] bg-background px-2 py-1.5 font-mono text-xs [overflow-wrap:anywhere]">(combined from similar events): …</p>
    </div>
  );
}

function Spam() {
  return (
    <div>
      <p className={LABEL}>처음 25개는 바로 통과</p>
      <div className="grid grid-cols-[repeat(25,minmax(0,1fr))] gap-px">
        <Cells count={25} className="border-primary bg-primary/30" />
      </div>
      <p className={`${LABEL} mt-4`}>그 뒤로는 300초에 1개</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {[0, 1, 2].map((slot) => (
          <span key={slot} className="contents">
            <span className={`${CELL} w-4 border-primary bg-primary/30`} />
            <span className="flex-1 border-t border-dashed border-border text-center leading-5">300초</span>
          </span>
        ))}
        <span className={`${CELL} w-4 border-primary bg-primary/30`} />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">그 사이에 일어난 일은 새 event로 기록되지 않을 수 있습니다.</p>
    </div>
  );
}

export default function EventFilterViz() {
  return (
    <SceneShell
      eyebrow="Event의 세 제약"
      title="event 수는 일어난 일의 수가 아닙니다"
      description="칸 하나가 event 하나입니다. Event는 왜 그 단어가 붙었는지를 message에 적어 둔 기록이고, kubelet처럼 보내는 쪽과 저장하는 쪽에서 줄어듭니다. 합치는 장면의 칸 수와 시간 간격은 모양을 보이기 위한 그림입니다(가정)."
      ariaLabel="Event가 사라지고 묶이고 걸러지는 세 제약"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={[<Ttl key="ttl" />, <Same key="same" />, <Merged key="merged" />, <Spam key="spam" />]} />}
    />
  );
}
