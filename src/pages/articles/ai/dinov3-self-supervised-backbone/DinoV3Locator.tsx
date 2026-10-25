import { Link } from "react-router-dom";

const REGIONS = [
  {
    label: "Patch sequence",
    detail: "ViT가 만든 자리별 표현",
    href: "/cs/ai/vision-transformer#architecture",
  },
  {
    label: "자기지도 목표",
    detail: "DINO · iBOT · Gram",
    current: true,
  },
  {
    label: "백본 선택",
    detail: "과제와 예산으로 실측",
    href: "/cs/ai/vision-backbone-selection#paired-selection",
  },
] as const;

export default function DinoV3Locator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="이미지 표현 학습 지도에서 DINOv3의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/vision-transformer#architecture" className="hover:text-primary">이미지 표현</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">DINOv3</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            라벨이 없을 때 무엇을 정답으로 삼고, 오래 학습해도 패치 관계를 어떻게 지킵니까?
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">
            한 이미지의 크롭이 teacher와 student를 지나 손실이 되는 경로와, 100만 스텝 뒤 Gram 규제가 붙는
            경로를 차례로 추적합니다.
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to="/cs/ai/vision-transformer#architecture"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            ViT의 patch token과 encoder ↗
          </Link>
        </div>
      </div>

      <ol className="mt-4 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="이미지 표현의 세 영역">
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

export function DinoV3MapReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 이미지 표현 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        ViT의 patch token은 이미지 전체를 맞히는 목표만으로는 자리별 관계를 오래 보존하지 못할 수 있습니다.
      </p>
      <p className="mt-2 max-w-3xl text-xs leading-6 text-muted-foreground">
        DINOv3는 EMA teacher로 이미지·패치 목표를 만들고, 긴 학습에서 흐려진 패치 관계는 이른 teacher의 Gram
        행렬을 기준으로 다시 붙잡습니다. 이 메커니즘을 이해한 뒤 실제 백본 선택은 별도 실측으로 판단합니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
        <Link to="/cs/ai/vision-transformer#architecture" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          부모 · ViT 구조 ↗
        </Link>
        <Link to="/cs/ai/vision-backbone-selection#paired-selection" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          실무 · 백본 비교 ↗
        </Link>
        <Link to="/cs/ai/embedding-evaluation" className="min-h-11 border-b border-border py-3 hover:border-primary hover:text-primary">
          실무 · 표현 평가 ↗
        </Link>
      </div>
    </aside>
  );
}
