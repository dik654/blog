import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sequence-accounting — n=3은 생성 경로 3개.
 * v0.6.6: 한 SequenceGroup 안의 여러 sequence. v0.27.1: ParentRequest가 n=1 자식 0_p, 1_p, 2_p로 나눔.
 * 자리 확인: 상한 4에 A·B가 있으면 남은 자리 2 → 셋째 자식은 대기(순서는 설명용 가정).
 */
const SCENES = [
  { label: "v0.6.6 · 한 그룹", summary: "SequenceGroup 안에 경로 3개", note: "역사적 구조입니다. 같은 입력에서 만드는 여러 sequence를 한 그룹이 담습니다. 현재 버전의 처리와 구분해 읽습니다." },
  { label: "v0.27.1 · 자식 요청", summary: "n=3 → n=1 자식 3개", note: "ParentRequest는 각 자식의 n을 1로 만들고 식별자를 0_p, 1_p, 2_p처럼 나눕니다. p는 부모 요청의 식별자입니다." },
  { label: "자리는 하나씩 확인", summary: "요청 3개 · 생성 경로 5개", note: "상한 4에 A·B가 있으면 두 자리만 남아(가정) 세 자식이 한 번에 수용된다는 보장이 없습니다. 사용자 요청은 3개, 생성 경로는 5개입니다." },
];

const PATH = "flex h-10 items-center justify-center rounded-sm border border-[#f59e0b] bg-[#fde68a] font-mono text-xs font-bold text-[#451a03]";

function Parent({ text }: { text: string }) {
  return <div className="rounded-lg border border-border bg-background px-3 py-2 text-center text-sm font-bold">{text}</div>;
}

const STAGES = [
  <div key="group" className="space-y-2">
    <Parent text="사용자 요청 p · n=3" />
    <p className="text-center text-sm text-muted-foreground" aria-hidden>↓</p>
    <div className="rounded-lg border border-[#b45309] p-3">
      <p className="mb-2 text-xs font-bold">SequenceGroup</p>
      <div className="grid grid-cols-3 gap-2">
        {["seq 1", "seq 2", "seq 3"].map((name) => <span key={name} className={PATH}>{name}</span>)}
      </div>
    </div>
  </div>,
  <div key="children" className="space-y-2">
    <Parent text="ParentRequest p · n=3" />
    <p className="text-center text-sm text-muted-foreground" aria-hidden>↓ 자식마다 n=1</p>
    <div className="grid grid-cols-3 gap-2">
      {["0_p", "1_p", "2_p"].map((name) => (
        <div key={name} className="rounded-lg border border-border p-2">
          <span className={PATH}>{name}</span>
          <p className="mt-1 text-center text-xs text-muted-foreground">n=1</p>
        </div>
      ))}
    </div>
  </div>,
  <div key="seats" className="space-y-3">
    <p className="text-xs font-bold">진행 자리 4개</p>
    <div className="grid grid-cols-4 gap-1">
      {["A", "B", "0_p", "1_p"].map((name, index) => (
        <span key={name} className={index < 2 ? "flex h-10 items-center justify-center rounded-sm border border-[#2563eb] bg-[#2563eb] font-mono text-xs font-bold text-white" : PATH}>{name}</span>
      ))}
    </div>
    <div className="grid grid-cols-4 items-center gap-1">
      <span className={PATH}>2_p</span>
      <span className="col-span-3 pl-1 text-xs font-bold">대기</span>
    </div>
  </div>,
];

export default function ParallelChildrenViz() {
  return (
    <SceneShell
      eyebrow="요청 수와 경로 수"
      title="응답 세 개를 요구한 요청 하나가 자리 세 개를 찾습니다"
      description="칸 하나가 응답 하나를 만드는 생성 경로입니다. 주황은 요청 p의 경로, 파랑은 다른 요청 A·B입니다. n은 한 요청이 요구한 응답 개수입니다."
      note="어느 자식이 먼저 자리를 얻는지는 그림을 위한 가정이며, 토큰과 저장 공간은 충분하다고 둡니다(가정)."
      ariaLabel="n=3 요청이 버전별로 생성 경로가 되는 구조와 자리 확인"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={STAGES} />}
    />
  );
}
