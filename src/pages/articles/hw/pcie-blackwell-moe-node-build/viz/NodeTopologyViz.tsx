import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 카드 여덟 장 사이의 길이 어느 부품을 지나는가.
 * 본문 대응: 4절(이름 없는 그림)과 5절(왜 길의 지연이 속도를 정하나).
 * 장면 1~3은 소켓마다 스위치 하나를 둔 배치에서 길 세 갈래를 차례로 비춘다.
 * 장면 4는 NIC 안에 스위치가 든 배치, 장면 5는 노드 밖으로 나가는 두 망이다.
 * 카드가 어느 스위치에 붙는지는 섀시마다 다르므로 4장씩 나눈 것은 (가정)이다.
 */
const SCENES = [
  "소켓마다 스위치, 같은 스위치 안의 길",
  "소켓을 건너는 길",
  "직접 길을 끈 경우",
  "NIC 안에 스위치를 둔 배치",
  "노드 밖으로 나가는 두 망",
] as const;

const NOTES = [
  "카드 넷씩 스위치 두 개에, 스위치는 각자 다른 소켓에 붙습니다. 전용 다리가 없어 모든 통신이 이 나무를 탑니다. 카드 0에서 1로는 스위치 A에서 바로 꺾는 가장 짧은 길입니다.",
  "카드 0에서 5로 가려면 스위치 A, 소켓 0, 소켓 사이 링크, 소켓 1, 스위치 B를 지납니다. 층마다 두 번 맞추는 통신이 이 길을 타면 단일 사용자 속도가 내려갑니다.",
  "직접 쓰는 길을 끄면 데이터가 호스트 메모리에 내려앉았다가 다시 올라갑니다. 단일 스트림은 느려지지만 동시 요청이 많을 때는 총 처리량이 더 높았다는 현장 보고가 있습니다.",
  "NIC 안의 스위치가 카드 둘과 NIC 하나를 한 묶음으로 만듭니다. 묶음 넷이면 카드 여덟 장에 NIC 넷입니다. 묶음 안은 짧은 길이지만 묶음 사이는 여전히 소켓을 지납니다.",
  "노드마다 모델 한 벌을 올리면 노드 사이 카드 통신이 없고 요청과 응답만 서비스망을 지납니다. 앞 단계가 만든 기억(KV)을 뒤 단계로 넘길 때만 RDMA 망이 일합니다.",
] as const;

const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const TEXT = "#475569";

type Edge = { id: string; x1: number; y1: number; x2: number; y2: number };

const CPU0 = { x: 40, y: 18, w: 170, h: 34 };
const CPU1 = { x: 270, y: 18, w: 170, h: 34 };
const SWA = { x: 55, y: 92, w: 140, h: 28 };
const SWB = { x: 285, y: 92, w: 140, h: 28 };
const gpuX = (i: number) => (i < 4 ? 47 + i * 40 : 277 + (i - 4) * 40);
const GPU_Y = 168;

const DUAL_EDGES: Edge[] = [
  { id: "cpu-cpu", x1: 210, y1: 35, x2: 270, y2: 35 },
  { id: "cpu0-swa", x1: 125, y1: 52, x2: 125, y2: 92 },
  { id: "cpu1-swb", x1: 355, y1: 52, x2: 355, y2: 92 },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `sw-g${i}`,
    x1: i < 4 ? 125 : 355,
    y1: 120,
    x2: gpuX(i) + 16,
    y2: GPU_Y,
  })),
];

const HIGHLIGHT: Record<number, string[]> = {
  0: ["sw-g0", "sw-g1"],
  1: ["sw-g0", "cpu0-swa", "cpu-cpu", "cpu1-swb", "sw-g5"],
  2: ["sw-g0", "cpu0-swa", "cpu-cpu", "cpu1-swb", "sw-g5"],
};

function Box({ x, y, w, h, label, active = false }: { x: number; y: number; w: number; h: number; label: string; active?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={active ? "#dbeafe" : "#f8fafc"} stroke={active ? BLUE : GRAY} strokeWidth={1} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>
        {label}
      </text>
    </g>
  );
}

function DualRoot({ scene }: { scene: number }) {
  const lit = new Set(HIGHLIGHT[scene] ?? []);
  const litGpu = scene === 0 ? [0, 1] : [0, 5];
  return (
    <svg viewBox="0 0 480 270" className="h-auto w-full" role="img" aria-label={SCENES[scene]}>
      {DUAL_EDGES.map((e) => (
        <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={lit.has(e.id) ? BLUE : GRAY} strokeWidth={lit.has(e.id) ? 1.2 : 1} />
      ))}
      <Box {...CPU0} label="소켓 0" active={scene >= 1} />
      <Box {...CPU1} label="소켓 1" active={scene >= 1} />
      <text x={240} y={29} textAnchor="middle" fontSize={12} fill={TEXT}>소켓 사이</text>
      <Box {...SWA} label="스위치 A" active />
      <Box {...SWB} label="스위치 B" active={scene >= 1} />
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i} x={gpuX(i)} y={GPU_Y} w={32} h={28} label={`${i}`} active={litGpu.includes(i)} />
      ))}
      <text x={125} y={216} textAnchor="middle" fontSize={12} fill={TEXT}>카드 0~3 (가정)</text>
      <text x={355} y={216} textAnchor="middle" fontSize={12} fill={TEXT}>카드 4~7 (가정)</text>
      {scene === 2 && (
        <g>
          <rect x={20} y={60} width={92} height={22} rx={4} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
          <text x={66} y={75} textAnchor="middle" fontSize={12} fill="#92400e">호스트 메모리 경유</text>
          <line x1={66} y1={60} x2={90} y2={52} stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />
        </g>
      )}
      <text x={240} y={250} textAnchor="middle" fontSize={13} fill={BLUE} fontWeight={600}>
        {scene === 0 && "카드 0 → 스위치 A → 카드 1"}
        {scene === 1 && "카드 0 → A → 소켓 0 → 소켓 1 → B → 카드 5"}
        {scene === 2 && "카드 0 → 메모리에 복사 → 다시 카드 5로"}
      </text>
    </svg>
  );
}

function NicSwitch() {
  const groups = [0, 1, 2, 3];
  const gx = (g: number) => 14 + g * 116;
  return (
    <svg viewBox="0 0 480 270" className="h-auto w-full" role="img" aria-label={SCENES[3]}>
      <line x1={210} y1={35} x2={270} y2={35} stroke={GRAY} strokeWidth={1} />
      {groups.map((g) => (
        <line key={`c${g}`} x1={g < 2 ? 125 : 355} y1={52} x2={gx(g) + 50} y2={92} stroke={GRAY} strokeWidth={1} />
      ))}
      <Box {...CPU0} label="소켓 0" />
      <Box {...CPU1} label="소켓 1" />
      {groups.map((g) => (
        <g key={g}>
          <Box x={gx(g)} y={92} w={100} h={30} label={`NIC+스위치 ${g + 1}`} active />
          {[0, 1].map((k) => {
            const id = g * 2 + k;
            const x = gx(g) + 10 + k * 48;
            return (
              <g key={id}>
                <line x1={gx(g) + 50} y1={122} x2={x + 16} y2={GPU_Y} stroke={BLUE} strokeWidth={1} />
                <Box x={x} y={GPU_Y} w={32} h={28} label={`${id}`} />
              </g>
            );
          })}
          <line x1={gx(g) + 50} y1={92} x2={gx(g) + 50} y2={80} stroke={GRAY} strokeWidth={1} strokeDasharray="3 2" />
        </g>
      ))}
      <text x={240} y={222} textAnchor="middle" fontSize={13} fill={BLUE} fontWeight={600}>카드 둘 : NIC 하나 → 카드 8장에 NIC 4개</text>
      <text x={240} y={242} textAnchor="middle" fontSize={12} fill={TEXT}>점선: 묶음마다 노드 밖으로 나가는 NIC 포트</text>
      <text x={240} y={258} textAnchor="middle" fontSize={12} fill={TEXT}>묶음 사이 길(예: 카드 1 → 카드 2)은 소켓을 지납니다</text>
    </svg>
  );
}

function OutsideNode() {
  const node = (x: number, label: string) => (
    <g>
      <rect x={x} y={30} width={150} height={120} rx={6} fill="#f8fafc" stroke={GRAY} strokeWidth={1} />
      <text x={x + 75} y={50} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={600}>{label}</text>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={x + 12 + (i % 4) * 33} y={64 + Math.floor(i / 4) * 30} width={26} height={22} rx={3} fill="#e2e8f0" stroke={GRAY} strokeWidth={1} />
      ))}
      <text x={x + 75} y={140} textAnchor="middle" fontSize={12} fill={TEXT}>모델 한 벌 전부</text>
    </g>
  );
  return (
    <svg viewBox="0 0 480 270" className="h-auto w-full" role="img" aria-label={SCENES[4]}>
      {node(20, "노드 1")}
      {node(310, "노드 2")}
      <rect x={190} y={8} width={100} height={26} rx={4} fill="#f8fafc" stroke={GRAY} strokeWidth={1} />
      <text x={240} y={25} textAnchor="middle" fontSize={12} fill="#0f172a" fontWeight={600}>요청 분배기</text>
      <line x1={190} y1={21} x2={170} y2={40} stroke={GRAY} strokeWidth={1} />
      <line x1={290} y1={21} x2={310} y2={40} stroke={GRAY} strokeWidth={1} />
      <line x1={170} y1={176} x2={310} y2={176} stroke={GRAY} strokeWidth={1} />
      <line x1={95} y1={150} x2={95} y2={176} stroke={GRAY} strokeWidth={1} />
      <line x1={385} y1={150} x2={385} y2={176} stroke={GRAY} strokeWidth={1} />
      <line x1={95} y1={176} x2={170} y2={176} stroke={GRAY} strokeWidth={1} />
      <text x={240} y={170} textAnchor="middle" fontSize={12} fill={TEXT}>서비스망: 요청과 응답 글자만</text>
      <line x1={95} y1={210} x2={385} y2={210} stroke={BLUE} strokeWidth={1.2} strokeDasharray="5 3" />
      <line x1={95} y1={150} x2={95} y2={210} stroke={BLUE} strokeWidth={1} strokeDasharray="5 3" />
      <line x1={385} y1={150} x2={385} y2={210} stroke={BLUE} strokeWidth={1} strokeDasharray="5 3" />
      <text x={240} y={204} textAnchor="middle" fontSize={12} fill={BLUE} fontWeight={600}>RDMA 망: 앞 단계가 만든 기억(KV)을 넘길 때만</text>
      <text x={240} y={240} textAnchor="middle" fontSize={13} fill={BLUE} fontWeight={600}>복제본으로 늘리면 노드 사이 카드 통신은 0</text>
    </svg>
  );
}

export default function NodeTopologyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  return (
    <VizFrame
      eyebrow="카드 사이의 길"
      title="같은 카드 여덟 장이라도 데이터가 지나는 길의 길이가 다릅니다"
      description="파란 선이 지금 장면의 데이터가 지나는 길입니다. 상자는 소켓, 스위치, 카드(번호)입니다."
      note="스위치마다 카드 넷을 붙인 배치는 설명용 가정입니다. 실제 배치는 섀시와 슬롯마다 다르므로 7절의 명령으로 확인합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="PCIe 전용 8카드 노드의 카드 간 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
        <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div className="w-full min-w-0">
          <StableSceneStack
            active={scene}
            scenes={SCENES.map((_, index) =>
              index <= 2 ? <DualRoot key={index} scene={index} /> : index === 3 ? <NicSwitch key={index} /> : <OutsideNode key={index} />,
            )}
          />
        </div>
        <StableSceneStack
          active={scene}
          scenes={NOTES.map((note) => (
            <p key={note} className="border-l border-primary/50 pl-4 text-sm leading-6 lg:leading-7 text-muted-foreground">
              {note}
            </p>
          ))}
        />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
