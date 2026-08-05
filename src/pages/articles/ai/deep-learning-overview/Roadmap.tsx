import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CapabilityCheck, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import { foundationPhases, foundationScienceGaps } from '@/content/ai/foundationCurriculum';
import { articlePath } from '@/lib/paths';

const articleLabels: Record<string, string> = {
  'deep-learning-overview': '학습 루프',
  perceptron: '퍼셉트론',
  'neural-network': '신경망 순전파',
  'activation-functions': '활성화 함수',
  'cross-entropy': '크로스 엔트로피',
  'backprop-optimization': '역전파',
  optimizers: '옵티마이저',
  'foundation-training-step': '한 Training Step 원장',
  autoencoder: '오토인코더',
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">이제 어떤 순서로 내려가야 할까?</h2>
      <p className="max-w-3xl text-base leading-7 text-muted-foreground">
        용어를 하나씩 외우는 대신, 방금 본 학습 루프의 빈칸을 순서대로 채운다. 각 글의 마지막에는 다음 글로 이어지는
        경로가 표시되며, 수학은 실제로 쓰이는 지점에서 함께 보강한다.
      </p>

      <div className="not-prose my-8 border-t border-border">
        {foundationPhases.map((phase) => (
          <div key={phase.id} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[7rem_1fr] sm:gap-5">
            <div>
              <p className="font-mono text-xs font-bold text-muted-foreground">PHASE {phase.number}</p>
              <h3 className="mt-1 text-sm font-bold">{phase.title}</h3>
            </div>
            <div className="space-y-2">
              {phase.items.map((item) => item.slug === 'deep-learning-overview' ? (
                <div key={item.slug} aria-current="page" className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-muted/25 px-2 py-2">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{articleLabels[item.slug] ?? item.slug}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.question}</span>
                  </span>
                  <span className="mt-0.5 shrink-0 text-[10px] font-bold text-muted-foreground">현재 위치</span>
                </div>
              ) : (
                <Link
                  key={item.slug}
                  to={articlePath('ai', item.slug)}
                  className="group flex min-w-0 items-start justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/30"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{articleLabels[item.slug] ?? item.slug}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.question}</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-lg font-bold">수학은 언제 보강해야 할까?</h3>
      <div className="not-prose mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {foundationScienceGaps.map((gap) => (
          <div key={gap.area} className="min-w-0 bg-background p-4">
            <p className="text-sm font-bold">{gap.area}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{gap.firstUsed}에서 처음 연결</p>
            <p className="mt-3 text-sm leading-relaxed">{gap.concepts}</p>
          </div>
        ))}
      </div>

      <CapabilityCheck
        title="이 글을 마치면"
        items={[
          '데이터에서 업데이트까지 학습 루프를 순서대로 그린다.',
          '파라미터, 예측, 손실, 기울기를 서로 다른 값으로 구분한다.',
          '비선형성이 없는 깊은 선형층이 하나의 선형 변환으로 축약됨을 설명한다.',
          'tensor shape와 GPU 병렬 계산의 관계를 설명한다.',
          '최적화, 일반화, 시스템 효율을 별도의 평가 문제로 구분한다.',
          '다음에 읽을 글과 필요한 수학 기반을 스스로 고른다.',
        ]}
      />

      <StopRule>
        순전파에서 예측이 만들어지고, 손실이 틀린 정도를 재며, 역전파가 기울기를 만들고, optimizer가 parameter를 바꾸는 네 값을 서로 구분하지 못하면 다음 글로 넘어가지 않는다. Train과 validation의 차이를 표현력·최적화·일반화·시스템 효율 중 어디에서 먼저 조사할지도 한 문장으로 정한 뒤 다음 단계로 간다.
      </StopRule>

      <SourceNotes
        sources={[
          { label: 'Deep Learning Book', href: 'https://www.deeplearningbook.org/', note: '표현 학습, 최적화, 일반화를 체계적으로 다루는 공개 교재.' },
          { label: 'Automatic Differentiation in Machine Learning', href: 'https://www.jmlr.org/papers/v18/17-468.html', note: '역전파와 reverse-mode automatic differentiation의 정확한 관계.' },
          { label: 'Learning representations by back-propagating errors', href: 'https://www.nature.com/articles/323533a0', note: '다층 신경망의 오차 역전파를 설명한 고전 논문.' },
          { label: 'NVIDIA · CUDA C++ Best Practices Guide', href: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html', note: 'GPU의 병렬 실행, host-device 전송과 memory bandwidth 병목을 구분하는 공식 지침.' },
          { label: 'PyTorch · Distributed Overview', href: 'https://docs.pytorch.org/tutorials/beginner/dist_overview.html', note: 'DDP, FSDP, tensor·pipeline parallel과 collective communication의 공식 구조.' },
        ]}
      />
    </section>
  );
}
