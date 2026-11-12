import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #triage-containment 셋째 문단 "원본 log·disk image·cloud audit record는 hash…".
 * 왼쪽 = 원본 보관, 가운데 = 조사 사본, 오른쪽 = 취급 기록(chain of custody).
 * hash 값과 기록 줄은 설명용 가정입니다.
 */
const TAGS = ["hash", "수집 시각", "source", "tool version", "custodian", "timezone·clock drift"] as const;

const LOG = [
  "수집 · custodian 지정 · hash 기록",
  "조사 사본 생성 · 사본 hash 대조",
  "분석가 사본 열람 · 접근 이력 추가",
] as const;

const SCENES = [
  {
    label: "원본 보존",
    summary: "원본에 출처 정보를 붙임",
    copy: false,
    logRows: 1,
    note: "원본 log·disk image·cloud audit record에 hash, 수집 시각, source, tool version, custodian(보관 책임자)과 접근 이력을 붙여 보존합니다. timezone과 clock drift도 함께 기록합니다. Hash는 파일 내용에서 계산한 짧은 지문으로, 내용이 한 글자라도 바뀌면 값이 달라집니다.",
  },
  {
    label: "사본 분리",
    summary: "조사는 사본에서",
    copy: true,
    logRows: 3,
    note: "조사용 사본과 원본을 분리합니다. 분석은 사본에서 하고, 원본은 최소 접근으로 보관합니다. 사본을 만들고 열 때마다 취급 기록에 한 줄씩 쌓입니다.",
  },
  {
    label: "기록이 보장하는 것",
    summary: "취급 재현 ≠ 내용의 진실",
    copy: true,
    logRows: 3,
    note: "Chain of custody는 파일이 진실이라는 보장이 아니라 누가 어떻게 취급했는지 재현하는 기록입니다. 기록이 완벽해도 원본 log 내용 자체가 사실인지는 별도로 판단해야 합니다.",
  },
] as const;

function Box({ title, children, tone }: { title: string; children: ReactNode; tone: "on" | "off" | "dim" }) {
  const cls = tone === "on" ? "border-[#2563eb]" : tone === "dim" ? "border-dashed border-border/60" : "border-border";
  return (
    <div className={`flex min-w-0 flex-col rounded-lg border bg-background p-3 ${cls}`}>
      <p className="text-[11px] font-bold text-muted-foreground">{title}</p>
      <div className="mt-2 flex-1">{children}</div>
    </div>
  );
}

export default function CustodyViz() {
  return (
    <SceneShell
      eyebrow="증거 보존"
      title="원본은 그대로 두고, 사본에서 조사하고, 취급을 한 줄씩 기록합니다"
      description="왼쪽부터 원본 보관, 조사 사본, 취급 기록입니다. Hash 값과 기록 줄은 설명용 가정입니다."
      ariaLabel="원본 증거 보존, 조사 사본 분리, chain of custody 기록"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const last = active === SCENES.length - 1;
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              <Box title="원본 (최소 접근)" tone={active === 0 ? "on" : "off"}>
                <p className="text-xs font-semibold">급여 export API log (가정)</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">hash 3f9a…c1 (가정)</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {TAGS.map((tag) => (
                    <span key={tag} className="rounded border border-border px-1 text-[10px] leading-4 text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </Box>
              <Box title="조사 사본" tone={scene.copy ? (last ? "off" : "on") : "dim"}>
                <p className={`text-xs font-semibold ${scene.copy ? "" : "text-muted-foreground/50"}`}>{scene.copy ? "분석가가 여는 쪽" : "아직 없음"}</p>
                <p className={`mt-1 font-mono text-[10px] ${scene.copy ? "text-muted-foreground" : "text-muted-foreground/40"}`}>{scene.copy ? "hash 3f9a…c1 = 원본과 같음" : "hash 없음"}</p>
              </Box>
              <Box title="취급 기록 (chain of custody)" tone={last ? "on" : "off"}>
                <ol className="space-y-1">
                  {LOG.map((row, index) => (
                    <li key={row} className={`border-l pl-2 text-[10px] leading-4 ${index < scene.logRows ? "border-[#2563eb] text-foreground" : "border-border/40 text-muted-foreground/40"}`}>
                      {index + 1}. {row}
                    </li>
                  ))}
                </ol>
              </Box>
            </div>
            <div className={`grid grid-cols-2 gap-2 text-[11px] leading-5 ${last ? "" : "invisible"}`} aria-hidden={!last}>
              <p className="rounded-lg border border-[#16a34a] px-2 py-1"><strong className="text-[#15803d] dark:text-[#4ade80]">재현함</strong> · 누가 언제 어떻게 다뤘는가</p>
              <p className="rounded-lg border border-dashed border-[#dc2626] px-2 py-1"><strong className="text-[#b91c1c] dark:text-[#f87171]">보장 안 함</strong> · 파일 내용이 진실인가</p>
            </div>
          </div>
        );
      }}
    />
  );
}
