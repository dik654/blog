import { Link } from "react-router-dom";

const REGION = [
  { label: "입력 크기", detail: "224×224×3", href: "/cs/ai/image-backbone-scaling#resolution-cost" },
  { label: "Patch sequence", detail: "196 patch + [CLS]", current: true },
  { label: "멀티모달 연결", detail: "시각 token → LLM", href: "/cs/ai/vision-language-model-architecture#overview" },
] as const;

export default function VisionTransformerLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="시각 표현 학습 지도에서 Vision Transformer의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/image-backbone-scaling#resolution-cost" className="hover:text-primary">이미지 표현</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">Vision Transformer</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            224×224×3 이미지는 어떻게 길이 197의 Transformer 입력이 됩니까?
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">
            같은 이미지를 patch로 나누고, token으로 투영하고, 위치를 붙이는 한 경로를 실제 shape와 코드로 추적합니다.
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to="/cs/ai/image-backbone-scaling#resolution-cost"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            해상도가 계산량을 바꾸는 위치 ↗
          </Link>
        </div>
      </div>

      <ol className="mt-4 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="이미지 표현의 세 영역">
        {REGION.map((item, index) => {
          const body = (
            <>
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{item.detail}</span>
            </>
          );
          return (
            <li key={item.label} className="min-w-0 bg-background">
              {"current" in item ? (
                <div aria-current="step" className="min-h-20 border-t-2 border-primary px-3 py-3 text-foreground">{body}</div>
              ) : (
                <Link to={item.href} className="block min-h-20 border-t-2 border-border px-3 py-3 hover:border-primary/60 hover:text-primary">{body}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export function VisionTransformerMapReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 이미지 표현 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        ViT가 보는 기본 단위는 pixel 한 칸이 아니라 projection과 위치 정보가 붙은 patch token입니다.
      </p>
      <p className="mt-2 max-w-3xl text-xs leading-6 text-muted-foreground">
        Patch 크기나 입력 해상도를 바꾸면 token 수와 attention 비용, position grid 계약이 함께 바뀝니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
        <Link to="/cs/ai/image-backbone-scaling#resolution-cost" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          부모 지도에서 계산량 보기 ↗
        </Link>
        <Link to="/cs/ai/vision-backbone-selection" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          실무 · 백본 선택 ↗
        </Link>
        <Link to="/cs/ai/transfer-learning-practice" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          실무 · checkpoint 인계 ↗
        </Link>
      </div>
    </aside>
  );
}
