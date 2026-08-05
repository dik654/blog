import { CapabilityCheck, InternalLink, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';

const MODEL_COMPARISON = [
  { model: 'DNABERT', params: 'BERT-base 계열', tokenizer: '고정 k-mer', data: '인간 reference genome', decision: 'DNA를 token sequence로 다루는 초기 canonical baseline' },
  { model: 'DNABERT-2', params: '117M', tokenizer: 'BPE', data: '다종 genome', decision: 'DNABERT의 고정 k-mer와 비교해 BPE·다종 transfer 효과를 분리할 후보' },
];

export default function Genomic() {
  return (
    <section id="genomic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도메인 적응의 전이 사례: 유전체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>유전체 언어모델(genomic Language Model, gLM)</strong> — DNA 서열(A, C, G, T 4개 염기)을 토큰 시퀀스로 취급하여 Transformer를 학습시킨 모델.<br />
          자연어의 "단어"에 해당하는 것이 <strong>k-mer</strong>(연속 k개 염기를 하나의 토큰으로 묶은 것).
          예: 6-mer는 "ATCGAT"처럼 6개 염기를 하나의 토큰으로 본다.
        </p>
        <p>
          <strong>DNABERT</strong>(Ji et al., 2021)는 BERT-base 구조에 6-mer 토큰화 + MLM을 적용한 초기 대표 gLM 중 하나다.
          <strong>Nucleotide Transformer</strong>(Dalla-Torre et al., 2023)는 6-mer 계열 입력과 다종 genome pretraining을 사용해 최대 2.5B 공개 계열까지 비교한다.<br />
          이 사례에서 읽어야 할 것은 “크면 항상 낫다”가 아니라 tokenizer, species diversity, model scale과 downstream probe가 각각 어떤 축인지다.
        </p>
        <p>
          <strong>SNV(Single Nucleotide Variant, 단일 염기 변이)</strong>는 DNA 한 자리 염기가 바뀐 것.
          질병 원인을 판별하려면 C → G 같은 미세한 차이가 downstream 기능 차이와 연결되는지 구분해야 한다.
          하지만 일반 사전학습 목적만으로 이 구분이 자동으로 생긴다고 가정할 수 없다.<br />
          <strong>Contrastive fine-tuning</strong>: 같은 기능 변이(양성 쌍)는 가까이, 다른 기능 변이(음성 쌍)는 멀리 배치하도록 임베딩 공간을 재조정.
          실제 이득은 variant label, split leakage, sequence window와 downstream head에 따라 달라지므로 고정된 AUC 수치로 일반화하지 않는다.
        </p>
        <p>
          하나의 실험 branch는 (1) generic gLM 기준선 → (2) domain continued pretraining → (3) contrastive adaptation → (4) task head 순서로 둘 수 있다.
          전통 feature나 tree model은 독립 기준선으로 남기고, 각 단계의 추가 이득과 비용을 ablation으로 확인한다.
        </p>
      </div>

      <div className="not-prose mb-8 divide-y divide-border border-y border-border">
        {MODEL_COMPARISON.map((model, index) => (
          <div key={model.model} className="grid min-w-0 gap-3 py-4 sm:grid-cols-[2rem_9rem_minmax(0,1fr)] sm:gap-4">
            <span className="text-2xl font-black tabular-nums text-muted-foreground/45">{String(index + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold">{model.model}</h3>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{model.params} · {model.tokenizer}</p>
            </div>
            <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">학습 분포.</strong> {model.data}</p>
              <p className="mt-2"><strong className="text-foreground">읽을 때 확인할 것.</strong> {model.decision}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">다른 도메인에서 가져올 판단 구조</h3>
        <p className="leading-7">
          DNA 서열은 k-mer 또는 단일 nucleotide 같은 표현 선택부터 결과가 달라진다.
          따라서 model scale, tokenizer, species diversity와 context length를 한 축으로 섞지 않고 ablation으로 본다.
          SNV처럼 작은 차이를 구분할 때 contrastive objective를 후보로 두되 leakage-safe split에서 검증한다.
          이 판단은 제조 검색에서도 같다. Crop 정책, encoder, domain data와 pair loss를 한 번에 바꾸지 않고 하나씩 비교해야 원인을 설명할 수 있다.
        </p>
      </div>
      <StopRule>
        Domain shift를 입력 분포, tokenizer/encoder, objective, label policy 네 축으로 나누고 continued pretraining과 task fine-tuning의 목적을 구분할 수 있으면 최소 바닥에 도달했다. 모든 생물정보학 model 계보는 현재 제조 검색 목표의 필수 선행이 아니다.
      </StopRule>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          제조 검색으로 돌아갈 때는 genome model을 그대로 가져오는 것이 아니라 “domain data를 언제 추가할지”라는 판단 구조만 가져간다.
          먼저 <InternalLink slug="image-rag-defect-retrieval">Defect Retrieval release gate</InternalLink>에서 generic baseline과 domain-adapted candidate를 같은 split으로 비교한다.
        </p>
      </div>
      <CapabilityCheck items={[
        'Domain shift와 task mismatch를 구분한다.',
        'Continued pretraining과 task fine-tuning의 학습 신호를 구분한다.',
        'Model scale, tokenizer, data diversity와 context length를 별도 축으로 비교한다.',
        'Domain metric 상승과 일반 능력 보존을 동시에 release gate에 넣는다.',
        '현재 목표에 불필요한 domain 계보는 필수 경로에서 멈춘다.',
      ]} />
      <SourceNotes sources={[
        { label: 'Don’t Stop Pretraining', href: 'https://arxiv.org/abs/2004.10964', note: 'Domain-adaptive와 task-adaptive continued pretraining을 분리하는 canonical 기준.' },
        { label: 'BioBERT', href: 'https://arxiv.org/abs/1901.08746', note: 'Biomedical corpus에서 language representation을 추가 사전학습한 공개 사례.' },
        { label: 'DNABERT', href: 'https://academic.oup.com/bioinformatics/article/37/15/2112/6128680', note: 'DNA sequence를 k-mer token과 bidirectional Transformer로 다룬 초기 기준.' },
        { label: 'DNABERT-2', href: 'https://arxiv.org/abs/2306.15006', note: 'BPE tokenization과 multi-species genome pretraining을 비교할 공개 근거.' },
        { label: 'Nucleotide Transformer', href: 'https://www.biorxiv.org/content/10.1101/2023.01.11.523679v2', note: 'Multi-species genomic pretraining과 downstream probing의 공개 근거.' },
      ]} />
    </section>
  );
}
