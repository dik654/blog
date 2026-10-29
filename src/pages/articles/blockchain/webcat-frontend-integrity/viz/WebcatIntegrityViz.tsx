import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "전체 경로",
  "사이트 등록",
  "배포물 서명",
  "페이지 요청",
  "로컬 검증",
  "변조 차단",
  "보장 경계",
] as const;

const NOTES = [
  "사전에 사이트의 서명 정책과 승인된 배포물 증거를 공개하고, 사용자의 브라우저가 실제 응답을 그 증거와 대조하는 두 시간축을 먼저 나눕니다.",
  "사이트 운영자는 enrollment.json에 manifest 서명자와 trust policy를 적습니다. Enrollment chain의 validator 2/3가 합의한 canonical state와 서명된 preload가 이 도메인의 등록 정보 hash를 고정합니다.",
  "개발자는 경로별 resource hash와 CSP를 manifest에 적어 등록된 정책에 맞게 서명하고 transparency proof를 붙입니다. 사이트는 enrollment·manifest·proof를 bundle.json 하나로 제공합니다.",
  "사용자가 사이트를 열면 서버는 HTTPS로 HTML·app.js·CSP와 bundle을 보냅니다. HTTPS 성공은 서버가 보낸 bytes를 보호하지만 개발자가 승인한 bytes인지는 아직 확인하지 못했습니다.",
  "Firefox extension은 보유한 preload로 enrollment를 확인하고, trust policy에 따라 manifest 서명과 transparency proof를 검증한 뒤 실제 resource hash와 CSP를 manifest와 대조합니다.",
  "서버가 app.js의 한 byte를 바꾸면 전달 hash가 manifest hash와 달라집니다. Extension은 content 실행 전에 페이지 로드를 멈추고 어느 검증 단계가 실패했는지 오류 화면을 보여 줍니다.",
  "이 검증은 first-party 서버가 승인되지 않은 bytes를 보내는 공격을 막는 경계입니다. 승인된 코드의 취약점·악의적인 개발자·WEBCAT 자체 공급망·현재 alpha의 안정성은 별도 문제로 남습니다.",
] as const;

const BUILD_ITEMS = [
  { id: "enrollment", title: "등록 정보", code: "/.well-known/webcat/enrollment.json", note: "서명자·threshold·trust policy" },
  { id: "preload", title: "Enrollment preload", code: "2/3 validator signatures", note: "도메인 → 등록 정보 hash" },
  { id: "manifest", title: "서명 manifest", code: "path → hash · CSP", note: "서명·transparency proof" },
  { id: "bundle", title: "사이트 bundle", code: "/.well-known/webcat/bundle.json", note: "등록 정보·manifest·proof" },
] as const;

const REQUEST_ITEMS = [
  { id: "browser", title: "Firefox + WEBCAT", note: "Preload를 보유한 검증 지점" },
  { id: "server", title: "HTTPS 서버", note: "HTML·app.js·CSP·bundle 전달" },
  { id: "verify", title: "실행 전 검증", note: "등록 → 서명 → resource → CSP" },
  { id: "outcome", title: "실행 또는 차단", note: "모두 일치해야 page load 계속" },
] as const;

function buildActive(scene: number, id: (typeof BUILD_ITEMS)[number]["id"]) {
  if (scene === 1) return id === "enrollment" || id === "preload";
  if (scene === 2) return id === "manifest" || id === "bundle";
  return false;
}

function requestActive(scene: number, id: (typeof REQUEST_ITEMS)[number]["id"]) {
  if (scene === 3) return id === "browser" || id === "server";
  if (scene === 4) return id === "verify";
  if (scene === 5 || scene === 6) return id === "outcome";
  return false;
}

export default function WebcatIntegrityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6500, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="app.js 한 건 · 사전 승인과 사용자 요청"
      title="브라우저가 서버 응답을 실행하기 전까지 어떤 증거를 연결하는지 추적합니다"
      description="위쪽은 배포 전에 고정하는 증거이고, 아래쪽은 사용자가 페이지를 여는 순간의 데이터 경로입니다. 재생은 직접 시작하며 마지막 장면에서 멈춥니다."
      note="WEBCAT 공식 문서와 2026년 3월 alpha 공개 범위를 시각화했습니다. 대상 서비스에서 측정한 성능이나 production 안정성 결과가 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-webcat-scene={active}
        tabIndex={0}
        role="group"
        aria-label="사이트 등록과 manifest 서명부터 브라우저의 resource 검증과 차단까지 이어지는 WEBCAT 흐름"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <section aria-label="배포 전에 고정하는 증거">
          <div className="flex items-end justify-between gap-3 px-1 pb-2">
            <strong className="text-xs">배포 전 · 승인 증거</strong>
            <span className="text-[10px] text-muted-foreground">Control evidence</span>
          </div>
          <div className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
            {BUILD_ITEMS.map((item, index) => {
              const selected = buildActive(active, item.id);
              return (
                <div key={item.id} className={`min-w-0 bg-background p-3 sm:p-4 ${selected ? "ring-2 ring-inset ring-primary" : ""}`}>
                  <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-xs sm:text-sm">{item.title}</strong>
                  <code className="mt-2 block break-all text-[9px] leading-4 text-primary sm:text-[10px]">{item.code}</code>
                  <span className="mt-1 block break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{item.note}</span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="my-3 border-l-2 border-primary/50 pl-3 text-[11px] leading-5 text-muted-foreground sm:text-xs">
          브라우저는 특정 validator 한 대를 믿지 않고, 2/3 서명과 Merkle proof를 검증한 preload를 기준점으로 사용합니다.
        </div>

        <section aria-label="사용자가 페이지를 여는 요청 경로">
          <div className="flex items-end justify-between gap-3 px-1 pb-2">
            <strong className="text-xs">요청 시 · 사용자 브라우저</strong>
            <span className="text-[10px] text-muted-foreground">Data and enforcement</span>
          </div>
          <div className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
            {REQUEST_ITEMS.map((item, index) => {
              const selected = requestActive(active, item.id);
              return (
                <div key={item.id} className={`relative min-w-0 bg-background p-3 sm:p-4 ${selected ? "ring-2 ring-inset ring-primary" : ""}`}>
                  <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-xs sm:text-sm">{item.title}</strong>
                  <span className="mt-2 block break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{item.note}</span>
                  {index < REQUEST_ITEMS.length - 1 ? <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-0.5 text-xs text-primary lg:block">→</span> : null}
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px" aria-label="app.js hash가 일치하거나 달라질 때의 결과">
          <div className={`min-w-0 bg-background p-3 sm:p-4 ${active === 4 ? "ring-2 ring-inset ring-emerald-500" : ""}`}>
            <p className="text-[10px] font-bold text-muted-foreground">승인된 app.js</p>
            <p className="mt-2 break-all font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300 sm:text-xs">H(받은 bytes) = manifest hash</p>
            <p className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">다른 검증 항목도 통과하면 실행합니다.</p>
          </div>
          <div className={`min-w-0 bg-background p-3 sm:p-4 ${active === 5 ? "ring-2 ring-inset ring-rose-500" : ""}`}>
            <p className="text-[10px] font-bold text-muted-foreground">서버에서 바뀐 app.js</p>
            <p className="mt-2 break-all font-mono text-[10px] font-bold text-rose-700 dark:text-rose-300 sm:text-xs">H(받은 bytes) ≠ manifest hash</p>
            <p className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">Content 실행 전에 페이지를 차단합니다.</p>
          </div>
        </div>

        <p data-scene-note className="mt-3 min-h-20 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "등록", "서명", "요청", "검증", "차단", "경계"]}
          playLabel="WEBCAT 흐름 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
