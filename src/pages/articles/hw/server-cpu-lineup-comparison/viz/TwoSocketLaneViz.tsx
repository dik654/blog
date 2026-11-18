import SceneShell from "./SceneShell";

/**
 * 본문 대응: #product-tiers 둘째 문단 — EPYC 9005 1소켓 최대 128레인, 2소켓은 256이 아니라
 * xGMI 링크 수에 따라 외부 PCIe가 일반적으로 128(4링크) 또는 최대 160(3링크).
 * 176은 #overview의 같은 노드(GPU 8 × 16 + NIC 2 × 16 + NVMe 4 × 4).
 * 주황 몫은 256에서 외부 PCIe를 뺀 계산이다(256 − 128 = 128, 256 − 160 = 96).
 */
const FULL = 256;
const NEED = 176;

const SCENES = [
  {
    label: "1소켓",
    summary: "128 < 176 → 48 부족",
    external: 128,
    link: 0,
    naive: false,
    note: "1소켓은 최대 128레인입니다. 이 글의 노드가 직접 연결에 요구하는 176레인(GPU 8 × 16 + NIC 2 × 16 + NVMe 4 × 4)에 48레인이 모자랍니다.",
  },
  {
    label: "2소켓을 단순히 더하면",
    summary: "2 × 128 = 256 ? (틀린 셈)",
    external: 256,
    link: 0,
    naive: true,
    note: "소켓이 둘이니 256레인이 장치에 남을 것처럼 보입니다. 그러나 CPU 둘을 서로 잇는 링크(xGMI)가 장치용 PCIe와 같은 물리 링크를 쓰므로 이 셈은 성립하지 않습니다.",
  },
  {
    label: "일반적인 4링크 구성",
    summary: "외부 128 → 48 부족",
    external: 128,
    link: 128,
    naive: false,
    note: "공식 문서의 일반적인 4링크 구성은 시스템 전체에 외부 PCIe 128레인을 남깁니다. 나머지 몫(256 − 128, 계산)은 CPU끼리 연결에 쓰여 1소켓과 같은 48레인이 모자랍니다.",
  },
  {
    label: "3링크 구성",
    summary: "외부 최대 160 → 16 부족",
    external: 160,
    link: 96,
    naive: false,
    note: "3링크 구성은 외부 PCIe를 최대 160레인 남깁니다(연결 몫 96, 계산). 그래도 176에 16레인이 모자라, 이 수치로는 소켓만 늘려 176레인을 직접 연결하지 못합니다(계산).",
  },
] as const;

const EXT = "#2563eb";
const LINK = "#d97706";
const NAIVE = "#94a3b8";
const pct = (lanes: number) => `${(lanes / FULL) * 100}%`;

export default function TwoSocketLaneViz() {
  return (
    <SceneShell
      eyebrow="2소켓의 레인 예산"
      title="소켓을 둘로 늘려도 장치 레인은 두 배가 되지 않습니다"
      description="막대 전체 폭이 256레인(2 × 128)입니다. 파랑은 GPU·NIC·NVMe가 쓸 수 있는 외부 PCIe, 주황은 CPU 두 개를 서로 잇는 링크(xGMI)에 쓰이는 몫, 세로 점선은 이 글의 노드가 직접 연결에 요구하는 176레인입니다."
      note="EPYC 9005 공식 아키텍처 문서(2026-11-02 확인)의 수치를 그대로 쓰고, 주황 몫은 256에서 외부 PCIe를 뺀 계산입니다. 관리 포트·온보드 장치가 쓰는 레인은 넣지 않았습니다."
      ariaLabel="1소켓과 2소켓 구성에서 외부 PCIe 레인과 176레인 요구 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const short = NEED - scene.external;
        return (
          <div className="min-w-0" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <div className="relative h-24 min-w-0">
              <div className="absolute inset-x-0 top-6 h-10 rounded-sm border border-dashed border-border" />
              <div
                className="absolute left-0 top-6 h-10 rounded-l-sm border"
                style={{
                  width: pct(scene.external),
                  backgroundColor: scene.naive ? "#e2e8f0" : "#dbeafe",
                  borderColor: scene.naive ? NAIVE : EXT,
                  borderStyle: scene.naive ? "dashed" : "solid",
                }}
              />
              {scene.link > 0 && (
                <div
                  className="absolute top-6 h-10 rounded-r-sm border"
                  style={{ left: pct(scene.external), width: pct(scene.link), backgroundColor: "#fef3c7", borderColor: LINK }}
                />
              )}
              <div className="absolute top-[1.125rem] h-[3.125rem] border-l border-dashed" style={{ left: pct(NEED), borderColor: "#dc2626" }} />
              <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-red-700 dark:text-red-400" style={{ left: pct(NEED) }}>
                필요 176
              </span>
              <span className="absolute left-0 top-[4.25rem] text-[11px] text-muted-foreground">0</span>
              <span className="absolute right-0 top-[4.25rem] text-[11px] text-muted-foreground">256</span>
            </div>
            <dl className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 text-xs sm:text-sm">
              <dt className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 shrink-0 rounded-sm border" style={{ borderColor: scene.naive ? NAIVE : EXT, backgroundColor: scene.naive ? "#e2e8f0" : "#dbeafe" }} />
                {scene.naive ? "외부 PCIe로 보이는 양(단순 합산)" : "외부 PCIe(장치용)"}
              </dt>
              <dd className="text-right font-mono font-bold">{scene.external}</dd>
              <dt className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 shrink-0 rounded-sm border" style={{ borderColor: LINK, backgroundColor: "#fef3c7" }} />
                CPU끼리 연결(xGMI) 몫
              </dt>
              <dd className="text-right font-mono font-bold">{scene.naive ? "?" : scene.link === 0 ? "없음" : scene.link}</dd>
              <dt className="font-semibold">176레인 직접 연결까지</dt>
              <dd className={`text-right font-bold ${scene.naive ? "text-muted-foreground" : "font-mono text-red-700 dark:text-red-400"}`}>
                {scene.naive ? "성립 안 함" : `${short} 부족`}
              </dd>
            </dl>
          </div>
        );
      }}
    />
  );
}
