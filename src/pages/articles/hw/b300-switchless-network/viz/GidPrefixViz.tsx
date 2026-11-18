import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #nccl "patch의 기본 prefix는 /16 … 반드시 /30을 명시" 문단과 #addressing의 주소 규칙.
 * 노드 3↔7: o2 = 100+10·3+7 = 137 → link 1 = 10.137.1.0/30, link 2 = 10.137.2.0/30, 노드 3은 .1, 노드 7은 .2.
 * remote GID가 10.137.2.2(노드 7, link 2)일 때 /16은 10.137만 비교 → 노드 3의 두 주소가 모두 후보.
 * /30은 10.137.2.0 블록까지 비교 → 10.137.2.1 하나만 후보.
 */
type Ip = readonly [number, number, number, number];

const REMOTE: Ip = [10, 137, 2, 2];
const LOCALS: readonly { ip: Ip; name: string }[] = [
  { ip: [10, 137, 1, 1], name: "노드 3 · link 1" },
  { ip: [10, 137, 2, 1], name: "노드 3 · link 2" },
];

const net30 = (ip: Ip) => `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3] - (ip[3] % 4)}`;
const net16 = (ip: Ip) => `${ip[0]}.${ip[1]}`;
const matches = (ip: Ip, prefix: 16 | 30) => (prefix === 16 ? net16(ip) === net16(REMOTE) : net30(ip) === net30(REMOTE));

const SCENES = [
  {
    label: "케이블 하나에 /30 두 개",
    summary: "10.137.1.0/30 · 10.137.2.0/30",
    note: "노드 3↔7은 a=3, b=7이라 둘째 칸이 100+30+7=137입니다. 셋째 칸의 link 번호 1·2가 두 논리 링크를 가릅니다. /30은 주소 네 개(network·두 끝·broadcast)짜리 묶음이고, 노드 3이 .1, 노드 7이 .2를 씁니다.",
  },
  {
    label: "patch 기본값 /16으로 비교하면",
    summary: "앞 두 칸만 비교 → 후보 2개",
    note: "상대(노드 7 link 2)의 GID에서 꺼낸 IPv4가 10.137.2.2라고 합시다. /16은 앞 두 칸 10.137만 비교하므로 노드 3의 두 주소가 모두 후보입니다. patch는 table을 돌며 첫 후보를 쓰므로, 순서상 link 1 주소가 먼저라면(가정) 상대와 다른 subnet을 골라 QP 생성이 실패할 수 있습니다.",
  },
  {
    label: "/30을 명시하면",
    summary: "넷째 칸의 4개 묶음까지 비교 → 후보 1개",
    note: "/30은 셋째 칸 전체와 넷째 칸을 4개씩 묶은 블록까지 비교합니다. 10.137.2.2의 블록은 10.137.2.0이고 10.137.1.1의 블록은 10.137.1.0이라 갈라집니다. 후보가 같은 논리 링크의 주소 하나로 좁혀져 첫 후보 규칙이 의도한 경로를 고릅니다.",
  },
] as const;

function OctetRow({ ip, label, prefix, tone }: { ip: Ip; label: string; prefix: 16 | 30; tone: "remote" | "hit" | "miss" }) {
  const border = tone === "remote" ? "#2563eb" : tone === "hit" ? "#0f766e" : "#94a3b8";
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <span className={`text-xs ${tone === "miss" ? "text-muted-foreground" : "font-semibold"}`}>{label}</span>
      <div className="grid min-w-0 grid-cols-4 gap-1">
        {ip.map((octet, index) => {
          const covered = prefix === 16 ? (index < 2 ? 1 : 0) : index < 3 ? 1 : 0.75;
          return (
            <div key={index} className="relative h-8 min-w-0 overflow-hidden rounded-md border bg-background" style={{ borderColor: border }}>
              <div className="absolute inset-y-0 left-0" style={{ width: `${covered * 100}%`, backgroundColor: `${border}22` }} />
              <span className="relative flex h-full items-center justify-center font-mono text-sm font-semibold">{octet}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompareScene({ prefix }: { prefix: 16 | 30 }) {
  const hits = LOCALS.filter((local) => matches(local.ip, prefix));
  return (
    <div className="space-y-2">
      <OctetRow ip={REMOTE} label="상대 GID의 IPv4" prefix={prefix} tone="remote" />
      <p className="pl-[7rem] text-[11px] text-muted-foreground sm:pl-[8.5rem]">
        비교 대상 = {prefix === 16 ? `${net16(REMOTE)}.*.*` : `${net30(REMOTE)}/30 블록 (.0~.3)`}
      </p>
      {LOCALS.map((local) => {
        const hit = matches(local.ip, prefix);
        return (
          <div key={local.name}>
            <OctetRow ip={local.ip} label={`${local.name} ${hit ? "✓" : "✗"}`} prefix={prefix} tone={hit ? "hit" : "miss"} />
          </div>
        );
      })}
      <div
        className={`mt-2 rounded-lg border px-3 py-2 text-sm ${
          hits.length > 1 ? "border-red-500/50 bg-red-500/5 text-red-700 dark:text-red-400" : "border-emerald-600/50 bg-emerald-600/5 text-emerald-800 dark:text-emerald-300"
        }`}
      >
        후보 {hits.length}개 → {hits.length > 1 ? "첫 후보가 link 1이면 상대와 다른 subnet" : `${hits[0]?.name ?? ""}만 남음`}
      </div>
    </div>
  );
}

function BlockScene() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[1, 2].map((link) => (
        <div key={link} className="min-w-0 rounded-lg border border-border bg-background p-3">
          <p className="text-xs font-semibold" style={{ color: link === 1 ? "#2563eb" : "#0f766e" }}>
            논리 link {link} · 10.137.{link}.0/30
          </p>
          <div className="mt-2 grid grid-cols-4 gap-1 text-center">
            {[
              { host: 0, role: "network" },
              { host: 1, role: "노드 3" },
              { host: 2, role: "노드 7" },
              { host: 3, role: "broadcast" },
            ].map((cell) => {
              const end = cell.host === 1 || cell.host === 2;
              return (
                <div key={cell.host} className={`min-w-0 rounded-md border px-0.5 py-1.5 ${end ? "border-border" : "border-dashed border-border/60"}`}>
                  <span className="block font-mono text-sm font-semibold">.{cell.host}</span>
                  <span className={`block truncate text-[10px] ${end ? "" : "text-muted-foreground"}`}>{cell.role}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground sm:col-span-2">둘째 칸 137 = 100 + 10×3 + 7 · 셋째 칸 = link 번호</p>
    </div>
  );
}

export default function GidPrefixViz() {
  return (
    <SceneShell
      eyebrow="prefix 길이"
      title="/16은 노드 3↔7의 두 논리 링크를 가르지 못합니다"
      description="칸 하나가 IPv4 주소의 한 자리(octet)입니다. 색칠한 부분이 prefix가 비교하는 범위입니다. GID는 RDMA가 쓰는 주소이고, 여기서는 그 안에 든 IPv4만 비교합니다."
      ariaLabel="노드 3과 7 사이 두 /30 논리 링크에서 /16과 /30 prefix로 local GID 후보를 고를 때의 차이"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={[<BlockScene key="block" />, <CompareScene key="p16" prefix={16} />, <CompareScene key="p30" prefix={30} />]} />
      )}
    />
  );
}
