import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { AudioRepresentationExplorer } from './speech-audio-core/viz/SpeechSystemExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-7 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function AudioRepresentationNeuralCodecsArticle() {
  return (
    <>
      <section id="representation-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Audio representation은 무엇을 버려도 되는지 정하는 계약이다</h2>
        <BeginnerBridge title="녹음 횟수를 나중에 늘려도 처음 듣지 못한 소리는 돌아오지 않는다">
          Sample rate는 1초 동안 소리를 몇 번 숫자로 기록했는지 나타낸다. 8 kHz 전화 음성은 1초에 8,000번 기록한 소리다. 이를 24 kHz 형식으로 바꾸면 숫자 칸은 늘지만 처음 녹음에서 빠진 높은 소리까지 새로 생기지는 않는다.
        </BeginnerBridge>
        <QuestionLead question="8 kHz 전화 음성을 24 kHz model에 넣으면 잃어버린 고음이 다시 생길까?" answer="아니다. 원래 capture에서 4 kHz 위 대역이 제거됐다면 upsampling은 sample 수만 늘린다. Representation은 model 앞의 편의 기능이 아니라, 어떤 시간·주파수·화자·음색 정보를 보존하고 얼마의 sequence와 bitrate를 지불할지 정하는 첫 설계 결정이다." />
        <ConceptPrimer items={[
          { term: 'Sample', meaning: '연속 압력 파형을 일정한 시간 간격으로 기록한 한 숫자다.', why: 'Sample rate가 보존 가능한 최고 주파수와 초당 입력량을 함께 정한다.' },
          { term: 'Frame · hop', meaning: '짧은 window와 다음 window까지 이동하는 간격이다.', why: '한 frame의 분석 문맥과 초당 feature 수·algorithmic delay를 정한다.' },
          { term: 'Continuous feature', meaning: 'Mel energy나 learned encoder latent처럼 실수 vector로 남긴 표현이다.', why: '가까운 소리를 가까운 값으로 표현하지만 autoregressive vocabulary처럼 바로 예측하지는 않는다.' },
          { term: 'Discrete codec token', meaning: 'Codebook에서 고른 index로 audio latent를 압축한 값이다.', why: 'Language model이 다음 audio code를 분류 문제로 생성할 수 있게 한다.' },
        ]} />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{x[n]}_{\text{n번째 sample}}&=\underbrace{x(n/f_s)}_{\text{연속 파형을 일정 간격으로 관측}}\\[0.35em]\underbrace{f_{\max}}_{\text{alias 없이 표현 가능한 최고 주파수}}&<\underbrace{\frac{f_s}{2}}_{\text{Nyquist 상한}}\end{aligned}`}
          meaning="초당 f_s번 sample하면 인접 sample 사이 간격은 1/f_s다. 원 신호에 f_s/2 이상의 성분이 남아 있으면 낮은 주파수로 접혀 alias가 된다. 그래서 ADC 앞 low-pass filter와 target sample rate를 함께 정한다. 8 kHz 전화 입력의 이론 상한은 4 kHz이며, 뒤에서 24 kHz로 늘려도 관측하지 않은 실제 대역은 돌아오지 않는다."
          symbols={[[String.raw`x(t)`, '시간 t의 연속 acoustic pressure signal'], [String.raw`x[n]`, 'ADC가 기록한 discrete sample'], [String.raw`f_s`, '초당 sample 수, Hz'], [String.raw`f_{max}`, '원 신호에서 alias 없이 남길 최고 주파수'], [String.raw`1/f_s`, '인접 sample 사이 시간']]} />
        <Misconception>Sample rate, bit depth와 bitrate는 다르다. 16 kHz는 초당 sample 수, 16-bit는 sample 하나의 양자화 정밀도, kbps는 초당 전송하는 전체 bit 수다.</Misconception>
      </section>

      <section id="frames-spectrum" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">긴 파형을 frame과 spectrum으로 바꾸면 무엇이 달라질까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>1초 16 kHz mono audio는 16,000개 sample이다. Speech는 수십 ms 동안은 비교적 안정적이므로 긴 파형을 겹치는 frame으로 자르고 각 frame의 주파수 성분을 본다. Frame length가 길면 가까운 frequency를 더 세밀하게 나누지만, 자음이 시작한 정확한 시간을 흐리고 첫 frame을 채울 때까지 기다려야 한다.</p>
          <p>Window는 frame 경계를 갑자기 0으로 자를 때 생기는 spectral leakage를 줄인다. Hop은 다음 frame이 시작되는 간격이다. 25 ms window와 10 ms hop은 1초를 40개 덩어리로 만드는 것이 아니라 겹치는 약 98개 frame으로 만든다.</p>
          <p><strong>8 kHz 전화 입력을 16 kHz로 올리는 일은 model interface를 맞추는 adapter일 뿐, 4 kHz 위 정보를 복원하지 않는다.</strong> 16 kHz용 mel filterbank를 그대로 쓰면 상단 filter가 실제 신호가 아닌 빈 대역을 본다. Target model이 16 kHz만 받는다면 resampling 뒤에도 원래 유효 대역 mask를 보존하고, 8 kHz 학습·평가 slice에서 front-end와 model을 함께 검증한다. Narrowband codec의 clipping·quantization artifact도 clean microphone과 별도 slice로 둔다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\tilde x_m[n]}_{\text{hop만큼 이동한 sample}}&=x[n+mH]\\
\underbrace{x_m[n]}_{\text{m번째 windowed frame}}&=\tilde x_m[n]w[n]\\
\underbrace{b_k[n]}_{\text{k번째 회전 basis}}&=e^{-j2\pi kn/N}\\
\underbrace{X[m,k]}_{\text{시간 m의 주파수 성분}}
&=\sum_{n=0}^{N-1}x_m[n]b_k[n]
\end{aligned}`}
          meaning="STFT(Short-Time Fourier Transform, 단시간 푸리에 변환)는 각 frame에 DFT(Discrete Fourier Transform, 이산 푸리에 변환)를 적용해 같은 주파수 분석을 여러 시간 위치에서 반복한다. N은 한 frame의 sample 수, H는 hop sample 수다. X[m,k]의 절댓값이나 제곱은 그 시간 frame에 해당 주파수 성분이 얼마나 강한지를 나타내지만 phase, 미세 파형과 long-term structure를 요약하거나 버릴 수 있다."
          symbols={[[String.raw`m`, 'time frame index'], [String.raw`k`, 'frequency bin index'], [String.raw`N`, '한 frame의 sample 수'], [String.raw`H`, '인접 frame 시작점 사이 sample 수'], [String.raw`w[n]`, 'Hann 같은 analysis window'], [String.raw`X[m,k]`, 'complex STFT coefficient']]} />
        <Formula
          latex={String.raw`\underbrace{M[m,b]}_{\text{시간 m의 mel band b 에너지}}=\sum_k\underbrace{H_b[k]}_{\text{b번째 mel filter 가중치}}\underbrace{|X[m,k]|^2}_{\text{주파수 bin의 power}}`}
          meaning="Mel filterbank는 선형 frequency bin 여러 개를 겹치는 삼각 filter로 묶어 사람의 청각 해상도에 가까운 band energy를 만든다. 80 mel bin은 80개의 vocabulary token이 아니라 frame 하나의 80차원 연속 vector다. Hop이 10 ms라면 1초에 약 100개의 80차원 vector가 생긴다."
          symbols={[[String.raw`M[m,b]`, 'm번째 frame, b번째 mel band의 energy'], [String.raw`H_b[k]`, 'frequency bin k가 mel band b에 기여하는 정도'], [String.raw`|X|^2`, 'phase를 제외한 power spectrum'], [String.raw`b`, 'mel filter index']]} />
        <AudioRepresentationExplorer />
      </section>

      <section id="learned-and-discrete" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Semantic latent와 acoustic token은 같은 압축이 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>ASR encoder는 accent·noise가 달라도 같은 말의 hidden representation이 비슷해지도록 학습할 수 있다. 이 continuous latent는 content에는 강하지만 원 화자의 pitch, room reverb와 미세 파형을 그대로 복원할 필요가 없다. 반대로 neural codec은 decoder가 waveform을 다시 만들 수 있도록 음색과 timing detail을 더 남긴다.</p>
          <p>따라서 “audio token”이라는 말만으로는 부족하다. Token rate, vocabulary, codebook 수, causal encoder 여부와 첫 codebook이 semantic distillation을 받는지 확인해야 한다. Moshi의 Mimi처럼 첫 level에 semantic 정보를 더하고 나머지 level로 acoustic residual을 채우는 구조도 있고, 모든 codebook이 reconstruction을 중심으로 학습된 codec도 있다.</p>
        </div>
        <div className="not-prose my-8 min-w-0 divide-y divide-border border-y border-border">
          {[
            ['01', 'Log-Mel feature', '주파수별 energy를 사람이 정한 축에 놓는다. ASR 입력으로 안정적이지만 waveform reconstruction contract는 없다.'],
            ['02', 'Learned continuous latent', 'Encoder가 task loss에 맞춰 정보를 압축한다. 가까운 vector의 의미는 학습 목적과 dataset에 의존한다.'],
            ['03', 'Semantic token', '내용이나 음소에 강한 discrete unit을 만든다. 낮은 bitrate가 가능하지만 speaker·prosody가 사라질 수 있다.'],
            ['04', 'Acoustic codec token', 'Decoder가 waveform을 복원할 discrete code다. 여러 RVQ level이 coarse structure와 residual detail을 나눈다.'],
          ].map(([index, title, text]) => <div key={index} className="grid gap-2 py-5 sm:grid-cols-[3rem_12rem_minmax(0,1fr)] sm:items-start"><span className="font-mono text-xs font-black text-muted-foreground">{index}</span><strong className="text-sm">{title}</strong><p className="text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}
        </div>
      </section>

      <section id="rvq-bitrate" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Residual Vector Quantization은 detail을 여러 index로 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Codec encoder가 frame latent <MathFormula>z</MathFormula>를 만들면 첫 codebook에서 가장 가까운 vector를 고른다. 남은 residual에 두 번째 codebook을 적용하고 이를 반복한다. 앞 level은 큰 윤곽을, 뒤 level은 앞에서 설명하지 못한 detail을 보정한다. 모든 level을 독립적으로 아무 순서 없이 생성하는 것이 아니다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{r^{(0)}}_{\text{처음 residual}}&=\underbrace{z}_{\text{encoder 출력}}\\\underbrace{d_j(e)}_{\text{후보 code와의 거리}}&=\left\|\underbrace{r^{(j-1)}}_{\text{남은 residual}}-\underbrace{e}_{\text{후보 vector}}\right\|_2^2\\\underbrace{q_j}_{\text{j번째 선택 code}}&=\arg\min_{e\in\mathcal C_j}d_j(e)\\\underbrace{r^{(j)}}_{\text{다음 residual}}&=r^{(j-1)}-q_j,\qquad \underbrace{\hat z}_{\text{복원 latent}}=\sum_{j=1}^{K}q_j\end{aligned}`}
          meaning="각 level은 현재 residual과 가장 가까운 code vector를 골라 빼 준다. Codebook을 추가하면 표현 가능한 detail은 늘지만 code index 수, codebook lookup, model output과 decoder 계산도 늘어난다. Codebook collapse가 생기면 일부 index만 쓰여 이론 vocabulary보다 실제 capacity가 작아진다."
          symbols={[[String.raw`z`, 'codec encoder가 만든 continuous latent'], [String.raw`d_j(e)`, '현재 residual과 후보 code vector의 제곱 거리'], [String.raw`\mathcal C_j`, 'j번째 codebook vector 집합'], [String.raw`q_j`, 'j번째 level에서 선택한 quantized vector'], [String.raw`r^{(j)}`, 'j개 level 뒤 남은 residual'], [String.raw`K`, '사용하는 RVQ level 수'], [String.raw`\hat z`, '선택 code vector의 합으로 복원한 latent']]} />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{B_{frame}}_{\text{frame 하나의 bit}}&=\underbrace{K}_{\text{codebook 수}}\times\underbrace{\log_2 V}_{\text{code 하나의 bit}}\\[0.35em]\underbrace{R_{codec}}_{\text{초당 codec bit}}&=\underbrace{f_{tok}}_{\text{초당 frame 수}}\times B_{frame}\end{aligned}`}
          meaning="예를 들어 12.5 frame/s, 8 codebook, vocabulary 2048이면 index 자체는 초당 12.5×8×11=1100 bit다. 실제 file/network bitrate에는 framing, entropy coding와 protocol overhead가 더해질 수 있다. Speech LM은 초당 100개의 code 결정을 생성해야 하므로 text token/s와 같은 숫자로 비교하면 안 된다."
          symbols={[[String.raw`f_{tok}`, 'codec encoder가 초당 내는 frame/token step'], [String.raw`K`, '각 step의 RVQ codebook 수'], [String.raw`V`, 'codebook 하나의 vocabulary size'], [String.raw`\log_2 V`, '고정 길이 index에 필요한 bit'], [String.raw`B_{frame}`, '한 codec frame에 포함되는 index payload bit'], [String.raw`R_{codec}`, 'index payload의 이론 bitrate']]} />
      </section>

      <section id="streaming-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Offline reconstruction이 좋아도 realtime codec일 수 없는 이유</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Non-causal encoder가 미래 audio를 함께 보면 현재 frame을 더 잘 압축할 수 있지만, stream에서는 그 미래가 올 때까지 기다려야 한다. Receptive field는 encoder가 output frame 하나를 만들기 위해 참조하는 입력 시간 구간이다. Causal receptive field는 현재와 과거만 보지만, frame accumulation, future look-ahead, packetization과 decoder warm-up은 별도 algorithmic latency를 만든다. Real-time factor(처리 시간 ÷ 입력 audio 길이)가 1보다 작아도 2초 window를 모두 받아야 시작한다면 대화 first packet은 느리다.</p>
          <p>Release에서는 waveform L1 하나가 아니라 intelligibility, speaker similarity, prosody, background artifact와 subjective listening을 본다. Packet loss 때 한 codebook packet이 사라졌을 때의 degradation, silence가 noise로 변하는 현상, long-form drift와 codebook utilization도 분리한다.</p>
          <p>표현의 frame, spectrum, filter와 delay가 왜 생기는지 바닥까지 내려가려면 <InternalLink slug="signals-systems-convolution">신호와 시스템</InternalLink>으로 간다. Sampling과 convolution을 이해하면 codec bitrate와 first-packet latency를 단순한 모델 숫자가 아니라 물리적 제한으로 읽을 수 있다.</p>
        </div>
        <Misconception>“Codec이 20배 realtime”은 입력 1초를 50 ms에 계산한다는 throughput 의미일 수 있다. First packet latency에는 future look-ahead, frame, queue, network와 playback buffer가 별도로 남는다.</Misconception>
        <CapabilityCheck items={[
          'Sample rate에서 Nyquist 상한과 1초 PCM 입력량을 계산한다.',
          '8 kHz 입력을 resampling해도 사라진 대역은 돌아오지 않으며, 16 kHz front-end의 빈 상단 대역을 구분한다.',
          'Frame length와 hop에서 frame 수, time-frequency trade-off와 최소 대기 시간을 설명한다.',
          'Mel bin, continuous latent, semantic token과 acoustic token을 보존 정보로 구분한다.',
          'RVQ의 residual update를 실제 순서대로 계산하고 codebook collapse를 진단한다.',
          'Token rate, codebook 수와 vocabulary에서 codec index bitrate를 계산한다.',
          'Offline reconstruction, realtime factor와 first-packet latency를 서로 다른 release 지표로 기록한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Défossez et al. · High Fidelity Neural Audio Compression', href: 'https://arxiv.org/abs/2210.13438', note: 'Streaming encoder-decoder, quantized latent, perceptual loss와 subjective codec evaluation의 1차 근거.' },
          { label: 'Zeghidour et al. · SoundStream', href: 'https://arxiv.org/abs/2107.03312', note: 'End-to-end neural codec, residual vector quantizer, variable bitrate와 low-latency mobile inference.' },
          { label: 'Défossez et al. · Moshi', href: 'https://arxiv.org/abs/2410.00037', note: 'Mimi의 semantic-acoustic split RVQ, 12.5 Hz audio step과 streaming speech LM 연결.' },
          { label: 'Google · Universal Speech Model', href: 'https://research.google/blog/universal-speech-model-usm-state-of-the-art-speech-ai-for-100-languages/', note: 'Log-Mel, convolutional subsampling과 Conformer encoder가 현대 ASR representation으로 이어지는 공식 사례.' },
        ]} />
      </section>
    </>
  );
}
