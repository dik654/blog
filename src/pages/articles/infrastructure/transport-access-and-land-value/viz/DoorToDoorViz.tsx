import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 35분이 차량 탑승만이고 도보 10분·환승 대기 10분이 더 들면 55분.
 * 이전 60분도 문 앞 기준일 때: 60−55 = 5분, 40번 × 5분 = 200분(산술).
 */
const BEFORE = 60;
const RIDE = 35;
const WALK = 10;
const WAIT = 10;
const ACTUAL = RIDE + WALK + WAIT;
const REAL_SAVED = BEFORE - ACTUAL;
const TRIPS = 40;

const SCENES = [
  { label: "35분이 문 앞부터 문 앞까지라면", summary: `${BEFORE} − ${RIDE} = ${BEFORE - RIDE}분`, note: "이 글의 계산은 35분을 집 문을 나서 회사에 도착하기까지의 시간으로 가정합니다." },
  { label: "35분이 차량 탑승뿐이라면", summary: `${RIDE} + ${WALK} + ${WAIT} = ${ACTUAL}분`, note: "걸어서 10분, 환승 대기 10분이 더 들면 실제는 55분입니다. 막대 순서는 이동 순서가 아니라 합계를 보이기 위한 것입니다." },
  { label: "생활에서 아끼는 시간", summary: `${BEFORE} − ${ACTUAL} = ${REAL_SAVED}분`, note: `이전 60분도 문 앞 기준이라면(가정) 편도 절약은 5분이고, 같은 40번의 편도로 ${REAL_SAVED * TRIPS}분입니다. 노선 속도와 생활에서 절약하는 시간은 이렇게 다를 수 있습니다.` },
] as const;

const pct = (minutes: number) => `${(minutes / BEFORE) * 100}%`;

function Segment({ minutes, text, color }: { minutes: number; text: string; color: string }) {
  return (
    <span className={`flex min-w-0 items-center justify-center overflow-hidden whitespace-nowrap text-[11px] font-bold ${color}`} style={{ width: pct(minutes) }}>
      {text}
    </span>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-center gap-2 text-xs">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <div className="flex h-9 min-w-0 gap-px">{children}</div>
    </div>
  );
}

export default function DoorToDoorViz() {
  return (
    <SceneShell
      eyebrow="문 앞에서 문 앞까지"
      title="같은 35분이 어디까지 세었느냐에 따라 절약이 달라집니다"
      description="가로 길이가 편도 시간입니다. 위 줄의 끝이 60분이고, 수치는 이 글의 가정입니다."
      ariaLabel="차량 탑승 35분에 도보와 환승 대기를 더한 문 앞 기준 시간 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <Row label="이전">
            <Segment minutes={BEFORE} text="문 앞까지 60분" color="rounded-md bg-slate-500 text-white" />
          </Row>
          <Row label="이후">
            <Segment minutes={RIDE} text={active === 0 ? "문 앞까지 35분" : "차량 35분"} color={active === 0 ? "rounded-md bg-primary text-primary-foreground" : "rounded-l-md bg-primary text-primary-foreground"} />
            {active > 0 && <Segment minutes={WALK} text="도보10" color="bg-amber-600 text-white" />}
            {active > 0 && <Segment minutes={WAIT} text="대기10" color="rounded-r-md bg-amber-700 text-white" />}
          </Row>
          <div className="grid min-w-0 grid-cols-2 gap-2 text-center text-xs">
            <div className={`rounded-lg border bg-background px-2 py-2 ${active === 0 ? "border-primary" : "border-border/60"}`}>
              <span className="block text-muted-foreground">편도 절약</span>
              <span className="mt-1 block font-mono text-sm font-bold">{active === 0 ? `${BEFORE - RIDE}분` : active === 1 ? "?" : `${REAL_SAVED}분`}</span>
            </div>
            <div className={`rounded-lg border bg-background px-2 py-2 ${active === 0 ? "border-primary" : "border-border/60"}`}>
              <span className="block text-muted-foreground">편도 40번</span>
              <span className="mt-1 block font-mono text-sm font-bold">{active === 0 ? "1,000분" : active === 1 ? "?" : `${REAL_SAVED * TRIPS}분`}</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
