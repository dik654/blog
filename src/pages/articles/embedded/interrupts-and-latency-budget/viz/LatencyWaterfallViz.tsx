import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 일곱 구간의 시작과 끝을 같은 0~1000 µs 축에 쌓는다.
 * 5+40+8+20=73, 73+40=113, 113+300+80=493, 1000−493=507. 시간은 전부 글의 가정값.
 */
const SEGMENTS = [
  { label: "입력 변화 검출", us: 5, from: 0 },
  { label: "다른 일로 대기", us: 40, from: 0 },
  { label: "처리 함수 진입", us: 8, from: 0 },
  { label: "사건 접수", us: 20, from: 0 },
  { label: "작업 깨우기", us: 40, from: 1 },
  { label: "센서 거래", us: 300, from: 2 },
  { label: "받은 값 계산", us: 80, from: 2 },
] as const;

const DEADLINE = 1000;
const ENDS = SEGMENTS.reduce<number[]>((acc, segment) => [...acc, (acc[acc.length - 1] ?? 0) + segment.us], []);
const TOTAL = ENDS[ENDS.length - 1] ?? 0;
const pct = (us: number) => `${(us / DEADLINE) * 100}%`;

const SCENES = [
  { label: "접수까지", summary: "5+40+8+20 = 73 µs", note: "처음 신호에서 네 구간을 지나면 73 µs입니다. 사건을 접수했을 뿐 센서 값은 아직 읽지 않았습니다." },
  { label: "작업 깨우기", summary: "73+40 = 113 µs", note: "읽을 작업을 깨우는 데 40 µs를 더 씁니다. 실제 센서 읽기는 이 뒤에 시작합니다." },
  { label: "거래와 계산", summary: "113+300+80 = 493 µs", note: "가장 긴 막대는 센서와의 거래입니다. 받은 값을 계산까지 마친 시점이 493 µs입니다." },
  { label: "마감과 비교", summary: "1000−493 = 507 µs 남음", note: "1 ms=1000 µs의 마감까지 507 µs가 남습니다. 일곱 구간이 겹치지 않는 상한이라는 가정에서 나온 값입니다." },
] as const;

export default function LatencyWaterfallViz() {
  return (
    <SceneShell
      eyebrow="한 사건의 시간 경로 · 가정값"
      title="일곱 구간을 같은 시간축에 이어 붙입니다"
      description="가로축은 처음 신호부터 1000 µs(1 ms) 마감까지입니다. 줄 하나가 한 구간이고 오른쪽 숫자는 그 구간이 끝나는 시각이고, 맨 아래 줄만 마감까지 남은 µs입니다."
      ariaLabel="일곱 지연 구간을 쌓아 493 마이크로초에 끝나고 507 마이크로초가 남는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-1.5">
          {SEGMENTS.map((segment, index) => {
            const shown = segment.from <= active;
            const end = ENDS[index] ?? 0;
            return (
              <div key={segment.label} className="grid grid-cols-[6.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                <span className={shown ? "whitespace-nowrap" : "whitespace-nowrap text-muted-foreground/50"}>{segment.label}</span>
                <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
                  {shown && (
                    <div
                      className="absolute inset-y-0 rounded-sm"
                      style={{ left: pct(end - segment.us), width: pct(segment.us), minWidth: 2, backgroundColor: index < 4 ? "#64748b" : "#2563eb" }}
                    />
                  )}
                </div>
                <span className={`text-right font-mono ${shown ? "" : "invisible"}`}>{end}</span>
              </div>
            );
          })}
          <div className="grid grid-cols-[6.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
            <span className={active === 3 ? "whitespace-nowrap font-bold" : "whitespace-nowrap text-muted-foreground/50"}>마감까지 여유</span>
            <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
              {active === 3 && (
                <div className="absolute inset-y-0 rounded-sm border border-dashed" style={{ left: pct(TOTAL), right: 0, borderColor: "#16a34a" }} />
              )}
            </div>
            <span className={`text-right font-mono font-bold ${active === 3 ? "" : "invisible"}`}>{DEADLINE - TOTAL}</span>
          </div>
          <div className="grid grid-cols-[6.25rem_minmax(0,1fr)_2.5rem] gap-2 text-xs text-muted-foreground">
            <span />
            <div className="flex justify-between font-mono">
              <span>0 µs</span>
              <span>마감 1000 µs</span>
            </div>
            <span />
          </div>
        </div>
      )}
    />
  );
}
