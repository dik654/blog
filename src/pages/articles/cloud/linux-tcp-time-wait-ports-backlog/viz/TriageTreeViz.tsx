import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #triage — 첫 갈림길(클라이언트의 connect 오류 / 서버의 응답 지연)에서 명령과 장부로 내려가는 판단 경로.
 * 첫 장면은 갈래 둘을 나란히 보이고, 뒤 장면은 고른 갈래의 명령만 보인다.
 */
interface Step {
  command: string;
  reads: string;
}

const CLIENT: readonly Step[] = [
  { command: "ss -tan state time-wait", reads: "한 목적지에 28,000개 가까이 → 포트 풀 (3절)" },
  { command: "/proc/net/sockstat 의 tw", reads: "전체 수를 빠르게 셈" },
  { command: "nstat TcpExtTCPTimeWaitOverflow", reads: "늘고 있음 → tcp_max_tw_buckets에 닿음" },
];

const SERVER: readonly Step[] = [
  { command: "ss -lnt", reads: "LISTEN 줄: Recv-Q 지금 줄, Send-Q 상한" },
  { command: "nstat -az TcpExtListenOverflows TcpExtListenDrops TcpExtTCPReqQFullDoCookies", reads: "두 번 찍어 차이, 늘고 있음 → 9절의 대기열" },
];

const LOGS: readonly Step[] = [
  { command: "dmesg 'Possible SYN flooding'", reads: "SYN 대기열 (9절)" },
  { command: "dmesg 'nf_conntrack: table full'", reads: "conntrack table (11절)" },
];

const SCENES = [
  { label: "첫 갈림길", summary: "오류인가, 지연인가", note: "먼저 어느 쪽의 장부가 찼는지 가릅니다. 클라이언트에서 connect()가 오류로 끝나는지, 서버에서 응답이 늦는지가 첫 갈림길입니다." },
  { label: "클라이언트의 오류", summary: "EADDRNOTAVAIL → TIME_WAIT 분포", note: "EADDRNOTAVAIL이 보이면 TIME_WAIT 소켓의 목적지 분포부터 봅니다." },
  { label: "서버의 꼬리 지연", summary: "LISTEN 줄 → 누적 counter", note: "연결된 소켓 줄에서는 Recv-Q와 Send-Q의 뜻이 다르니 섞어 읽지 않습니다. nstat 값은 누적이라 두 번 찍어 차이를 봅니다." },
  { label: "함께 보는 dmesg", summary: "두 메시지가 가리키는 장부", note: "두 메시지가 있는지도 함께 봅니다." },
] as const;

function StepList({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step) => (
        <li key={step.command} className="min-w-0 border-l border-border pl-3">
          <code className="block break-words font-mono text-xs font-semibold leading-5">{step.command}</code>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{step.reads}</span>
        </li>
      ))}
    </ol>
  );
}

function Fork() {
  return (
    <div className="grid grid-cols-2 gap-2 text-center">
      <div className="min-w-0 rounded-lg border p-3" style={{ borderColor: "#2563eb" }}>
        <p className="text-sm font-bold">클라이언트</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">connect()에서 EADDRNOTAVAIL</p>
        <p className="mt-2 text-xs font-semibold">→ 포트 풀 쪽</p>
      </div>
      <div className="min-w-0 rounded-lg border p-3" style={{ borderColor: "#2563eb" }}>
        <p className="text-sm font-bold">서버</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">꼬리 지연이 늘어남</p>
        <p className="mt-2 text-xs font-semibold">→ 대기열 쪽</p>
      </div>
    </div>
  );
}

export default function TriageTreeViz() {
  return (
    <SceneShell
      eyebrow="어느 장부가 찼나"
      title="오류인지 지연인지에서 시작해 어느 장부가 찼는지 가립니다"
      description="첫 장면이 갈림길이고, 다음 장면부터 각 갈래에서 치는 명령과 읽는 값을 차례로 봅니다."
      ariaLabel="증상에서 포트 풀, accept 대기열, conntrack 장부로 내려가는 판단 경로"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="rounded-lg border border-border px-3 py-2 text-center text-sm font-semibold">
            connect()가 오류로 끝나는가, 서버 응답이 늦는가
          </div>
          <StableSceneStack
            active={active}
            scenes={[
              <Fork key="fork" />,
              <StepList key="client" steps={CLIENT} />,
              <StepList key="server" steps={SERVER} />,
              <StepList key="logs" steps={LOGS} />,
            ]}
          />
        </div>
      )}
    />
  );
}
