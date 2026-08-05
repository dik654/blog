import type { ReactNode } from 'react';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import LtxVersionPipelineLab from './LtxVersionPipelineLab';

const sourceRevision = '9377758131b1ffde4b7f766804590a6617bf2ab9';
const sourceRoot = `https://github.com/Lightricks/LTX-2/blob/${sourceRevision}`;

function Milestone({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-16 scroll-mt-20">
      <div className="not-prose mb-5 grid gap-2 border-b border-border pb-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
        <span className="font-mono text-3xl font-black text-muted-foreground/35">{number}</span>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Ltx23Article() {
  return (
    <>
      <QuestionLead
        question="LTX-2 논문의 14B video + 5B audio를 더하면 왜 현재 LTX-2.3 checkpoint의 22B가 되지 않을까?"
        answer={<>서로 다른 <strong>version layer</strong>의 수치이기 때문이다. 14B·5B는 LTX-2 논문이 공개한 비대칭 dual-stream 설명이고, 22B는 현재 repository가 붙인 LTX-2.3 artifact label이다. 검산한 공개 문서는 2.3의 정확한 stream 분할을 확정하지 않으므로 구조 아이디어와 current artifact를 연결하되 같은 숫자로 합치면 안 된다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'version layer', meaning: '논문 구조, 현재 checkpoint와 현재 pipeline code가 속한 서로 다른 근거 층.', why: '옛 수치와 최신 artifact를 같은 사양으로 섞지 않는다.' },
          { term: 'modality VAE', meaning: 'Video와 audio를 각각 작은 latent 표현으로 압축하는 별도 encoder·decoder.', why: '두 media가 같은 token shape를 쓴다고 오해하지 않는다.' },
          { term: 'dual-stream DiT', meaning: 'Video와 audio를 별도 hidden stream으로 처리하면서 서로 교환하는 transformer.', why: '화면과 소리의 동기화가 후처리가 아니라 denoising 내부에서 생긴다.' },
          { term: 'spatial upscaler', meaning: '1단계 low-resolution latent를 2단계 refinement 해상도로 키우는 현재 runtime artifact.', why: '권장 품질 path의 필수 stage를 장식적 후처리로 보지 않는다.' },
          { term: 'is_generated', meaning: '해당 modality에 noise와 loss를 적용할지 정하는 trainer 계약.', why: '생성 대상과 clean conditioning을 한 config에서 구분한다.' },
        ]}
      />
      <Misconception>
        이 글은 LTX-2의 논문 구조와 repository revision <code>{sourceRevision.slice(0, 12)}</code>의
        LTX-2.3 package·pipeline을 연결한다. 논문상 14B/5B를 현재 22B checkpoint의 정확한 내부
        분할로 주장하지 않는다.
      </Misconception>

      <Milestone number="01" eyebrow="Version before mechanism" title="논문 구조, current artifact와 runnable pipeline을 세 층으로 읽는다">
        <div id="version-boundary" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            LTX라는 이름 아래에는 서로 다른 종류의 근거가 있다. Technical report는 modality-specific
            VAE와 비대칭 audio-video stream, bidirectional exchange라는 구조를 설명한다. 현재
            repository는 LTX-2.3 22B checkpoint, core components, inference pipelines와 trainer를
            배포한다.
          </p>
          <p>
            <code>ltx-core</code>는 model primitive, <code>ltx-pipelines</code>는 실행 graph,
            <code>ltx-trainer</code>는 adaptation workflow를 소유한다. “LTX-2.3 모델 하나를
            실행했다”는 문장에는 어느 checkpoint, pipeline class, upscaler, adapter와 guider가
            결합됐는지 빠져 있다.
          </p>
        </div>
        <LtxVersionPipelineLab />
      </Milestone>

      <Milestone number="02" eyebrow="Latent and dual stream" title="Video와 audio는 따로 압축하고, hidden state는 양방향으로 교환한다">
        <div id="dual-stream-contract" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            원본 video는 frame·height·width가 있는 시공간 data이고 audio는 시간에 따른 waveform 또는
            주파수 표현이다. 같은 VAE와 위치 인코딩으로 억지로 처리하지 않고 각각 latent로 압축한 뒤
            patch token으로 만든다. Video token은 공간과 시간 위치를, audio token은 시간 중심 위치를
            보존한다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.72}>{String.raw`\begin{aligned}
z_v&=\underbrace{E_v(x_{1:T})}_{\text{frame 묶음을 video latent로 압축}}\\
z_a&=\underbrace{E_a(a_{1:T})}_{\text{같은 시간 구간의 audio를 별도 압축}}\\
h_v^0,h_a^0&=\underbrace{P_v(z_v),P_a(z_a)}_{\text{각 latent를 위치가 있는 token으로 변환}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 video와 audio가 같은 시간 구간을 공유해도 서로 다른 encoder와 patchifier를 쓰는 이유를 보여 준다. 압축은 VAE가, transformer 입력 순서와 위치 부여는 patchifier가 소유한다."
            symbols={[
              [String.raw`E_v,E_a`, 'Video와 audio를 각각 압축하는 modality-specific encoder'],
              [String.raw`x_{1:T},a_{1:T}`, '같은 기간에 정렬된 frame과 audio signal'],
              [String.raw`P_v,P_a`, '각 latent grid를 transformer token으로 만드는 patchifier'],
              [String.raw`h_v^0,h_a^0`, 'Dual-stream DiT에 들어가는 최초 hidden token'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            각 block은 video self-attention과 audio self-attention으로 modality 내부 관계를 정리하고,
            text condition과 상대 stream의 hidden state를 읽는다. 그래서 입 모양과 음성, 물체 충돌과
            충돌음, 장면 전환과 환경음의 정렬을 마지막 mux 단계가 아니라 denoising 중에 조정할 수 있다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.67}>{String.raw`\begin{aligned}
h_v^{\ell+1}&=\underbrace{B_v(h_v^\ell,c_{\mathrm{text}},h_a^\ell,t)}_{\text{영상이 문장과 현재 audio를 보고 갱신}}\\
h_a^{\ell+1}&=\underbrace{B_a(h_a^\ell,c_{\mathrm{text}},h_v^\ell,t)}_{\text{audio가 문장과 현재 영상을 보고 갱신}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 두 stream이 자기 modality를 유지하면서 상대 stream의 이전 hidden state를 양방향으로 읽는 이유를 보여 준다. 동기화가 깨지면 checkpoint뿐 아니라 cross-modal guidance와 condition alignment도 확인해야 한다."
            symbols={[
              [String.raw`h_v^\ell,h_a^\ell`, 'l번째 block에 들어오는 video·audio hidden token'],
              [String.raw`c_{\mathrm{text}}`, '두 stream이 공유하는 text condition'],
              [String.raw`t`, '현재 denoising noise level'],
              [String.raw`B_v,B_a`, '크기와 위치 구조가 다른 modality별 transformer block'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            LTX-2 논문은 이 비대칭 구조를 14B video와 5B audio stream으로 설명한다. 이 수치는
            inherited architecture idea의 근거다. 현재 LTX-2.3 22B artifact의 정확한 video/audio
            분할은 검산한 문서에서 확인되지 않으므로, 19B와 22B 차이를 숨은 adapter나 새 block으로
            임의 설명하지 않는다.
          </p>
        </div>
      </Milestone>

      <Milestone number="03" eyebrow="Current two-stage runtime" title="낮은 해상도 생성, latent upsample, refinement를 한 pipeline으로 본다">
        <div id="two-stage-runtime" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            현재 docs는 production-quality path로 two-stage pipeline을 권장한다. Stage 1은 낮은
            spatial resolution에서 장면과 motion의 큰 구조를 만든다. Spatial upscaler가 latent grid를
            키우고, Stage 2가 짧은 schedule과 필요한 distilled artifact를 이용해 detail을 다듬는다.
          </p>
          <p>
            Upscaler는 결과 video에 마지막으로 sharpening을 거는 장식이 아니다. Stage 1과 Stage 2가
            서로 다른 spatial grid에서 일하도록 이어 주는 model artifact다. 누락하면 current
            recommended pipeline을 실행한 것이 아니고, 다른 upscaler를 넣으면 checkpoint 외의 변수가
            바뀐다.
          </p>
          <p>
            One-stage pipeline은 구조 학습과 prototyping에는 유용하지만 docs가 최종 품질 기준선으로
            권장하는 path가 아니다. Distilled pipeline은 빠른 8-sigma path이고 multimodal guidance
            지원 범위도 다른 pipeline과 다르다. 결과를 비교할 때 stages, upsampling, guidance와
            condition mode를 함께 기록해야 한다.
          </p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {[
            ['Stage 1', '낮은 resolution latent', '전체 composition, camera와 motion을 먼저 만든다.'],
            ['Spatial upsampler', '확대된 latent grid', '해상도를 올리되 pixel decode 전에 표현을 전달한다.'],
            ['Stage 2', 'Refined latent', '고해상도 detail을 복원하고 짧은 sigma path를 닫는다.'],
            ['Decode', 'Video + audio output', 'Modality decoder와 output packaging을 거친다.'],
          ].map(([stage, artifact, purpose]) => (
            <div key={stage} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[9rem_10rem_minmax(0,1fr)] sm:gap-4">
              <strong className="text-sm">{stage}</strong>
              <code className="break-words text-xs leading-6 [overflow-wrap:anywhere]">{artifact}</code>
              <p className="text-sm leading-6 text-muted-foreground">{purpose}</p>
            </div>
          ))}
        </div>
      </Milestone>

      <Milestone number="04" eyebrow="Generated versus conditioning" title="같은 dual-stream에서 noise와 loss를 받을 modality를 고른다">
        <div id="modality-training" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Current trainer의 flexible strategy는 task마다 별도 model class를 만들지 않는다.
            Modality별 <code>is_generated</code>를 정해 noise와 loss를 받을 대상과 clean condition을
            구분한다. T2V는 video와 audio 둘 다 생성하고, A2V는 audio를 고정한 채 video만, V2A는
            video를 고정한 채 audio만 생성한다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.68}>{String.raw`\begin{aligned}
z_m^{(t)}&=
\begin{cases}
\underbrace{\alpha_tz_m+\sigma_t\epsilon}_{\text{생성할 modality에 noise 적용}},&g_m=1\\
\underbrace{z_m}_{\text{조건 modality는 clean 상태 유지}},&g_m=0
\end{cases}\\
\mathcal L&=\underbrace{\sum_{m\in\{v,a\}}g_m\,\mathcal L_m}_{\text{생성 대상으로 표시한 modality만 loss에 포함}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 `is_generated`가 true인 modality만 noisy target과 loss를 받고, false인 modality는 sigma=0의 clean condition으로 cross-modal attention에 참여하는 이유를 보여 준다."
            symbols={[
              [String.raw`m\in\{v,a\}`, 'Video 또는 audio modality'],
              [String.raw`g_m`, '`is_generated`를 1 또는 0으로 나타낸 mask'],
              [String.raw`z_m^{(t)}`, '현재 training step에서 transformer가 보는 modality latent'],
              [String.raw`\mathcal L_m`, '해당 modality의 denoising objective'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Reference, first frame, prefix·suffix와 mask condition은 이 기본 생성·고정 계약 위에 추가된다.
            예를 들어 IC-LoRA의 reference token은 bidirectional self-attention에는 들어가지만 noise와
            loss를 받지 않는다. “Input에 들어갔다”와 “생성 대상으로 학습됐다”를 구분해야 한다.
          </p>
          <p>
            Public trainer는 LoRA, IC-LoRA와 full fine-tuning을 지원한다. 이는 LTX-2.3 위에 adaptation을
            수행할 수 있다는 current tooling fact다. Foundation pretraining dataset과 전체 대규모
            schedule이 재현 가능하게 공개됐다는 뜻은 아니다.
          </p>
        </div>
      </Milestone>

      <Milestone number="05" eyebrow="Reproduction ledger" title="Checkpoint보다 pipeline graph 전체를 artifact로 고정한다">
        <div id="ltx-evidence" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            LTX-2.3 결과를 재현하려면 checkpoint 이름만으로 부족하다. Text encoder, video·audio VAE,
            spatial upscaler, distilled LoRA, pipeline class, guider parameter, sigma schedule,
            condition media와 repository revision을 하나의 manifest로 고정한다.
          </p>
          <p>
            특히 audio-video sync 실패는 여러 owner를 가진다. Source media alignment가 틀릴 수 있고,
            modality guidance가 비활성일 수 있고, frame/audio duration이 다르거나 cross-modal
            checkpoint가 맞지 않을 수 있다. “Dual-stream이 나쁘다”로 시작하지 말고 처음 어긋난
            boundary를 찾는다.
          </p>
        </div>
        <StopRule>
          LTX-2 논문의 14B/5B 수치를 LTX-2.3 22B의 정확한 내부 분할로 재사용하지 않는다. Public
          architecture idea, current checkpoint와 two-stage graph, generated/frozen modality를
          재구성할 수 있으면 derivative checkpoint 사례로 이동한다.
        </StopRule>
      </Milestone>

      <CapabilityCheck
        items={[
          'LTX-2 논문 구조와 LTX-2.3 current artifact를 다른 근거 층으로 분리한다.',
          'Video·audio VAE 압축과 patchification의 역할을 따로 설명한다.',
          'Dual-stream hidden state가 양방향으로 교환되는 이유를 추적한다.',
          'Two-stage pipeline에서 spatial upscaler의 중간 artifact 역할을 설명한다.',
          'T2V, A2V와 V2A의 generated·frozen modality를 정확히 고른다.',
          'Checkpoint, upscaler, adapter, guider와 sigma schedule을 manifest에 넣는다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="video-model-runtime" learningPathId="ai-open-model-ltx">Video Runtime 공통 계약</InternalLink></span>
        <span>다음: <InternalLink slug="sulphur-2" learningPathId="ai-open-model-ltx">파생 checkpoint의 증거 경계</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'LTX-2 official repository', href: `${sourceRoot}/README.md`, note: `검산 revision ${sourceRevision.slice(0, 12)}. LTX-2.3 22B artifacts, packages와 spatial upscaler requirement.` },
          { label: 'LTX core architecture overview', href: `${sourceRoot}/packages/ltx-core/README.md`, note: 'LTX-2 14B video + 5B audio dual-stream 설명. Current 2.3 exact split으로 일반화하지 않는다.' },
          { label: 'LTX pipeline selection', href: `${sourceRoot}/packages/ltx-pipelines/docs/pipeline-selection.md`, note: 'One-stage, recommended two-stage, distilled와 condition-specific pipeline의 current 선택 계약.' },
          { label: 'LTX trainer modes', href: `${sourceRoot}/packages/ltx-trainer/docs/training-modes.md`, note: '`is_generated`, generated/frozen modality와 reference condition의 current contract.' },
          { label: 'LTX-2 technical report', href: 'https://arxiv.org/abs/2601.03233', note: 'Modality-specific latent, asymmetric dual stream와 audio-video joint generation의 1차 연구 문헌.' },
        ]}
      />
    </>
  );
}
