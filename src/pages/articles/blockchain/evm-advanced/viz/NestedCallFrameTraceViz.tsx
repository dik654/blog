import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Proxy 호출",
  "코드 위임",
  "Proxy 상태 변경",
  "읽기 전용 호출",
  "쓰기 거절",
  "위임 프레임 복구",
  "상위 호출 정상 종료",
] as const;

const NOTES = [
  "Alice가 Proxy P에 1 ETH와 요청을 보냅니다. 바깥 프레임 F0의 현재 주소와 storage 주인은 P이고, msg.sender는 Alice입니다.",
  "P가 Implementation I를 DELEGATECALL합니다. F1은 I의 코드를 읽지만 현재 주소·storage·sender·value는 F0에서 그대로 물려받습니다.",
  "I의 코드가 SSTORE를 실행합니다. 코드는 I에서 왔지만 F1의 현재 주소는 P이므로 P의 slot 0 변경이 F1 checkpoint에 기록됩니다.",
  "I의 코드가 Checker C를 STATICCALL합니다. F2는 C의 코드와 storage를 사용하고 msg.sender는 현재 주소 P, msg.value는 0, 쓰기 금지 표시는 true입니다.",
  "C가 SSTORE를 시도하면 F2는 예외 종료합니다. STATICCALL은 success=0을 F1에 돌려주며, 하위 프레임의 상태 변경은 남지 않습니다.",
  "I의 코드가 실패를 REVERT로 전파합니다. F1에서 임시로 기록한 P의 slot 0=7도 checkpoint까지 되돌아가 0이 됩니다.",
  "P가 DELEGATECALL의 success=0을 처리한 뒤 정상 반환합니다. 바깥 거래 status는 성공일 수 있지만 내부 위임 호출과 slot 변경은 실패한 상태입니다.",
] as const;

const ACTIVE_NODE = [1, 2, 2, 3, 3, 2, 1] as const;

const FRAME_STATUS = [
  ["실행 중", "아직 없음", "아직 없음"],
  ["대기", "실행 중", "아직 없음"],
  ["대기", "slot 0=7 기록", "아직 없음"],
  ["대기", "하위 결과 대기", "실행 중"],
  ["대기", "success=0 수신", "예외 종료"],
  ["success=0 수신", "REVERT · 복구", "종료"],
  ["정상 종료", "실패 처리됨", "종료"],
] as const;

const RECEIPTS = [
  ["Proxy slot 0", "0"],
  ["F1 변경", "없음"],
  ["F1 변경", "slot 0=7 · 임시"],
  ["F2 권한", "static=true"],
  ["F2 결과", "success=0"],
  ["Proxy slot 0", "0 · 복구"],
  ["바깥 / 내부", "status=1 / success=0"],
] as const;

const FRAMES = [
  {
    id: "F0",
    opcode: "외부 CALL",
    code: "Proxy P",
    storage: "Proxy P",
    sender: "Alice",
    value: "1 ETH",
    write: "허용",
  },
  {
    id: "F1",
    opcode: "DELEGATECALL",
    code: "Implementation I",
    storage: "Proxy P",
    sender: "Alice",
    value: "1 ETH",
    write: "허용",
  },
  {
    id: "F2",
    opcode: "STATICCALL",
    code: "Checker C",
    storage: "Checker C",
    sender: "Proxy P",
    value: "0",
    write: "금지",
  },
] as const;

function visibleFrameCount(active: number) {
  if (active < 1) return 1;
  if (active < 3) return 2;
  return 3;
}

export default function NestedCallFrameTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
  const active = scenes.active;
  const shown = visibleFrameCount(active);

  return (
    <VizFrame
      eyebrow="한 요청 추적 · Alice → Proxy"
      title="다른 코드를 실행해도 상태의 주인이 자동으로 바뀌지는 않습니다"
      description="Proxy P가 Implementation I의 코드를 빌려 쓰고, 그 코드가 Checker C를 읽기 전용으로 호출하는 한 거래를 추적합니다."
      note="주소와 값은 설명용입니다. 핵심은 각 프레임에서 code·현재 주소(storage)·sender·value·static 표시를 따로 읽는 것입니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-evm-call-scene={active}
        tabIndex={0}
        role="group"
        aria-label="DELEGATECALL과 STATICCALL의 중첩 실행 프레임"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-4 gap-px bg-border p-px" aria-label="호출 경로">
          {(["Alice", "Proxy P", "Implementation I", "Checker C"] as const).map((label, index) => (
            <div
              key={label}
              className={`min-w-0 bg-background px-1.5 py-2 text-center transition-colors sm:px-3 sm:py-3 ${ACTIVE_NODE[active] === index ? "text-foreground" : "text-muted-foreground"}`}
            >
              <span className={`mx-auto mb-1 block h-1 w-8 transition-colors ${ACTIVE_NODE[active] === index ? "bg-primary" : "bg-border"}`} />
              <strong className="break-keep text-[9px] leading-4 sm:text-xs">{label}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid gap-2 sm:mt-4" aria-label="열린 실행 프레임">
          {FRAMES.map((frame, index) => {
            const visible = index < shown;
            const current =
              (active === 0 && index === 0) ||
              (active >= 1 && active <= 2 && index === 1) ||
              (active >= 3 && active <= 4 && index === 2) ||
              (active === 5 && index === 1) ||
              (active === 6 && index === 0);

            return (
              <div
                key={frame.id}
                aria-hidden={!visible}
                className={`min-w-0 border px-2 py-2 transition-all sm:px-4 sm:py-3 ${
                  visible
                    ? current
                      ? "border-primary/60 bg-primary/[0.055] opacity-100"
                      : "border-border bg-background opacity-100"
                    : "max-h-0 overflow-hidden border-transparent py-0 opacity-0"
                }`}
              >
                <div className="flex min-w-0 items-baseline justify-between gap-2">
                  <p className="font-mono text-[10px] font-black text-primary sm:text-xs">{frame.id} · {frame.opcode}</p>
                  <p className="break-keep text-right text-[9px] font-bold text-muted-foreground sm:text-[11px]">{FRAME_STATUS[active][index]}</p>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] leading-4 sm:grid-cols-5 sm:text-[11px] sm:leading-5">
                  {([
                    ["코드", frame.code],
                    ["상태", frame.storage],
                    ["sender", frame.sender],
                    ["value", frame.value],
                    ["쓰기", frame.write],
                  ] as const).map(([key, value]) => (
                    <div key={key} className="min-w-0 border-t border-border/60 pt-1">
                      <dt className="text-muted-foreground">{key}</dt>
                      <dd className="break-keep font-semibold text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>

        <div className="mt-2 grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-px bg-border p-px text-[10px] sm:mt-4 sm:text-xs">
          <div className="bg-background px-2 py-2 font-bold text-muted-foreground sm:px-4">{RECEIPTS[active][0]}</div>
          <div className="min-w-0 bg-background px-2 py-2 font-mono font-bold text-foreground sm:px-4">{RECEIPTS[active][1]}</div>
        </div>

        <div className="mt-2 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">
            {String(active + 1).padStart(2, "0")} · {SCENES[active]}
          </p>
          <p className="mt-1 min-h-28 break-keep text-xs leading-5 text-muted-foreground sm:min-h-16 sm:text-sm sm:leading-6">
            {NOTES[active]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["호출", "위임", "기록", "정적", "거절", "복구", "종료"]}
          playLabel="중첩 호출 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
