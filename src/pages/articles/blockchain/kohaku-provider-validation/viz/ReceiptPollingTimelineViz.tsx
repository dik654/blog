import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #receipt-wait — alpha.13 기본값 100ms polling·10초 timeout.
 * 한 RPC가 끝난 뒤 interval을 기다리므로 poll이 겹치지 않는다. 전체 timeout에는 stalled RPC 시간이 들어간다.
 * Timeout 뒤 helper timer와 후속 poll은 멈추지만 진행 중인 RPC는 취소하지 못한다.
 * Receipt는 포함 여부만 말한다(status=0 가능). 가로 위치는 축척이 아니다.
 */
const X0 = 24;
const DEADLINE = 360;
const END = 470;
const LANE_Y = 78;
const LANE_H = 34;
const AXIS_Y = 166;

const RPC1 = { from: X0, to: 84 };
const RPC2 = { from: 124, to: 184 };
const RPC3 = { from: 224, to: 284 };

const SCENES = [
  {
    label: "Poll은 겹치지 않습니다",
    summary: "RPC 끝 → 100ms → 다음 RPC",
    note: "Receipt 조회 RPC가 응답하면 그때부터 100ms를 기다린 뒤 다음 RPC를 보냅니다. 앞 RPC가 끝나기 전에 다음 RPC를 보내지 않으므로 같은 시점에 두 poll이 겹치지 않습니다.",
    result: "응답이 비어 있으면 100ms 뒤 다시 묻고, receipt가 오면 멈춥니다.",
  },
  {
    label: "Receipt는 포함만 말합니다",
    summary: "receipt 있음 ≠ 실행 성공",
    note: "Receipt가 왔다는 것은 transaction이 block에 포함됐다는 뜻입니다. 실행이 실패한 status=0 receipt일 수도 있고, confirmations와 finality도 이 대기가 확인해 주지 않습니다.",
    result: "포함됨 · status=0일 수도 있음 · 실행 성공·confirmations·finality는 별도 확인",
  },
  {
    label: "멈춘 RPC도 시간에 들어갑니다",
    summary: "10초에 stalled 시간 포함",
    note: "두 번째 RPC가 응답하지 않으면 다음 poll은 시작하지 않지만 10초 시계는 계속 갑니다. Timeout은 poll 횟수가 아니라 대기를 시작한 뒤 흐른 전체 시간에 걸립니다.",
    result: "다음 poll은 시작하지 않고, 10초 시계는 대기 시작부터 계속 갑니다.",
  },
  {
    label: "Timeout 뒤",
    summary: "timer·후속 poll 정지, RPC는 계속",
    note: "10초가 되면 helper timer와 후속 poll은 멈춥니다. 하지만 이미 보낸 RPC는 취소하지 못하므로 점선처럼 계속 진행될 수 있고, 취소됐다고 기록하면 안 됩니다.",
    result: "Timeout = 10초 안에 receipt를 못 봤다는 뜻 · 거래 실패 증거가 아닙니다.",
  },
] as const;

function Rpc({ from, to, label, fill, stroke, dashed = false }: { from: number; to: number; label: string; fill: string; stroke: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={from} y={LANE_Y} width={to - from} height={LANE_H} rx={4} fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={(from + to) / 2} y={LANE_Y + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={stroke}>{label}</text>
    </g>
  );
}

function Wait({ from, to }: { from: number; to: number }) {
  return (
    <g>
      <line x1={from + 2} x2={to - 2} y1={LANE_Y + LANE_H / 2} y2={LANE_Y + LANE_H / 2} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
      <text x={(from + to) / 2} y={LANE_Y - 8} textAnchor="middle" fontSize={13} fill="#64748b">100ms</text>
    </g>
  );
}

export default function ReceiptPollingTimelineViz() {
  return (
    <SceneShell
      eyebrow="Receipt 대기"
      title="10초 timeout은 poll 횟수가 아니라 흐른 시간에 걸립니다"
      description="Receipt는 transaction이 block에 포함됐다는 응답이고, polling은 그 receipt가 생겼는지 RPC로 반복해 묻는 일입니다. 막대 하나가 RPC 한 번이며 100ms와 10초는 alpha.13 기본값입니다. 가로 길이는 축척이 아니고 RPC 길이는 가정입니다."
      ariaLabel="receipt polling에서 RPC가 겹치지 않고, 멈춘 RPC가 timeout에 포함되며, timeout 뒤에도 진행 중 RPC가 취소되지 않는 과정"
      scenes={SCENES}
      render={(active) => {
        const stalled = active >= 2;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 480 192" className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={X0} y={16} fontSize={13} fontWeight={700} fill="#64748b">receipt 조회 RPC</text>
              {stalled && (
                <g>
                  <line x1={X0} x2={DEADLINE} y1={46} y2={46} stroke="#dc2626" strokeWidth={1} />
                  <line x1={X0} x2={X0} y1={42} y2={50} stroke="#dc2626" strokeWidth={1} />
                  <line x1={DEADLINE} x2={DEADLINE} y1={42} y2={50} stroke="#dc2626" strokeWidth={1} />
                  <text x={(X0 + DEADLINE) / 2} y={38} textAnchor="middle" fontSize={13} fill="#dc2626">전체 timeout: stalled 시간 포함</text>
                </g>
              )}
              <Rpc {...RPC1} label="없음" fill="#f1f5f9" stroke="#475569" />
              <Wait from={RPC1.to} to={RPC2.from} />
              {stalled ? (
                <>
                  <Rpc from={RPC2.from} to={DEADLINE} label="응답 없음 (stalled)" fill="#fef3c7" stroke="#b45309" />
                  {active === 3 && <Rpc from={DEADLINE} to={END} label="진행 중" fill="#ffffff" stroke="#b45309" dashed />}
                </>
              ) : (
                <>
                  <Rpc {...RPC2} label="없음" fill="#f1f5f9" stroke="#475569" />
                  <Wait from={RPC2.to} to={RPC3.from} />
                  <Rpc {...RPC3} label="receipt" fill={active === 1 ? "#dbeafe" : "#dcfce7"} stroke={active === 1 ? "#1d4ed8" : "#15803d"} />
                  <text x={RPC3.to + 8} y={LANE_Y + 22} fontSize={13} fill="#64748b">대기 종료</text>
                </>
              )}
              {active === 3 && (
                <g>
                  <text x={DEADLINE + 6} y={LANE_Y + LANE_H + 20} fontSize={13} fill="#dc2626">다음 poll 없음</text>
                  <text x={DEADLINE + 6} y={LANE_Y + LANE_H + 38} fontSize={13} fill="#dc2626">timer 정리</text>
                </g>
              )}
              <line x1={DEADLINE} x2={DEADLINE} y1={52} y2={AXIS_Y} stroke="#dc2626" strokeWidth={1} strokeDasharray={stalled ? undefined : "3 3"} opacity={stalled ? 1 : 0.4} />
              <line x1={X0} x2={END} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              <text x={X0} y={AXIS_Y + 20} fontSize={13} fill="#64748b">0 · 대기 시작</text>
              <text x={DEADLINE} y={AXIS_Y + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626" opacity={stalled ? 1 : 0.5}>10초</text>
              <text x={END} y={AXIS_Y + 20} textAnchor="end" fontSize={12} fill="#94a3b8">축척 아님</text>
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((scene) => (
                <p key={scene.label} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-semibold leading-5">
                  {scene.result}
                </p>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
