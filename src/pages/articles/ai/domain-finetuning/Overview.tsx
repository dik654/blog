import OverviewViz from './viz/OverviewViz';

const DOMAIN_EXAMPLES = [
  { domain: '유전체', vocab: 'ATCG, SNV, exon, codon', corpus: 'NCBI, UniProt', gap: '29%', color: '#10b981' },
  { domain: '의료', vocab: 'MeSH, ICD-10, SNOMED', corpus: 'PubMed, MIMIC', gap: '9%', color: '#6366f1' },
  { domain: '제조', vocab: '공정 코드, 센서 ID', corpus: '공정 로그, 설비 매뉴얼', gap: '15%', color: '#f59e0b' },
  { domain: '법률', vocab: '판례 인용, 조문 번호', corpus: '판결문, 법령 DB', gap: '12%', color: '#8b5cf6' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도메인 적응이 왜 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 질문</strong> — 범용 사전학습 모델(BERT, GPT 등)을 특정 도메인에 바로 적용하면 왜 성능이 떨어지는가?<br />
          유전체(ATCG 서열), 의료(MeSH 용어), 제조(공정 로그) 텍스트는 일반 코퍼스(위키, 뉴스)와 <strong>어휘 분포</strong>가 근본적으로 다르다.
          범용 토크나이저가 도메인 전문 용어를 과도하게 subword로 분해 → 의미 단위 파괴 → 임베딩 품질 저하.
        </p>
        <p>
          해결책은 <strong>도메인 적응(Domain Adaptation)</strong>: 범용 사전학습 → 도메인 추가학습 → 태스크 학습의 3단계 파이프라인.
          이 글에서는 각 단계의 원리, 실전 하이퍼파라미터, 유전체 사례까지 다룬다.
        </p>
      </div>

      <div className="not-prose overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">도메인</th>
              <th className="text-left py-2 px-3">핵심 어휘</th>
              <th className="text-left py-2 px-3">주요 코퍼스</th>
              <th className="text-left py-2 px-3">적응 후 성능 향상</th>
            </tr>
          </thead>
          <tbody>
            {DOMAIN_EXAMPLES.map(d => (
              <tr key={d.domain} className="border-b border-border/40">
                <td className="py-2 px-3 font-semibold" style={{ color: d.color }}>{d.domain}</td>
                <td className="py-2 px-3 font-mono text-xs">{d.vocab}</td>
                <td className="py-2 px-3">{d.corpus}</td>
                <td className="py-2 px-3 font-semibold" style={{ color: d.color }}>+{d.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">범용 모델 한계 & 3단계 파이프라인</h3>
        <div className="not-prose"><OverviewViz /></div>
        <p className="leading-7">
          요약 1: 범용 모델은 도메인 어휘를 <strong>subword로 과분해</strong> → 의미 손실.<br />
          요약 2: 도메인 적응 3단계(사전학습 → 추가학습 → 태스크)가 <strong>성능 격차의 핵심</strong>.<br />
          요약 3: 모델 크기 증가보다 <strong>도메인 데이터가 더 효과적</strong> — BioBERT(110M)가 BERT-large(340M)를 의료에서 압도.
        </p>
      </div>
    </section>
  );
}
