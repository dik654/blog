import SceneShell from "./SceneShell";

/**
 * 본문 대응: #upgrade-skew — kube-apiserver 를 기준으로 허용 범위가 함께 움직인다.
 * controller-manager·scheduler: −1~0, kubelet·kube-proxy: −3~0, kubectl: −1~+1.
 * detectTooOldKubelets: 새 minor > kubelet minor + 3 이면 오류. 2단계 도약: 정식 릴리스 Mandatory, CI 버전 Skippable.
 * 시작 위치 (kubelet N−3, kube-proxy N−2 등)는 그림용 가정이다.
 */
interface SkewScene {
  label: string;
  summary: string;
  note: string;
  api: number;
  target: number | null;
  rejected: boolean;
  cm: number;
  kubelet: number;
  proxy: number;
  bad: boolean;
}

const SCENES: readonly SkewScene[] = [
  { label: "허용 범위는 apiserver 를 따라갑니다", summary: "apiserver N 기준", api: 0, target: null, rejected: false, cm: 0, kubelet: -3, proxy: -2, bad: false, note: "kubelet 은 N−3까지 뒤처져도 되지만 N보다 새로울 수는 없습니다. 점의 시작 위치는 규칙을 보이려는 가정입니다." },
  { label: "두 단계를 한 번에 뛰면", summary: "N → N+2 · 거부", api: 0, target: 2, rejected: true, cm: 0, kubelet: -3, proxy: -2, bad: false, note: "kubeadm(이 규칙을 집행하는 도구)은 한 번에 minor 1단계만 올립니다. 정식 릴리스면 Mandatory 오류, CI 버전이면 강제 실행(-f)으로 넘길 수 있는 Skippable 오류입니다." },
  { label: "N+1 도 아직 막힙니다", summary: "N+1 > (N−3) + 3 · 오류", api: 0, target: 1, rejected: true, cm: 0, kubelet: -3, proxy: -2, bad: true, note: "점선이 N+1일 때의 허용 범위입니다. N−3 kubelet 은 그 밖이라 kubeadm 의 kubelet 검사(detectTooOldKubelets)가 오류를 돌려줍니다." },
  { label: "그 노드부터 올립니다", summary: "kubelet N−3 → N−2", api: 0, target: 1, rejected: false, cm: 0, kubelet: -2, proxy: -2, bad: false, note: "노드를 drain(Pod 를 비움)한 뒤 kubelet 을 올립니다. 이제 N+1 > (N−2) + 3이 거짓이라 점선 범위 안에 듭니다." },
  { label: "1. kube-apiserver", summary: "N → N+1", api: 1, target: null, rejected: false, cm: 0, kubelet: -2, proxy: -2, bad: false, note: "허용 범위가 한 칸 오른쪽으로 옮겨 갑니다. HA cluster 의 apiserver 들은 서로 minor 1단계 안에 있어야 합니다." },
  { label: "2. controller-manager·scheduler", summary: "N → N+1", api: 1, target: null, rejected: false, cm: 1, kubelet: -2, proxy: -2, bad: false, note: "apiserver 가 먼저 올라갔기 때문에 이들은 apiserver 보다 새롭지 않습니다." },
  { label: "3. drain 뒤 kubelet, 4. kube-proxy", summary: "각각 N−2 → N−1", api: 1, target: null, rejected: false, cm: 1, kubelet: -1, proxy: -1, bad: false, note: "kubelet 은 제자리에서 minor 를 올릴 수 없어 노드를 비운 뒤 올리고, kube-proxy 가 마지막입니다. 이렇게 한 단계씩 되풀이합니다." },
];

const ROWS = [
  { key: "api", name: "kube-apiserver", low: 0, high: 0 },
  { key: "cm", name: "controller·scheduler", low: -1, high: 0 },
  { key: "kubelet", name: "kubelet", low: -3, high: 0 },
  { key: "proxy", name: "kube-proxy", low: -3, high: 0 },
  { key: "kubectl", name: "kubectl", low: -1, high: 1 },
] as const;

const COLS = [-3, -2, -1, 0, 1, 2];
const COL_NAMES = ["N−3", "N−2", "N−1", "N", "N+1", "N+2"];
const X0 = 106;
const CW = 41;
const Y0 = 28;
const RH = 32;
const BLUE = "#2563eb";
const RED = "#dc2626";
const colX = (version: number) => X0 + (version + 3) * CW;

export default function VersionSkewViz() {
  return (
    <SceneShell
      eyebrow="version skew"
      title="허용 범위는 kube-apiserver 를 따라 움직입니다"
      description="가로는 minor 버전(1.36·1.37의 가운데 숫자)이고 N은 업그레이드를 시작할 때의 kube-apiserver입니다. 칠한 칸이 지금의 허용 범위, 점이 현재 버전, 점선 원이 올리려는 목표이고 ✕는 거부입니다."
      ariaLabel="구성 요소별 허용 버전 범위와 업그레이드 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const current = (key: string) => (key === "api" ? scene.api : key === "cm" ? scene.cm : key === "kubelet" ? scene.kubelet : key === "proxy" ? scene.proxy : 0);
        const nextBand = scene.target === 1;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {COLS.map((version, index) => (
              <text key={version} x={colX(version) + CW / 2} y={18} textAnchor="middle" fontSize={10.5} fontWeight={version === scene.api ? 700 : 400} fill={version === scene.api ? BLUE : "#64748b"}>{COL_NAMES[index]}</text>
            ))}
            {ROWS.map((row, rowIndex) => {
              const y = Y0 + rowIndex * RH;
              const version = current(row.key);
              const bad = row.key === "kubelet" && scene.bad;
              const bandX = colX(scene.api + row.low);
              const bandW = (row.high - row.low + 1) * CW;
              return (
                <g key={row.key}>
                  <text x={4} y={y + 17} fontSize={10} fontWeight={700} className="fill-foreground">{row.name}</text>
                  <line x1={X0} x2={X0 + CW * 6} y1={y + 28} y2={y + 28} stroke="#94a3b8" strokeWidth={0.5} />
                  <rect x={bandX + 1} y={y + 2} width={bandW - 2} height={22} rx={4} fill={BLUE} fillOpacity={0.2} />
                  {nextBand && <rect x={colX(1 + row.low) + 1} y={y + 2} width={bandW - 2} height={22} rx={4} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="3 2" />}
                  <circle cx={colX(version) + CW / 2} cy={y + 13} r={6} fill={bad ? RED : BLUE} />
                  {bad && <text x={colX(version) + CW / 2} y={y + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">!</text>}
                </g>
              );
            })}
            {scene.target !== null && (
              <g>
                <circle cx={colX(scene.target) + CW / 2} cy={Y0 + 13} r={9} fill="none" stroke={scene.rejected ? RED : BLUE} strokeWidth={1.25} strokeDasharray="2 2" />
                {scene.rejected && <text x={colX(scene.target) + CW / 2} y={Y0 + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>✕</text>}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
