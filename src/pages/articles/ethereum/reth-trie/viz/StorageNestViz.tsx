import SceneShell from "./TrieSceneShell";

/**
 * 본문 대응: #prefix-set "Account와 storage의 dirty 범위를 따로 둡니다".
 * balance·nonce·code 변경 → account path만. storage slot 변경 → storage trie root를 먼저 다시 계산 → account leaf의 storage root → account path.
 * Account 삭제·storage 전체 삭제는 별도 marker와 전체 하위 트리 처리 경계. contract C는 설명용 가정.
 */
const HOT = "#d97706";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const WIPE = "#dc2626";

const SCENES = [
  {
    label: "balance만 바뀜",
    summary: "account path만 dirty",
    note: "balance·nonce·code가 바뀌면 account leaf의 값이 달라지므로 그 account path를 다시 계산할 대상으로 표시합니다. storage trie는 건드리지 않습니다.",
  },
  {
    label: "slot 하나 바뀜",
    summary: "storage trie부터 다시 계산",
    note: "contract의 slot 하나가 바뀌면 먼저 그 account의 storage trie에서 slot leaf부터 storage root까지 다시 계산합니다. 이 단계에서는 아직 account trie에 손대지 않았습니다.",
  },
  {
    label: "storage root → account",
    summary: "slot → storage root → account → state root",
    note: "새 storage root는 account leaf 네 필드 중 하나로 들어갑니다. 그래서 slot 하나의 변경 표시가 account path를 거쳐 state root까지 이어집니다.",
  },
  {
    label: "storage 전체 삭제",
    summary: "key 하나가 아니라 하위 경로 전체",
    note: "account 삭제나 storage 전체 삭제는 key 하나를 바꾸는 작업과 다릅니다. 기존 하위 경로가 통째로 사라지므로 Reth는 별도 marker와 전체 하위 트리 처리 경계를 씁니다. 그림은 account 삭제는 그리지 않고 storage 전체 삭제만 보여 줍니다. 이 경우 account leaf의 storage root 값을 바꾸므로 account leaf를 거쳐 state root까지 다시 계산합니다.",
  },
] as const;

/** 장면마다 켜지는 부분: a = account 쪽, s = storage 쪽, f = storage root 필드, w = 전체 삭제 */
const LIT: readonly { a: boolean; s: boolean; f: boolean; w: boolean; balance: boolean }[] = [
  { a: true, s: false, f: false, w: false, balance: true },
  { a: false, s: true, f: false, w: false, balance: false },
  { a: true, s: true, f: true, w: false, balance: false },
  { a: true, s: false, f: true, w: true, balance: false },
];

function Box({ x, y, w, h, title, on, color = HOT, dashed = false }: { x: number; y: number; w: number; h: number; title: string; on: boolean; color?: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={on ? color : "none"} fillOpacity={on ? 0.14 : 0} stroke={on ? color : MUTED} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? color : TEXT}>{title}</text>
    </g>
  );
}

function StorageNestFigure({ active }: { active: number }) {
  const lit = LIT[active];
  const fields: readonly { name: string; on: boolean }[] = [
    { name: "nonce", on: false },
    { name: "balance", on: lit.balance },
    { name: "storage root", on: lit.f },
    { name: "code hash", on: false },
  ];
  const storageColor = lit.w ? WIPE : HOT;
  const storageOn = lit.s || lit.w;
  return (
    <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[380px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={84} y={14} textAnchor="middle" fontSize={11} fill={TEXT}>account trie</text>
      <text x={276} y={14} textAnchor="middle" fontSize={11} fill={TEXT}>contract C의 storage trie (가정)</text>

      <Box x={24} y={24} w={120} h={30} title="state root" on={lit.a} />
      <path d="M84 54 L84 72" stroke={lit.a ? HOT : MUTED} strokeWidth={1} />
      <Box x={24} y={72} w={120} h={30} title="account path" on={lit.a} />
      <path d="M84 102 L84 120" stroke={lit.a ? HOT : MUTED} strokeWidth={1} />
      <rect x={14} y={120} width={140} height={124} rx={6} fill={lit.a ? HOT : "none"} fillOpacity={lit.a ? 0.06 : 0} stroke={lit.a ? HOT : MUTED} strokeWidth={1} />
      <text x={84} y={138} textAnchor="middle" fontSize={11} fontWeight={700} fill={lit.a ? HOT : TEXT}>account leaf C</text>
      {fields.map((field, index) => (
        <g key={field.name}>
          <rect x={26} y={148 + index * 23} width={116} height={19} rx={3} fill={field.on ? HOT : "none"} fillOpacity={field.on ? 0.22 : 0} stroke={field.on ? HOT : MUTED} strokeWidth={field.on ? 1.25 : 1} />
          <text x={84} y={161 + index * 23} textAnchor="middle" fontSize={10.5} fontWeight={field.on ? 700 : 400} fill={field.on ? HOT : TEXT}>{field.name}</text>
        </g>
      ))}

      <Box x={216} y={72} w={120} h={30} title="storage root" on={storageOn} color={storageColor} dashed={lit.w} />
      <path d="M276 102 L276 140" stroke={storageOn ? storageColor : MUTED} strokeWidth={1} strokeDasharray={lit.w ? "4 3" : undefined} />
      <Box x={216} y={140} w={120} h={30} title="storage path" on={storageOn} color={storageColor} dashed={lit.w} />
      <path d="M276 170 L276 208" stroke={storageOn ? storageColor : MUTED} strokeWidth={1} strokeDasharray={lit.w ? "4 3" : undefined} />
      <Box x={216} y={208} w={120} h={30} title={lit.w ? "모든 slot ×" : "slot leaf"} on={storageOn} color={storageColor} dashed={lit.w} />
      <text x={276} y={256} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={lit.w ? WIPE : "none"}>별도 marker · 하위 트리 전체</text>

      <path d="M216 87 C184 87 176 203 142 203" fill="none" stroke={lit.f ? HOT : MUTED} strokeWidth={lit.f ? 1.25 : 1} strokeDasharray="4 3" />
      <text x={182} y={66} textAnchor="middle" fontSize={10} fill={lit.f ? HOT : TEXT}>값으로 들어감</text>
    </svg>
  );
}

export default function StorageNestViz() {
  return (
    <SceneShell
      eyebrow="storage trie ⊂ account leaf"
      title="Storage slot 변경은 account leaf를 거쳐 state root까지 올라갑니다"
      description="왼쪽은 account trie, 오른쪽은 한 contract가 따로 가진 storage trie입니다. 주황은 다시 계산할 대상으로 표시된 부분입니다."
      ariaLabel="balance 변경과 storage slot 변경이 각각 어느 경로를 dirty로 만드는지, storage 전체 삭제는 어떻게 다른지 비교"
      scenes={SCENES}
      render={(active) => <StorageNestFigure active={active} />}
    />
  );
}
