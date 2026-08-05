import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { CitationBlock } from '@/components/ui/citation';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import { ProductionGoalRouter } from './open-model-core/viz/OpenModelExplorers';

const imageFamilies = [
  {
    index: '01',
    name: 'Ideogram 4.0',
    slug: 'ideogram-4-typography-layout',
    date: '2026-06-03',
    question: '문구와 배치를 결과물의 구조로 다뤄야 하는가?',
    story: 'Exact string과 지정 box가 납품 조건이라면 structured caption, typography와 layout control이 핵심이다.',
    evidence: '현재 text·bbox·2K와 공개 weight를, follow-up editable layer roadmap과 분리해야 한다.',
    decision: '구조·sampler·license와 exact-string 평가를 독립 글에서 검증한다.',
    href: 'https://ideogram.ai/news/ideogram-4.0/',
  },
  {
    index: '02',
    name: 'Krea 2',
    slug: 'krea-2-foundation-model',
    date: '2026-06-23',
    question: '한 가지 polished default가 아니라 style 공간을 탐색해야 하는가?',
    story: 'Concept 단계에서 mood·재질·composition을 넓게 탐색하려면 한 장의 최고점보다 유효한 style 분포가 중요하다.',
    evidence: '공식 보고서는 data, single-stream DiT, curriculum, post-training과 RAW/Turbo를 한 lifecycle로 공개한다.',
    decision: '공개 checkpoint와 Krea 서비스 helper를 분리하고 RAW→Turbo 계약을 독립 글에서 검증한다.',
    href: 'https://www.krea.ai/blog/krea-2-technical-report',
  },
  {
    index: '03',
    name: 'FLUX.2 family',
    date: '2026-07 기준 문서',
    question: '여러 reference, 편집과 local 실행을 같은 계열에서 골라야 하는가?',
    story: '제품, 인물, pose reference를 함께 넣어 campaign variant를 만들려면 multi-reference가 필요하다. 하지만 “FLUX.2” 하나를 골랐다고 끝나지 않는다. API의 max·pro·flex, 공개 weight의 dev·klein은 기능, 속도와 license가 다르다.',
    evidence: '공식 문서는 FLUX.2의 multi-reference와 typography를 설명하고, klein 4B는 Apache 2.0, 9B는 FLUX Non-Commercial License라고 구분한다. Undistilled base variant는 fine-tuning용이며 public API model과도 구분된다.',
    decision: 'Family 이름 대신 정확한 variant·revision·license를 기록한다. 24GB급 장비에서는 “consumer GPU” 문구를 믿기보다 실제 weight, dtype, VAE와 peak VRAM을 측정한다.',
    href: 'https://docs.bfl.ai/flux_2/flux2_overview',
  },
  {
    index: '04',
    name: 'Qwen-Image family · 2.0 watchlist',
    date: '2026-02-10 이후',
    question: '긴 지시, typography와 generation/editing 통합이 필요한가?',
    story: '기존 제품 형태는 유지하면서 한글 문구와 배경만 바꾸려면 장면 의미와 pixel appearance를 함께 읽어야 한다. Qwen 계열은 원본 20B MMDiT와 월별 edit checkpoint, 2026년 2.0 발표를 시간순으로 구분해야 한다.',
    evidence: '공식 repository는 Qwen-Image-2.0이 1k-token instruction, native 2K, generation/editing 통합과 더 가벼운 구조를 목표로 한다고 밝힌다. 같은 repository의 공개 Qwen-Image 계열은 Apache 2.0이지만, 2.0의 weight availability는 별도 model card로 재확인해야 한다.',
    decision: '2.0은 발표·online 체험 상태와 공개 weight 상태를 분리한다. 2.0 model card와 weight revision을 확보하기 전에는 local 실행 후보가 아니라 watchlist이며, 현재 공개 2025 checkpoint로 대신 검증했다고 쓰지 않는다.',
    href: 'https://github.com/QwenLM/Qwen-Image',
  },
  {
    index: '05',
    name: 'Z-Image',
    slug: 'z-image',
    date: '2026-07 조회 기준',
    question: '작은 active runtime과 few-step artifact의 경계를 먼저 봐야 하는가?',
    story: 'Local 반복 비용이 병목이면 family 이름보다 Base 50 NFE, Turbo 8 NFE와 현재 공개된 T2I artifact를 구분해야 한다.',
    evidence: '조회한 공식 README·code는 6B S3-DiT 계열 설명과 Base·Turbo 실행을 보여 주지만 Edit·Omni는 조회 시점에 아직 공개 예정이다.',
    decision: '빠른 Turbo 결과를 Base 학습 계약이나 미공개 Edit 기능으로 일반화하지 않고 exact checkpoint·encoder·VAE·offload를 기록한다.',
    href: 'https://github.com/Tongyi-MAI/Z-Image',
  },
  {
    index: '06',
    name: 'Illustrious XL v1.1',
    slug: 'illustrious-xl',
    date: '2026-07 current card',
    question: '새 architecture보다 SDXL 상속과 domain checkpoint delta가 중요한가?',
    story: 'Illustration·character 작업은 새 foundation architecture보다 SDXL에서 무엇을 상속했고 v1.1이 무엇을 바꿨는지 분리해야 재현할 수 있다.',
    evidence: '공식 model card가 밝힌 continuation, 2024-07 knowledge cutoff와 400-sample ELO는 v1.1 범위의 근거다. Tag·LoRA·merge 관행은 별도 실험이다.',
    decision: 'Checkpoint 고유 변화와 VAE·LoRA·prompt convention의 효과를 같은 seed·sampler·adapter ablation으로 분리한다.',
    href: 'https://huggingface.co/OnomaAIResearch/Illustrious-XL-v1.1',
  },
] as const;

const videoFamilies = [
  {
    name: 'LTX-2.3',
    slug: 'ltx-23',
    role: '영상과 audio를 한 모델에서 동기화해야 할 때',
    mechanism: 'DiT 기반 joint audio-video · multimodal input · step-distilled local path',
    boundary: '공식 open-source 문서는 최대 약 20초를 configuration·hardware에 따라 지원한다고 설명한다. LTX-2 Community License는 연 매출 1천만 달러 이상 법인에 별도 유료 commercial license를 요구하므로, API 상품·code license·model weight license를 각각 확인한다.',
    href: 'https://docs.ltx.io/open-source-model/getting-started/overview',
  },
  {
    name: 'Wan2.2',
    slug: 'wan22',
    role: 'T2V·I2V·TI2V·Animate 중 task entry를 명확히 골라야 할 때',
    mechanism: 'High-noise / low-noise expert MoE · TI2V 5B · temporal VAE',
    boundary: 'A14B MoE와 5B dense TI2V는 다른 모델이다. Repository model은 Apache 2.0이지만 input 권리와 배포 의무는 별도다. “4090에서 실행”은 공식 configuration의 해상도·frame·offload 조건까지 함께 읽는다.',
    href: 'https://github.com/Wan-Video/Wan2.2',
  },
] as const;

export default function OpenImageVideoModelsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최신 이름보다 제작 목표를 먼저 고른다</h2>
        <BeginnerBridge title="한 카메라가 제품 글자·스타일 탐색·부분 수정·긴 영상을 모두 가장 잘 찍지는 않는다">
          생성 모델의 ‘최고’는 하나의 점수가 아니다. 글자를 정확히 그려야 하는지, 같은 제품을 유지하며 고칠지, 여러 시안을 빨리 볼지, 움직이는 장면을 만들지에 따라 실패 조건과 필요한 모델 계열이 달라진다.
        </BeginnerBridge>
        <QuestionLead
          question="Ideogram, Krea, FLUX, Qwen 중 지금 가장 좋은 모델은 무엇일까?"
          answer="하나의 순위로 답할 수 없다. 한국어 문구가 한 글자만 틀려도 폐기되는 패키지, style 후보를 넓게 탐색하는 concept art, 여러 reference를 합치는 편집, 5초 동안 identity를 지켜야 하는 영상은 서로 다른 제어 신호와 실패 비용을 가진다. 이 글은 모델 목록이 아니라 목표에서 실행 경로를 고르는 입구다."
        />
        <ConceptPrimer items={[
          { term: 'Model family', meaning: '하나의 이름 아래 크기·학습 상태·API·공개 weight variant가 모인 계열이다.', why: 'FLUX.2처럼 같은 family 안에서도 license와 fine-tuning 가능 범위가 다르다.' },
          { term: 'Open weights', meaning: '학습된 parameter를 내려받을 수 있다는 뜻이다.', why: 'Code·data·상업 사용까지 자동으로 허용된다는 뜻이 아니다.' },
          { term: 'Control surface', meaning: 'Prompt 밖에서 결과를 움직이는 box, mask, reference, audio와 strength 같은 입력이다.', why: '샘플 취향 대신 실제 작업이 요구하는 입력 계약으로 모델을 고른다.' },
          { term: 'Runtime contract', meaning: 'Encoder, latent, denoiser, solver, VAE와 memory 이동의 정확한 조합이다.', why: 'Model quality와 반복 생산 가능한 비용을 함께 판단한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 스튜디오가 한국어 문구가 들어간 제품 패키지를 만들고, 같은 제품 identity를 유지한 채 배경을 편집한 다음,
            5초 영상을 생성한다고 하자. 상업 사용이 가능해야 하고, 24GB급 장비에서 local fallback이 있어야 하며,
            다른 작업자가 같은 결과를 재현해야 한다. 이 요구는 한 모델의 benchmark score로 닫히지 않는다.
          </p>
          <p>
            먼저 결과물을 폐기하게 만드는 오류를 적고, 그 오류를 직접 제어할 input을 고른다. 그 다음에야 공식 release가
            그 기능을 현재 제공하는지, weight와 code를 받을 수 있는지, license가 무엇인지, runtime 비용이 감당 가능한지 확인한다.
            Image와 Video는 이 지점에서 형제 branch로 갈라지고 workflow audit에서 다시 합류한다.
          </p>
        </div>
        <ProductionGoalRouter />
      </section>

      <section id="model-map" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이미지 모델은 서로 다른 문제를 전면에 놓는다</h2>
        <p className="mb-6 max-w-3xl text-sm leading-7 text-muted-foreground">
          여섯 모델을 한꺼번에 외우지 않는다. 하나를 고른 뒤 해결하려는 실패, 공식 근거, 아직 측정할 경계를 같은 순서로 읽는다.
        </p>
        <ImageModelDecisionSequence />
        <Misconception>
          공식 문서가 typography, consumer GPU, open weights를 말해도 내 작업의 한국어 정확도, 24GB peak VRAM과 상업 배포가 자동으로 보장되는 것은 아니다. Claim은 후보를 좁히고, 고정 suite와 license snapshot이 채택을 결정한다.
        </Misconception>
      </section>

      <section id="video-map" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">영상은 이미지 위에 시간 계약을 추가한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            영상도 prompt, latent, denoiser와 VAE를 사용하지만 결과 판정은 달라진다. 첫 frame을 잘 보존했는지, 제품이 회전할 때 형태가
            변하지 않는지, camera motion과 object motion이 분리되는지, 음성과 입 모양이 맞는지를 시간에 따라 본다. 따라서 image benchmark의
            한 장 품질은 video model을 고르는 충분한 근거가 아니다.
          </p>
        </div>
        <VideoModelDecisionSequence />
        <CitationBlock source="Wan2.2 official repository" citeKey={1} href="https://github.com/Wan-Video/Wan2.2">
          <p>A14B의 high/low-noise expert MoE, 5B TI2V의 압축 VAE와 task별 공개 checkpoint를 구분하는 기준 자료다.</p>
        </CitationBlock>
        <CitationBlock source="LTX-2.3 open-source documentation" citeKey={2} href="https://docs.ltx.io/open-source-model/getting-started/overview">
          <p>DiT 기반 joint audio-video, multimodal input, local execution과 configuration에 따른 길이·해상도 범위를 설명한다.</p>
        </CitationBlock>
      </section>

      <section id="selection" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">두 branch는 따로 시작하고 같은 증거 계약에서 합류한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이미지 작업자는 Image runtime에서 text encoder, latent, denoiser, solver와 VAE를 추적한다. 영상 작업자는 Video runtime에서
            같은 뼈대를 확인한 뒤 temporal latent, motion state, audio condition과 memory 증가를 추가한다. 둘 다 다음 단계에서는
            model revision, workflow graph, runtime, preprocessing와 sampling trace를 manifest로 고정한다.
          </p>
          <p>
            그 뒤 parameter 글에서 steps, guidance, resolution과 frame을 비용 가설로 바꾸고, adaptation 글에서 prompt·control로 해결할지,
            reference나 LoRA가 필요한지, full fine-tuning까지 갈지를 판단한다. Diffusion과 VAE는 처음부터 강제로 읽는 선행 과목이 아니라,
            solver나 latent reconstruction이 막혔을 때 내려가는 최소 기반이다.
          </p>
        </div>
        <div className="not-prose grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.72fr)]">
          {[
            ['IMAGE PATH', 'image-model-runtime', 'ai-open-image-current-first', 'Image runtime → 재현 → 예산 → 적응'],
            ['VIDEO PATH', 'video-model-runtime', 'ai-open-video-current-first', 'Video runtime → 재현 → 예산 → 적응'],
          ].map(([label, slug, pathId, title]) => (
            <Link
              key={pathId}
              to={`${articlePath('ai', slug)}?path=${encodeURIComponent(pathId)}`}
              state={{ learningPathId: pathId }}
              className="min-w-0 rounded-md border border-border p-4 hover:bg-muted/25"
            >
              <span className="text-xs font-bold text-muted-foreground">{label}</span>
              <strong className="mt-2 block text-sm leading-relaxed">{title}</strong>
            </Link>
          ))}
          <Link to={articlePath('ai', 'stable-diffusion-open-models')} className="min-w-0 rounded-md border border-dashed border-border p-4 hover:bg-muted/25">
            <span className="text-xs font-bold text-muted-foreground">OPTIONAL FLOOR</span>
            <strong className="mt-2 block text-sm leading-relaxed">U-Net·SDXL 상속이 막힐 때만 Stable Diffusion 기준선</strong>
          </Link>
        </div>
      </section>

      <section id="practice" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이 글을 읽고 설계할 비교 실험</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            하나의 studio brief를 여섯 fixture로 쪼갠다. 한국어 exact text, box layout, product identity, multi-reference composition,
            style diversity, 5초 motion·audio다. 모델이 지원하지 않는 control은 낮은 품질 점수가 아니라 “계약 미지원”으로 기록한다.
            각 run은 model variant와 revision, license snapshot, prompt와 reference, preprocessing, seed, solver·schedule, steps·guidance,
            dtype·offload, peak VRAM, latency, postprocess와 output hash를 남긴다.
          </p>
          <p>
            이 본문만 읽고도 왜 Ideogram 4.0의 editable text layer를 현재 기능으로 쓰면 안 되는지, 왜 FLUX.2 4B와 9B를 같은 상업 조건으로
            묶으면 안 되는지, 왜 Wan2.2 A14B와 TI2V-5B의 실행 결과를 같은 architecture로 설명하면 안 되는지 판정할 수 있어야 한다.
          </p>
          <h3>모델을 돌리기 전에 여섯 통과선을 고정한다</h3>
          <p>
            숫자는 모든 작업에 통용되는 정답이 아니다. 먼저 사람이 pass·fail로 합의한 gold fixture를 만들고 threshold를 고정한 뒤 모델을 비교한다.
            결과를 본 다음 기준을 바꾸면 cherry-picking이 된다.
          </p>
          <ol>
            <li><strong>한국어 exact text:</strong> 목표 문자열과 OCR 결과를 Unicode NFC로 정규화한 뒤 codepoint와 줄바꿈을 exact match한다. 각 글자 box가 지정 layout box 안에 있는지 확인하고, OCR이 놓치는 장식 글꼴은 사람이 glyph를 대조한다.</li>
            <li><strong>제품 identity:</strong> 실루엣, logo 위치, 부품 수와 brand color를 hard attribute로 고정한다. Embedding similarity는 gold pass/fail set으로 threshold를 보정한 보조 신호이며 단독 판정자가 아니다.</li>
            <li><strong>5초 영상:</strong> 고정 frame 간격마다 image gate를 반복하고, 정상 motion으로 보정한 뒤 남는 flicker·identity drift와 audio event offset을 별도 한도로 판정한다.</li>
            <li><strong>24GB fallback:</strong> 24 GiB에서 선언한 safety margin을 뺀 peak reserved memory, host RAM, cold/warm latency를 세 번 측정한다. 한 번의 OOM-free screenshot은 통과 근거가 아니다.</li>
            <li><strong>상업 사용:</strong> model weight, code, custom node와 dependency, input asset, output 사용 조건의 license snapshot을 각각 남긴다. “open source” 한 문장으로 합치지 않는다.</li>
            <li><strong>Replay:</strong> 두 번째 machine에서 같은 revision·manifest로 실행하고, bitwise 일치가 불가능하면 위의 작업별 acceptance gate 안에 다시 들어오는지 확인한다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          '결과물의 폐기 조건에서 필요한 control surface를 먼저 고를 수 있다.',
          'Foundation model, API product, open weights, code와 license를 서로 다른 계약으로 확인한다.',
          'Image와 Video runtime을 형제 branch로 읽고 시간축이 추가하는 실패를 설명할 수 있다.',
          '새 모델이 나와도 여섯 acceptance gate와 실행 manifest로 기존 후보와 비교할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Ideogram 4.0 release', href: 'https://ideogram.ai/news/ideogram-4.0/', note: '현재 기능, 공개 weight·license와 layer roadmap의 경계.' },
          { label: 'Krea 2 Technical Report', href: 'https://www.krea.ai/blog/krea-2-technical-report', note: 'Foundation model architecture, training과 style-control 설계.' },
          { label: 'FLUX.2 documentation', href: 'https://docs.bfl.ai/flux_2/flux2_overview', note: 'API/open variants, reference 기능, 4B·9B license와 reproducible endpoint.' },
          { label: 'Qwen-Image repository', href: 'https://github.com/QwenLM/Qwen-Image', note: '2.0 announcement와 공개 Qwen-Image 계열의 시간 경계.' },
          { label: 'Z-Image official repository', href: 'https://github.com/Tongyi-MAI/Z-Image', note: 'Base·Turbo artifact, current T2I code와 미공개 변형의 경계. 재현 manifest에는 조회한 commit 또는 model-card revision을 따로 고정한다.' },
          { label: 'Illustrious XL v1.1 model card', href: 'https://huggingface.co/OnomaAIResearch/Illustrious-XL-v1.1', note: 'SDXL 상속 위 v1.1 delta와 scoped ELO 근거.' },
          { label: 'Wan2.2 repository', href: 'https://github.com/Wan-Video/Wan2.2', note: 'MoE A14B, dense TI2V-5B, VAE, task별 공개 경로와 Apache 2.0 model license.' },
          { label: 'LTX-2.3 open-source docs', href: 'https://docs.ltx.io/open-source-model/getting-started/overview', note: 'Joint audio-video와 local runtime 범위.' },
          { label: 'LTX-2 Community License', href: 'https://github.com/Lightricks/LTX-2/blob/main/LICENSE', note: 'Commercial entity의 매출 기준과 별도 commercial license 조건.' },
        ]} />
      </section>
    </div>
  );
}

function ImageModelDecisionSequence() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const model = imageFamilies[selectedIndex];

  return (
    <figure className="not-prose min-w-0 scroll-mt-20 border-y border-border" data-image-model-sequence data-viz-canvas>
      <div className="grid grid-cols-3 border-b border-border" role="tablist" aria-label="현재 이미지 모델 여섯 선택지">
        {imageFamilies.map((item, index) => {
          const active = selectedIndex === index;
          return (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-label={item.name}
              aria-selected={active}
              aria-controls="image-model-decision-panel"
              onClick={() => setSelectedIndex(index)}
              className={`min-h-[68px] min-w-0 border-r border-t border-border px-2 py-3 text-left first:border-t-0 [&:nth-child(2)]:border-t-0 [&:nth-child(3)]:border-t-0 [&:nth-child(3n)]:border-r-0 sm:px-3 ${active ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted/25 hover:text-foreground'}`}
            >
              <span className="block font-mono text-xs font-bold">{item.index}</span>
              <span className="mt-1 block text-xs font-bold leading-4 sm:text-sm">{imageTabLabel(item.name)}</span>
            </button>
          );
        })}
      </div>

      <article id="image-model-decision-panel" role="tabpanel" className="min-w-0 py-8 sm:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-xs font-bold text-primary">IMAGE {model.index} / 06</p>
          <p className="font-mono text-xs font-bold text-muted-foreground">AS OF {model.date}</p>
        </div>
        <h3 className="mt-3 text-xl font-black leading-tight sm:text-2xl">{model.name}</h3>
        <p className="mt-3 max-w-3xl text-base font-semibold leading-7">{model.question}</p>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-foreground/80">{model.story}</p>

        <dl className="mt-7 grid border-y border-border md:grid-cols-2">
          <DecisionBoundary label="공식 원문이 말하는 것" body={model.evidence} tone="source" />
          <DecisionBoundary label="채택 전에 직접 확인할 것" body={model.decision} tone="verify" />
        </dl>

        <div className="mt-6 flex flex-wrap gap-4">
          {'slug' in model && model.slug && (
            <Link to={articlePath('ai', model.slug)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground">
              구조부터 읽기
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
          <a href={model.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground">
            공식 원문 열기
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </article>
    </figure>
  );
}

function VideoModelDecisionSequence() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const model = videoFamilies[selectedIndex];

  return (
    <figure className="not-prose mt-6 min-w-0 scroll-mt-20 border-y border-border" data-video-model-sequence data-viz-canvas>
      <div className="grid grid-cols-2 border-b border-border" role="tablist" aria-label="현재 비디오 모델 두 선택지">
        {videoFamilies.map((item, index) => {
          const active = selectedIndex === index;
          return (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-label={item.name}
              aria-selected={active}
              aria-controls="video-model-decision-panel"
              onClick={() => setSelectedIndex(index)}
              className={`min-h-[64px] border-r border-border px-3 py-3 text-left last:border-r-0 ${active ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted/25 hover:text-foreground'}`}
            >
              <span className="font-mono text-xs font-bold">0{index + 1}</span>
              <span className="ml-3 text-sm font-black">{item.name}</span>
            </button>
          );
        })}
      </div>
      <article id="video-model-decision-panel" role="tabpanel" className="grid min-w-0 gap-6 py-8 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:py-10">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">현재 공개 실행 사례</p>
          <h3 className="mt-2 text-xl font-black sm:text-2xl">{model.name}</h3>
          <p className="mt-4 text-sm font-bold leading-7">{model.role}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="font-mono text-sm font-semibold leading-7">{model.mechanism}</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{model.boundary}</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link to={articlePath('ai', model.slug)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground">
              구조부터 읽기
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a href={model.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-border underline-offset-4 hover:decoration-foreground">
              공식 원문 열기
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    </figure>
  );
}

function DecisionBoundary({ label, body, tone }: { label: string; body: string; tone: 'source' | 'verify' }) {
  const toneClass = tone === 'source'
    ? 'bg-emerald-50/45 text-emerald-900 dark:bg-emerald-950/15 dark:text-emerald-100'
    : 'border-t border-border bg-amber-50/45 text-amber-950 md:border-l md:border-t-0 dark:bg-amber-950/15 dark:text-amber-100';
  return (
    <div className={`min-w-0 px-4 py-5 sm:px-5 ${toneClass}`}>
      <dt className="text-xs font-bold">{label}</dt>
      <dd className="mt-2 text-sm leading-7">{body}</dd>
    </div>
  );
}

function imageTabLabel(name: string) {
  if (name.startsWith('Ideogram')) return 'Ideogram';
  if (name.startsWith('Krea')) return 'Krea';
  if (name.startsWith('FLUX')) return 'FLUX.2';
  if (name.startsWith('Qwen')) return 'Qwen 2.0';
  if (name.startsWith('Z-Image')) return 'Z-Image';
  return 'Illustrious';
}
