import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — read() 한 번이 지나는 다섯 칸.
 * 위 칸은 지금 도는 코드가 어느 쪽인지, 아래 칸은 task가 어디에 있는지 보여 준다.
 */
type Code = "user" | "kernel";
type Place = "cpu" | "sleep" | "queue";

const SCENES: readonly { label: string; summary: string; note: string; code: Code; place: Place; other: Place }[] = [
  { label: "1칸 · read()를 부릅니다", summary: "경계 앞", code: "user", place: "cpu", other: "queue", note: "프로그램이 파일을 읽고 싶어 read()를 부릅니다. 아직 자기 주소 공간 안에서 도는 사용자 코드입니다." },
  { label: "2칸 · 문을 지납니다", summary: "경계 통과", code: "kernel", place: "cpu", other: "queue", note: "CPU의 특권 모드(하드웨어에 손댈 수 있는 실행 상태)를 바꾸는 명령 하나로 커널 코드에 들어갑니다. 첫 두 칸이 사용자 공간과 커널 공간의 경계입니다." },
  { label: "3칸 · 잠재웁니다", summary: "상태 변화", code: "kernel", place: "sleep", other: "queue", note: "디스크를 기다려야 할 때 커널은 이 task를 잠재웁니다. CPU에서 내려왔으니 기다리는 동안 CPU를 쓰지 않습니다." },
  { label: "4칸 · 다른 task를 올립니다", summary: "스케줄링", code: "kernel", place: "sleep", other: "cpu", note: "비어 있는 CPU에 차례를 기다리던 다른 task가 올라갑니다. 어느 task를 올릴지 고르는 규칙은 7절에서 다룹니다." },
  { label: "5칸 · 깨워서 줄에 세웁니다", summary: "다시 대기", code: "kernel", place: "queue", other: "cpu", note: "디스크의 답이 오면 잠든 task를 깨워 다시 줄에 세웁니다. 차례가 와서 커널이 일을 마치면 들어온 길로 사용자 코드에 돌아옵니다." },
];

function Token({ kind }: { kind: "self" | "other" }) {
  return kind === "self" ? (
    <span className="rounded-sm bg-[#2563eb] px-2 py-0.5 text-xs font-bold text-white">read를 부른 task</span>
  ) : (
    <span className="rounded-sm border border-border bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground">다른 task</span>
  );
}

function Zone({ name, hint, children }: { name: string; hint: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-[6.25rem] min-w-0 flex-col rounded-lg border border-border bg-background p-2">
      <span className="text-xs font-bold">{name}</span>
      <span className="text-[11px] leading-4 text-muted-foreground">{hint}</span>
      <div className="mt-auto flex flex-wrap gap-1 pt-2">{children}</div>
    </div>
  );
}

export default function KernelFlowViz() {
  return (
    <SceneShell
      eyebrow="다섯 칸 지도"
      title="read() 한 번은 문을 지나 잠들고, 깨어나 다시 줄에 섭니다"
      description="위 줄은 read를 부른 task의 호출이 어느 쪽 코드에 와 있는지, 아래 줄은 그 task가 어디 있는지입니다. (가정) 그림을 줄이려고 CPU를 하나만 그렸습니다."
      ariaLabel="read 호출이 사용자 코드, 커널 코드, 잠, 줄로 옮겨 가는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_3.25rem_minmax(0,1fr)] items-stretch gap-2">
              <Zone name="사용자 코드" hint="자기 주소 공간 안">
                {s.code === "user" && <Token kind="self" />}
              </Zone>
              <div className="flex flex-col items-center justify-center text-center text-[11px] leading-4">
                <span className={`font-mono text-base font-bold ${active === 1 ? "text-[#2563eb]" : "text-muted-foreground"}`}>⇄</span>
                <span className={active === 1 ? "font-bold text-[#2563eb]" : "text-muted-foreground"}>시스템 콜</span>
              </div>
              <Zone name="커널 코드" hint="하드웨어를 다루는 쪽">
                {s.code === "kernel" && <Token kind="self" />}
              </Zone>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Zone name="CPU" hint="지금 도는 자리">
                {s.place === "cpu" && <Token kind="self" />}
                {s.other === "cpu" && <Token kind="other" />}
              </Zone>
              <Zone name="잠" hint="사건을 기다림">
                {s.place === "sleep" && <Token kind="self" />}
              </Zone>
              <Zone name="줄" hint="CPU 차례 대기">
                {s.place === "queue" && <Token kind="self" />}
                {s.other === "queue" && <Token kind="other" />}
              </Zone>
            </div>
          </div>
        );
      }}
    />
  );
}
