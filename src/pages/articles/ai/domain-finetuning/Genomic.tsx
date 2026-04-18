import GenomicViz from './viz/GenomicViz';

const MODEL_COMPARISON = [
  { model: 'DNABERT', params: '110M', tokenizer: '6-mer (슬라이딩)', data: '인간 게놈 참조 서열', promo: 'F1 0.90', year: '2021' },
  { model: 'DNABERT-2', params: '117M', tokenizer: 'BPE (다중 종)', data: '다종 게놈', promo: 'F1 0.92', year: '2023' },
  { model: 'Nucleotide Transformer', params: '500M~2.5B', tokenizer: 'BPE', data: '3,200종 게놈', promo: 'F1 0.94', year: '2023' },
  { model: 'HyenaDNA', params: '1.4M~7M', tokenizer: '단일 염기', data: '인간 게놈 전체', promo: 'F1 0.88', year: '2023' },
];

export default function Genomic() {
  return (
    <section id="genomic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도메인 사례: 유전체, 의료, 제조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>유전체 언어모델(genomic Language Model, gLM)</strong> — DNA 서열(A, C, G, T 4개 염기)을 토큰 시퀀스로 취급하여 Transformer를 학습시킨 모델.<br />
          자연어의 "단어"에 해당하는 것이 <strong>k-mer</strong>(연속 k개 염기를 하나의 토큰으로 묶은 것).
          예: 6-mer는 "ATCGAT"처럼 6개 염기를 하나의 토큰으로 본다.
        </p>
        <p>
          <strong>DNABERT</strong>(Ji et al., 2021)는 BERT-base 구조에 6-mer 토큰화 + MLM을 적용한 최초의 대규모 gLM.
          <strong>Nucleotide Transformer</strong>(Dalla-Torre et al., 2023)는 BPE 토큰화를 채택하고 3,200종의 다종 게놈으로 최대 2.5B 파라미터까지 확장.<br />
          규모 확대 시 프로모터 예측, 스플라이스 사이트(splice site) 검출, 인핸서 활성도 예측 등 다운스트림 태스크 전반에서 성능이 급증한다.
        </p>
        <p>
          <strong>SNV(Single Nucleotide Variant, 단일 염기 변이)</strong>는 DNA 한 자리 염기가 바뀐 것.
          질병 원인을 판별하려면 C → G 같은 미세한 차이를 임베딩이 구분해야 하는데,
          일반 gLM은 이 차이에 둔감하다.<br />
          <strong>Contrastive fine-tuning</strong>: 같은 기능 변이(양성 쌍)는 가까이, 다른 기능 변이(음성 쌍)는 멀리 배치하도록 임베딩 공간을 재조정.
          이로써 SNV 병원성 판별 AUC가 0.72 → 0.89로 크게 향상된다.
        </p>
        <p>
          <strong>대회 전략</strong>: (1) gLM 선택 → (2) 도메인 continued pretrain → (3) contrastive fine-tuning → (4) task head 학습 → (5) gLM + 전통 ML(XGBoost) 앙상블.
          Kaggle 유전체 대회 상위 솔루션의 공통 패턴이다.
        </p>
      </div>

      <div className="not-prose overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">모델</th>
              <th className="text-left py-2 px-3">파라미터</th>
              <th className="text-left py-2 px-3">토크나이저</th>
              <th className="text-left py-2 px-3">학습 데이터</th>
              <th className="text-left py-2 px-3">프로모터 F1</th>
              <th className="text-left py-2 px-3">연도</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_COMPARISON.map(m => (
              <tr key={m.model} className="border-b border-border/40">
                <td className="py-2 px-3 font-semibold">{m.model}</td>
                <td className="py-2 px-3 font-mono text-xs">{m.params}</td>
                <td className="py-2 px-3">{m.tokenizer}</td>
                <td className="py-2 px-3">{m.data}</td>
                <td className="py-2 px-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">{m.promo}</td>
                <td className="py-2 px-3 text-muted-foreground">{m.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">gLM 구조 & SNV 민감도 & 대회 파이프라인</h3>
        <div className="not-prose"><GenomicViz /></div>
        <p className="leading-7">
          요약 1: DNA 서열은 <strong>k-mer 토큰화</strong>로 자연어 Transformer 구조를 그대로 적용 가능.<br />
          요약 2: <strong>Nucleotide Transformer</strong>(2.5B)가 DNABERT(110M) 대비 다운스트림 전반 성능 우위.<br />
          요약 3: SNV 구분에는 <strong>contrastive fine-tuning</strong>이 필수 — AUC 0.72 → 0.89 향상.<br />
          요약 4: 대회 최적 전략은 <strong>gLM 임베딩 + 수공학 피처 + XGBoost</strong> 앙상블.
        </p>
      </div>
    </section>
  );
}
