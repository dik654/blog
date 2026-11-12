import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bia-rpo-rto 첫 문단 "목표가 10분이라고 적었더라도 … 실현한 RPO는 30분입니다"와
 * #backup-restore의 RPO_real·RTO_real 식(12:00 장애, 11:50 검증 log, 13:20 업무 승인, 목표 5분·60분).
 * 가로축은 12:00 기준 분(−40 ~ +90). 30분 예는 글이 절대 시각을 주지 않아 사고를 12:00에 둔 가정입니다.
 */
const MIN = -40;
const SPAN = 130;
const pct = (minute: number) => ((minute - MIN) / SPAN) * 100;

const TICKS = [
  { m: -30, t: "11:30" },
  { m: 0, t: "12:00" },
  { m: 30, t: "12:30" },
  { m: 60, t: "13:00" },
  { m: 90, t: "13:30" },
] as const;

type Scene = {
  label: string;
  summary: string;
  note: string;
  /** 검증된 마지막 복구 지점(분). null이면 표시하지 않음 */
  point: number | null;
  /** RPO 목표(분). null이면 표시하지 않음 */
  rpoTarget: number | null;
  showRpo: boolean;
  showRto: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "사고와 마지막 검증 지점",
    summary: "12:00 손상 · 11:50 검증 log",
    note: "급여 DB가 12시 00분에 손상됐고, 11시 50분 database log가 무결성과 consistency 검증을 통과한 마지막 복구 지점이라고 가정한 글의 사례입니다. 빨간 선이 장애 시각, 파란 점이 latest recoverable point입니다.",
    point: -10,
    rpoTarget: null,
    showRpo: false,
    showRto: false,
  },
  {
    label: "실제 RPO는 뒤로 잰다",
    summary: "12:00 − 11:50 = 10분",
    note: "RPO_real은 장애 시각에서 검증된 마지막 복구 지점까지, 곧 잃은 데이터 구간입니다. 10분을 잃었는데 목표가 5분이었다면 목표 미달입니다. 점선 칸이 목표, 채운 막대가 이번 사고에서 실제로 잃은 구간입니다.",
    point: -10,
    rpoTarget: 5,
    showRpo: true,
    showRto: false,
  },
  {
    label: "목표를 적어도 실제는 검증 지점이 정함",
    summary: "목표 10분 · 실제 30분",
    note: "바로 아래 문단의 예입니다. 목표를 10분이라고 적었더라도 복구 검증을 통과한 지점이 30분 전이면 실현한 RPO는 30분입니다. 사고 시각을 12:00에 두면 그 지점은 11:30입니다(가정). 파일이 있다는 사실이 아니라 restore와 consistency oracle 통과가 지점을 정합니다.",
    point: -30,
    rpoTarget: 10,
    showRpo: true,
    showRto: false,
  },
  {
    label: "실제 RTO는 앞으로 잰다",
    summary: "13:20 − 12:00 = 80분",
    note: "RTO_real은 장애부터 서비스 owner가 업무 정상화를 승인한 13:20까지입니다. process 기동 시각이 아니라 검증과 traffic 전환까지 포함합니다. 목표 60분이었다면 20분 늦었고, 앞의 RPO 10분(목표 5분)과 함께 두 목표를 모두 놓친 훈련입니다.",
    point: -10,
    rpoTarget: 5,
    showRpo: true,
    showRto: true,
  },
];

function Bar({ from, to, show, color, label }: { from: number; to: number; show: boolean; color: string; label: string }) {
  return (
    <div
      className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-sm transition-opacity duration-300 motion-reduce:transition-none ${show ? "opacity-100" : "opacity-0"}`}
      style={{ left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%`, backgroundColor: color }}
      aria-label={label}
    />
  );
}

function Target({ from, to, show }: { from: number; to: number; show: boolean }) {
  return (
    <div
      className={`absolute top-1/2 h-7 -translate-y-1/2 rounded-sm border border-dashed border-[#64748b] transition-opacity duration-300 motion-reduce:transition-none ${show ? "opacity-100" : "opacity-0"}`}
      style={{ left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%` }}
    />
  );
}

function Row({ title, value, verdict, children }: { title: string; value: string; verdict: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
        <span className="font-bold">{title}</span>
        <span className="font-mono">
          {value} <span className="font-bold text-[#b91c1c] dark:text-[#f87171]">{verdict}</span>
        </span>
      </div>
      <div className="relative h-9 rounded-sm bg-muted/40">{children}</div>
    </div>
  );
}

export default function RecoveryTimelineViz() {
  return (
    <SceneShell
      eyebrow="실제 RPO · RTO"
      title="잃은 데이터는 사고에서 뒤로, 복구 시간은 사고에서 앞으로 잽니다"
      description="가로축은 시각입니다. RPO(복구 시점 목표)는 얼마나 과거까지 되돌아가도 되는지, RTO(복구 시간 목표)는 중단 뒤 언제까지 업무를 승인받아야 하는지에 대한 사전 목표입니다. 점선 칸이 목표, 채운 막대가 이번 사고에서 관측한 값입니다."
      ariaLabel="12시 장애를 기준으로 실제 RPO와 RTO를 목표와 비교하는 시간축"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rpo = scene.point === null ? 0 : -scene.point;
        const target = scene.rpoTarget ?? 0;
        return (
          <div className="min-w-0 space-y-4">
            <div className="relative h-14">
              <div className="absolute inset-x-0 top-7 h-px bg-border" />
              {TICKS.map((tick) => (
                <div key={tick.t} className="absolute top-5 -translate-x-1/2 text-center" style={{ left: `${pct(tick.m)}%` }}>
                  <div className="mx-auto h-4 w-px bg-[#94a3b8]" />
                  <span className="mt-1 block font-mono text-[10px] text-muted-foreground">{tick.t}</span>
                </div>
              ))}
              <div className="absolute top-0 -translate-x-1/2 text-[11px] font-bold text-[#b91c1c] dark:text-[#f87171]" style={{ left: `${pct(0)}%` }}>
                장애
              </div>
              {scene.point !== null && (
                <div
                  className="absolute top-[22px] h-3 w-3 -translate-x-1/2 rounded-full border border-background bg-[#2563eb] transition-[left] duration-300 motion-reduce:transition-none"
                  style={{ left: `${pct(scene.point)}%` }}
                  aria-label="검증된 마지막 복구 지점"
                />
              )}
              <div className="absolute top-4 h-10 w-px bg-[#dc2626]" style={{ left: `${pct(0)}%` }} />
            </div>

            <Row
              title="RPO · 잃은 데이터"
              value={scene.showRpo ? `실제 ${rpo}분 / 목표 ${target}분` : "−"}
              verdict={scene.showRpo && rpo > target ? "미달" : ""}
            >
              <Target from={-target} to={0} show={scene.showRpo} />
              <Bar from={scene.point ?? 0} to={0} show={scene.showRpo} color="#2563eb" label={`실제 RPO ${rpo}분`} />
              <div className="absolute top-0 h-full w-px bg-[#dc2626]" style={{ left: `${pct(0)}%` }} />
            </Row>

            <Row
              title="RTO · 업무 승인까지"
              value={scene.showRto ? "실제 80분 / 목표 60분" : "−"}
              verdict={scene.showRto ? "미달" : ""}
            >
              <Target from={0} to={60} show={scene.showRto} />
              <Bar from={0} to={80} show={scene.showRto} color="#7c3aed" label="실제 RTO 80분" />
              <div className="absolute top-0 h-full w-px bg-[#dc2626]" style={{ left: `${pct(0)}%` }} />
              <div
                className={`absolute top-1/2 -translate-x-full -translate-y-1/2 pr-1 font-mono text-[10px] font-bold transition-opacity duration-300 motion-reduce:transition-none ${scene.showRto ? "opacity-100" : "opacity-0"}`}
                style={{ left: `${pct(0)}%` }}
              >
                12:00
              </div>
            </Row>

            <p className={`text-[11px] leading-5 text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none ${scene.showRto ? "opacity-100" : "opacity-0"}`}>
              80분 안에 들어가는 것: 격리 복원 · 기술·업무·보안 oracle · canary · owner 승인. 구간별 길이는 글에 없어 나누어 그리지 않았습니다.
            </p>
          </div>
        );
      }}
    />
  );
}
