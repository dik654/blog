import type { ReactNode } from "react";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shared-spill — 기본은 local 경로, 지시문을 켜면 shared 먼저, 부족하면 남은 값은 local.
 * 값 6개와 shared 칸 수는 분기를 보이기 위한 가정이며 실제 용량이 아니다.
 */
const SPILLED = 6;

const SCENES = [
  { label: "기본 경로", summary: "넘친 값 → local", shared: 0, sharedDetail: "지시문이 없어 spill에 쓰지 않음", gate: "지시문 없음 · 기본 local-memory 경로. 앞의 CC 7.0 사례는 이쪽입니다.", note: "register에 계속 둘 수 없는 값은 thread별 주소로 저장되고, 실제 저장 공간은 device memory입니다." },
  { label: "지시문을 켜고 shared가 충분할 때", summary: "local spill 보고 0", shared: 6, sharedDetail: "spill에 쓸 칸 6개(가정)", gate: '.pragma "enable_smem_spilling"; · 이 버전 대상은 sm_75 이상', note: "넘친 값이 모두 shared memory로 갑니다. local spill 보고가 0이어도 모든 값이 register에 있다는 뜻은 아닙니다." },
  { label: "지시문을 켰지만 shared가 부족할 때", summary: "shared 4 · local 2 (가정)", shared: 4, sharedDetail: "spill에 쓸 칸이 4개뿐(가정)", gate: '.pragma "enable_smem_spilling"; · 이 버전 대상은 sm_75 이상', note: "shared 공간이 부족하면 남은 spill은 local 경로로 갑니다. 그림의 4와 2는 설명용 값입니다(가정)." },
  { label: "그 대가", summary: "occupancy 다시 계산", shared: 6, sharedDetail: "spill에 쓸 칸 6개(가정)", gate: '.pragma "enable_smem_spilling"; · 이 버전 대상은 sm_75 이상', note: "block당 shared 사용량이 늘면 다른 block의 입장을 막을 수 있습니다. 줄어든 local 전송과 줄어든 동시 배치를 실제 실행 시간으로 비교합니다." },
] as const;

function Chip({ on, tone }: { on: boolean; tone: "primary" | "amber" }) {
  const cls = !on ? "border-border/50" : tone === "primary" ? "border-primary bg-primary/25" : "border-amber-600 bg-amber-500/25";
  return (
    <span className={`flex h-6 items-center justify-center border text-[11px] ${cls}`}>
      {on ? "값" : ""}
    </span>
  );
}

function Store({ name, detail, children, lit }: { name: string; detail: string; children: ReactNode; lit: boolean }) {
  return (
    <div className={`min-w-0 border p-2 ${lit ? "border-primary" : "border-border"}`}>
      <p className="text-xs font-bold sm:text-sm">{name}</p>
      <p className="mb-2 min-h-8 text-[11px] leading-4 text-muted-foreground">{detail}</p>
      <div className="grid grid-cols-3 gap-1">{children}</div>
    </div>
  );
}

export default function SharedSpillBranchViz() {
  return (
    <SceneShell
      eyebrow="값이 내려가는 갈래"
      title="지시문을 켜면 넘친 값을 shared에 먼저 놓습니다"
      description="register에 둘 수 없는 값을 6개라고 놓고(가정) 어디로 가는지 셉니다. 칸 하나가 값 하나입니다. shared memory는 block이 함께 쓰는 가까운 공간입니다."
      note="함수별 분리 컴파일, device debug, 재귀가 있는 해당 모드, 동적 shared memory, setmaxnreg 사용에는 제한이 있습니다."
      ariaLabel="spill 값이 shared와 local로 나뉘는 분기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const local = SPILLED - scene.shared;
        return (
          <div>
            <StableSceneStack
              active={active}
              scenes={SCENES.map((item) => (
                <p key={item.label} className="font-mono text-xs leading-5 text-muted-foreground">{item.gate}</p>
              ))}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Store name="shared memory" detail={scene.sharedDetail} lit={scene.shared > 0}>
                {Array.from({ length: SPILLED }, (_, slot) =>
                  slot < scene.shared ? <Chip key={slot} on tone="primary" /> : <span key={slot} aria-hidden className="h-6" />,
                )}
              </Store>
              <Store name="local 경로" detail="실제 저장 공간은 device memory" lit={local > 0}>
                {Array.from({ length: SPILLED }, (_, slot) => (
                  <Chip key={slot} on={slot < local} tone="amber" />
                ))}
              </Store>
            </div>
            <p className={`mt-3 border-l border-primary pl-3 text-sm font-semibold ${active === 3 ? "" : "invisible"}`}>
              block당 shared 사용량 ↑ → 들어갈 block 수를 다시 계산
            </p>
          </div>
        );
      }}
    />
  );
}
