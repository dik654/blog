import type { ReactNode } from 'react';
import {
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
} from '@/components/learning/ArticleLearning';
import IdeogramControlFlowViz from './viz/IdeogramControlFlowViz';

function ContractRow({
  index,
  title,
  owner,
  children,
}: {
  index: string;
  title: string;
  owner: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-3 border-t border-border py-4 sm:grid-cols-[2.5rem_minmax(9rem,0.55fr)_minmax(0,1fr)]">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <div className="min-w-0">
        <p className="text-sm font-black">{title}</p>
        <p className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">{owner}</p>
      </div>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export default function IdeogramOverview() {
  return (
    <>
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">글자를 잘 그리는 모델보다 납품 조건을 지키는 시스템으로 읽는다</h2>
        <QuestionLead
          question="제품 패키지의 “여름 한정” 문구가 한 글자도 틀리면 안 되고, 오른쪽 위 지정 영역 안에 있어야 한다면 무엇부터 고쳐야 할까?"
          answer="Prompt를 길게 쓰기 전에 exact string, 허용 box, palette와 실패 기준을 구조화해야 한다. Ideogram 4의 핵심은 9.3B라는 크기보다 이 brief를 structured JSON condition으로 받고 text와 image token을 한 흐름에서 처리하는 계약에 있다."
        />
        <ConceptPrimer items={[
          { term: 'Exact string', meaning: '결과 이미지에 그대로 보여야 하는 Unicode 문자열이다.', why: '의미가 비슷한 문구가 아니라 글자·공백·줄바꿈까지 납품 조건으로 고정한다.' },
          { term: 'Bounding box', meaning: '객체나 문구가 놓일 사각 영역을 0–1000 상대 좌표로 지정한다.', why: '“오른쪽 위” 같은 모호한 공간 지시를 검사 가능한 숫자로 바꾼다.' },
          { term: 'Structured caption', meaning: '전체 설명, style, background와 element를 분리한 JSON 문자열이다.', why: '모델이 학습한 입력 schema와 실제 brief의 구조를 맞춘다.' },
          { term: 'Open weight', meaning: '학습된 parameter를 내려받아 실행할 수 있다는 뜻이다.', why: 'Inference code의 license와 상업 배포 권리를 자동으로 포함하지 않는다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            포스터 한 장을 만든다고 하자. 제목은 “서울 디자인 주간”, 부제는 “7월 28일–8월 2일”이다.
            제목은 위쪽 25% 안에, 제품은 중앙에, 짙은 남색과 형광 녹색만 주조색으로 써야 한다.
            일반적인 prompt는 이 요구를 한 문단 안에 섞는다. 결과가 틀렸을 때 모델이 글자를 놓쳤는지,
            위치를 오해했는지, 색 조건이 약했는지 분리하기 어렵다.
          </p>
          <p>
            Ideogram 4는 이 문제를 input contract부터 바꾼다. 전체 장면 설명과 style을 나누고,
            background와 각 element를 별도 항목으로 만든다. Text element에는 실제 문자열을 넣고,
            필요하면 box와 element별 palette를 붙인다. 즉 prompt engineering의 중심이 수식어를 더하는 일에서
            디자인 brief를 구조화하는 일로 이동한다.
          </p>
          <p>
            그렇다고 JSON을 썼다는 이유만으로 결과가 정확해지는 것은 아니다. Caption이 tokenizer와 Qwen3-VL을 지나며
            보존되어야 하고, joint transformer가 text–image 관계를 학습했어야 하며, sampler와 VAE 뒤 pixel에서도 글자와
            배치가 살아 있어야 한다. 따라서 아래 Viz는 “모델 상자”가 아니라 실패 소유자를 찾는 실행 trace다.
          </p>
        </div>
        <IdeogramControlFlowViz />
      </section>

      <section id="input-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Structured caption은 자연어를 버리는 형식이 아니라 brief를 분해하는 형식이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 prompting guide의 최상위 필드는 세 개다. <code>high_level_description</code>은 전체 장면을 요약한다.
            <code>style_description</code>은 aesthetics, lighting, medium과 photo 또는 art style을 담는다.
            <code>compositional_deconstruction</code>은 background와 elements를 소유한다.
            이 가운데 composition object와 그 안의 background·elements는 필수다.
          </p>
          <p>
            Element는 객체와 글자를 구분한다. 객체는 <code>type: "obj"</code>와 설명을,
            글자는 <code>type: "text"</code>, literal text와 설명을 가진다. Box의 순서는 흔히 쓰는
            <code>x1,y1,x2,y2</code>가 아니라 <code>y_min,x_min,y_max,x_max</code>다. 원점은 왼쪽 위이며
            좌표 범위는 0부터 1000이다. 이 순서를 바꾸면 “오른쪽 상단”이 전혀 다른 사각형이 된다.
          </p>
        </div>
        <div className="not-prose mt-6 border-y border-border">
          <ContractRow index="01" title="전체 의도" owner="high_level_description">
            한두 문장으로 결과물 전체를 고정한다. 개별 element가 충돌할 때 장면의 전역 방향을 잃지 않게 한다.
          </ContractRow>
          <ContractRow index="02" title="시각 문법" owner="style_description">
            Photo와 art style 중 하나를 고르고 lighting, medium과 palette를 분리한다. 전체 palette는 최대 16개 uppercase hex다.
          </ContractRow>
          <ContractRow index="03" title="배경" owner="compositional_deconstruction.background">
            모든 element 뒤에 깔리는 환경을 별도 문장으로 둔다. 제품·문구 설명에 배경 조건을 반복하지 않는다.
          </ContractRow>
          <ContractRow index="04" title="배치 가능한 요소" owner="elements[]">
            객체와 text를 구분하고 literal string, 설명, optional box와 element palette를 붙인다. Element palette는 최대 5개다.
          </ContractRow>
        </div>
        <Misconception>
          Magic prompt가 model 자체의 언어 이해를 대체하는 것은 아니다. 공개 CLI의 기본 <code>ideogram-4-v1</code>은
          plain text를 Ideogram hosted API로 보내 structured JSON을 받는다. OpenRouter의 Claude configuration이나 공개 system
          prompt를 사용하는 자체 LLM으로 교체할 수 있지만, 공식 문서는 이 경로가 hosted 제품의 production magic prompt와
          같지 않고 자체 LLM의 품질도 보장하지 않는다고 선을 긋는다. 따라서 provider·model·system-prompt revision과 실제 expanded
          caption을 run manifest에 남긴다.
        </Misconception>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Key order도 단순한 JSON 미관이 아니다. 공식 guide는 학습 caption의 일관된 순서와 맞추면 품질이 좋아진다고 설명하고,
            <code>CaptionVerifier</code>가 누락·미지 key와 순서를 경고한다. 한국어 text는
            <code>ensure_ascii=False</code>로 직렬화해 실제 문자를 보존한다. 이 계약은
            <InternalLink slug="image-model-runtime">공통 Image Runtime</InternalLink>의 “실제 encoder input을 기록한다”는 원칙을
            Ideogram 4에 구체화한 사례다.
          </p>
        </div>
      </section>
    </>
  );
}
