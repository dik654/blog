import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

type NodeId = "client" | "bootnode" | "candidates" | "transport";

type Transfer = {
  from: NodeId;
  to: NodeId;
  label: string;
};

const nodes: ReadonlyArray<{ id: NodeId; label: string; role: string }> = [
  {
    id: "client",
    label: "Alice · 새 실행 클라이언트",
    role: "알려진 bootnode 하나에서 탐색을 시작합니다.",
  },
  {
    id: "bootnode",
    label: "Bootnode",
    role: "Alice의 PONG을 확인한 뒤 가까운 노드 후보를 알려줍니다.",
  },
  {
    id: "candidates",
    label: "후보 목록",
    role: "검증한 identity·UDP/TCP endpoint·ENR을 모읍니다.",
  },
  {
    id: "transport",
    label: "RLPx 연결",
    role: "발견이 끝난 뒤 별도 프로토콜이 실제 세션을 엽니다.",
  },
];

const scenes: ReadonlyArray<{
  label: string;
  question: string;
  conclusion: string;
  active: readonly NodeId[];
  transfers: readonly Transfer[];
  distance?: string;
}> = [
  {
    label: "출발",
    question: "주소 하나만 아는 새 노드는 어디서 시작할까요?",
    conclusion:
      "설정에 든 bootnode endpoint는 첫 연락처일 뿐, 신뢰한 피어나 동기화 상대가 아닙니다.",
    active: ["client", "bootnode"],
    transfers: [],
  },
  {
    label: "상대 확인",
    question: "Alice는 bootnode가 UDP 응답을 받을 수 있는지 어떻게 확인할까요?",
    conclusion:
      "Alice의 PING에 bootnode가 요청 hash를 넣은 PONG을 돌려줍니다. 이 왕복은 bootnode의 endpoint만 확인합니다.",
    active: ["client", "bootnode"],
    transfers: [
      { from: "client", to: "bootnode", label: "PING · 만료 시각" },
      { from: "bootnode", to: "client", label: "PONG · 요청 hash" },
    ],
  },
  {
    label: "Alice 확인",
    question: "Bootnode는 Alice에게 큰 응답을 보내도 되는지 어떻게 확인할까요?",
    conclusion:
      "Bootnode도 Alice에게 PING을 보내고 Alice의 PONG을 기억해야 합니다. 이 반대 방향 증명이 FINDNODE 응답의 조건입니다.",
    active: ["client", "bootnode"],
    transfers: [
      { from: "bootnode", to: "client", label: "PING · Alice endpoint 확인" },
      { from: "client", to: "bootnode", label: "PONG · 요청 hash" },
    ],
  },
  {
    label: "후보 요청",
    question: "목표 ID에 가까운 다른 노드는 어떻게 물을까요?",
    conclusion:
      "Bootnode가 Alice의 최근 PONG을 기억할 때 FINDNODE에 답합니다. Target은 서버 주소가 아니라 찾을 node ID입니다.",
    active: ["client", "bootnode"],
    transfers: [
      { from: "client", to: "bootnode", label: "FINDNODE · target ID" },
    ],
  },
  {
    label: "후보 수신",
    question: "NEIGHBORS를 받으면 곧바로 연결해도 될까요?",
    conclusion:
      "여러 UDP datagram의 서명·만료·중복을 검사한 뒤 shortlist에 합칩니다. 아직 실제 transport 연결은 아닙니다.",
    active: ["client", "bootnode", "candidates"],
    transfers: [
      { from: "bootnode", to: "client", label: "NEIGHBORS · 최대 16개 후보" },
      { from: "client", to: "candidates", label: "검증 뒤 shortlist 병합" },
    ],
    distance: "목표까지 XOR 거리: d₀ > d₁ > d₂ · 더 가까운 미조회 후보를 다음에 선택",
  },
  {
    label: "기록 갱신",
    question: "더 높은 ENR sequence를 받으면 무엇을 확인해야 할까요?",
    conclusion:
      "ENRRESPONSE를 요청과 맞추고 record signature와 identity를 검증한 뒤 endpoint를 교체합니다.",
    active: ["client", "bootnode", "candidates"],
    transfers: [
      { from: "client", to: "candidates", label: "ENRREQUEST · 선택한 후보" },
      { from: "candidates", to: "client", label: "그 후보의 ENRRESPONSE" },
      { from: "client", to: "candidates", label: "검증한 record로 갱신" },
    ],
  },
  {
    label: "연결 인계",
    question: "탐색이 성공했다는 말은 블록을 받을 수 있다는 뜻일까요?",
    conclusion:
      "Discv4는 검증한 identity와 endpoint를 넘기고 끝납니다. RLPx와 ETH Status가 실제 연결과 체인 호환성을 따로 확인합니다.",
    active: ["client", "candidates", "transport"],
    transfers: [
      { from: "candidates", to: "transport", label: "검증한 endpoint 인계" },
    ],
  },
];

function TransferTrack({
  transfer,
  reducedMotion,
  order,
}: {
  transfer: Transfer;
  reducedMotion: boolean;
  order: number;
}) {
  const fromIndex = nodes.findIndex((node) => node.id === transfer.from);
  const toIndex = nodes.findIndex((node) => node.id === transfer.to);
  const forward = fromIndex <= toIndex;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(4rem,1fr)_minmax(5rem,1.5fr)_minmax(4rem,1fr)] items-center gap-2 text-[10px] sm:grid-cols-[minmax(5.5rem,1fr)_minmax(7rem,2fr)_minmax(5.5rem,1fr)] sm:text-[11px]">
      <span className="truncate text-right font-semibold text-foreground">
        {nodes[fromIndex].label}
      </span>
      <div className="min-w-0">
        <p className="mb-1 truncate text-center font-semibold text-muted-foreground">
          {transfer.label}
        </p>
        <div className="relative h-px bg-border">
          <motion.span
            aria-hidden="true"
            className="absolute -top-1 h-2 w-2 rounded-full bg-primary"
            initial={false}
            animate={{
              left: reducedMotion
                ? "calc(50% - 0.25rem)"
                : forward
                  ? ["0%", "calc(100% - 0.5rem)"]
                  : ["calc(100% - 0.5rem)", "0%"],
            }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 1.8,
                    delay: order * 1.25,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 2.8,
                  }
            }
          />
        </div>
      </div>
      <span className="truncate font-semibold text-foreground">
        {nodes[toIndex].label}
      </span>
    </div>
  );
}

export default function Discv4LookupViz() {
  const scene = useAnimatedScenes(scenes.length, 5200, {
    loop: true,
    autoPlay: false,
  });
  const current = scenes[scene.active];
  const vizRef = useRef<HTMLDivElement>(null);
  const setPlayingRef = useRef(scene.setPlaying);
  const userControlledRef = useRef(false);

  useEffect(() => {
    setPlayingRef.current = scene.setPlaying;
  }, [scene.setPlaying]);

  useEffect(() => {
    const element = vizRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setPlayingRef.current(false);
          return;
        }
        if (!userControlledRef.current && !scene.reducedMotion) {
          setPlayingRef.current(true);
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [scene.reducedMotion]);

  const setActiveFromControl = (value: number) => {
    userControlledRef.current = true;
    scene.setActive(value);
  };

  const setPlayingFromControl = (value: boolean) => {
    userControlledRef.current = true;
    scene.setPlaying(value);
  };

  const onKeyDownFromControl = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (["ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      userControlledRef.current = true;
    }
    scene.onKeyDown(event);
  };

  return (
    <VizFrame
      eyebrow="한 번의 노드 발견"
      title="발견한 endpoint가 실제 실행 피어가 되기까지"
      description="Alice가 bootnode 하나에서 시작해 후보 endpoint를 얻고, 별도 RLPx 연결 계층에 넘기는 경계를 따라갑니다."
      note="움직이는 점은 실제 packet 방향을 나타냅니다. Discv4 payload는 암호화되지 않으며, 후보 발견만으로 상대의 정직성이나 체인 호환성이 보장되지는 않습니다."
      canvasClassName="p-3 sm:p-5"
    >
      <div
        ref={vizRef}
        role="group"
        tabIndex={0}
        aria-label="Discv4 노드 발견 일곱 장면"
        onKeyDown={onKeyDownFromControl}
        className="flex min-h-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-[31rem] px-1 py-2 sm:min-h-[34rem]">
          <p className="text-sm font-bold leading-6 text-foreground">
            {current.question}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            {current.conclusion}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {nodes.map((node) => {
              const active = current.active.includes(node.id);
              return (
                <div
                  key={node.id}
                  data-active={active ? "true" : "false"}
                  className={`min-w-0 border-l-2 px-3 py-2.5 ${
                    active
                      ? "border-primary bg-primary/[0.055]"
                      : "border-border bg-background"
                  }`}
                >
                  <p className="text-xs font-bold leading-5">{node.label}</p>
                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">
                    {node.role}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-y border-border py-4">
            {current.transfers.length > 0 ? (
              <div className="space-y-4">
                {current.transfers.map((transfer, index) => (
                  <TransferTrack
                    key={`${transfer.from}-${transfer.to}-${transfer.label}`}
                    transfer={transfer}
                    reducedMotion={scene.reducedMotion}
                    order={index}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-xs leading-5 text-muted-foreground">
                아직 packet을 보내지 않습니다. 로컬 설정에서 첫 연락처만 읽은 상태입니다.
              </p>
            )}
          </div>
          {current.distance ? (
            <p className="mt-3 border-l-2 border-primary/50 pl-3 font-mono text-[10px] leading-5 text-foreground sm:text-xs">
              {current.distance}
            </p>
          ) : null}
        </div>

        <AnimatedSceneControls
          {...scene}
          setActive={setActiveFromControl}
          setPlaying={setPlayingFromControl}
          labels={scenes.map((item) => item.label)}
          playLabel="반복 재생"
        />
      </div>
    </VizFrame>
  );
}
