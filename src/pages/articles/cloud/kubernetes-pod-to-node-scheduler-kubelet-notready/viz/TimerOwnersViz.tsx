import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 숫자마다 주인이 다릅니다. kubelet(40·10), controller-manager(5·50·60), kube-apiserver(300).
 * 40 × 0.25 = 10, 30 + 15 = 45 < 50, 50 + 300 = 350. podEvictionTimeout 5분은 v1.37.1 controller 코드가 읽지 않습니다.
 */
const INK = "#64748b";
const ACCENT = "#2563eb";
const WARN = "#b45309";
const OFF = "#b91c1c";

const OWNERS = [
  { name: "kubelet", values: "Lease 40\u00a0s · 갱신 10\u00a0s" },
  { name: "controller-manager", values: "검사 5\u00a0s · grace 50\u00a0s · 신규 60\u00a0s" },
  { name: "kube-apiserver", values: "toleration 300\u00a0s" },
] as const;

const SCENES = [
  { label: "kubelet의 40과 10", summary: "40 × 0.25 = 10", note: "Lease에 적히는 유효 기간이 40초이고 갱신 간격은 여기에 0.25를 곱한 10초입니다. 10·20·30초의 갱신을 세 번 놓쳐도 Lease는 아직 유효합니다.", owner: [0], end: 60 },
  { label: "컨트롤러의 5와 50", summary: "30 + 15 = 45 < 50", note: "컨트롤러는 5초마다 노드를 훑고 마지막으로 심장박동을 본 시각 뒤 50초가 지나면 Ready를 Unknown으로 바꿉니다. 소스 주석은 HTTP/2 ping timeout 30초 + read idle 15초를 넘어야 느린 연결을 죽은 노드로 오판하지 않는다고 적습니다. 막 등록된 노드는 60초를 봐줍니다.", owner: [1], end: 60 },
  { label: "API server의 300", summary: "50 + 300 = 350", note: "300초는 kube-apiserver의 admission 플러그인 DefaultTolerationSeconds가 Pod를 만들 때 넣습니다. taint가 붙은 뒤 300초가 지나면 taint eviction 컨트롤러가 Pod 삭제를 요청합니다. 앞의 50초에 이어 붙으면 약 350초입니다.", owner: [2], end: 350 },
  { label: "쓰이지 않는 5분", summary: "podEvictionTimeout ✕", note: "kube-controller-manager 설정에 남은 podEvictionTimeout 5분은 v1.37.1 node lifecycle controller 코드 어디에서도 읽지 않습니다. 5분을 바꾸려면 --default-unreachable-toleration-seconds나 Pod 자신의 toleration을 바꿔야 합니다.", owner: [1, 2], end: 350 },
] as const;

const X0 = 14;
const X1 = 346;

function Axis({ end, children, marks }: { end: number; marks: readonly number[]; children: (x: (t: number) => number) => ReactNode }) {
  const x = (t: number) => X0 + (t / end) * (X1 - X0);
  return (
    <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`0초부터 ${end}초까지의 시간축`}>
      {children(x)}
      <line x1={X0} x2={X1} y1={122} y2={122} stroke="#94a3b8" strokeWidth={1} />
      {marks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={118} y2={126} stroke="#94a3b8" strokeWidth={1} />
          <text x={x(t)} y={142} textAnchor={t === 0 ? "start" : t === end ? "end" : "middle"} fontSize={11} fill={INK}>{t}{t === end ? " s" : ""}</text>
        </g>
      ))}
    </svg>
  );
}

function LeaseScene() {
  return (
    <Axis end={60} marks={[0, 10, 20, 30, 40, 50, 60]}>
      {(x) => (
        <>
          <rect x={x(0)} y={60} width={x(40) - x(0)} height={22} rx={3} fill={ACCENT} />
          <text x={x(20)} y={75} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">Lease 유효 40 s</text>
          {[10, 20, 30].map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={84} y2={118} stroke={WARN} strokeWidth={1} strokeDasharray="3 2" />
              <text x={x(t)} y={102} textAnchor="middle" fontSize={15} fontWeight={700} fill={WARN}>×</text>
            </g>
          ))}
          <text x={x(0)} y={46} fontSize={12} fontWeight={700} fill={WARN}>× 와야 할 갱신이 오지 않은 시각</text>
        </>
      )}
    </Axis>
  );
}

function GraceScene() {
  return (
    <Axis end={60} marks={[0, 30, 45, 50, 60]}>
      {(x) => (
        <>
          {Array.from({ length: 13 }, (_, i) => i * 5).map((t) => <line key={t} x1={x(t)} x2={x(t)} y1={100} y2={118} stroke="#64748b" strokeWidth={1} />)}
          <rect x={x(0)} y={68} width={x(30) - x(0)} height={22} fill="#64748b" />
          <text x={x(15)} y={83} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">ping timeout 30</text>
          <rect x={x(30)} y={68} width={x(45) - x(30)} height={22} fill="#94a3b8" />
          <text x={x(37.5)} y={83} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">read idle 15</text>
          <line x1={x(50)} x2={x(50)} y1={30} y2={118} stroke={ACCENT} strokeWidth={1.25} />
          <text x={x(50) - 4} y={42} textAnchor="end" fontSize={12} fontWeight={700} fill={ACCENT}>grace 50 → Unknown</text>
          <line x1={x(60)} x2={x(60)} y1={28} y2={118} stroke={INK} strokeWidth={1} strokeDasharray="3 2" />
          <text x={x(60)} y={22} textAnchor="end" fontSize={11} fill={INK}>신규 노드 60</text>
          <text x={x(0)} y={60} fontSize={11} fill={INK}>아래 눈금 = 5초마다 검사</text>
        </>
      )}
    </Axis>
  );
}

function TolerationScene({ retired }: { retired: boolean }) {
  return (
    <Axis end={350} marks={[0, 50, 350]}>
      {(x) => (
        <>
          <rect x={x(0)} y={84} width={x(50) - x(0)} height={22} fill="#64748b" />
          <text x={x(25)} y={99} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">50</text>
          <rect x={x(50)} y={84} width={x(350) - x(50)} height={22} fill={ACCENT} />
          <text x={x(200)} y={99} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">toleration 300 s</text>
          {retired && (
            <>
              <rect x={x(50)} y={40} width={x(350) - x(50)} height={22} fill="none" stroke={OFF} strokeWidth={1} strokeDasharray="4 3" />
              <text x={x(200)} y={55} textAnchor="middle" fontSize={11} fontWeight={700} fill={OFF}>podEvictionTimeout 5분 · 읽는 코드 없음</text>
            </>
          )}
        </>
      )}
    </Axis>
  );
}

export default function TimerOwnersViz() {
  return (
    <SceneShell
      eyebrow="v1.37.1 기본값"
      title="숫자마다 주인이 달라서 바꾸는 곳도 다릅니다"
      description="위 칸은 숫자를 정하는 곳, 아래 축은 그 숫자가 차지하는 시간입니다. 축의 단위는 초이고 앞 두 장면과 뒤 두 장면의 축 길이가 다릅니다."
      ariaLabel="kubelet, controller-manager, kube-apiserver가 각각 정한 시간 값"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-3 gap-2">
            {OWNERS.map((owner, index) => {
              const on = (SCENES[active].owner as readonly number[]).includes(index);
              return (
                <div key={owner.name} className={`min-w-0 rounded-lg border p-2 text-[11px] leading-4 ${on ? "border-primary bg-primary/10" : "border-border"}`}>
                  <p className={`break-words font-mono font-bold ${on ? "text-foreground" : "text-muted-foreground"}`}>{owner.name}</p>
                  <p className={`mt-1 break-keep ${on ? "text-foreground" : "text-muted-foreground"}`}>{owner.values}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-3">
            {active === 0 && <LeaseScene />}
            {active === 1 && <GraceScene />}
            {active >= 2 && <TolerationScene retired={active === 3} />}
          </div>
        </div>
      )}
    />
  );
}
