import SceneShell from "./SceneShell";

/**
 * 본문 대응: #python-layer "Canonicalization은 다른 값을 억지로 같게 만드는 작업이 아닙니다".
 * 같은 login fixture를 Python과 Rust로 돌린 trace 한 쌍(값은 설명용 가정)을
 * 원본 → 올바른 정규화 → 과잉 정규화 순으로 비교합니다.
 */
type Row = { field: string; py: string; rs: string; same: boolean; hidden?: boolean };

const RAW: readonly Row[] = [
  { field: "run ID (UUID)", py: "7c1e-…-a4", rs: "02ab-…-9f", same: false },
  { field: "timestamp", py: "12:00:01", rs: "12:00:04", same: false },
  { field: "edit 대상 경로", py: "/tmp/w81/auth.ts", rs: "C:\\Temp\\w5\\auth.ts", same: false },
  { field: "permission map", py: "{path, mode}", rs: "{mode, path}", same: false },
  { field: "tool call 순서", py: "read → edit → test", rs: "read → edit → test", same: true },
];

const NORMALIZED: readonly Row[] = [
  { field: "run ID (UUID)", py: "$RUN_ID", rs: "$RUN_ID", same: true },
  { field: "timestamp", py: "$TIME", rs: "$TIME", same: true },
  { field: "edit 대상 경로", py: "$WORKSPACE/auth.ts", rs: "$WORKSPACE/auth.ts", same: true },
  { field: "permission map", py: "{mode, path}", rs: "{mode, path}", same: true },
  { field: "tool call 순서", py: "read → edit → test", rs: "read → edit → test", same: true },
];

const OVER: readonly Row[] = [
  { field: "run ID (UUID)", py: "$RUN_ID", rs: "$RUN_ID", same: true },
  { field: "timestamp", py: "$TIME", rs: "$TIME", same: true },
  { field: "edit 대상 경로", py: "/tmp/w81/auth.ts\n→ <PATH>", rs: "/etc/hosts\n→ <PATH>", same: true, hidden: true },
  { field: "permission map", py: "{mode, path}", rs: "{mode, path}", same: true },
  { field: "tool call 순서", py: "read → edit → test\n→ 정렬", rs: "edit → read → test\n→ 정렬", same: true, hidden: true },
];

const SCENES = [
  {
    label: "원본 trace",
    summary: "4칸이 다름",
    note: "두 실행은 같은 일을 했지만 UUID·시각·임시 workspace 경로·map key 순서가 매번 달라집니다. 이대로 byte 비교하면 의미 없는 mismatch가 납니다.",
    rows: RAW,
  },
  {
    label: "올바른 정규화",
    summary: "의미가 같으면 같아짐",
    note: "UUID는 $RUN_ID, 시각은 $TIME, 임시 workspace 절대 경로는 $WORKSPACE로 바꾸고, 역슬래시와 슬래시를 같은 논리 경로로 통일하며, 순서가 없는 map은 key를 정렬합니다. tool call 순서는 그대로 둡니다.",
    rows: NORMALIZED,
  },
  {
    label: "과잉 정규화",
    summary: "Rust가 다르게 움직인 run도 같음",
    note: "이번에는 Rust run이 workspace 밖 경로를 고치고 순서도 바꿨다고 가정합니다. 허용된 경로와 workspace 밖 경로를 모두 같은 문자열로 지우고 tool call 순서를 정렬하면 이 run도 '같음'으로 나옵니다. 보안·제어 흐름의 차이가 사라지므로 normalizer도 test가 필요합니다.",
    rows: OVER,
  },
] as const;

export default function CanonicalizationViz() {
  return (
    <SceneShell
      eyebrow="Paired fixture의 정규화"
      title="지워도 되는 차이와 지우면 안 되는 차이"
      description="같은 login fixture를 Python reference와 Rust로 한 번씩 실행한 trace 한 쌍입니다. 경로·ID·시각 값은 설명용 가정(가정)이며, 세 번째 장면은 Rust가 workspace 밖(/etc/hosts)을 고치고 순서를 바꾼 다른 run을 가정해 정규화가 무엇을 숨기는지 보입니다."
      ariaLabel="Python과 Rust trace를 원본, 올바른 정규화, 과잉 정규화 순으로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-2">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-2 px-2 text-[10px] font-bold text-muted-foreground sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)_3.5rem] sm:text-xs">
              <span className="hidden sm:block">field</span>
              <span>Python</span>
              <span>Rust</span>
              <span className="text-right">판정</span>
            </div>
            {scene.rows.map((row) => {
              const verdictColor = row.hidden ? "#dc2626" : row.same ? "#2563eb" : "#64748b";
              const verdict = row.hidden ? "같음?" : row.same ? "같음" : "다름";
              return (
                <div
                  key={row.field}
                  className={`grid min-h-[3.75rem] min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] items-center gap-x-2 gap-y-1 rounded-lg border bg-background px-2 py-2 sm:min-h-[2.75rem] sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)_3.5rem] ${row.hidden ? "border-dashed border-red-600/60" : "border-border"}`}
                >
                  <span className="col-span-3 break-keep text-[10px] font-semibold text-muted-foreground sm:col-span-1 sm:text-xs">{row.field}</span>
                  <code className="min-w-0 whitespace-pre-line break-all font-mono text-[10px] leading-4 sm:text-xs">{row.py}</code>
                  <code className="min-w-0 whitespace-pre-line break-all font-mono text-[10px] leading-4 sm:text-xs">{row.rs}</code>
                  <span className="text-right text-[10px] font-bold sm:text-xs" style={{ color: verdictColor }}>{verdict}</span>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
