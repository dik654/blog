import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: agent-loop-foundations #request-trace — 읽기·수정·측정 세 번의 proposal이 같은 기록을 갱신한다.
 * 화면 390px, 문서 430px → 넘침 40px. 실행 예산 6번에서 한 번씩 줄어 5·4·3.
 * 세 번째 측정에서 document=390 → 390−390=0px. 숫자와 경로는 본문의 가정을 그대로 쓴다.
 */
const VIEWPORT = 390;
const BUDGET = 6;
const AXIS_MAX = 460;

const SCENES = [
  {
    label: "처음 state",
    summary: "430 − 390 = 40px 넘침 · 남은 6번",
    proposal: "아직 제안 없음",
    runtime: "—",
    result: "원인 모름",
    file: "원인 모름",
    document: 430,
    measured: "430px",
    remaining: 6,
    verdict: "진행 중",
    note: "화면 폭 390px, 문서 폭 430px이라 오른쪽으로 40px가 넘칩니다. 실행은 최대 6번까지 허용한다고 정했습니다. 숫자와 파일명은 본문의 가정입니다.",
  },
  {
    label: "① 파일 읽기",
    summary: "width:430px 반환 · 남은 5번",
    proposal: "read_file(path=/repo/page.css)",
    runtime: "읽기 허용",
    result: "width:430px",
    file: "/repo/page.css · width:430px",
    document: 430,
    measured: "430px",
    remaining: 5,
    verdict: "진행 중",
    note: "Runtime이 읽기를 허용하고 width:430px를 돌려줍니다. 원인을 찾았지만 화면은 아직 그대로라 문서 폭은 430px로 남습니다.",
  },
  {
    label: "② 폭 규칙 수정",
    summary: "저장 결과 기록 · 남은 4번",
    proposal: "page.css의 폭 규칙 수정",
    runtime: "쓰기 범위·파일 버전 확인",
    result: "실제 저장 결과",
    file: "/repo/page.css · 폭 규칙 수정됨",
    document: 430,
    measured: "430px (수정 전 측정)",
    remaining: 4,
    verdict: "아직 완료 아님",
    note: "파일은 바뀌었지만 화면을 다시 재지 않았습니다. 기록의 마지막 측정은 여전히 430px이므로 이 시점에는 고쳐졌다고 결론내리지 않습니다.",
  },
  {
    label: "③ 같은 화면 측정",
    summary: "390 − 390 = 0px · 남은 3번",
    proposal: "390px 화면에서 문서 폭 측정",
    runtime: "측정 허용",
    result: "document=390",
    file: "/repo/page.css · 폭 규칙 수정됨",
    document: 390,
    measured: "390px",
    remaining: 3,
    verdict: "완료 판정",
    note: "같은 390px 화면에서 문서 폭 390px를 얻어 넘침이 0px임을 확인합니다. 파일 변경과 이 측정이 일치할 때 완료로 판정합니다.",
  },
] as const;

type Scene = (typeof SCENES)[number];

function Row({ label, value, changed }: { label: string; value: string; changed: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 border-b border-border/50 py-1 text-xs last:border-b-0 sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`min-w-0 break-words font-mono ${changed ? "font-bold text-[#2563eb] dark:text-[#60a5fa]" : ""}`}>{value}</span>
    </div>
  );
}

function WidthBar({ scene }: { scene: Scene }) {
  const pct = (value: number) => (value / AXIS_MAX) * 100;
  const over = scene.document - VIEWPORT;
  return (
    <svg viewBox="0 0 360 74" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`화면 390px, 마지막 측정 문서 폭 ${scene.document}px, 넘침 ${over}px`}>
      <text x={4} y={14} fontSize={11} fill="#64748b">화면 폭 390px</text>
      <rect x={4} y={20} width={(pct(VIEWPORT) / 100) * 352} height={14} rx={2} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
      <text x={4} y={52} fontSize={11} fill="#64748b">마지막 측정한 문서 폭 {scene.document}px</text>
      <rect x={4} y={58} width={(pct(VIEWPORT) / 100) * 352} height={14} rx={2} fill="#2563eb" opacity={0.75} />
      {over > 0 ? (
        <>
          <rect x={4 + (pct(VIEWPORT) / 100) * 352} y={58} width={(pct(over) / 100) * 352} height={14} fill="#dc2626" />
          <text x={356} y={52} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">+{over}px 넘침</text>
        </>
      ) : (
        <text x={356} y={52} textAnchor="end" fontSize={11} fontWeight={700} fill="#16a34a">넘침 0px</text>
      )}
      <line x1={4 + (pct(VIEWPORT) / 100) * 352} x2={4 + (pct(VIEWPORT) / 100) * 352} y1={18} y2={74} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
    </svg>
  );
}

export default function LoopTraceViz() {
  return (
    <SceneShell
      eyebrow="같은 기록을 세 번 갱신"
      title="읽기·수정·측정마다 기록의 어느 칸이 바뀌는가"
      description="위는 이번 요청의 제안→runtime 판정→반환 결과, 아래는 다음 판단이 읽는 state 기록입니다. 파란 글씨가 이번에 바뀐 칸입니다. 390·430·6번은 본문의 가정입니다."
      ariaLabel="viewport 390, document 430, remaining 6에서 세 번의 proposal로 state가 갱신되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4">
            <div className="grid min-w-0 grid-cols-3 gap-2 text-center text-[11px] leading-5 sm:text-xs">
              {(["proposal", "runtime", "result"] as const).map((key, index) => (
                <div key={key} className={`min-w-0 rounded-lg border px-1.5 py-1.5 ${active === 0 ? "border-dashed border-border/60 text-muted-foreground" : "border-border"}`}>
                  <span className="block text-[10px] text-muted-foreground">{["제안 (proposal)", "runtime 판정", "반환 결과"][index]}</span>
                  <StableSceneStack
                    active={active}
                    scenes={SCENES.map((item) => (
                      <span key={item.label} className="block break-words font-mono font-semibold">{item[key]}</span>
                    ))}
                  />
                </div>
              ))}
            </div>
            <StableSceneStack
              active={active}
              scenes={SCENES.map((item, index) => {
                const prev = SCENES[Math.max(0, index - 1)];
                return (
                  <div key={item.label} className="rounded-lg border border-border px-3 py-1">
                    <Row label="목표" value="390px 화면에서 넘침 0px" changed={false} />
                    <Row label="수정할 파일" value={item.file} changed={index > 0 && item.file !== prev.file} />
                    <Row label="마지막 측정" value={item.measured} changed={index > 0 && item.document !== prev.document} />
                    <Row label="남은 횟수" value={`${item.remaining} / ${BUDGET}`} changed={index > 0} />
                    <Row label="판정" value={item.verdict} changed={index > 0 && item.verdict !== prev.verdict} />
                  </div>
                );
              })}
            />
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: BUDGET }, (_, slot) => (
                <div key={slot} className={`h-2.5 flex-1 rounded-sm border ${slot < scene.remaining ? "border-[#2563eb] bg-[#2563eb]/70" : "border-border bg-transparent"}`} />
              ))}
            </div>
            <WidthBar scene={scene} />
          </div>
        );
      }}
    />
  );
}
