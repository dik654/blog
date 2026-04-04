import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const witnessCode = `// Witness = 모든 와이어 값의 할당 (public input + private input + 중간값)
// 예: x^3 + x + 5 = 35  →  x=3 일 때
//
// 와이어:  w0=1(상수), w1=3(x), w2=9(x^2), w3=27(x^3), w4=30(x^3+x+5-5부분), w5=35(출력)
//
// 증명자가 해야 할 일:
//   1. public input (x=3, out=35) 고정
//   2. 제약 시스템(R1CS)을 순서대로 풀어서 중간 와이어 w2, w3, w4 계산
//   3. 모든 와이어 값 = "witness"
//
// 이 과정이 witness generation이다.
// 회로가 수백만 개 제약을 가지면, 수백만 개의 와이어를 순서대로 계산해야 한다.`;

const bottleneckData = [
  ['Groth16 (2^20)', '~1.2초', '~3.5초', '~4.7초', '25%'],
  ['PLONK (2^22)', '~8초', '~12초', '~20초', '40%'],
  ['zkEVM (Scroll)', '~45초', '~25초', '~70초', '64%'],
  ['circom (2^24)', '~30초', '~15초', '~45초', '67%'],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Witness 생성이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ZK 증명은 두 단계로 나뉜다. <strong>witness 생성</strong>(제약 시스템을 풀어 모든 와이어 값을 계산)과
          <strong>증명 생성</strong>(MSM/NTT로 다항식 커밋먼트를 계산)이다.<br />
          GPU 가속 연구는 증명 생성에 집중되어 왔지만, witness 생성이 전체 시간의 <strong>40-70%</strong>를 차지하는 경우가 많다.
        </p>

        <CitationBlock source="Scroll Tech -- zkEVM Prover Architecture" citeKey={1} type="code"
          href="https://github.com/scroll-tech/zkevm-circuits">
          <p className="text-xs">
            Scroll zkEVM 프로파일링에서 witness 생성이 전체 증명 파이프라인의 60% 이상을 차지한다.<br />
            EVM 상태 전이 시뮬레이션 + R1CS 와이어 계산이 주요 병목이다.
          </p>
        </CitationBlock>

        <CodePanel title="Witness 생성 개념" code={witnessCode}
          annotations={[
            { lines: [1, 4], color: 'sky', note: '회로 예시: x^3 + x + 5 = 35' },
            { lines: [6, 9], color: 'emerald', note: '순서대로 중간 와이어 계산' },
            { lines: [11, 12], color: 'amber', note: '대규모 회로 = 수백만 와이어' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Witness 생성 비중</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">시스템</th>
                <th className="border border-border px-4 py-2 text-left">Witness</th>
                <th className="border border-border px-4 py-2 text-left">Proving</th>
                <th className="border border-border px-4 py-2 text-left">전체</th>
                <th className="border border-border px-4 py-2 text-left">Witness 비율</th>
              </tr>
            </thead>
            <tbody>
              {bottleneckData.map(([sys, wit, prov, total, ratio]) => (
                <tr key={sys}>
                  <td className="border border-border px-4 py-2 font-medium">{sys}</td>
                  <td className="border border-border px-4 py-2">{wit}</td>
                  <td className="border border-border px-4 py-2">{prov}</td>
                  <td className="border border-border px-4 py-2">{total}</td>
                  <td className="border border-border px-4 py-2 font-semibold">{ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          회로 복잡도가 높을수록 witness 비중이 커진다. zkEVM처럼 EVM 시뮬레이션이 필요한 경우 특히 심하다.
        </p>
      </div>
    </section>
  );
}
