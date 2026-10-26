import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "입력 고정",
  "필드 인코딩",
  "목록 완성",
  "정확히 복원",
  "해시 계산",
  "주소 선택",
] as const;

const NOTES = [
  "Alloy 1.6.1 문서의 실제 예시를 사용합니다. 보내는 주소는 20바이트 Address이고 nonce는 u64 값 1입니다.",
  "주소는 20바이트 문자열이라 길이 표시 0x94를 앞에 붙입니다. nonce 1은 한 바이트 0x01만으로 표현합니다.",
  "두 필드의 payload는 22바이트입니다. 짧은 RLP 목록 머리 0xd6을 붙이면 전체 23바이트가 됩니다.",
  "alloy-rlp 0.3.16의 decode_exact는 두 값을 복원한 뒤 남은 바이트가 0인지 확인합니다. 뒤에 0x00이 붙으면 실패합니다.",
  "정확히 그 23바이트를 Keccak-256에 넣어 32바이트 B256 digest를 계산합니다. SHA3-256과 같은 이름으로 뭉뚱그리지 않습니다.",
  "digest의 마지막 20바이트를 새 Address로 사용합니다. 중간 바이트가 하나만 달라도 해시와 결과 주소가 모두 달라집니다.",
] as const;

const STEPS = [
  ["입력", "Address · nonce"],
  ["필드", "94… · 01"],
  ["RLP", "d6…01"],
  ["복원", "남은 바이트 0"],
  ["Keccak", "32바이트"],
  ["주소", "마지막 20바이트"],
] as const;

const SENDER = "b20a608c624ca5003905aa834de7156c68b2e1d0";
const RLP = `d694${SENDER}01`;
const DIGEST = "c71d864bc265f58febf32269e33c6e89e69d085897f98e92b06ebd541d1daa99";
const CREATED = "e33c6e89e69d085897f98e92b06ebd541d1daa99";

const SNAPSHOTS = [
  { kind: "Address + u64", bytes: "아직 만들지 않음", check: "폭 확인", result: "입력 의미 고정" },
  { kind: "RLP 필드 2개", bytes: `94${SENDER} · 01`, check: "20B + 1B", result: "각 필드가 한 표현을 가짐" },
  { kind: "RLP 목록", bytes: RLP, check: "23바이트", result: "hash 입력 확정" },
  { kind: "Address + u64", bytes: RLP, check: "남은 바이트 0", result: "원래 값과 일치" },
  { kind: "B256", bytes: DIGEST, check: "Keccak-256", result: "32바이트 digest" },
  { kind: "Address", bytes: CREATED, check: "digest[12..32]", result: "계약 주소 확정" },
] as const;

export default function ContextViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600, { loop: false });
  const active = scenes.active;
  const snapshot = SNAPSHOTS[active];

  return (
    <VizFrame
      eyebrow="한 값의 이동 · 타입 → 바이트 → 해시"
      title="보내는 주소와 nonce 1이 새 계약 주소가 되는 과정을 끝까지 추적합니다"
      description="Alloy 1.6.1의 CREATE 예시를 같은 식별자로 따라갑니다. 재생은 직접 시작하며 마지막 장면에서 멈춥니다."
      note="입력과 결과는 Alloy 1.6.1 address.rs의 공식 예시입니다. RLP 바이트와 Keccak digest는 같은 입력으로 다시 계산해 확인했습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-alloy-scene={active}
        tabIndex={0}
        role="group"
        aria-label="주소와 nonce를 RLP로 직렬화하고 해시해 새 계약 주소를 만드는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div
          className="grid grid-cols-[minmax(0,1fr)_4.5rem] gap-px bg-border p-px"
          aria-label="고정 입력"
        >
          <div className="min-w-0 bg-background px-3 py-2.5">
            <p className="text-[9px] font-bold text-muted-foreground">보내는 Address · 20바이트</p>
            <p className="mt-1 break-all font-mono text-[10px] font-bold leading-4 sm:text-xs">0x{SENDER}</p>
          </div>
          <div className="min-w-0 bg-background px-2 py-2.5 text-center">
            <p className="text-[9px] font-bold text-muted-foreground">nonce</p>
            <p className="mt-1 font-mono text-sm font-black">1</p>
          </div>
        </div>

        <div
          className="mt-3 grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6"
          aria-label="주소를 만드는 여섯 단계"
        >
          {STEPS.map(([label, detail], index) => {
            const passed = index < active;
            const current = index === active;
            return (
              <div
                key={label}
                className={`min-w-0 bg-background px-2 py-2.5 ${current ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span className={`mb-2 block h-1 w-7 ${current ? "bg-primary" : passed ? "bg-primary/35" : "bg-border"}`} />
                <strong className="block break-keep text-xs">{label}</strong>
                <span className="mt-1 hidden break-keep text-[10px] leading-4 sm:block">{detail}</span>
              </div>
            );
          })}
        </div>

        <div
          className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[7rem_minmax(0,1fr)]"
          aria-label="현재 장면의 값과 바이트"
        >
          <div className="min-w-0 bg-background px-3 py-3">
            <p className="text-[9px] font-bold text-muted-foreground">현재 타입</p>
            <p className="mt-1 break-keep text-xs font-black leading-5">{snapshot.kind}</p>
          </div>
          <div className="min-w-0 bg-background px-3 py-3">
            <p className="text-[9px] font-bold text-muted-foreground">현재 바이트</p>
            <p className="mt-1 break-all font-mono text-[10px] font-bold leading-4 sm:text-xs sm:leading-5">{snapshot.bytes}</p>
          </div>
          <div className="min-w-0 bg-background px-3 py-3">
            <p className="text-[9px] font-bold text-muted-foreground">검사</p>
            <p className="mt-1 break-keep text-xs font-black leading-5">{snapshot.check}</p>
          </div>
          <div className="min-w-0 bg-background px-3 py-3">
            <p className="text-[9px] font-bold text-muted-foreground">이 단계의 결론</p>
            <p className="mt-1 break-keep text-xs font-black leading-5">{snapshot.result}</p>
          </div>
        </div>

        <p
          data-scene-note
          className="mt-3 min-h-20 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-16 sm:pl-4 sm:text-sm sm:leading-6"
        >
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["입력", "필드", "목록", "복원", "해시", "주소"]}
          playLabel="주소 생성 과정 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
