import CodePanel from '@/components/ui/code-panel';
import PC1ArchViz from './viz/PC1ArchViz';
import { PC1_CODE, PC2_CODE } from './PC1PC2Data';

export default function PC1PC2() {
  return (
    <section id="pc1-pc2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PC1/PC2 가속</h2>
      <div className="not-prose mb-8">
        <PC1ArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>PC1: 메모리-NVMe 하이브리드</h3>
        <p>
          PC1은 Stacked DRG 그래프 생성으로,
          11 레이어 x 2^30 노드의 SHA-256 해싱이 필요합니다.<br />
          SupraSeal은 <strong>NVMe</strong>를 메모리 대용으로 사용하고,
          <strong>SPDK</strong>로 커널을 우회하며,
          <strong>멀티버퍼 SHA-256</strong>으로 코어당 4섹터를 처리합니다.
        </p>
        <CodePanel title="PC1 최적화 전략" code={PC1_CODE}
          annotations={[
            { lines: [4, 5], color: 'sky', note: 'SHA Extensions 멀티버퍼' },
            { lines: [8, 10], color: 'emerald', note: '인터리브드 레이아웃' },
            { lines: [13, 14], color: 'amber', note: '12x NVMe 스트라이핑' },
          ]} />
        <h3>PC2: GPU 가속 Poseidon</h3>
        <p>
          PC2는 그래프 컬럼의 Poseidon 해시(Tree C)와
          복제본의 머클 트리(Tree R)를 생성합니다.<br />
          CUDA를 활용한 <strong>대규모 병렬 처리</strong>와
          64개 스트림으로 GPU 활용률을 극대화합니다.
        </p>
        <CodePanel title="PC2 GPU 가속" code={PC2_CODE}
          annotations={[
            { lines: [3, 9], color: 'sky', note: '컬럼별 데이터 재배열' },
            { lines: [12, 16], color: 'emerald', note: 'CUDA 메모리 계층 최적화' },
          ]} />
      </div>
    </section>
  );
}
