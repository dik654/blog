import { CitationBlock } from '@/components/ui/citation';
import { ConceptPrimer, InternalLink, QuestionLead } from '@/components/learning/ArticleLearning';
import DomainAdaptationDecisionLab from './viz/DomainAdaptationDecisionLab';

const DOMAIN_EXAMPLES = [
  { domain: '유전체', vocab: 'ATCG, SNV, exon, codon', corpus: 'Reference genome, variant record', failure: '한 염기 차이와 긴 조절 구간의 기능 관계를 놓침' },
  { domain: '의료', vocab: 'MeSH, ICD-10, SNOMED', corpus: '논문, 진료 기록, image-text pair', failure: '전문 용어와 modality별 촬영 분포가 일반 web data와 다름' },
  { domain: '제조', vocab: '공정 코드, 장비 ID, 결함 원인', corpus: '검사 image, 공정 log, 조치 이력', failure: '제품 형상과 조명이 결함 원인보다 embedding을 지배함' },
  { domain: '법률', vocab: '판례 인용, 조문 번호', corpus: '판결문, 법령 revision', failure: '인용 관계와 적용 시점이 일반 문장 유사도에 묻힘' },
];

const ADAPTATION_STAGES = [
  {
    stage: '범용 기준선',
    question: '도메인 적응 없이 어디까지 되는가?',
    action: '같은 backbone과 전처리로 generic checkpoint를 먼저 평가한다.',
    gate: '장비·조명·제품군 slice별 오류를 남겨 domain shift의 위치를 찾는다.',
  },
  {
    stage: '도메인 표현 적응',
    question: '라벨 이전에 입력 분포를 더 배워야 하는가?',
    action: '라벨이 없는 domain corpus로 기존 사전학습 objective를 이어간다.',
    gate: 'Domain metric뿐 아니라 generic holdout의 손실과 embedding collapse를 함께 본다.',
  },
  {
    stage: '최종 과업 적응',
    question: '현재 의사결정에 필요한 경계는 무엇인가?',
    action: '검색 pair, class label, regression target처럼 실제 목표와 같은 신호를 학습한다.',
    gate: '새 장비·새 시점 holdout에서 generic 기준선과 비용까지 함께 비교한다.',
  },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도메인 적응이 왜 필요한가</h2>
      <QuestionLead
        question="Hard negative를 잘 골라 contrastive fine-tuning까지 했는데 새 장비·새 조명에서 검색이 다시 무너진다. 다음으로 무엇을 확인해야 할까?"
        answer={<>Pair loss보다 먼저 data distribution을 본다. Generic pretraining에 현재 촬영 조건, 전문 label과 공정 맥락이 충분히 없으면 domain data로 representation을 적응시키되, 일반 능력 손실과 overfitting을 별도 holdout에서 함께 확인해야 한다.</>}
      />
      <ConceptPrimer items={[
        { term: 'Domain shift', meaning: '학습 data와 실제 입력의 촬영·어휘·label 분포가 달라지는 현상.', why: '같은 model이라도 새 장비나 전문 문서에서 neighborhood 의미가 바뀐다.' },
        { term: 'Continued pretraining', meaning: '사전학습 objective를 domain corpus에서 이어 수행하는 단계.', why: 'Task label이 적어도 domain의 표현과 문맥을 먼저 익힐 수 있다.' },
        { term: 'Task fine-tuning', meaning: '최종 분류·검색·회귀 목표로 model을 조정하는 단계.', why: 'Domain을 아는 것과 현재 의사결정을 잘하는 것은 다른 목표다.' },
        { term: 'Catastrophic forgetting', meaning: 'Domain 적응 중 기존의 일반 표현 능력이 크게 손실되는 현상.', why: 'Domain metric만 올리고 다른 중요한 slice를 망치는 release를 막는다.' },
      ]} />
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 질문</strong> — 범용 사전학습 모델(BERT, GPT 등)을 특정 도메인에 바로 적용하면 왜 성능이 떨어지는가?<br />
          유전체 서열, 의료 기록, 제조 이미지와 공정 로그는 일반 web corpus와 입력 분포가 다르다.
          Text에서는 전문 용어가 과도하게 subword로 분해될 수 있고, vision에서는 조명·배율·texture가 일반 image pair와 다르다.
        </p>
        <p>
          해결책은 <strong>도메인 적응(Domain Adaptation)</strong>: 범용 사전학습 → 도메인 추가학습 → 태스크 학습의 3단계 파이프라인.
          이 글에서는 언제 추가학습을 열고, 언제 generic baseline으로 돌아갈지 판단하는 기준까지 다룬다.
          검색 pair 자체가 막혔다면 먼저 <InternalLink slug="contrastive-learning">Contrastive Learning</InternalLink>으로 돌아간다.
        </p>
        <CitationBlock source="Don't Stop Pretraining · Gururangan et al." citeKey={1} href="https://arxiv.org/abs/2004.10964">
          <p>원 논문은 domain-adaptive와 task-adaptive pretraining을 여러 NLP domain에서 비교한다. 여기서는 모든 modality에 같은 성능을 약속하는 근거가 아니라 continued pretraining을 별도 단계로 분리하는 canonical 기준으로 사용한다.</p>
        </CitationBlock>
      </div>

      <div className="not-prose mb-8 divide-y divide-border border-y border-border">
        {DOMAIN_EXAMPLES.map((item, index) => (
          <div key={item.domain} className="grid min-w-0 gap-3 py-4 sm:grid-cols-[2rem_6rem_minmax(0,1fr)] sm:gap-4">
            <span className="text-2xl font-black tabular-nums text-muted-foreground/45">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-sm font-bold">{item.domain}</h3>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{item.vocab}</p>
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">모을 근거.</strong> {item.corpus}</p>
              <p className="mt-2"><strong className="text-foreground">Generic model의 흔한 실패.</strong> {item.failure}</p>
            </div>
          </div>
        ))}
      </div>

      <DomainAdaptationDecisionLab />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">범용 모델 한계 & 3단계 파이프라인</h3>
        <div className="not-prose my-6 divide-y divide-border border-y border-border">
          {ADAPTATION_STAGES.map((item, index) => (
            <div key={item.stage} className="grid min-w-0 gap-3 py-5 md:grid-cols-[3rem_10rem_minmax(0,1fr)] md:gap-5">
              <span className="text-3xl font-black tabular-nums text-muted-foreground/40">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground">{item.stage}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.question}</p>
              </div>
              <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                <p><strong className="text-foreground">실행.</strong> {item.action}</p>
                <p className="mt-2"><strong className="text-foreground">통과 조건.</strong> {item.gate}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="leading-7">
          이 순서는 무조건 세 단계를 모두 실행하라는 처방이 아니다.
          범용 기준선이 운영 slice를 이미 통과하면 continued pretraining을 생략한다.
          실패가 입력 분포가 아니라 pair 또는 label 정의에 있다면 곧바로 최종 과업 신호를 고친다.
          모델 크기와 domain data의 효과는 같은 backbone·split에서 분리해 비교하고, 일반 능력 보존 gate도 함께 둔다.
        </p>
      </div>
    </section>
  );
}
