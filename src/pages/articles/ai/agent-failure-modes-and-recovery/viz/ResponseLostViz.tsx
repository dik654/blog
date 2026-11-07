import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 주문 42, 10,000원, pay-42. 서버는 처리했지만 응답이 오는 중 연결이 끊긴 가정 사례.
 * 첫 조회가 빈 결과여도 미실행이 아니고, 새 요청으로 다시 청구하면 20,000원이 될 수 있다.
 */
const LEFT_X = 44;
const RIGHT_X = 316;
const ACCENT = "#2563eb";
const WARN = "#d97706";
const RED = "#dc2626";
const LINE = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "청구 요청을 보냅니다", summary: "주문 42 · 10,000원", note: "같은 업무를 가리키는 식별자 pay-42를 붙여 한 번 청구합니다. 이 사례는 가정입니다.", known: "요청을 보냄", server: "0원", serverTone: "" },
  { label: "응답이 오다 끊깁니다", summary: "서버 10,000원 · 응답 없음", note: "서버에서는 처리됐지만 응답이 돌아오는 중 연결이 끊겼습니다. 서버 쪽 칸은 설명을 위해 보여 줄 뿐, 요청 쪽은 이 값을 볼 수 없습니다.", known: "응답 없음 · 실행 여부 모름", server: "10,000원", serverTone: "" },
  { label: "첫 조회가 비어 있습니다", summary: "빈 결과 ≠ 미실행", note: "첫 확인에서 기록이 안 보여도 미실행이라고 결론내릴 수 없습니다. 조회가 늦거나 확인 경로가 장애일 수도 있기 때문입니다.", known: "기록 안 보임 · 여전히 모름", server: "10,000원", serverTone: "" },
  { label: "새 요청으로 다시 청구하면", summary: "20,000원이 될 수 있음", note: "원하는 최종 청구액은 10,000원입니다. 실행 여부를 모른 채 새 요청을 보내면 같은 청구가 한 번 더 일어날 수 있습니다.", known: "모른 채 다시 보냄", server: "20,000원이 될 수 있음", serverTone: "text-red-700 dark:text-red-400" },
] as const;

function Message({ y, label, toServer, color, lost = false }: { y: number; label: string; toServer: boolean; color: string; lost?: boolean }) {
  const start = toServer ? LEFT_X : RIGHT_X;
  const end = lost ? 150 : toServer ? RIGHT_X - 6 : LEFT_X + 6;
  const head = toServer ? `${RIGHT_X - 6},${y} ${RIGHT_X - 14},${y - 4} ${RIGHT_X - 14},${y + 4}` : `${LEFT_X + 6},${y} ${LEFT_X + 14},${y - 4} ${LEFT_X + 14},${y + 4}`;
  return (
    <g>
      <line x1={start} x2={end} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      {lost ? (
        <g stroke={RED} strokeWidth={1.25}>
          <line x1={end - 6} x2={end + 6} y1={y - 6} y2={y + 6} />
          <line x1={end - 6} x2={end + 6} y1={y + 6} y2={y - 6} />
        </g>
      ) : (
        <polygon points={head} fill={color} />
      )}
      <text x={lost ? 232 : 180} y={y - 7} textAnchor="middle" fontSize={13} fill={color}>{label}</text>
    </g>
  );
}

export default function ResponseLostViz() {
  return (
    <SceneShell
      eyebrow="응답이 끊긴 청구"
      title="응답을 잃으면 요청 쪽은 서버에서 일어난 일을 볼 수 없습니다"
      description="왼쪽은 요청을 보내는 쪽, 오른쪽은 서버입니다. 시간은 위에서 아래로 흐릅니다. 사례 전체가 가정입니다."
      ariaLabel="청구 요청 뒤 응답이 끊겨 실행 여부를 모르고, 새 요청이 이중 청구가 될 수 있는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT_X} y={14} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>요청 쪽</text>
              <text x={RIGHT_X} y={14} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>서버</text>
              <line x1={LEFT_X} x2={LEFT_X} y1={22} y2={208} stroke={LINE} strokeWidth={1} />
              <line x1={RIGHT_X} x2={RIGHT_X} y1={22} y2={208} stroke={LINE} strokeWidth={1} />
              <Message y={52} label="청구 · pay-42" toServer color={ACCENT} />
              {active >= 1 && <Message y={92} label="처리 응답" toServer={false} color={WARN} lost />}
              {active >= 2 && <Message y={132} label="조회" toServer color={ACCENT} />}
              {active >= 2 && <Message y={164} label="빈 결과" toServer={false} color={WARN} />}
              {active >= 3 && <Message y={204} label="새 요청으로 청구" toServer color={RED} />}
            </svg>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-border bg-background p-2.5">
                <p className="text-xs font-bold text-muted-foreground">요청 쪽이 아는 것</p>
                <p className="mt-1 font-semibold leading-5">{scene.known}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-2.5">
                <p className="text-xs font-bold text-muted-foreground">서버의 청구 합계</p>
                <p className={`mt-1 font-semibold leading-5 ${scene.serverTone}`}>{scene.server}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
