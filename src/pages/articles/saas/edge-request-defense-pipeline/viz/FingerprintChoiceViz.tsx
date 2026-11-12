import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fingerprint-rule — 표본 패킷에서 필드 조합(지문) 후보를 만들고, 공격만 잘 거르면서
 * 정상을 적게 건드리는 조합을 고릅니다. 좁으면 필드 하나만 바꿔도 빠져나가고, 넓으면 정상까지 버립니다.
 * 표본 12개(공격 8, 정상 4)와 필드 값 a·b·c, 짧음·긺, X·Y는 모두 설명용 가정입니다.
 * 셈: 좁은 지문 6/8·정상 0 → 포트를 b로 바꾸면 0/8, 넓은 지문 8/8·정상 2, 고른 지문 8/8·정상 0.
 */
type Packet = { attack: boolean; port: string; len: string; flag: string };

const SAMPLE: readonly Packet[] = [
  ...Array.from({ length: 6 }, () => ({ attack: true, port: "a", len: "짧음", flag: "X" })),
  ...Array.from({ length: 2 }, () => ({ attack: true, port: "b", len: "짧음", flag: "X" })),
  { attack: false, port: "a", len: "긺", flag: "X" },
  { attack: false, port: "a", len: "긺", flag: "X" },
  { attack: false, port: "b", len: "짧음", flag: "Y" },
  { attack: false, port: "c", len: "긺", flag: "Y" },
];

type Rule = { name: string; match: (p: Packet) => boolean } | null;

const NARROW: Rule = { name: "포트 a · 짧음 · X", match: (p) => p.port === "a" && p.len === "짧음" && p.flag === "X" };
const WIDE: Rule = { name: "플래그 X", match: (p) => p.flag === "X" };
const CHOSEN: Rule = { name: "짧음 · X", match: (p) => p.len === "짧음" && p.flag === "X" };

const SCENES = [
  { label: "표본 12개", summary: "공격 8 · 정상 4 (가정)", note: "분석기가 받은 표본입니다. 패킷마다 출발지 포트, 길이, 프로토콜 플래그 세 필드를 봅니다. 공격 패킷은 길이와 플래그가 같고 포트만 섞여 있습니다.", rule: null, shift: false },
  { label: "좁은 지문", summary: "공격 6/8 · 정상 0", note: "세 필드를 모두 묶으면 정상은 하나도 안 건드리지만, 포트 b로 온 공격 2개를 놓칩니다.", rule: NARROW, shift: false },
  { label: "공격자가 포트만 바꾸면", summary: "공격 0/8", note: "공격자가 포트 하나를 b로 바꾸면 좁은 지문에 걸리는 패킷이 사라집니다. 필드 하나로 빠져나가는 경우입니다.", rule: NARROW, shift: true },
  { label: "넓은 지문", summary: "공격 8/8 · 정상 2 버림", note: "플래그 하나만 보면 공격은 다 잡지만, 같은 플래그를 쓰는 정상 패킷 2개까지 버립니다.", rule: WIDE, shift: false },
  { label: "고른 지문", summary: "공격 8/8 · 정상 0", note: "길이와 플래그를 묶은 후보가 이 표본에서는 공격을 모두 거르고 정상을 건드리지 않습니다. 포트를 바꿔도 걸립니다. 후보 여러 개를 표본 분포에 대 보고 이런 조합을 고릅니다.", rule: CHOSEN, shift: false },
] as const satisfies readonly { label: string; summary: string; note: string; rule: Rule; shift: boolean }[];

function Cell({ packet, hit }: { packet: Packet; hit: boolean | null }) {
  return (
    <div
      className={`min-w-0 rounded-md border px-1.5 py-1.5 text-center text-[11px] leading-4 ${
        hit === null ? "border-border" : hit ? (packet.attack ? "border-emerald-600 bg-emerald-600/10" : "border-red-600 bg-red-600/10") : packet.attack ? "border-amber-600 border-dashed" : "border-border"
      }`}
    >
      <span className={`block font-bold ${packet.attack ? "text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-300"}`}>{packet.attack ? "■ 공격" : "○ 정상"}</span>
      <span className="block font-mono text-muted-foreground">
        {packet.port}·{packet.len}·{packet.flag}
      </span>
      <span className={`block font-semibold ${hit === null ? "invisible" : hit ? (packet.attack ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400") : packet.attack ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
        {hit === null ? "−" : hit ? "버림" : packet.attack ? "놓침" : "통과"}
      </span>
    </div>
  );
}

export default function FingerprintChoiceViz() {
  return (
    <SceneShell
      eyebrow="지문 고르기"
      title="좁은 지문은 빠져나가고 넓은 지문은 정상까지 버립니다"
      description="칸 하나가 표본 패킷 하나이고, 아래 글자는 포트·길이·플래그입니다. 표본 수와 필드 값은 설명용 가정입니다. 초록 칸은 맞게 버린 공격, 빨간 칸은 잘못 버린 정상, 점선 칸은 놓친 공격입니다."
      ariaLabel="필드 조합 지문 후보별로 공격과 정상 패킷이 버려지는 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const packets = scene.shift ? SAMPLE.map((p) => (p.attack ? { ...p, port: "b" } : p)) : SAMPLE;
        const rule: Rule = scene.rule;
        return (
          <div className="min-w-0">
            <p className="mb-2 text-xs">
              <span className="text-muted-foreground">적용한 지문 </span>
              <span className="font-mono font-semibold">{rule ? rule.name : "아직 없음"}</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {packets.map((p, i) => (
                <Cell key={i} packet={p} hit={rule ? rule.match(p) : null} />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
