import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bia-rpo-rto 둘째 문단 "매체 수를 세는 3-2-1 표어만으로는 region·credential·operator mistake가
 * 공유되는지 알 수 없습니다 … 별도 failure domain과 immutability policy를 확인해야 합니다."
 * 세 칸의 매체·위치·account 배치는 설명용 가정입니다.
 */
type Status = "ok" | "lost" | "kept";

type Copy = { name: string; media: string; place: string };

const COPIES: readonly Copy[] = [
  { name: "운영 원본", media: "운영 disk", place: "운영 위치" },
  { name: "사본 1", media: "다른 매체", place: "운영 위치" },
  { name: "사본 2", media: "다른 매체", place: "다른 위치" },
];

type Scene = {
  label: string;
  summary: string;
  note: string;
  accounts: readonly [string, string, string];
  status: readonly [Status, Status, Status];
  lock: boolean;
  event: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "3-2-1은 개수를 센다",
    summary: "사본 3 · 매체 2 · 원격 1 충족",
    note: "3-2-1은 데이터를 세 벌 두고, 두 종류 매체에 나누고, 한 벌은 다른 장소에 두라는 표어입니다. 그림은 세 조건을 모두 채웁니다. 하지만 세 벌이 같은 region·credential·operator를 공유하는지는 이 개수로 알 수 없습니다.",
    accounts: ["?", "?", "?"],
    status: ["ok", "ok", "ok"],
    lock: false,
    event: "아직 사고 없음",
  },
  {
    label: "같은 credential을 공유하면",
    summary: "account 삭제 한 번에 세 벌 모두",
    note: "세 벌이 모두 운영 account의 권한으로 지워질 수 있다고 가정합니다. 운영 account 삭제나 operator 실수 한 번이 개수와 무관하게 세 벌을 함께 지웁니다. 장소가 달라도 같은 credential이면 같은 failure domain입니다.",
    accounts: ["운영 account", "운영 account", "운영 account"],
    status: ["lost", "lost", "lost"],
    lock: false,
    event: "운영 account 삭제",
  },
  {
    label: "별도 failure domain",
    summary: "운영 삭제가 backup account에 닿지 않음",
    note: "사본 2를 운영과 credential을 공유하지 않는 별도 backup account에 둡니다. 운영 account 삭제는 운영 쪽 두 벌만 지우고, backup account의 사본은 남습니다.",
    accounts: ["운영 account", "운영 account", "backup account"],
    status: ["lost", "lost", "kept"],
    lock: false,
    event: "운영 account 삭제",
  },
  {
    label: "Immutability policy",
    summary: "retention 변경 요청 거부",
    note: "Ransomware가 backup의 보존 기간(retention)을 바꾸려 해도 immutability policy가 변경을 막아야 합니다. 이 두 성질, 곧 별도 failure domain과 immutability를 실제로 확인하는 것이 사본 개수를 세는 것보다 먼저입니다.",
    accounts: ["운영 account", "운영 account", "backup account"],
    status: ["lost", "lost", "kept"],
    lock: true,
    event: "운영 account 삭제에 이어 ransomware가 backup retention 변경 시도",
  },
];

const TONE: Record<Status, { box: string; text: string; word: string }> = {
  ok: { box: "border-border", text: "text-muted-foreground", word: "보존" },
  lost: { box: "border-dashed border-[#dc2626]", text: "text-[#b91c1c] dark:text-[#f87171]", word: "삭제됨" },
  kept: { box: "border-[#2563eb]", text: "text-[#1d4ed8] dark:text-[#60a5fa]", word: "남음" },
};

export default function FailureDomainViz() {
  return (
    <SceneShell
      eyebrow="사본 개수와 failure domain"
      title="사본이 세 벌이어도 같은 권한 아래 있으면 한 번에 사라질 수 있습니다"
      description="Failure domain은 사고나 실수 한 번에 함께 망가지는 범위입니다. 칸 하나가 데이터 한 벌이고, 아래 줄은 사본 개수 기준(3-2-1)의 점검 결과입니다. 매체·위치·account 배치는 설명용 가정이며, 위의 띠는 그 장면에서 일어난 사건입니다."
      ariaLabel="3-2-1 사본 개수와 공유 credential, 별도 backup account, immutability policy 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
              <span className="font-bold text-muted-foreground">사건 · </span>
              <span className="font-semibold">{scene.event}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {COPIES.map((copy, index) => {
                const status = scene.status[index];
                const tone = TONE[status];
                const account = scene.accounts[index];
                const locked = scene.lock && index === 2;
                return (
                  <div key={copy.name} className={`min-w-0 rounded-lg border bg-background px-3 py-2 ${tone.box}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-bold">{copy.name}</p>
                      <p className={`text-xs font-bold ${tone.text}`}>{tone.word}</p>
                    </div>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                      {copy.media} · {copy.place}
                    </p>
                    <p className="mt-1 text-[11px] leading-4">
                      <span className="text-muted-foreground">account </span>
                      <span className={account === "backup account" ? "font-bold text-[#1d4ed8] dark:text-[#60a5fa]" : ""}>{account}</span>
                    </p>
                    <p className={`mt-1 text-[11px] leading-4 ${locked ? "font-bold" : "text-muted-foreground"}`}>
                      retention {locked ? "변경 거부 (immutable)" : "−"}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">3-2-1 점검(배치만 셈 · 사고 결과와 무관하게 그대로)</p>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                {["사본 3벌", "매체 2종", "원격 1벌"].map((item) => (
                  <span key={item} className="rounded border border-border bg-background px-1 py-1">
                    {item} ✓
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
