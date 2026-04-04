import CodePanel from '@/components/ui/code-panel';
import QueryFlowViz from './viz/QueryFlowViz';
import { QUERY_CODE, QUERY_ANNOTATIONS } from './QueryProofData';

export default function QueryProof() {
  return (
    <section id="query-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SQL 쿼리 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Proof of SQL의 핵심 혁신은 <strong>SQL 연산을 다항식으로 변환</strong>하여
          영지식 증명이 가능하게 만드는 것입니다. WHERE 절의 조건 검사, SELECT의 컬럼 선택 등
          모든 SQL 연산이 스칼라 필드 위의 다항식으로 표현됩니다.
        </p>
        <h3>증명 생성 7단계</h3>
        <ol>
          <li><strong>데이터 준비</strong> -- 쿼리 참조 테이블 범위 계산 및 데이터 로드</li>
          <li><strong>첫 번째 라운드</strong> -- 쿼리 실행 및 중간 결과 commitment</li>
          <li><strong>Transcript 구성</strong> -- Fiat-Shamir 변환을 위한 해시 체인 구축</li>
          <li><strong>최종 라운드</strong> -- Sumcheck용 다항식 구성</li>
          <li><strong>Sumcheck 증명</strong> -- 메인 증명 생성 (SQL &rarr; 다항식 변환의 핵심)</li>
          <li><strong>MLE 평가</strong> -- 평가점에서의 다선형 확장 계산</li>
          <li><strong>Inner Product 증명</strong> -- Commitment 일관성 증명</li>
        </ol>
        <h3>SQL &rarr; 다항식 변환</h3>
        <p>
          WHERE 절의 조건을 Boolean 마스크로 변환한 후, 각 원소를 스칼라 필드 원소
          (0 또는 1)로 매핑합니다. 이 다항식의 합이 조건을 만족하는 행의 수와 일치하는지
          Sumcheck으로 증명합니다.
        </p>
        <CodePanel title="SQL 다항식 변환" code={QUERY_CODE} annotations={QUERY_ANNOTATIONS} />
      </div>
      <div className="mt-8"><QueryFlowViz /></div>
    </section>
  );
}
