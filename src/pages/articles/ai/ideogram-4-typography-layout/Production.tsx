import {
  CapabilityCheck,
  InternalLink,
  Misconception,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';

function EvidenceRow({
  label,
  observed,
  pass,
}: {
  label: string;
  observed: string;
  pass: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
      <p className="text-sm font-black">{label}</p>
      <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">기록</strong> · {observed}</p>
      <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">통과</strong> · {pass}</p>
    </div>
  );
}

export default function IdeogramProduction() {
  return (
    <>
      <section id="runtime-license" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2K·open weight·commercial이라는 단어를 한 문장으로 묶지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 inference는 가로·세로 256–2048, 16의 배수, 최대 6:1 aspect ratio를 지원한다. “Native 2K”는
            모든 작업을 2048×2048로 돌리라는 뜻이 아니다. Banner는 1600×400처럼 긴 canvas를 쓸 수 있고,
            해상도가 커지면 latent token, attention과 VAE decode 비용이 함께 늘어난다. 먼저 납품 크기를 정한 뒤
            12·20·48-step preset에서 품질과 latency를 측정한다.
          </p>
          <p>
            공개 model zoo에는 9.3B NF4와 FP8 weight가 있다. 두 weight 모두 Ideogram 4 Non-Commercial agreement 아래 gated
            Hugging Face repository로 배포된다. Inference code는 Apache 2.0이다. 여기까지가 무료 공개 범위다.
            Public quantized weight를 자체 infrastructure에서 상업적으로 쓰려면 self-serve commercial right가 필요하고,
            full-precision, customer-facing product, third-party API-like access와 더 복잡한 배포는 enterprise 범위다.
          </p>
          <p>
            Weight를 self-host했다고 prompt expansion과 safety까지 자동으로 local이 되는 것은 아니다. 공개 CLI의 기본 Magic Prompt는
            Ideogram hosted API를 호출하고, 기본 safety path는 Hive Text Moderation과 Visual Content Moderation key를 요구한다.
            폐쇄망이라면 공개 system prompt를 쓸 local LLM과 Hive 대신 동등하거나 더 강한 prompt·output filter를 별도로 설계해야 한다.
            공식 safety 문서는 moderation을 빼면 runtime screening이 완전히 꺼지며 supported deployment가 아니라고 명시한다.
          </p>
        </div>
        <div className="not-prose mt-6 divide-y divide-border border-y border-border">
          {[
            ['Public weights', 'NF4·FP8 quantized, gated download', '연구·평가·prototype·개인 프로젝트의 non-commercial agreement'],
            ['Inference code', 'Python pipeline과 실행 구현', 'Apache 2.0 code license'],
            ['Prompt expansion', '기본 Ideogram hosted API 또는 대체 LLM', 'Provider·model·system prompt·expanded JSON을 기록'],
            ['Safety screening', 'Hive text·visual moderation 또는 동등 이상 filter', 'Prompt 전·image 반환 전 두 경계를 모두 검사'],
            ['Self-hosted commercial', 'Public quantized weights를 자체 인프라에서 실행', '별도 self-serve license와 계약 시점 allowance를 재확인'],
            ['Enterprise', 'Full precision, customer-facing, third-party access', '별도 검토·지원·custom terms'],
          ].map(([title, artifact, right]) => (
            <div key={title} className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,0.8fr)_minmax(0,1fr)] sm:gap-5">
              <p className="text-sm font-black">{title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{artifact}</p>
              <p className="text-xs leading-relaxed">{right}</p>
            </div>
          ))}
        </div>
        <StopRule>
          “GitHub가 Apache 2.0이니 model도 상업적으로 무료다” 또는 “weight가 local이니 prompt와 output도 외부로 나가지 않는다”고
          결론 내리지 않는다. Code license, weight agreement, Magic Prompt endpoint, moderation provider, output policy와 실제
          deployment right를 각각 snapshot으로 남긴다.
        </StopRule>
      </section>

      <section id="release-state" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 기능과 layer roadmap 사이에 시간 경계를 긋는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2026년 6월 3일 release가 현재 model capability로 제시한 것은 multilingual text rendering, native bounding-box control,
            2K photoreal output과 fine-tuning 기반이다. Transparent cutout은 현재 Background Remover가 제공한다.
            이것은 flat output에서 alpha cutout을 만드는 제품 기능이다.
          </p>
          <p>
            Editable text와 movable image layer를 model inference가 직접 반환하는 기능은 follow-up release로 명시됐다.
            Branded asset이 typography, palette와 logo fidelity를 따르는 기능도 그 뒤 roadmap이다. 따라서 현재 채택 문서에
            “text layer를 나중에 다시 편집할 수 있다”고 적으면 release state를 과장한 것이다.
          </p>
        </div>
        <Misconception>
          “Transparent layer today”는 “editable text layer today”와 같지 않다. 현재 alpha cutout, follow-up component stack과 향후 brand system은 서로 다른 날짜와 acceptance test를 가져야 한다.
        </Misconception>
      </section>

      <section id="evaluation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">샘플 한 장이 아니라 다섯 납품 gate로 평가한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            회사가 제시한 leaderboard는 후보를 고르는 근거다. 내 한국어 글꼴, packaging layout와 hardware에서 출시할 근거는 아니다.
            평가 fixture는 문구 길이, 언어, box 크기, contrast와 aspect ratio를 조합한다. Prompt마다 seed를 여러 개 돌리고
            best-of-k가 아니라 first-sample과 실패율을 함께 기록한다.
          </p>
        </div>
        <div className="not-prose mt-6 border-b border-border">
          <EvidenceRow label="Exact text" observed="원문·expanded JSON·OCR output·Unicode codepoint·line break" pass="NFC 정규화 뒤 exact match, 장식 glyph는 사람이 대조" />
          <EvidenceRow label="Layout" observed="요청 box와 실제 glyph/object box, overlap와 margin" pass="모든 납품 요소가 허용 영역과 간격 규칙 안에 존재" />
          <EvidenceRow label="Palette" observed="요청 uppercase hex, 주요 영역의 sampled color와 ΔE" pass="Brand가 합의한 색 오차와 contrast gate를 통과" />
          <EvidenceRow label="Runtime" observed="weight quantization, preset, resolution, GPU, peak VRAM, cold/warm latency" pass="목표 hardware에서 OOM 없이 반복 latency 예산 통과" />
          <EvidenceRow label="Rights · replay" observed="code/weight/policy/license, Magic Prompt·moderation endpoint, expanded caption, seed, output hash" pass="외부 전송 경계 승인, 두 번째 machine 재실행과 deployment review 모두 통과" />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OCR만으로 text gate를 닫으면 작은 장식 글꼴이나 비슷한 자형을 놓칠 수 있다. 사람만 보면 많은 sample의 작은 오류를 일관되게 세기 어렵다.
            자동 exact match와 glyph review를 결합하고, box와 palette는 별도 metric으로 둔다.
            Workflow snapshot과 다른 작업자의 재실행은
            <InternalLink slug="open-model-community-workflows">Workflow 감사 글</InternalLink>의 manifest로 넘긴다.
          </p>
        </div>
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델 이름 대신 brief가 살아남는 경로를 기억한다</h2>
        <CapabilityCheck items={[
          'Plain prompt를 exact string, style, background, element, box와 palette가 있는 structured caption으로 분해한다.',
          '0–1000 box의 y-first 좌표를 output aspect ratio에 맞는 상대 배치로 해석한다.',
          'Qwen3-VL 13-layer feature와 image token이 34-block single-stream DiT에서 만나는 이유와 한계를 설명한다.',
          'Velocity prediction, Euler/CFG, VAE decode의 서로 다른 실패 소유자를 찾는다.',
          'NF4·FP8 weight, Apache inference code, self-serve와 enterprise commercial right를 구분한다.',
          'Self-hosted weight와 hosted Magic Prompt·Hive moderation dependency를 분리하고 폐쇄망 대체 경로를 설계한다.',
          '현재 alpha cutout과 follow-up editable layer roadmap을 혼동하지 않는다.',
          'Exact text, layout, palette, runtime, rights·replay gate로 모델을 채택한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Ideogram 4 official repository', href: 'https://github.com/ideogram-oss/ideogram4', note: '9.3B NF4·FP8 model zoo, trained-from-scratch claim, quick start와 공개 runtime의 기준.' },
          { label: 'Official prompting guide', href: 'https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md', note: 'Structured JSON schema, y-first 0–1000 bbox, key order, palette와 magic prompt의 정확한 계약.' },
          { label: 'Official model architecture', href: 'https://github.com/ideogram-oss/ideogram4/blob/main/docs/model_architecture.md', note: 'Qwen3-VL 13-layer features, 34-block single stream, QK-RMSNorm, MRoPE, flow sampler와 VAE.' },
          { label: 'Official inference reference', href: 'https://github.com/ideogram-oss/ideogram4/blob/main/docs/inference.md', note: '12·20·48 step preset, guidance schedule, 256–2048 resolution과 aspect ratio boundary.' },
          { label: 'Official safety reference', href: 'https://github.com/ideogram-oss/ideogram4/blob/main/docs/safety.md', note: 'Hive prompt·output moderation의 integration point, filter를 제거한 배포의 unsupported 경계와 대체 filter 책임.' },
          { label: 'Ideogram licensing', href: 'https://ideogram.ai/licensing/', note: 'Public non-commercial weights, Apache code, self-serve commercial과 enterprise 권리의 분리.' },
          { label: 'Ideogram 4 release', href: 'https://ideogram.ai/news/ideogram-4.0/', note: '2026-06-03 현재 capability와 transparent/editable/branded layer roadmap의 시간 경계.' },
        ]} />
      </section>
    </>
  );
}
