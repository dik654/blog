import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const CONTEXT_ROWS = [
  ["CALL", "대상", "대상", "현재 주소", "명시한 값", "상위 표시를 물려받음"],
  ["DELEGATECALL", "대상", "그대로", "그대로", "그대로", "상위 표시를 물려받음"],
  ["STATICCALL", "대상", "대상", "현재 주소", "0", "true"],
] as const;

export function CallContextMatrixViz() {
  return (
    <VizFrame
      eyebrow="권한표"
      title="opcode가 새 프레임의 코드와 상태 주인을 따로 정합니다"
      description="‘현재 주소’는 상위 프레임에서 ADDRESS가 돌려주는 계약 주소입니다. DELEGATECALL의 ‘그대로’는 대상 코드의 주소로 바뀌지 않는다는 뜻입니다."
      note="상위 프레임이 이미 static이면 CALL과 DELEGATECALL의 하위 프레임도 static입니다. static 문맥의 CALL은 0이 아닌 value를 보낼 수 없습니다."
      canvasClassName="p-2 sm:p-5"
    >
      <ResponsiveVizTable
        columns={["opcode", "실행할 코드", "현재 주소·storage", "msg.sender", "msg.value", "static 표시"]}
        rows={CONTEXT_ROWS}
        desktopMinWidthClassName="min-w-[760px]"
        firstColumnClassName="font-mono"
        className="mt-0"
      />
      <div className="mt-4 grid grid-cols-3 gap-px bg-border p-px text-center text-[10px] leading-4 sm:text-xs sm:leading-5">
        <div className="bg-background px-2 py-2"><strong className="block text-primary">code</strong>어느 명령을 읽는가</div>
        <div className="bg-background px-2 py-2"><strong className="block text-primary">address</strong>어느 상태를 바꾸는가</div>
        <div className="bg-background px-2 py-2"><strong className="block text-primary">static</strong>변경을 허용하는가</div>
      </div>
    </VizFrame>
  );
}

const CREATE_SCENES = [
  "입력 고정",
  "주소 계산",
  "충돌 검사",
  "init code 실행",
  "runtime code 저장",
] as const;

const CREATE_NOTES = [
  "CREATE2는 deployer, 32-byte salt, init code bytes를 입력으로 받습니다. runtime code는 아직 만들어지지 않았습니다.",
  "0xff·deployer·salt·keccak256(init code)를 이어 붙여 다시 hash하고 마지막 20 bytes를 후보 주소로 사용합니다.",
  "후보 주소에 0이 아닌 nonce나 비어 있지 않은 code가 있으면 생성은 실패합니다. 기존 계약을 덮어쓰지 않습니다.",
  "충돌이 없으면 새 child frame에서 init code를 한 번 실행합니다. 이 프레임도 gas·memory·journal과 실패 경계를 가집니다.",
  "init code가 정상 반환한 bytes만 새 계정의 runtime code가 됩니다. REVERT나 예외 종료라면 계정 생성과 하위 변경을 되돌립니다.",
] as const;

const CREATE_STATE = [
  ["입력", "deployer · salt · init code"],
  ["후보", "0x4D1A…BF38"],
  ["계정", "비어 있음 · 진행"],
  ["child", "init code 실행 중"],
  ["결과", "RETURN bytes → code"],
] as const;

export function CreateLifecycleViz() {
  const scenes = useAnimatedScenes(CREATE_SCENES.length, 4400, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="한 생성 추적 · EIP-1014 예제 0"
      title="주소를 먼저 계산하고, 설치 코드를 실행한 뒤, 반환값만 저장합니다"
      description="deployer=0x00…00, salt=0, init code=0x00인 공식 예제로 CREATE2의 다섯 경계를 분리합니다."
      note="후보 주소 0x4D1A2e2bB4F88F0250f26Ffff098B0b30B26BF38은 EIP-1014 예제 0의 값입니다. 주소 계산은 배포 성공을 보장하지 않습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-create2-scene={active}
        tabIndex={0}
        role="group"
        aria-label="CREATE2 주소 계산과 init code 실행 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-5 gap-px bg-border p-px" aria-label="CREATE2 처리 단계">
          {CREATE_SCENES.map((label, index) => (
            <div
              key={label}
              className={`min-w-0 bg-background px-1 py-2 text-center transition-colors sm:px-2 sm:py-3 ${index <= active ? "text-foreground" : "text-muted-foreground"}`}
            >
              <strong className={`block font-mono text-[9px] ${index === active ? "text-primary" : "text-muted-foreground"}`}>
                {index < active ? "✓" : String(index + 1).padStart(2, "0")}
              </strong>
              <span className="mt-1 hidden break-keep text-[10px] font-bold leading-4 sm:block">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 border border-primary/35 bg-primary/[0.045] px-3 py-3 sm:mt-4 sm:px-5 sm:py-4">
          <p className="text-[10px] font-bold text-primary">{CREATE_STATE[active][0]}</p>
          <p className="mt-1 min-w-0 break-words font-mono text-xs font-bold leading-5 sm:text-sm">{CREATE_STATE[active][1]}</p>
        </div>

        <div className="mt-3 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">
            {String(active + 1).padStart(2, "0")} · {CREATE_SCENES[active]}
          </p>
          <p className="mt-1 min-h-24 break-keep text-xs leading-5 text-muted-foreground sm:min-h-14 sm:text-sm sm:leading-6">
            {CREATE_NOTES[active]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={CREATE_SCENES}
          controlLabels={["입력", "주소", "충돌", "실행", "저장"]}
          playLabel="생성 과정 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={CREATE_SCENES} notes={CREATE_NOTES} />
    </VizFrame>
  );
}
