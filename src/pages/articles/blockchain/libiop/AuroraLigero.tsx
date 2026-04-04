import CodePanel from '@/components/ui/code-panel';
import ProtocolCompareViz from './viz/ProtocolCompareViz';
import { LIGERO_CODE, AURORA_CODE } from './AuroraLigeroData';

export default function AuroraLigero() {
  return (
    <section id="aurora-ligero" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Aurora / Ligero 프로토콜</h2>
      <div className="not-prose mb-8">
        <ProtocolCompareViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Ligero: 직접 LDT 기반 O(sqrt N) 증명</h3>
        <p>
          Ligero는 증인 벡터를 <strong>m x n 행렬</strong>로 재배열하여
          행별 Reed-Solomon 인코딩과 열별 일관성 검사로
          O(sqrt N) 크기의 증명을 달성합니다.
          2라운드 공개 코인 프로토콜로 구현이 단순합니다.
        </p>
        <CodePanel title="Ligero 핵심 구조" code={LIGERO_CODE}
          annotations={[
            { lines: [5, 8], color: 'sky', note: '계수 직접 전송 (Direct LDT)' },
            { lines: [10, 11], color: 'emerald', note: '무작위 위치 쿼리' },
            { lines: [14, 16], color: 'amber', note: 'O(sqrt N) 복잡도' },
          ]} />
        <h3>Aurora: FRI 기반 O(log^2 N) 증명</h3>
        <p>
          Aurora는 <strong>FRI(Fast Reed-Solomon IOP)</strong>를 활용하여
          다항식을 재귀적으로 폴딩합니다.<br />
          차수를 절반씩 줄이는 O(log N) 라운드로
          총 O(log^2 N) 인수 크기를 달성합니다.
        </p>
        <CodePanel title="Aurora + FRI 구조" code={AURORA_CODE}
          annotations={[
            { lines: [4, 9], color: 'sky', note: 'FRI 프로토콜 클래스' },
            { lines: [12, 13], color: 'emerald', note: '폴딩: 차수 절반 감소' },
            { lines: [14, 14] as [number, number], color: 'amber', note: 'O(log^2 N) 인수 크기' },
          ]} />
      </div>
    </section>
  );
}
