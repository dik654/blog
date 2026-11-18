import Sp1SceneShell from "./Sp1SceneShell";

/**
 * 본문 대응: #execution-shards — 각 shard proof가 유효한 것과 shard 사이가 이어지는 것은 다른 검사입니다.
 * nextPC_i = startPC_{i+1}, t_i^last = t_{i+1}^initial. shard 수 3은 그림을 위한 가정입니다.
 * 장면 4: 둘째 shard의 start PC만 바꾸면 거절. 장면 5: 1·3·2 순서로 붙이면 경계가 이어지지 않아 거절.
 */
interface Joint {
  ok: boolean;
  line1: string;
  line2: string;
}

interface ShardScene {
  label: string;
  summary: string;
  note: string;
  split: boolean;
  order: readonly number[];
  badStart: number | null;
  joints: readonly Joint[] | null;
  result: string;
  resultOk: boolean;
}

const SCENES: readonly ShardScene[] = [
  { label: "한 실행의 record", summary: "event가 실행 순서대로 쌓인 한 묶음", split: false, order: [1], badStart: null, joints: null, result: "PC·timestamp가 끊기지 않고 이어진 한 실행", resultOk: true, note: "ExecutionRecord에는 CPU·ALU·memory·branch event와 syscall·precompile event가 담깁니다. Memory 초기화·종료와 public values도 같은 record에 남습니다." },
  { label: "shard로 나누기", summary: "세 조각, 조각마다 proof (가정)", split: true, order: [1, 2, 3], badStart: null, joints: null, result: "각 조각의 proof는 자기 안의 event만 증명", resultOk: true, note: "긴 record를 여러 shard로 나눠 각각 proof를 만들 수 있습니다. 그림의 세 조각은 설명을 위한 가정입니다. 아직 조각 사이가 이어지는지는 확인하지 않았습니다." },
  { label: "경계 맞물림", summary: "nextPCᵢ = startPCᵢ₊₁ · 끝 tᵢ = 시작 tᵢ₊₁", split: true, order: [1, 2, 3], badStart: null, joints: [{ ok: true, line1: "nextPC₁ = startPC₂", line2: "끝 t₁ = 시작 t₂" }, { ok: true, line1: "nextPC₂ = startPC₃", line2: "끝 t₂ = 시작 t₃" }], result: "PC·timestamp 경계 통과", resultOk: true, note: "앞 shard가 끝난 명령 주소에서 다음 shard가 시작하고, 마지막 timestamp가 다음 처음과 같아야 event 조각이 빠지거나 겹치지 않습니다. 실제 verifier는 exit code·memory·committed digest·global cumulative sum도 따로 연결합니다." },
  { label: "start PC 하나 변경", summary: "둘째 shard의 startPC만 바꿈 → 거절", split: true, order: [1, 2, 3], badStart: 2, joints: [{ ok: false, line1: "nextPC₁ ≠ startPC₂", line2: "끝 t₁ = 시작 t₂" }, { ok: true, line1: "nextPC₂ = startPC₃", line2: "끝 t₂ = 시작 t₃" }], result: "조각마다 proof ✓여도 전체 core proof 거절", resultOk: false, note: "두 번째 shard의 start PC 하나만 바뀌어도, 각 shard의 내용을 따로 보는 것과 무관하게 전체 core proof는 거절됩니다." },
  { label: "순서 섞기", summary: "1·3·2로 붙임 → 거절", split: true, order: [1, 3, 2], badStart: null, joints: [{ ok: false, line1: "끝 t₁ ↔ 시작 t₃", line2: "사이 event가 빠짐" }, { ok: false, line1: "끝 t₃ ↔ 시작 t₂", line2: "이어지지 않음" }], result: "유효한 proof를 아무 순서로 붙여도 한 실행이 아님", resultOk: false, note: "shard 1 바로 뒤에 shard 3을 놓으면 shard 2의 event가 빠진 자리가 생깁니다. 유효한 proof들을 아무 순서로 붙인다고 한 실행이 되지는 않습니다." },
];

const X0 = 12;
const BOX_W = 100;
const GAP = 18;
const BAR_Y = 50;
const BAR_H = 40;
const boxX = (slot: number) => X0 + slot * (BOX_W + GAP);
const jointX = (slot: number) => boxX(slot) + BOX_W + GAP / 2;

const OK = "#0f766e";
const BAD = "#dc2626";
const LINE = "#94a3b8";
const TEXT = "#334155";
const MUTED = "#64748b";
const FILL = "#eff6ff";
const ACCENT = "#2563eb";

export default function ShardContinuityViz() {
  return (
    <Sp1SceneShell
      eyebrow="shard 연속성"
      title="유효한 shard proof들이 한 실행으로 이어지는지 따로 검사합니다"
      description="가로 막대가 한 번의 실행이고 왼쪽에서 오른쪽으로 시간이 흐릅니다. 막대 사이의 동그라미가 앞 shard의 끝과 다음 shard의 시작을 비교하는 경계입니다. PC는 다음에 실행할 명령의 주소입니다."
      ariaLabel="shard 경계의 PC와 timestamp 연속성 검사 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ticks = Array.from({ length: 27 }, (_, index) => X0 + 6 + index * 12.4);
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={16} fontSize={10} fill={MUTED}>시간 →</text>
            {!scene.split && (
              <g>
                <rect x={X0} y={BAR_Y} width={336} height={BAR_H} rx={6} fill={FILL} stroke={ACCENT} strokeWidth={1} />
                {ticks.map((x) => (
                  <line key={x} x1={x} x2={x} y1={BAR_Y + BAR_H - 10} y2={BAR_Y + BAR_H - 4} stroke={ACCENT} strokeWidth={1} />
                ))}
                <text x={180} y={BAR_Y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>ExecutionRecord · 한 번의 실행</text>
              </g>
            )}
            {scene.split &&
              scene.order.map((shard, slot) => {
                const bad = scene.badStart === shard;
                return (
                  <g key={shard}>
                    <text x={boxX(slot) + BOX_W / 2} y={BAR_Y - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>proof ✓</text>
                    <rect x={boxX(slot)} y={BAR_Y} width={BOX_W} height={BAR_H} rx={6} fill={FILL} stroke={ACCENT} strokeWidth={1} />
                    {ticks
                      .filter((x) => x > boxX(slot) + 4 && x < boxX(slot) + BOX_W - 4)
                      .map((x) => (
                        <line key={x} x1={x} x2={x} y1={BAR_Y + BAR_H - 10} y2={BAR_Y + BAR_H - 4} stroke={ACCENT} strokeWidth={1} />
                      ))}
                    <text x={boxX(slot) + BOX_W / 2} y={BAR_Y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{`shard ${shard}`}</text>
                    {bad && <line x1={boxX(slot)} x2={boxX(slot)} y1={BAR_Y - 2} y2={BAR_Y + BAR_H + 2} stroke={BAD} strokeWidth={1.25} />}
                    {bad && <text x={boxX(slot) + 4} y={BAR_Y + BAR_H + 12} fontSize={9} fontWeight={700} fill={BAD}>startPC 변경</text>}
                  </g>
                );
              })}
            {scene.joints?.map((joint, slot) => {
              const x = jointX(slot);
              const color = joint.ok ? OK : BAD;
              return (
                <g key={slot}>
                  <line x1={x} x2={x} y1={BAR_Y + BAR_H} y2={112} stroke={LINE} strokeWidth={1} strokeDasharray="2 2" />
                  <circle cx={x} cy={120} r={9} fill="#ffffff" stroke={color} strokeWidth={1.25} />
                  <text x={x} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{joint.ok ? "✓" : "✗"}</text>
                  <text x={x} y={146} textAnchor="middle" fontSize={11} fill={TEXT}>{joint.line1}</text>
                  <text x={x} y={161} textAnchor="middle" fontSize={11} fill={TEXT}>{joint.line2}</text>
                </g>
              );
            })}
            <text x={180} y={188} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.resultOk ? OK : BAD}>{scene.result}</text>
          </svg>
        );
      }}
    />
  );
}
