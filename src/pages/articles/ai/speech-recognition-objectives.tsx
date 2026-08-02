import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { AsrAlignmentExplorer } from './speech-audio-core/viz/SpeechSystemExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-7 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function SpeechRecognitionObjectivesArticle() {
  return (
    <>
      <section id="alignment-problem" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ASR의 첫 문제는 “어느 frame이 어느 글자인가”다</h2>
        <BeginnerBridge title="1초의 소리는 약 100개의 짧은 조각인데 받아 적은 글자는 훨씬 적다">
          Audio frame은 약 10ms씩 잘라 얻은 소리 특징이고, transcript는 사람이 읽는 글자나 token이다. 녹음에는 “이 37번째 frame에서 첫 글자가 시작한다”는 표지가 없으므로, 모델은 긴 소리 조각과 짧은 글의 대응 관계를 함께 찾아야 한다.
        </BeginnerBridge>
        <QuestionLead question="1초에 약 100개의 audio frame이 있는데 transcript가 두 글자라면 정답을 어느 frame에 붙여야 할까?" answer="사람은 보통 각 글자의 정확한 시작 frame을 표시하지 않는다. ASR objective는 긴 acoustic frame sequence와 짧은 label sequence 사이의 가능한 alignment를 숨은 변수로 두고 합하거나, decoder가 직접 선택하게 만든다. CTC, RNN-T와 attention encoder-decoder의 핵심 차이는 이 alignment와 context를 어디서 책임지는가다." />
        <ConceptPrimer items={[
          { term: 'Acoustic frame', meaning: 'Mel 또는 learned encoder가 만든 짧은 시간 단위의 feature다.', why: 'Label보다 훨씬 길고 주변 noise·speaker 정보도 함께 들어 있다.' },
          { term: 'Label', meaning: '글자, subword 또는 byte처럼 decoder가 최종 transcript로 내는 단위다.', why: 'Label vocabulary와 normalization이 WER(Word Error Rate, 단어 오류율)·CER(Character Error Rate, 글자 오류율)와 decoding behavior를 바꾼다.' },
          { term: 'Alignment', meaning: '각 audio 시간 위치에서 blank를 내거나 어떤 label을 내는 경로다.', why: '정확한 frame-level annotation 없이 sequence likelihood를 계산하게 한다.' },
          { term: 'Partial hypothesis', meaning: '발화가 끝나기 전에 현재까지 내놓은 임시 transcript다.', why: 'Final WER가 같아도 자주 뒤집히면 caption·agent tool call이 불안정해진다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Backbone과 objective를 섞지 않는다. Conformer는 local convolution과 global attention으로 acoustic feature를 만드는 encoder 구조다. 그 encoder 출력 위에 CTC를 붙일 수도, RNN-T joint network를 붙일 수도, attention decoder를 붙일 수도 있다. “Conformer가 RNN-T보다 좋다”는 비교는 서로 다른 축을 비교한 문장이 된다.</p>
        </div>
      </section>

      <section id="ctc" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">CTC는 blank와 반복을 넣은 모든 단조 경로를 더한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>CTC는 각 frame에서 label vocabulary와 특별한 blank <MathFormula>{String.raw`\varnothing`}</MathFormula>의 확률을 낸다. 경로 <MathFormula>π</MathFormula>는 frame마다 하나를 고른 긴 sequence다. Collapse 함수 <MathFormula>B</MathFormula>는 연속 반복을 하나로 줄이고 blank를 지운다. 예를 들어 <MathFormula>{String.raw`\varnothing, 안, 안, \varnothing, 녕, 녕`}</MathFormula>은 “안녕”이 된다.</p>
          <p>학습은 “안녕”으로 collapse되는 경로를 하나 고르지 않는다. 가능한 모든 경로의 확률을 forward-backward dynamic programming으로 더한다. 이 때문에 frame-level label 없이 학습할 수 있지만, 주어진 audio에서 각 frame 출력은 다른 label output에 직접 조건화되지 않는다는 독립 가정을 가진다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
q_t(\pi_t)&=p(\pi_t\mid h_t) \quad \text{frame label 확률}\\
p(\pi\mid x)&=\prod_{t=1}^{T}q_t(\pi_t) \quad \text{경로 확률}\\
\mathcal A_y&=\{\pi:B(\pi)=y\} \quad \text{정답 경로 집합}\\
p(y\mid x)&=\sum_{\pi\in\mathcal A_y}p(\pi\mid x)
\end{aligned}`}
          meaning="Encoder가 T개 hidden state h_t를 만들면 각 time step의 label·blank 확률을 곱해 한 alignment path의 확률을 만든다. 정답 y로 collapse되는 path를 모두 더해 transcript likelihood를 계산한다. Blank는 space가 아니라 새 label을 내지 않는 frame을 표현하고, 같은 글자를 두 번 연속 출력하려면 그 사이 blank가 필요하다."
          symbols={[[String.raw`x`, '입력 audio feature sequence'], [String.raw`h_t`, 'encoder의 t번째 acoustic hidden state'], [String.raw`\pi_t`, 't번째 frame에서 선택한 label 또는 blank'], [String.raw`B`, 'repeat collapse 뒤 blank를 제거하는 함수'], [String.raw`y`, '정답 label sequence'], [String.raw`T`, 'encoder time step 수']]} />
        <Misconception>CTC가 monotonic하다는 말은 partial transcript가 절대 수정되지 않는다는 뜻이 아니다. Beam search, language bias와 새 audio evidence 때문에 아직 commit하지 않은 prefix는 바뀔 수 있다.</Misconception>
      </section>

      <section id="rnnt" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">RNN-T는 audio 시간과 이미 낸 label을 함께 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>RNN-T는 transcription encoder가 지금까지의 audio를 hidden state <MathFormula>h_t</MathFormula>로 만들고, prediction network가 이전 output label <MathFormula>{String.raw`y_{<u}`}</MathFormula>를 state <MathFormula>g_u</MathFormula>로 만든다. Audio 시간 <MathFormula>t</MathFormula>와 이미 낸 label 수 <MathFormula>u</MathFormula>를 두 축으로 놓은 격자를 lattice라 부른다. Joint network는 현재 위치 <MathFormula>(t,u)</MathFormula>에서 blank 또는 다음 label을 낼 확률을 준다.</p>
          <p>Blank를 고르면 audio time만 한 칸 오른쪽으로 이동한다. Label을 고르면 같은 audio time에서도 output 축을 아래로 한 칸 이동할 수 있다. 따라서 acoustic evidence와 이미 말한 label history를 함께 사용하면서 streaming decoding을 할 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{h_t}_{\text{현재까지의 audio state}}&=\underbrace{f_{enc}(x_{\le t})}_{\text{causal 또는 chunked encoder}}\\\underbrace{g_u}_{\text{이미 낸 label history}}&=\underbrace{f_{pred}(y_{<u})}_{\text{prediction network}}\\\underbrace{j_{t,u}}_{\text{두 state의 결합}}&=\underbrace{f_{joint}(h_t,g_u)}_{\text{acoustic·label context 결합}}\\\underbrace{p(k\mid t,u)}_{\text{다음 symbol 확률}}&=\operatorname{softmax}\!\left(j_{t,u}\right)_k\end{aligned}`}
          meaning="RNN-T의 prediction network는 이전 label을 요약하지만 독립 외부 language model과 동일하지 않다. Joint network가 acoustic state와 label state를 함께 보고 blank 또는 다음 token 확률을 만든다. 전체 transcript 확률은 CTC처럼 같은 y를 만드는 monotonic lattice path를 합해 계산한다."
          symbols={[[String.raw`x_{\le t}`, '현재 t까지 도착한 audio frame'], [String.raw`h_t`, 'transcription encoder 출력'], [String.raw`y_{<u}`, '이미 생성한 u개 미만 label'], [String.raw`g_u`, 'prediction network가 만든 label-history state'], [String.raw`j_{t,u}`, 'audio와 label-history state를 합친 joint logit'], [String.raw`k`, 'blank 또는 label vocabulary 항목'], [String.raw`f_{joint}`, '두 state를 logit으로 결합하는 network']]} />
        <AsrAlignmentExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>RNN-T가 자동으로 낮은 latency를 보장하지는 않는다. Encoder가 미래 chunk를 많이 보거나, beam이 넓거나, endpoint가 오래 기다리면 first stable token은 늦다. Alignment restriction, blank penalty와 endpoint tuning은 accuracy와 emission delay를 함께 바꾼다.</p>
        </div>
      </section>

      <section id="encoder-decoder" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Encoder-decoder는 alignment를 attention에 맡긴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Attention encoder-decoder(AED)는 decoder가 이전 text token과 encoder memory를 보고 다음 token을 생성한다. Whisper는 30초 audio를 log-Mel로 바꾸어 encoder-decoder Transformer에 넣고, 언어·전사·번역·timestamp task를 special token으로 통합한 대표 사례다.</p>
          <p>전체 audio context를 볼 수 있어 long-range disambiguation에 유리하지만, vanilla full-context attention은 발화 끝이나 chunk가 올 때까지 기다린다. Streaming AED는 causal encoder, chunk attention, monotonic attention 또는 blockwise decoding을 따로 설계해야 한다. 그러면 chunk boundary마다 transcript가 수정되는 정책도 함께 정해야 한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{c_u}_{\text{u번째 label의 문맥}}&=\left(\underbrace{y_{<u}}_{\text{이전 text}},\underbrace{H(x)}_{\text{audio memory}}\right)\\[0.35em]\underbrace{p(y\mid x)}_{\text{transcript 전체 확률}}&=\prod_{u=1}^{U}\underbrace{p_\theta(y_u\mid c_u)}_{\text{다음 label 확률}}\end{aligned}`}
          meaning="Decoder는 이전 label과 audio encoder memory에 조건화해 다음 label을 낸다. CTC처럼 frame별 독립 확률을 먼저 만들지 않고 attention이 label u에 필요한 audio 위치를 선택한다. Full-context H(x)를 쓰면 정확한 뒤 문맥을 활용할 수 있지만 online stream에서는 아직 오지 않은 audio를 기다릴 수 있다."
          symbols={[[String.raw`U`, '출력 label 길이'], [String.raw`y_u`, 'u번째 transcript token'], [String.raw`y_{<u}`, '이전에 생성한 transcript prefix'], [String.raw`H(x)`, 'audio encoder hidden sequence'], [String.raw`c_u`, '이전 text와 audio memory를 묶은 decoder context'], [String.raw`p_\theta`, 'attention decoder의 conditional distribution']]} />
      </section>

      <section id="partial-and-endpoint" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Final transcript 전에 무엇을 commit할 것인가?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Streaming caption과 voice agent는 final transcript를 기다리지 않는다. Partial “대출 상…”을 downstream에 보낸 뒤 새 audio로 “대출 상환”이 되면 괜찮지만, 이미 tool을 호출한 뒤 “대출 상담”으로 바뀌면 부작용이 생긴다. Display update와 irreversible action commit을 같은 threshold로 두면 안 된다.</p>
          <p>Stable prefix는 여러 decode update에서 바뀌지 않은 token만 commit한다. Endpoint는 silence, semantic completion, decoder end probability와 maximum utterance duration을 함께 본다. 짧은 pause를 문장 끝으로 오판하면 deletion이 늘고, 오래 기다리면 latency가 늘어난다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{R_{rev}}_{\text{partial transcript 수정률}}=\frac{\sum_{i=2}^{M}\underbrace{d_{edit}(\hat y^{(i-1)},\hat y^{(i)})}_{\text{연속 update 사이 바뀐 token 수}}}{\sum_{i=2}^{M}\underbrace{|\hat y^{(i)}|}_{\text{현재 partial 길이}}}`}
          meaning="Final WER가 보지 못하는 partial instability를 읽는 설명용 revision metric이다. 연속 partial hypothesis 사이 edit distance를 현재 길이로 정규화한다. 실제 제품에서는 committed prefix를 제외한 unstable suffix, first correct token time와 finalization delay도 별도로 기록한다."
          symbols={[[String.raw`\hat y^{(i)}`, 'i번째 streaming decode update의 partial transcript'], [String.raw`M`, '발화 동안 발생한 update 수'], [String.raw`d_{edit}`, '두 partial 사이 insertion·deletion·substitution 수'], [String.raw`|\hat y|`, 'partial label 수'], [String.raw`R_{rev}`, '작을수록 화면과 downstream 상태가 안정적인 수정률']]} />
        <div className="not-prose my-8 min-w-0 divide-y divide-border border-y border-border">
          {[
            ['Final WER·CER', '발화 종료 뒤 text edit error', 'accent, noise, code-switch, 숫자·고유명사를 따로 slice한다.'],
            ['Emission latency', '정답 token이 처음 안정적으로 나온 시간', 'audio timestamp 기준으로 p50·p95를 기록한다.'],
            ['Partial revision', '임시 transcript가 뒤집히는 정도', 'caption 표시와 tool commit threshold를 분리한다.'],
            ['Semantic slot', 'intent·entity가 맞는지', 'WER가 높아도 task가 성공하거나 반대인 경우를 잡는다.'],
            ['Endpoint error', '너무 빨리 자르거나 너무 늦게 닫는 비율', '짧은 pause, long-form과 overlap speech를 분리한다.'],
          ].map(([title, metric, check]) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[9rem_12rem_minmax(0,1fr)]"><strong className="text-sm">{title}</strong><span className="text-xs leading-relaxed text-muted-foreground">{metric}</span><span className="text-xs leading-relaxed text-muted-foreground">{check}</span></div>)}
        </div>
      </section>

      <section id="objective-decision" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Objective 선택은 제품의 commit contract에서 역산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Offline batch transcription에서 긴 뒤 문맥과 timestamp가 중요하면 encoder-decoder를 강한 기준선으로 둘 수 있다. 항상 켜진 voice command에서 빠른 monotonic emission과 이전 label context가 필요하면 RNN-T가 자연스럽다. CTC는 단순하고 parallel한 training·decoding baseline, encoder representation 학습과 auxiliary loss에 유용하다. 실제 system은 CTC와 attention loss를 함께 쓰거나 transducer에 별도 rescoring을 붙일 수도 있다.</p>
          <p>CTC·RNN-T가 정렬하는 frame이 어떤 시간·주파수 정보를 담는지 더 내려가려면 <InternalLink slug="audio-representation-neural-codecs">Audio Representation · Neural Codec</InternalLink>으로 간다. 여기서 frame, hop, spectrum과 learned latent가 인식에 주는 정보와 지연을 분리한다.</p>
        </div>
        <Misconception>WER 숫자를 비교하기 전에 text normalization, word segmentation, punctuation, 숫자 표기와 reference 정책을 고정한다. 한국어에서는 word boundary 정의에 따라 WER가 크게 달라져 CER·semantic slot을 함께 본다.</Misconception>
        <CapabilityCheck items={[
          'Audio frame 수와 label 수가 다른 이유를 alignment hidden variable로 설명한다.',
          'CTC path를 blank·repeat collapse하고 같은 transcript의 path probability를 합한다.',
          'RNN-T lattice에서 audio time 이동과 label emission 이동을 구분한다.',
          'Conformer backbone과 CTC·RNN-T·AED objective를 서로 다른 설계 축으로 분리한다.',
          'Final WER, emission latency, partial revision과 semantic slot이 잡는 실패를 구분한다.',
          'Caption update와 irreversible tool action의 stable-prefix commit policy를 따로 설계한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Graves et al. · Connectionist Temporal Classification', href: 'https://www.cs.toronto.edu/~graves/icml_2006.pdf', note: 'Unsegmented sequence의 blank·collapse와 path-sum objective 원 논문.' },
          { label: 'Graves · Sequence Transduction with Recurrent Neural Networks', href: 'https://arxiv.org/abs/1211.3711', note: 'Transcription, prediction, joint network와 output-conditioned monotonic transduction의 원 논문.' },
          { label: 'OpenAI · Whisper paper', href: 'https://cdn.openai.com/papers/whisper.pdf', note: 'Log-Mel encoder-decoder, multilingual multitask token과 distribution-shift robustness evidence.' },
          { label: 'Google Research · Conformer', href: 'https://research.google/pubs/conformer-convolution-augmented-transformer-for-speech-recognition/', note: 'Local convolution과 global attention을 결합한 acoustic encoder backbone의 공식 연구 근거.' },
          { label: 'OpenAI · GPT-Realtime-Whisper', href: 'https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/', note: '2026 streaming transcription이 live speech를 처리하는 현재 제품 상단. 내부 objective는 공개 claim 이상으로 추정하지 않는다.' },
        ]} />
      </section>
    </>
  );
}
