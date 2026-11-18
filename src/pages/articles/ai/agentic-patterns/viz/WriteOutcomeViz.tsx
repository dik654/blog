import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: agent-loop-foundations #why-runtime — 같은 수정 제안이라도 실행 결과는 성공·거부·응답 없음으로 갈린다.
 * 칸 셋: 실제 파일 / 다음 기록 / 이어지는 판단. 거부를 "수정 완료"로 적으면 뒤의 검사와 최종 답이 거짓 전제를 물려받는다.
 */
const SCENES = [
  {
    label: "제안만 나온 상태",
    summary: "제안 ≠ 실행 결과",
    branch: -1,
    file: "width:430px 그대로",
    record: "아직 결과 없음",
    next: "실행 담당자의 판정을 기다림",
    tone: "neutral",
    note: "다음 행동을 고르는 쪽이 폭 규칙 수정을 제안했습니다. 제안 자체는 실행 결과가 아니라서 이 순간 파일은 아직 바뀌지 않았습니다.",
  },
  {
    label: "쓰기 성공",
    summary: "파일 변경 = 기록",
    branch: 0,
    file: "폭 규칙 수정됨",
    record: "성공 · 실제 저장 결과",
    next: "화면을 다시 재어 확인",
    tone: "ok",
    note: "실행 담당자가 쓰기를 허용해 파일이 바뀌었고, 기록에도 실제 저장 결과가 남습니다. 그래도 화면이 고쳐졌는지는 다음 측정이 알려 줍니다.",
  },
  {
    label: "거부인데 ‘수정 완료’로 적음",
    summary: "파일 그대로 · 기록은 완료",
    branch: 1,
    file: "width:430px 그대로",
    record: "수정 완료 (거짓)",
    next: "검사·최종 답이 거짓 전제를 물려받음",
    tone: "bad",
    note: "쓰기가 거부돼 파일은 그대로인데 기록에 수정 완료라고 적으면, 이어지는 검사와 최종 답이 바뀌지 않은 파일을 바뀌었다고 믿고 시작합니다.",
  },
  {
    label: "거부를 거부로 적음",
    summary: "파일 그대로 · 기록도 거부",
    branch: 1,
    file: "width:430px 그대로",
    record: "거부 · 거부 이유",
    next: "거부 이유로 다음 행동을 고름",
    tone: "ok",
    note: "같은 거부라도 거부라고 남기면 다음 판단이 실제 파일과 맞는 전제에서 출발합니다. 값은 그대로 두고 거부 이유를 근거로 다음 행동을 고릅니다.",
  },
  {
    label: "바꾼 뒤 응답 없음",
    summary: "변경 여부 모름",
    branch: 2,
    file: "바뀌었을 수 있음 · 확인 전엔 모름",
    record: "응답 없음",
    next: "재실행 전에 실제 파일과 실행 기록 확인",
    tone: "unknown",
    note: "파일을 바꾼 뒤 응답을 받지 못했다면 변경이 있었는지 아직 모릅니다. 그대로 다시 실행하기 전에 실제 파일과 실행 기록을 먼저 확인합니다.",
  },
] as const;

const BRANCHES: readonly string[] = ["성공", "거부", "응답 없음"];

const TONE: Record<(typeof SCENES)[number]["tone"], string> = {
  neutral: "#64748b",
  ok: "#16a34a",
  bad: "#dc2626",
  unknown: "#d97706",
};

function Cell({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="min-w-0 rounded-lg border px-2 py-2" style={{ borderColor: color }}>
      <span className="block text-[10px] text-muted-foreground sm:text-[11px]">{title}</span>
      <span className="mt-0.5 block break-words text-xs font-semibold leading-5 sm:text-sm" style={{ color }}>{value}</span>
    </div>
  );
}

export default function WriteOutcomeViz() {
  return (
    <SceneShell
      eyebrow="수정 제안 하나, 결과 셋"
      title="같은 제안이 성공·거부·응답 없음으로 갈릴 때 기록할 것"
      description="위 갈래는 실행 담당자의 실제 결과입니다. 아래 세 칸은 그때의 실제 파일, 다음 기록, 그 기록을 읽는 다음 판단입니다."
      ariaLabel="쓰기 제안의 성공, 거부, 응답 없음 갈래와 각각의 파일 상태와 기록"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const color = TONE[scene.tone];
        return (
          <div className="grid min-w-0 gap-4">
            <svg viewBox="0 0 360 96" className="h-auto w-full max-w-[560px] justify-self-center" role="img" aria-label={`수정 제안에서 ${scene.branch < 0 ? "아직 갈래 없음" : BRANCHES[scene.branch]} 갈래`}>
              <rect x={120} y={4} width={120} height={26} rx={6} fill="none" stroke="#475569" strokeWidth={1} />
              <text x={180} y={21} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">폭 규칙 수정 제안</text>
              {BRANCHES.map((label, index) => {
                const x = 60 + index * 120;
                const on = scene.branch === index;
                const stroke = on ? color : "#cbd5e1";
                return (
                  <g key={label}>
                    <path d={`M180 30 L180 44 L${x} 44 L${x} 62`} fill="none" stroke={stroke} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
                    <rect x={x - 48} y={62} width={96} height={26} rx={6} fill={on ? color : "none"} fillOpacity={on ? 0.12 : 0} stroke={stroke} strokeWidth={on ? 1.25 : 1} />
                    <text x={x} y={79} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? color : "#94a3b8"}>{label}</text>
                  </g>
                );
              })}
            </svg>
            <StableSceneStack
              active={active}
              scenes={SCENES.map((item) => {
                const itemColor = TONE[item.tone];
                return (
                  <div key={item.label} className="grid h-full min-w-0 grid-cols-3 gap-2">
                    <Cell title="실제 파일" value={item.file} color={item.tone === "bad" ? "#64748b" : itemColor} />
                    <Cell title="다음 기록" value={item.record} color={itemColor} />
                    <Cell title="이어지는 판단" value={item.next} color={itemColor} />
                  </div>
                );
              })}
            />
          </div>
        );
      }}
    />
  );
}
