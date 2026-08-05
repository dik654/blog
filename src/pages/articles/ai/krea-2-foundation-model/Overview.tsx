import {
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
} from '@/components/learning/ArticleLearning';
import Krea2LifecycleViz from './viz/Krea2LifecycleViz';

function ContrastRow({
  label,
  narrow,
  exploratory,
}: {
  label: string;
  narrow: string;
  exploratory: string;
}) {
  return (
    <div className="grid min-w-0 gap-3 border-t border-border py-4 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
      <p className="text-sm font-black">{label}</p>
      <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">좁은 default</strong> · {narrow}</p>
      <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">탐색 가능한 분포</strong> · {exploratory}</p>
    </div>
  );
}

export default function Krea2Overview() {
  return (
    <>
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Krea 2는 한 장의 정답보다 탐색할 수 있는 분포를 만든다</h2>
        <QuestionLead
          question="첫 결과가 매끈하지만 열 개의 seed가 모두 비슷하다면 창작 모델로 충분할까?"
          answer="납품 단계에는 안정적인 default가 유리하지만 concept 단계에는 style, mood, material과 composition을 넓게 탐색할 수 있어야 한다. Krea 2는 여러 작업으로 적응할 넓은 바탕 모델을 먼저 만들고, 학습용 원형 체크포인트와 빠른 실행용 증류 체크포인트를 나눠 그 폭과 속도를 관리한 사례다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            가구 브랜드의 새 campaign 방향을 찾는다고 하자. 첫날에는 따뜻한 film photo, 차가운 industrial render,
            flat illustration과 surreal collage를 넓게 본다. 방향이 정해진 뒤에야 logo, 제품 형태와 palette를 고정한다.
            처음부터 “무난하게 예쁜 한 장”만 반복해서 나오면 concept search의 역할을 하지 못한다.
          </p>
          <p>
            Krea 2 technical report는 바로 이 문제에서 시작한다. 최근 image system이 reliability를 높이는 과정에서
            비슷한 polished default로 수렴했다고 보고, broad style coverage와 user control을 함께 목표로 둔다.
            이를 위해 model block 하나만 바꾼 것이 아니라 data curation, captioning, architecture ablation,
            256→512→1024 curriculum, SFT, preference optimization, RL과 fast checkpoint를 한 lifecycle로 설계했다.
          </p>
          <p>
            아래 Viz는 그 lifecycle을 다섯 장면으로 좁힌다. 핵심은 마지막 장면이다. 공개 checkpoint 둘은
            “저품질/고품질” 등급이 아니다. 하나는 후속 학습이 가능한 원형이고 하나는 적은 step으로 빠르게 실행하도록
            증류한 결과물이다. 먼저 이 역할을 구분하고, 바로 아래에서 각각 RAW와 Turbo라는 이름을 붙인다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Foundation model', meaning: '특정 style 하나가 아니라 넓은 visual distribution을 먼저 학습한 base다.', why: 'Prompt, LoRA와 post-training으로 여러 작업에 적응할 여지를 남긴다.' },
          { term: 'Aesthetic diversity', meaning: 'Seed와 prompt 변화가 서로 다른 유효한 시각 방향을 탐색하는 능력이다.', why: '평균 미감 점수 하나가 숨기는 mode collapse를 찾는다.' },
          { term: 'RAW', meaning: 'Distillation과 최종 post-training을 거치지 않은 공개 base checkpoint다.', why: 'LoRA·fine-tuning·research의 학습 artifact로 사용한다.' },
          { term: 'Turbo', meaning: '8-step 추론을 위해 distill된 공개 checkpoint다.', why: '빠른 preview와 production inference를 base 학습과 분리한다.' },
        ]} />
        <Krea2LifecycleViz />
      </section>

      <section id="distribution-goal" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Diversity는 많이 생성했다는 뜻이 아니라 유효한 방향이 남아 있다는 뜻이다</h2>
        <div className="not-prose border-b border-border">
          <ContrastRow label="Seed 변화" narrow="인물 자세와 배경만 조금 바뀌고 style 문법은 반복된다." exploratory="서로 다른 composition과 재질이 나오되 prompt 핵심은 유지된다." />
          <ContrastRow label="Prompt 변화" narrow="모델의 기본 조명·피부·색보정이 모든 문장을 덮는다." exploratory="짧은 mood 단서와 긴 directed prompt가 서로 다른 위치로 이동한다." />
          <ContrastRow label="Reference" narrow="Reference의 내용이 그대로 새어 style과 subject가 함께 복제된다." exploratory="Style 방향은 옮기되 content identity는 별도 control로 다룬다." />
          <ContrastRow label="Post-training" narrow="평균 aesthetic score만 올려 rare style과 구조적 다양성을 잃는다." exploratory="Rare style coverage는 보존하고, prompt 요구·artifact를 따로 채점해 reward가 속일 여지만 좁힌다." />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            따라서 “다양하다”는 평가는 pairwise 예쁜 이미지 투표만으로 끝나지 않는다. Prompt별 seed 간 perceptual distance,
            composition class의 분포, rare style coverage와 prompt constraint pass rate를 함께 본다. 무작위 noise처럼 서로 다르기만 한 결과도 실패다.
            넓은 분포와 지시 충실도를 동시에 유지해야 한다.
          </p>
          <p>
            Krea 제품에는 prompt expander와 style-reference system도 있다. 그러나 이를 공개 Krea 2 weight 하나의 내장 능력으로 합치면 안 된다.
            Core text-to-image checkpoint, prompt를 다시 쓰는 helper와 reference를 condition으로 만드는 별도 component를 manifest에서 나눈다.
            이 경계는 <InternalLink slug="image-model-runtime">공통 Image Runtime</InternalLink>의 condition owner를 그대로 따른다.
          </p>
        </div>
        <Misconception>
          Krea service에서 보이는 기능 전체가 Krea 2 공개 checkpoint의 API라는 뜻은 아니다. Core model, prompt expander, style reference, upscaler와 hosted UI를 분리한 뒤 실제 repository가 공개한 input과 output만 local capability로 기록한다.
        </Misconception>
      </section>
    </>
  );
}
