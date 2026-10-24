import { Link } from "react-router-dom";

const STEPS = [
  ["cause", "숨은 원인", "관측값을 만들었지만 직접 보이지 않는 z를 둡니다.", "/cs/ai/latent-variable-generative-models#latent-cause"],
  ["posterior", "분포 추정", "encoder가 z 한 점이 아니라 평균과 분산을 냅니다.", "/cs/ai/vae#ae-vs-vae"],
  ["sample", "표본 만들기", "난수를 분리해 z에서 encoder까지 미분 경로를 만듭니다.", "/cs/ai/vae#reparam-trick"],
  ["objective", "두 비용", "복원 비용과 prior에서 벗어난 비용을 함께 계산합니다.", "/cs/ai/vae#vae-loss"],
  ["diagnosis", "사용 여부", "잠재변수가 실제로 정보를 담는지 따로 확인합니다.", "/cs/ai/vae#training"],
  ["variants", "표현 변경", "연속·이산·계층형 잠재 표현의 계약을 구분합니다.", "/cs/ai/vae#applications"],
] as const;

export function VaeMechanismLocator() {
  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="잠재변수 모형에서 VAE 구현으로 내려가는 지도">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/generative-theory" className="hover:text-primary">생성 모델</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/latent-variable-generative-models" className="hover:text-primary">잠재변수 모형</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">VAE 구현</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            분포에서 표본을 뽑으면서도 encoder까지 오차를 어떻게 전달합니까?
          </p>
          <p className="mt-1 break-keep text-xs leading-6 text-muted-foreground">
            이진 관측 하나를 평균·분산, 난수, 잠재 표본, 복원 확률, ELBO까지 같은 숫자로 추적합니다.
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link to="/cs/ai/latent-variable-generative-models#elbo" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            계산하기 어려운 사후분포를 q(z|x)로 근사하는 잠재변수 모형 ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6" aria-label="VAE를 이해하는 여섯 단계">
        {STEPS.map(([id, label, detail, href], index) => (
          <Link key={id} to={href} className="min-w-0 bg-background px-3 py-3 hover:text-primary">
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 text-muted-foreground lg:block">{detail}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function VaeMechanismMapReturn() {
  return (
    <aside id="vae-mechanism-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 VAE 학습 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        VAE는 입력을 한 점으로 압축하는 모델이 아닙니다. 입력마다 잠재 분포를 추정하고, 난수를 외부 입력으로 분리해 표본 경로를 미분하며, 복원과 prior 정렬을 함께 학습하는 잠재변수 생성 모델입니다.
      </p>
      <Link to="/cs/ai/gan" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
        다음 확대 · 두 분포를 판별 신호로 비교하는 GAN →
      </Link>
    </aside>
  );
}
