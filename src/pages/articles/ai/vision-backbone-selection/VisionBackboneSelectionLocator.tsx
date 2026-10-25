import { Link } from "react-router-dom";

const REGIONS = [
  {
    label: "표현 만들기",
    detail: "patch와 학습 신호",
    href: "/cs/ai/vision-transformer#architecture",
  },
  {
    label: "후보 이해",
    detail: "자기지도 · 이미지-텍스트 · 분할",
    href: "/cs/ai/dinov3-self-supervised-backbone#use-boundary",
  },
  {
    label: "후보 선택",
    detail: "요구사항 · 실측 · 교체 비용",
    current: true,
  },
  {
    label: "검색에 배치",
    detail: "전처리 · 벡터 · 색인 계약",
    href: "/cs/ai/image-embedding-pipeline#pipeline-contract",
  },
] as const;

export default function VisionBackboneSelectionLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="이미지 표현 학습 지도에서 Vision Backbone 선택의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/image-backbone-scaling#budget-comparison" className="hover:text-primary">이미지 백본</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">후보 선택</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">실무</span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            사용자가 올린 사진으로 같은 상품을 찾으려면 어떤 표현을 고르고, 무엇을 직접 재야 합니까?
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">
            입력과 출력에서 출발해 후보의 학습 신호를 확인하고, 같은 조건의 작은 실측과 재색인 비용까지 한 요청으로
            추적합니다.
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">출발할 개념</p>
          <Link
            to="/cs/ai/image-backbone-scaling#budget-comparison"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            이미지 Backbone의 표현과 비용 ↗
          </Link>
        </div>
      </div>

      <ol className="mt-4 grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4" aria-label="이미지 표현 선택의 네 영역">
        {REGIONS.map((item, index) => {
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

export function VisionBackboneSelectionMapReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 이미지 백본 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        백본의 크기와 공개 점수만으로는 서비스 적합성을 결정할 수 없습니다.
      </p>
      <p className="mt-2 max-w-3xl text-xs leading-6 text-muted-foreground">
        입력·출력 계약이 후보 종류를 줄이고, 같은 데이터와 전처리로 얻은 실측이 후보를 가릅니다. 마지막 결정에는
        지연과 메모리뿐 아니라 기존 벡터를 다시 계산하고 임계값을 조정하는 비용도 들어갑니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
        <Link to="/cs/ai/image-backbone-scaling#budget-comparison" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          부모 · 백본 예산 비교 ↗
        </Link>
        <Link to="/cs/ai/image-embedding-pipeline#pipeline-contract" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          다음 · 임베딩 계약 ↗
        </Link>
        <Link to="/cs/ai/embedding-evaluation" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          실무 · 표현 평가 ↗
        </Link>
      </div>
    </aside>
  );
}
