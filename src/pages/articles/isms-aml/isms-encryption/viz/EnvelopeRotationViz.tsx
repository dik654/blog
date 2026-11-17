import SceneShell from "./SceneShell";

/**
 * 본문 대응: #key-lifecycle 수식 C = AEAD_{K_D}(M, A), W = Wrap_{K_E}(K_D).
 * KEK만 교체 → 검증한 DEK를 새 KEK로 rewrap(C 그대로).
 * DEK compromise·crypto policy 변경 → data ciphertext까지 다시 암호화.
 * v1·v2 버전 표기는 그림을 위한 가정이다.
 */
type Box = { kd: string; ke: string; c: string; w: string; changed: readonly string[] };

const SCENES = [
  { label: "두 층으로 감쌉니다", summary: "data는 DEK, DEK는 KEK", kd: "v1", ke: "v1", c: "K_D v1", w: "K_E v1", changed: [] as string[], redo: "처음 저장", note: "계좌번호 M은 DEK K_D로 AEAD 암호화해 C로 저장하고, tenant·record 같은 metadata A는 함께 인증합니다. KMS/HSM 안의 KEK K_E는 data가 아니라 작은 DEK만 감싸 W를 만듭니다." },
  { label: "경우 A: KEK만 교체", summary: "W만 rewrap · C 그대로", kd: "v1", ke: "v2", c: "K_D v1", w: "K_E v2", changed: ["ke", "w"], redo: "다시 쓰는 것: W 하나", note: "KEK만 바꿀 때는 검증한 DEK를 새 KEK v2로 다시 감싸면 됩니다. DEK가 그대로이므로 대량의 data ciphertext C는 건드리지 않습니다." },
  { label: "경우 B: DEK 유출·정책 변경", summary: "C까지 다시 암호화", kd: "v2", ke: "v1", c: "K_D v2", w: "K_E v1", changed: ["kd", "c", "w"], redo: "다시 쓰는 것: C 전체 + W", note: "장면 1 상태에서 DEK가 유출됐거나 crypto policy가 바뀐 경우입니다. 새 DEK v2로 data ciphertext C를 계획적으로 다시 암호화하고, 새 DEK를 감싼 W도 새로 만듭니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#b45309";

function Node({ x, y, w, h, title, sub, extra, hot }: { x: number; y: number; w: number; h: number; title: string; sub: string; extra?: string; hot: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={hot ? "#fef3c7" : "#ffffff"} stroke={hot ? AMBER : "#64748b"} strokeWidth={hot ? 1.25 : 1} />
      <text x={x + w / 2} y={y + (extra ? 17 : h / 2 - 2)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{title}</text>
      <text x={x + w / 2} y={y + (extra ? 32 : h / 2 + 13)} textAnchor="middle" fontSize={10} fill={hot ? "#92400e" : "#475569"}>{sub}</text>
      {extra && <text x={x + w / 2} y={y + 47} textAnchor="middle" fontSize={10} fill={hot ? "#92400e" : "#475569"}>{extra}</text>}
    </g>
  );
}

function Arrow({ x, y1, y2, label, anchor }: { x: number; y1: number; y2: number; label: string; anchor: "start" | "end" }) {
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={y2 - 6} stroke={BLUE} strokeWidth={1.25} />
      <path d={`M ${x - 4} ${y2 - 7} L ${x} ${y2} L ${x + 4} ${y2 - 7} Z`} fill={BLUE} />
      <text x={anchor === "start" ? x + 7 : x - 7} y={(y1 + y2) / 2 - 3} textAnchor={anchor} fontSize={10} fill="#1e3a8a">{label}</text>
    </g>
  );
}

export default function EnvelopeRotationViz() {
  return (
    <SceneShell
      eyebrow="Envelope encryption"
      title="KEK만 바꾸면 작은 W만, DEK가 문제면 data까지 다시 씁니다"
      description="DEK(data-encryption key)는 data를 직접 암호화하는 key, KEK(key-encryption key)는 KMS/HSM이 보호하며 DEK만 감싸는 key입니다. 장면 2·3의 노란 칸이 장면 1 상태와 비교해 새로 만들거나 다시 쓰는 것이고, v1·v2 표기는 그림용입니다(가정)."
      ariaLabel="DEK와 KEK 두 층 구조, KEK 교체 시 rewrap, DEK 유출 시 data 재암호화 비교"
      scenes={SCENES}
      render={(active) => {
        const s: Box = SCENES[active];
        const hot = (k: string) => s.changed.includes(k);
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={92} y={14} textAnchor="middle" fontSize={10} fill="#64748b">data 쪽 (양이 많음)</text>
            <text x={270} y={14} textAnchor="middle" fontSize={10} fill="#64748b">key 쪽 (작음)</text>
            <Node x={12} y={22} w={160} h={40} title="M + A" sub="계좌번호 + metadata" hot={false} />
            <Arrow x={92} y1={62} y2={100} label="AEAD (K_D로)" anchor="start" />
            <Node x={12} y={100} w={160} h={58} title="C" sub="nonce·ciphertext·tag·key ID" extra={`(${s.c}로 암호화)`} hot={hot("c")} />
            <Node x={196} y={22} w={72} h={40} title="K_D" sub={`DEK ${s.kd}`} hot={hot("kd")} />
            <Arrow x={232} y1={62} y2={100} label="" anchor="start" />
            <text x={225} y={93} textAnchor="end" fontSize={10} fill="#1e3a8a">Wrap (K_E로)</text>
            <line x1={284} x2={237} y1={72} y2={80} stroke={BLUE} strokeWidth={1} strokeDasharray="3 2" />
            <Node x={196} y={100} w={72} h={40} title="W" sub={`${s.w}로 감쌈`}hot={hot("w")} />
            <rect x={278} y={22} width={74} height={74} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <text x={315} y={36} textAnchor="middle" fontSize={10} fill="#64748b">KMS / HSM</text>
            <Node x={284} y={48} w={62} h={40} title="K_E" sub={`KEK ${s.ke}`} hot={hot("ke")} />
            <line x1={12} x2={352} y1={174} y2={174} stroke="#e2e8f0" strokeWidth={1} />
            <text x={12} y={194} fontSize={12} fontWeight={700} fill={active === 0 ? "#334155" : AMBER}>{SCENES[active].redo}</text>
            <text x={12} y={209} fontSize={10} fill="#64748b">C: {hot("c") ? "다시 암호화" : active === 0 ? "새로 저장" : "그대로"} · W: {hot("w") ? "새로 만듦" : active === 0 ? "새로 저장" : "그대로"}</text>
          </svg>
        );
      }}
    />
  );
}
