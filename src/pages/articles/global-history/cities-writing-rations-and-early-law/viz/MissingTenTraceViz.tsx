import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 계량 100 → 점토판 기록·인장 봉인 → 배급과 인수 표시 →
 * 40을 받을 집단이 30만 받음 → 남은 곡물·수정 흔적·인장·증언 대조 →
 * 단순 계산 오류인지 고의 누락인지 가르고 보충 배급이나 처벌. 신분에 따라 증언의 무게와 벌이 다를 수 있다.
 */
const STEPS: readonly string[] = ["계량", "기록", "배급", "대조", "판단"];

const SCENES = [
  { label: "계량하고 적고 봉인합니다", summary: "100 → 점토판 → 인장", steps: [0, 1], alert: false, note: "창고에서 100을 계량한 뒤 각 몫을 점토판에 적고 인장으로 봉인합니다. 몫은 3절의 설명용 가정을 그대로 씁니다." },
  { label: "받는 사람과 주는 사람이 확인합니다", summary: "확인 + 인수 표시", steps: [2], alert: false, note: "배급 때 노동자는 받을 양을 확인하고, 담당자는 인수(물건을 넘겨받았다는 확인)를 표시합니다." },
  { label: "40 대신 30만 받았습니다", summary: "40 − 30 = 10", steps: [2], alert: true, note: "40을 받을 집단이 30만 받았습니다. 빠진 10이 어디로 갔는지는 아직 모릅니다." },
  { label: "네 가지를 맞대어 봅니다", summary: "곡물·판·인장·증언", steps: [3], alert: true, note: "남은 곡물, 판의 수정 흔적, 인장과 증언을 서로 대조합니다." },
  { label: "오류인가 고의 누락인가", summary: "보충 배급이나 처벌", steps: [4], alert: true, note: "판단자는 단순 계산 오류인지 고의 누락인지 가르고 보충 배급이나 처벌을 정합니다." },
  { label: "같은 절차, 다른 무게", summary: "기록 ≠ 동등한 권리", steps: [4], alert: true, note: "이 절차가 있어도 신분에 따라 증언의 무게와 벌이 다를 수 있습니다. 기록할 수 있다는 것과 권리가 같다는 것은 별개의 성취입니다." },
] as const;

function Box({ title, children, tone = "plain" }: { title: string; children: ReactNode; tone?: "plain" | "alert" }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 ${tone === "alert" ? "border-dashed border-red-600/70" : "border-border"}`}>
      <span className="block text-xs text-muted-foreground">{title}</span>
      <span className="block text-sm font-semibold leading-6">{children}</span>
    </div>
  );
}

function Detail({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="grid gap-2 sm:grid-cols-3">
        <Box title="창고">곡물 100을 계량</Box>
        <Box title="점토판">노 40 · 장 20 · 사 15 · 관 10 · 비 15</Box>
        <Box title="인장">판을 봉인</Box>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <Box title="노동자">받을 양 40을 확인</Box>
        <Box title="담당자">인수를 표시</Box>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="grid grid-cols-3 gap-2">
        <Box title="받을 양">40</Box>
        <Box title="받은 양">30</Box>
        <Box title="빠진 양" tone="alert">10</Box>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Box title="실물">남은 곡물</Box>
        <Box title="점토판">수정 흔적</Box>
        <Box title="봉인">인장</Box>
        <Box title="사람">증언</Box>
      </div>
    );
  }
  if (index === 4) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Box title="갈래 1">단순 계산 오류</Box>
          <Box title="갈래 2">고의 누락</Box>
        </div>
        <Box title="판단자가 정함">보충 배급 또는 처벌</Box>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Box title="증언의 무게">신분에 따라 다를 수 있음</Box>
        <Box title="벌">신분에 따라 다를 수 있음</Box>
      </div>
      <Box title="남는 구분" tone="alert">기록 가능성 ≠ 동등한 권리</Box>
    </div>
  );
}

export default function MissingTenTraceViz() {
  return (
    <SceneShell
      eyebrow="빠진 곡물 10의 경로"
      title="빠진 10이 측정에서 판단까지 가는 길"
      description="위 띠는 절차의 다섯 단계이고 진하게 표시된 칸이 현재 단계입니다. 노·장·사·관·비는 3절 장부의 노동자·장인·사원·관리와 전령·비축 몫이며, 수치는 설명용 가정입니다."
      ariaLabel="창고 계량부터 점토판 기록, 배급, 대조, 판단까지 빠진 곡물 10을 추적하는 절차"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const current: readonly number[] = scene.steps;
        return (
          <div className="min-w-0 space-y-4">
            <ol className="grid grid-cols-5 gap-1">
              {STEPS.map((step, index) => {
                const on = current.includes(index);
                const alert = on && scene.alert;
                return (
                  <li
                    key={step}
                    className={`rounded-md border px-1 py-2 text-center text-sm font-semibold ${alert ? "border-red-600 text-red-700 dark:text-red-400" : on ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
                  >
                    <span className="block font-mono text-[11px] font-normal">{index + 1}</span>
                    {step}
                  </li>
                );
              })}
            </ol>
            <Detail index={active} />
          </div>
        );
      }}
    />
  );
}
