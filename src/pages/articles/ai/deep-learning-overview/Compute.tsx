import { Link } from 'react-router-dom';
import { Cpu, Database, Gauge, Network } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const bottlenecks = [
  { icon: Cpu, title: '계산', text: '행렬곱과 convolution처럼 같은 연산을 많은 원소에 적용한다.' },
  { icon: Database, title: '메모리', text: '가중치와 activation을 계산 장치가 사용할 수 있는 곳으로 읽어 온다.' },
  { icon: Network, title: '통신', text: '여러 GPU라면 gradient와 activation을 장치 사이에서 교환한다.' },
  { icon: Gauge, title: '동기화', text: '느린 장치나 작은 작업이 전체 파이프라인을 기다리게 할 수 있다.' },
];

export default function Compute() {
  return (
    <section id="compute" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">왜 딥러닝은 Tensor와 GPU를 함께 이야기할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          신경망의 한 층은 많은 샘플과 특징에 같은 형태의 곱셈과 덧셈을 반복한다. 샘플을 batch 차원으로 묶으면
          수천 개의 작은 계산을 하나의 큰 행렬곱으로 표현할 수 있다. GPU는 이런 규칙적이고 병렬적인 연산의 처리량을
          높이는 데 적합하다.
        </p>
      </div>

      <Math display>{String.raw`X_{[B\times d]}W_{[d\times h]} = Z_{[B\times h]}`}</Math>
      <FormulaNote
        meaning="B개 샘플의 d개 입력 특징을 한 번에 h개 은닉 특징으로 바꾸는 행렬곱이다. 가운데 차원 d가 같아야 곱할 수 있고, 출력은 샘플마다 h개 값을 가진다."
        symbols={[
          ['B', '한 번에 처리하는 샘플 수인 batch size'],
          ['d', '입력 특징의 수'],
          ['h', '현재 층이 만드는 출력 특징의 수'],
          ['X', 'shape가 B×d인 입력 batch'],
          ['W', 'shape가 d×h인 가중치 행렬'],
          ['Z', 'shape가 B×h인 선형층 출력'],
        ]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {bottlenecks.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="min-w-0 bg-background p-5">
              <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>GPU가 있다고 모든 단계가 빨라지는 것은 아니다</h3>
        <p>
          연산 묶음이 너무 작거나, CPU와 GPU 사이에 데이터를 자주 복사하거나, 메모리에서 값을 읽는 속도가 느리면
          GPU의 계산 장치가 기다린다. 여러 GPU를 묶으면 통신 비용까지 생긴다. 그래서 딥러닝 성능은 연산량뿐 아니라
          tensor shape, batch 크기, 메모리 대역폭, 장치 연결 구조를 함께 봐야 한다.
        </p>
      </div>

      <Misconception>
        GPU 서버 한 대가 곧 HPC인 것은 아니다. 한 서버의 여러 GPU를 쓰는 것과 여러 노드를 고속 네트워크로 연결해 하나의 분산 작업을 실행하는 것은 다른 단계다. 자세한 구조는 <Link className="font-semibold underline underline-offset-4" to={articlePath('gpu', 'gpu-hpc-from-scratch')}>GPU HPC 바닥부터</Link>에서 이어진다.
      </Misconception>
    </section>
  );
}
