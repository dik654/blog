import { ArrowRight, BrainCircuit, Gauge, Route, ScanSearch, Shapes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Misconception } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const contracts = [
  { icon: Shapes, label: 'Representation', value: 'Pixel 또는 VAE latent', question: '어떤 공간에서 계산하는가?' },
  { icon: BrainCircuit, label: 'Backbone', value: 'U-Net · DiT · MMDiT', question: '누가 방향을 예측하는가?' },
  { icon: Route, label: 'Path · target', value: 'ε · x₀ · v · flow velocity', question: '무엇을 정답으로 가르치는가?' },
  { icon: Gauge, label: 'Solver', value: 'Euler · Heun · scheduler', question: '몇 번, 어떤 규칙으로 이동하는가?' },
  { icon: ScanSearch, label: 'Evaluation', value: '품질 · coverage · 조건 · 비용', question: '어떤 실패를 통과해야 하는가?' },
] as const;

export default function ModernDiffusion() {
  return (
    <section id="modern" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">여기서부터는 모델 이름보다 바뀐 계약을 읽는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>지금까지는 DDPM의 forward noising, noise-prediction training, reverse sampling과 latent diffusion을 하나의 흐름으로 따라왔다. 최신 모델을 읽을 때는 이 기초 위에서 무엇이 바뀌었는지 다섯 칸으로 나눈다. DiT는 backbone의 변화이고, Flow Matching은 path와 target의 변화다. Solver와 평가 조건은 또 별개의 결정이다.</p>
      </div>
      <div className="not-prose my-8 grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {contracts.map(({ icon: Icon, label, value, question }, index) => (
          <div key={label} className={`min-w-0 bg-background p-4 ${index === contracts.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">{label}</p>
            <p className="mt-1 break-words text-xs font-bold leading-relaxed">{value}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{question}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>예를 들어 U-Net DDPM과 MMDiT rectified-flow model의 결과가 다르면 backbone과 path가 동시에 바뀐 것이다. VAE, text encoder, sampler, NFE(number of function evaluations, 한 샘플을 만들 때 denoiser를 호출한 횟수), seed와 prompt당 후보 수도 다르다면 어느 하나가 원인이라고 단정할 수 없다. 최신 모델 비교에는 이 다섯 계약을 고정한 controlled ablation이 필요하다.</p>
      </div>
      <Link to={articlePath('ai', 'dit-flow-matching-evaluation')} className="not-prose my-8 flex min-w-0 items-center justify-between gap-4 rounded-md border border-border bg-muted/15 px-4 py-4 transition-colors hover:border-foreground/35 sm:px-5">
        <span className="min-w-0"><span className="block text-xs font-bold uppercase text-muted-foreground">다음 글</span><strong className="mt-1 block text-sm leading-relaxed">DiT, MMDiT, Flow Matching, solver와 생성 평가를 다섯 축으로 깊게 읽기</strong></span>
        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
      </Link>
      <Misconception>기초 Diffusion 글에서 모든 최신 논문을 한꺼번에 끝내지 않는다. 이 글은 DDPM의 최소 계약에서 멈추고, 현재 구조와 평가는 다음 글에서 같은 latent를 놓고 비교한다.</Misconception>
    </section>
  );
}
