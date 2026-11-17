import SceneShell from "./SceneShell";

/**
 * 본문 대응: #normal-case 첫 문단 "같은 자리에 다른 요청을 이미 받지 않았는지를 검사합니다 … 잘못된 주 노드가 같은 순번에
 * 두 요청을 나눠 보내도 정상 복제본은 두 요청을 모두 지지하지 않습니다."
 * n=4, f=1, prepared = PRE-PREPARE + 서로 다른 백업의 PREPARE 2f=2개(글의 식). R0가 잘못된 주 노드이면 f=1이므로 백업 R1·R2·R3는 정상.
 * 어느 백업이 어느 값을 먼저 받았는지(R1=dA, R2·R3=dB)는 설명용 가정입니다.
 * 둘 다 prepared가 되려면 PREPARE 2+2=4개가 필요하지만 백업은 3대이고 한 자리에 하나씩만 보내므로 최대 3개입니다.
 */
type Scene = {
  label: string;
  summary: string;
  note: string;
  held: readonly [string, string, string];
  late: boolean;
  counted: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "같은 자리에 두 값",
    summary: "(0, 42)에 dA와 dB",
    note: "잘못된 주 노드 R0가 view 0·sequence 42라는 같은 자리에 R1에게는 요청 해시 dA를, R2·R3에게는 dB를 담은 PRE-PREPARE를 보냅니다(분배는 가정). f=1이므로 R0가 잘못된 복제본이면 세 백업은 모두 정상입니다.",
    held: ["?", "?", "?"],
    late: false,
    counted: false,
  },
  {
    label: "자리마다 하나만 승인",
    summary: "먼저 승인한 값만 유지",
    note: "백업은 서명·해시·view·순번 범위를 확인하고, 같은 자리에 이미 다른 요청을 받았는지 봅니다. R1이 나중에 같은 자리의 dB를 받더라도(가정) 42번 자리에 dA가 있으므로 승인하지 않습니다. 승인한 값에만 PREPARE를 보냅니다.",
    held: ["dA", "dB", "dB"],
    late: true,
    counted: false,
  },
  {
    label: "PREPARE 세기",
    summary: "dA 1개 · dB 2개, 기준 2f = 2",
    note: "dA에는 R1의 PREPARE 하나뿐이라 2f=2에 못 미칩니다. dB에는 R2·R3의 PREPARE 두 개가 있어, dB의 PRE-PREPARE를 가진 R2·R3에서 prepared가 될 수 있습니다.",
    held: ["dA", "dB", "dB"],
    late: false,
    counted: true,
  },
  {
    label: "둘 다는 불가능",
    summary: "필요 4개 > 백업 3대",
    note: "두 값이 모두 prepared가 되려면 서로 다른 백업의 PREPARE가 값마다 2개, 합쳐 4개 필요합니다. 정상 백업 3대는 한 자리에 PREPARE를 하나씩만 보내므로 많아야 3개입니다. 그래서 정상 복제본은 같은 순번의 두 요청을 모두 지지하지 않습니다.",
    held: ["dA", "dB", "dB"],
    late: false,
    counted: true,
  },
];

const BACKUP_Y = [40, 105, 170] as const;
const COLOR = { dA: "#2563eb", dB: "#d97706", idle: "#94a3b8" } as const;

function colorOf(value: string) {
  return value === "dA" ? COLOR.dA : value === "dB" ? COLOR.dB : COLOR.idle;
}

function CountRow({ name, votes, color, shown, need }: { name: string; votes: readonly string[]; color: string; shown: boolean; need: number }) {
  const ok = votes.length >= need;
  return (
    <div className="grid min-w-0 grid-cols-[2.5rem_repeat(3,minmax(0,1fr))_4.5rem] items-center gap-1.5 text-[11px]">
      <span className="font-mono font-bold" style={{ color }}>{name}</span>
      {[0, 1, 2].map((slot) => (
        <span
          key={slot}
          className={`rounded border px-1 py-1 text-center font-semibold ${shown && slot < votes.length ? "" : "border-dashed text-muted-foreground/60"}`}
          style={shown && slot < votes.length ? { borderColor: color } : undefined}
        >
          {shown && slot < votes.length ? votes[slot] : slot < need ? "필요" : "—"}
        </span>
      ))}
      <span className={`text-right font-bold ${shown ? (ok ? "text-foreground" : "text-[#b91c1c] dark:text-[#f87171]") : "text-muted-foreground/60"}`}>
        {shown ? `${votes.length}개 ${ok ? "≥" : "<"} 2` : "세기 전"}
      </span>
    </div>
  );
}

export default function EquivocationViz() {
  return (
    <SceneShell
      eyebrow="같은 순번의 두 제안 · n=4, f=1"
      title="주 노드가 한 자리에 두 요청을 나눠 보내도 둘 다 prepared가 되지는 않습니다"
      description="f는 잘못 동작할 수 있는 복제본의 최대 수이고, 4대이면 f = 1입니다. 왼쪽 R0가 잘못된 주 노드, 오른쪽 세 칸이 백업입니다. 파랑은 요청 해시 dA, 주황은 dB입니다. 아래 줄은 값마다 모인 PREPARE이며, prepared에는 PRE-PREPARE와 서로 다른 백업의 PREPARE 2f = 2개가 필요합니다."
      ariaLabel="잘못된 주 노드가 같은 sequence에 dA와 dB를 나눠 보낼 때 PREPARE 개수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const votesA = scene.held.flatMap((value, index) => (value === "dA" ? [`R${index + 1}`] : []));
        const votesB = scene.held.flatMap((value, index) => (value === "dB" ? [`R${index + 1}`] : []));
        const sent = ["dA", "dB", "dB"] as const;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={16} y={83} width={88} height={44} rx={8} fill="none" stroke="#dc2626" strokeWidth={1.25} />
              <text x={60} y={101} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b91c1c">R0</text>
              <text x={60} y={117} textAnchor="middle" fontSize={11} fill="#64748b">잘못된 주 노드</text>
              {BACKUP_Y.map((y, index) => {
                const value = sent[index];
                const held = scene.held[index];
                return (
                  <g key={y}>
                    <line x1={104} y1={105} x2={226} y2={y} stroke={colorOf(value)} strokeWidth={1.25} />
                    <polygon points={`${226},${y} ${218},${y - 4} ${219},${y + 5}`} fill={colorOf(value)} />
                    <text x={160} y={(105 + y) / 2 + (index === 1 ? -5 : index === 0 ? -6 : 14)} textAnchor="middle" fontSize={11} fontWeight={700} fill={colorOf(value)}>
                      {`PP(0,42,${value})`}
                    </text>
                    <rect x={228} y={y - 20} width={116} height={40} rx={8} fill="none" stroke={colorOf(held)} strokeWidth={held === "?" ? 1 : 1.25} />
                    <text x={240} y={y - 3} fontSize={11} fontWeight={700} fill="#475569">{`R${index + 1} · 백업`}</text>
                    <text x={240} y={y + 12} fontSize={11} fontWeight={700} fill={colorOf(held)}>
                      {held === "?" ? "검사 전" : `42번 = ${held} 승인`}
                    </text>
                  </g>
                );
              })}
              <g opacity={scene.late ? 1 : 0}>
                <line x1={60} y1={83} x2={226} y2={28} stroke={COLOR.dB} strokeWidth={1} strokeDasharray="4 3" />
                <text x={136} y={52} textAnchor="end" fontSize={11} fontWeight={700} fill="#b91c1c">나중의 dB · 거절</text>
              </g>
            </svg>
            <div className="min-w-0 space-y-1.5 rounded-lg border border-border bg-background p-2.5">
              <p className="text-[10px] font-black text-muted-foreground">sequence 42에 모인 PREPARE (서로 다른 백업)</p>
              <CountRow name="dA" votes={votesA} color={COLOR.dA} shown={scene.counted} need={2} />
              <CountRow name="dB" votes={votesB} color={COLOR.dB} shown={scene.counted} need={2} />
              <p className={`text-[11px] font-bold ${active === 3 ? "text-foreground" : "text-transparent"}`} aria-hidden={active !== 3}>
                둘 다 prepared = 2 + 2 = 4개 필요 · 백업 3대 × 자리당 1개 = 최대 3개
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
