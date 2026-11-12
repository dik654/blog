import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reclaim-protection — PVC를 지운 뒤의 갈래.
 * 수동 PV는 reclaimPolicy 비우면 Retain(defaults.go 328~330) → Released, 디스크 남음.
 * 동적 PV는 클래스에 적지 않으면 Delete → Released → reclaimVolume → DeleteVolume.
 * Pod가 쓰는 PVC는 pvc-protection finalizer로 Terminating. StatefulSet은 retention 기본값 Retain.
 */
interface Card {
  title: string;
  lines: readonly string[];
  tone: "keep" | "gone" | "wait" | "plain";
}

interface Scene {
  label: string;
  summary: string;
  cards: readonly [Card, Card, Card];
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "수동 PV",
    summary: "기본 Retain → Released",
    cards: [
      { title: "PVC 삭제 전", lines: ["PVC Bound", "PV Bound", "디스크 있음"], tone: "plain" },
      { title: "PVC 삭제", lines: ["PV Released", "reclaimPolicy 비움 → Retain", "디스크 남음"], tone: "keep" },
      { title: "그 뒤", lines: ["이전 데이터가 남아", "다른 PVC가 이 PV를", "받을 수 없음"], tone: "wait" },
    ],
    note: "관리자가 직접 만든 PV는 reclaimPolicy를 비우면 Retain입니다(core/v1 defaults.go 328~330행). PVC를 지우면 PV가 Released로 남고 디스크도 그대로입니다.",
  },
  {
    label: "Released 정리",
    summary: "운영자가 따로 해야 함",
    cards: [
      { title: "PV 객체 삭제", lines: ["PV 없음", "백엔드 디스크는 남음"], tone: "keep" },
      { title: "데이터 정리", lines: ["디스크 위 데이터를", "운영자가 정리"], tone: "plain" },
      { title: "마무리", lines: ["디스크 삭제", "또는 같은 디스크로", "새 PV 생성"], tone: "plain" },
    ],
    note: "Released PV는 저절로 재사용되지 않습니다. 문서가 적는 절차는 PV 객체 삭제 → 데이터 정리 → 디스크 삭제이거나, 같은 디스크를 가리키는 새 PV를 만드는 것입니다.",
  },
  {
    label: "동적 PV",
    summary: "기본 Delete → 디스크 삭제",
    cards: [
      { title: "PVC 삭제 전", lines: ["PVC Bound", "PV Bound", "디스크 있음"], tone: "plain" },
      { title: "PVC 삭제", lines: ["PV Released", "클래스에 적지 않음 → Delete", "reclaimVolume 호출"], tone: "plain" },
      { title: "deleteVolumeOperation", lines: ["CSI DeleteVolume", "디스크 삭제됨"], tone: "gone" },
    ],
    note: "동적으로 만든 PV는 클래스의 reclaimPolicy를 따르고, 클래스에 적지 않으면 Delete입니다. 그래서 동적 프로비저닝 환경에서 PVC를 지우면 대개 디스크도 사라집니다.",
  },
  {
    label: "사용 중 PVC",
    summary: "Terminating에서 대기",
    cards: [
      { title: "PVC 삭제 요청", lines: ["PVC Terminating", "finalizer pvc-protection", "Used By에 Pod 남음"], tone: "wait" },
      { title: "마지막 Pod 사라짐", lines: ["finalizer가 풀림"], tone: "plain" },
      { title: "PVC 실제 삭제", lines: ["그 뒤 PV는", "reclaimPolicy를 따름"], tone: "plain" },
    ],
    note: "Pod가 쓰고 있는 PVC는 지워도 kubernetes.io/pvc-protection 때문에 Terminating에 머물다 마지막 Pod가 사라져야 실제로 지워집니다. PVC가 묶인 PV도 pv-protection으로 같은 보호를 받습니다.",
  },
  {
    label: "StatefulSet",
    summary: "기본 whenDeleted·whenScaled: Retain",
    cards: [
      { title: "지우거나 줄임", lines: ["Pod는 사라짐", "PVC는 남음"], tone: "keep" },
      { title: "다시 늘림", lines: ["같은 이름의 PVC가", "같은 데이터로 붙음"], tone: "plain" },
      { title: "지우고 싶다면", lines: ["whenDeleted: Delete", "를 명시"], tone: "plain" },
    ],
    note: "volumeClaimTemplates로 만든 PVC는 persistentVolumeClaimRetentionPolicy 기본값이 whenDeleted: Retain, whenScaled: Retain이라 StatefulSet을 지우거나 줄여도 남습니다. 이 기능은 v1.32에서 stable이 됐습니다.",
  },
];

const TONE: Record<Card["tone"], string> = { keep: "#2563eb", gone: "#dc2626", wait: "#d97706", plain: "#94a3b8" };
const TAG: Record<Card["tone"], string | null> = { keep: "남음", gone: "지워짐", wait: "막힘", plain: null };

export default function ReclaimPathsViz() {
  return (
    <SceneShell
      eyebrow="PVC를 지운 뒤"
      title="PVC를 지운 뒤 디스크가 남는지는 PV를 만든 쪽과 보호 장치가 정합니다"
      description="칸 번호가 시간 순서입니다. 파란 테두리(남음)는 데이터가 남는 칸, 빨간 테두리(지워짐)는 디스크가 지워지는 칸, 주황 테두리(막힘)는 막혀 기다리는 칸, 회색 테두리는 그 사이의 보통 단계입니다."
      ariaLabel="정적 PV와 동적 PV의 reclaimPolicy 기본값, pvc-protection, StatefulSet retention에 따른 PVC 삭제 이후 경로"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <ol className="grid min-w-0 gap-2 sm:grid-cols-3">
            {s.cards.map((c, i) => (
              <li key={i} className="rounded-lg border px-3 py-2" style={{ borderColor: TONE[c.tone] }}>
                <p className="flex items-baseline justify-between gap-2 text-xs font-bold" style={{ color: TONE[c.tone] }}>
                  <span>{i + 1}. {c.title}</span>
                  {TAG[c.tone] && <span className="shrink-0 whitespace-nowrap">{TAG[c.tone]}</span>}
                </p>
                <ul className="mt-1 space-y-0.5 text-sm leading-5">
                  {c.lines.map((line) => (
                    <li key={line} className="break-words">{line}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        );
      }}
    />
  );
}
