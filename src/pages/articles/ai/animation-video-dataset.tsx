import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { ClipContractViz } from './animation-production/viz/ProductionDecisionViz';

export default function AnimationVideoDatasetArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">데이터셋은 영상 폴더가 아니라 학습 단위의 계약이다</h2>
        <QuestionLead
          question="한 episode를 일정한 4초 길이로 잘라 1,000개 clip을 만들면 바로 좋은 animation dataset일까?"
          answer="아니다. Shot 경계를 가로지른 clip, 같은 장면의 중복, character가 train과 validation에 동시에 들어간 split, 잘못된 FPS와 권리 정보 누락은 표본 수가 많아도 평가와 학습을 망친다. 먼저 model이 한 sample로 읽을 시간·내용·출처 단위를 정해야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Shot', meaning: 'Camera·장면·행동의 연속성이 유지되는 구간이다.', why: '서로 다른 motion과 camera rule을 한 sample에 섞지 않는다.' },
          { term: 'Cadence', meaning: '표시 frame과 실제 drawing 변화가 배치된 시간 규칙이다.', why: 'On twos, hold와 impact를 단순 중복 frame으로 지우지 않는다.' },
          { term: 'Group split', meaning: '서로 닮은 clip이 train과 validation에 갈라지지 않게 source 단위로 나누는 방식이다.', why: '암기를 일반화처럼 측정하지 않는다.' },
          { term: 'Provenance', meaning: '원본, 권리, 변환, 검수 이력을 추적하는 정보다.', why: '학습 결과의 사용 가능성과 삭제 요청 영향을 판단한다.' },
        ]} />
        <ClipContractViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 7초 action shot에서도 준비, anticipation, smear, impact, settle은 서로 다른 역할을 한다. Fixed 3초 window가 impact 직전에 잘리면 model은 원인과 결과를 따로 본다.
            반대로 긴 clip 하나에 여러 cut을 넣으면 camera transition과 object motion을 섞는다. “3~5초가 정답”이 아니라 목표 motion이 닫히고 model의 frame bucket에 맞는 길이가 정답이다.
          </p>
        </div>
      </section>

      <section id="clip-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Frame 수, FPS와 drawing 수를 따로 센다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <M>{String.raw`N`}</M>개 frame을 <M>{String.raw`f`}</M> fps로 표시하면 첫 frame부터 마지막 frame까지의 시간은 보통 <M>{String.raw`(N-1)/f`}</M>다.
            하지만 같은 drawing을 두 frame씩 유지하면 표시 frame 수와 unique drawing 수는 다르다. 중복 제거를 무조건 적용하면 limited animation의 timing을 데이터에서 지워 버릴 수 있다.
          </p>
          <M display>{String.raw`\begin{aligned}
            T_{\text{clip}}&=\underbrace{\frac{N-1}{f_{\text{display}}}}_{\text{첫 frame부터 마지막 frame까지의 시간}}\\
            r_{\text{drawing}}&=\underbrace{\frac{U}{N}}_{\text{표시 frame 중 서로 다른 drawing의 비율}}\\
            h_t&=\underbrace{\mathbf 1[x_t=x_{t-1}]}_{\text{의도된 hold 후보}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="Display FPS가 높아도 unique drawing이 많다는 뜻은 아니다. Hold 후보는 pixel equality만으로 확정하지 않고 shot 문맥과 검수 label을 함께 본다."
            symbols={[
              [String.raw`N`, 'Decode된 표시 frame 수'],
              [String.raw`f_{display}`, '파일 timestamp가 가리키는 표시 속도'],
              [String.raw`U`, '의미상 서로 다른 drawing 또는 pose의 수'],
              [String.raw`h_t`, '직전 frame과 같아 의도된 hold일 가능성을 표시하는 값'],
            ]}
          />
          <p>
            다음 provenance 절의 manifest 예시처럼 <M>{String.raw`N=185`}</M>개 frame을 <M>{String.raw`f_{display}=24`}</M> fps로 표시하면,
            첫 frame에서 마지막 frame까지의 시간은 <M>{String.raw`(185-1)/24\approx 7.67\text{s}`}</M>다. 단순히 <M>{String.raw`185/24`}</M>로 나누지 않는 이유는
            첫 frame이 이미 시간 0에 놓이고 frame 사이 간격이 184개이기 때문이다.
          </p>
          <p>
            Dataset manifest에는 원본 FPS, decode된 timestamp, target frame bucket과 cadence tag를 함께 둔다. Variable frame rate source를 단순히 `-r 24`로 바꾸면 frame drop·duplication이 생길 수 있으므로,
            원본 timestamp를 먼저 보존하고 정규화 결과를 별도 artifact로 만든다.
          </p>
          <CitationBlock source="LTX-2 Dataset Preparation Guide" citeKey={1} href="https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/dataset-preparation.md">
            <p>공식 trainer는 long video의 scene split, caption, latent·text embedding 전처리와 width×height×frame resolution bucket을 분리한다. 특정 5초나 49 frame 예시는 model contract의 한 설정이지 모든 video model의 보편값이 아니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="split-leakage" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Clip이 아니라 source group을 나눠 leakage를 막는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Episode 하나에서 인접 window를 여러 개 만들면 배경, character와 drawing이 거의 같다. 이를 clip 단위로 무작위 split하면 validation에 train 장면의 이웃이 들어간다.
            Character LoRA를 평가할 때는 같은 character가 다른 episode에 반복되는 것조차 의도에 따라 leakage가 될 수 있다. “새 shot에서 같은 character를 보존”하는 평가와
            “처음 보는 character로 일반화”하는 평가는 group key가 다르다.
          </p>
          <M display>{String.raw`\begin{aligned}
            g_i&=\underbrace{(\text{source}_i,\text{character}_i,\text{shot}_i)}_{\text{서로 닮은 sample을 묶는 group key}}\\
            \mathcal G_{\text{train}}\cap\mathcal G_{\text{val}}&=
              \underbrace{\varnothing}_{\text{group이 두 split에 동시에 나타나지 않음}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="무엇을 group에 넣을지는 평가 질문이 정한다. Source-generalization이면 source를, unseen-character 평가면 character를 분리한다. 모든 경우에 같은 key를 기계적으로 쓰지 않는다."
            symbols={[
              [String.raw`g_i`, 'i번째 clip이 속한 유사성·출처 group'],
              [String.raw`\mathcal G_{train}`, '학습 split에 배정된 group 집합'],
              [String.raw`\mathcal G_{val}`, '검증 split에 배정된 group 집합'],
              [String.raw`\varnothing`, '두 집합에 겹치는 group이 없다는 뜻'],
            ]}
          />
          <p>
            Exact hash는 동일 파일만 잡고, perceptual hash나 embedding은 crop·재인코딩된 near-duplicate를 찾는다. 그러나 smear와 hold는 일반 영상에서 “낮은 품질”처럼 보일 수 있다.
            자동 중복·정지 필터의 reject 결과도 삭제하지 말고 review queue와 reason code를 남겨 의도된 animation frame을 복구할 수 있게 한다.
          </p>
        </div>
      </section>

      <section id="quality-provenance" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">품질 scalar보다 실패 벡터와 권리 이력을 남긴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Blur score 하나로 정렬하면 의도된 motion blur와 압축 blur를 구분하지 못한다. Motion magnitude 하나로 정렬하면 hold shot을 버린다. 품질은 목적별 vector로 저장한다.
            예를 들어 line clarity, compression, motion readability, identity visibility, watermark와 audio sync를 별도 필드로 둔다. 최종 accept rule은 학습 목표가 선택한다.
          </p>
          <pre><code>{`{
  "clip_id": "seriesA_ep03_shot017_v2",
  "media_path": "clips/shot017.mp4",
  "source": {"asset_id":"seriesA_ep03","timecode":[314.2,321.9]},
  "time": {"source_fps":"24000/1001","display_fps":24,"frames":185},
  "groups": {"source":"seriesA_ep03","character":["heroA"],"shot":"017"},
  "cadence": {"holds":[[1,2],[41,42]],"smear":[73],"impact":[97]},
  "quality": {"line":4,"compression":3,"motion_readability":5},
  "rights": {"license_id":"studio-contract-v3","training":true,"commercial":true},
  "transform": {"scene_split":"v1.4","decode":"ffmpeg-7.1","review":"approved"}
}`}</code></pre>
          <Misconception>Metadata는 나중에 검색하기 위한 장식이 아니다. Split, 삭제, 재전처리, 학습 원인 분석과 release 권리를 결정하는 실행 입력이다.</Misconception>
        </div>
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수집에서 학습 cache까지의 실행 순서</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><strong>원본 고정:</strong> immutable asset id, checksum, source timebase와 rights record를 만든다.</li>
            <li><strong>Shot proposal:</strong> scene detector가 후보 경계를 만들고 dissolve·flash·rapid cut을 사람이 검수한다.</li>
            <li><strong>Decode trace:</strong> frame timestamp, audio sample rate와 색 공간을 보존한 inspection proxy를 만든다.</li>
            <li><strong>Target clip:</strong> 목표 motion beat가 닫히는 범위와 model bucket을 함께 만족하도록 trim·pad한다.</li>
            <li><strong>Filter queue:</strong> exact/near duplicate, blank, watermark, compression과 cadence 후보를 reason code로 분류한다.</li>
            <li><strong>Group split:</strong> 평가 질문에 맞는 source·character·shot key로 train/validation/test를 고정한다.</li>
            <li><strong>Precompute:</strong> VAE latent와 text/audio embedding을 cache한 뒤 일부를 다시 decode해 corruption을 확인한다.</li>
          </ol>
          <p>
            Cache 성공은 데이터가 맞다는 뜻이 아니다. Resize crop이 얼굴을 잘랐는지, temporal padding이 마지막 drawing을 과도하게 늘렸는지, audio가 밀리지 않았는지
            decode verification sample로 확인한다. LTX-2 공식 trainer도 전처리 latent의 decode 검수를 제공한다.
          </p>
        </div>
      </section>

      <section id="practice" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">작은 oracle로 pipeline을 먼저 검증한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 실험은 “몇 clip이면 충분한가”를 답하지 않는다. 서로 다른 cadence를 가진 12개 shot으로 fixture를 만들고, scene split·timestamp·group split·rights·decode round-trip이
            모두 기대값과 일치하는지 테스트한다. 그 뒤 100개, 1,000개로 늘려도 같은 contract가 유지되는지를 본다.
          </p>
        </div>
        <CapabilityCheck items={[
          '고정 3~5초 규칙 대신 motion beat와 model frame bucket으로 clip 길이를 정할 수 있다.',
          'Display FPS, frame 수와 unique drawing 수를 분리해 기록할 수 있다.',
          '평가 질문에 맞는 source·character·shot group split으로 leakage를 막을 수 있다.',
          '자동 filter가 버린 hold·smear를 reason code와 review queue에서 복구할 수 있다.',
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 <InternalLink slug="animation-captioning">Condition Signal</InternalLink> 글에는 승인된 clip id, source timecode, cadence marker와 review 상태를 넘긴다. Caption은 이 원본 좌표 없이 독립적으로 만들지 않는다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'LTX-2 dataset preparation', href: 'https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/dataset-preparation.md', note: 'Scene split, caption, resolution bucket, latent cache와 decode verification의 실제 공개 계약.' },
          { label: 'AniMatrix paper', href: 'https://arxiv.org/abs/2605.03652', note: 'Animation production variable와 domain-specific data·training 문제의 최신 근거.' },
          { label: 'AnimeInterp paper', href: 'https://arxiv.org/abs/2104.02495', note: 'Animation의 textureless color region, large nonlinear motion과 dedicated triplet dataset 문제.' },
        ]} />
      </section>
    </div>
  );
}
