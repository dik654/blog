import { useMemo, useState } from 'react';
import { Braces, FileCode2, Languages } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, SegmentedControl, Takeaway } from '../nlp-shared';

type TokenMode = 'word' | 'grapheme' | 'byte' | 'subword';
type NormalizationMode = 'none' | 'NFC' | 'NFKC';

const modeOptions: Array<{ value: TokenMode; label: string }> = [
  { value: 'word', label: '단어' },
  { value: 'grapheme', label: '문자' },
  { value: 'byte', label: 'byte' },
  { value: 'subword', label: 'subword' },
];

function splitSubwords(text: string) {
  const graphemes = [...new Intl.Segmenter('ko', { granularity: 'grapheme' }).segment(text)].map((part) => part.segment);
  const tokens: string[] = [];
  let wordRun: string[] = [];
  const flushWordRun = () => {
    if (wordRun.length > 0) tokens.push(wordRun.slice(0, 2).join(''));
    if (wordRun.length > 2) tokens.push(wordRun.slice(2).join(''));
    wordRun = [];
  };

  for (const grapheme of graphemes) {
    if (/[\p{L}\p{N}]/u.test(grapheme)) {
      wordRun.push(grapheme);
      continue;
    }
    flushWordRun();
    if (!/^\s+$/u.test(grapheme)) tokens.push(grapheme);
  }
  flushWordRun();
  return tokens;
}

function TextBoundaryExplorer() {
  const [text, setText] = useState('Å ＡI와 C++17');
  const [mode, setMode] = useState<TokenMode>('subword');
  const [normalization, setNormalization] = useState<NormalizationMode>('NFKC');
  const normalized = normalization === 'none' ? text : text.normalize(normalization);
  const tokens = useMemo(() => {
    if (mode === 'word') return normalized.trim().split(/\s+/).filter(Boolean);
    if (mode === 'grapheme') return [...new Intl.Segmenter('ko', { granularity: 'grapheme' }).segment(normalized)].map((part) => part.segment);
    if (mode === 'byte') return [...new TextEncoder().encode(normalized)].map((byte) => `0x${byte.toString(16).padStart(2, '0')}`);
    return splitSubwords(normalized);
  }, [mode, normalized]);
  const bytes = new TextEncoder().encode(normalized).length;
  const codePoints = [...normalized].length;
  const graphemes = [...new Intl.Segmenter('ko', { granularity: 'grapheme' }).segment(normalized)].length;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="tokenizer-input" className="text-xs font-semibold text-muted-foreground">직접 분해할 문자열
          <input id="tokenizer-input" value={text} onChange={(event) => setText(event.target.value.slice(0, 48))} className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SegmentedControl label="토큰 경계" options={modeOptions} value={mode} onChange={setMode} />
          <SegmentedControl label="Unicode 정규화" options={[{ value: 'none', label: '원문' }, { value: 'NFC', label: 'NFC' }, { value: 'NFKC', label: 'NFKC' }]} value={normalization} onChange={setNormalization} />
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2" aria-label={`${tokens.length}개 토큰`}>
          {tokens.map((token, index) => <span key={`${token}-${index}`} className="max-w-full break-all rounded border border-border bg-muted/20 px-2 py-1 font-mono text-xs">{token === ' ' ? 'SPACE' : token}</span>)}
        </div>
        <MetricGrid items={[
          { label: '표시 token 수', value: String(tokens.length), note: '모드가 바뀌면 sequence 길이가 달라진다.' },
          { label: 'code point / grapheme', value: `${codePoints} / ${graphemes}`, note: '저장 문자와 사용자가 보는 글자 수를 구분한다.' },
          { label: 'UTF-8 byte 수', value: String(bytes), note: 'byte fallback의 최하위 단위다.' },
          { label: '복원 기준 문자열', value: normalized === text ? '원문' : normalization, note: normalized === text ? '정규화로 바뀐 code point 없음' : `${text} → ${normalized}` },
        ]} />
        <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
          이 explorer의 subword 모드는 경계 차이를 보여 주는 교육용 규칙이다. 실제 token은 학습 corpus, pre-tokenizer, merge rank와 vocabulary 파일을 실행해야 결정된다. Byte는 입력 전체를 복원할 수 있지만 임의의 생성 token prefix는 완전한 UTF-8 문자가 아닐 수 있다.
        </p>
      </div>
    </div>
  );
}

type VocabSize = '32k' | '64k' | '128k';

function VocabularyBudgetExplorer() {
  const [size, setSize] = useState<VocabSize>('32k');
  const [projection, setProjection] = useState<'tied' | 'untied'>('tied');
  const vocabulary = { '32k': 32_768, '64k': 65_536, '128k': 131_072 }[size];
  const hidden = 4_096;
  const matrixCount = projection === 'tied' ? 1 : 2;
  const parameters = vocabulary * hidden * matrixCount;
  const gib = (parameters * 2) / (1024 ** 3);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <SegmentedControl label="Vocabulary 크기" options={[{ value: '32k', label: '32k' }, { value: '64k', label: '64k' }, { value: '128k', label: '128k' }]} value={size} onChange={setSize} />
        <SegmentedControl label="Input-output weight 공유" options={[{ value: 'tied', label: 'tied' }, { value: 'untied', label: 'untied' }]} value={projection} onChange={setProjection} />
      </div>
      <div className="p-4 sm:p-6">
        <MetricGrid items={[
          { label: 'vocabulary |V|', value: vocabulary.toLocaleString('en-US'), note: '서로 다른 token ID 수' },
          { label: 'hidden d', value: hidden.toLocaleString('en-US'), note: 'token vector 차원' },
          { label: 'matrix 수', value: String(matrixCount), note: projection === 'tied' ? '입력 embedding을 출력 projection과 공유' : '입력과 출력 weight를 각각 보유' },
          { label: 'bf16 weight', value: `${gib.toFixed(2)} GiB`, note: `${(parameters / 1e6).toFixed(1)}M parameters`, accent: size === '32k' && projection === 'tied' },
        ]} />
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Vocabulary를 네 배로 키우면 같은 hidden size에서 이 weight도 네 배가 된다. 대신 더 긴 문자열 조각을 한 ID로 담아 sequence를 줄일 가능성이 생긴다.</p>
      </div>
    </div>
  );
}

const mergeStates = [
  ['l', 'o', 'w', 'e', 's', 't'],
  ['lo', 'w', 'e', 's', 't'],
  ['low', 'e', 's', 't'],
  ['low', 'es', 't'],
  ['low', 'est'],
  ['lowest'],
];
const mergeRules = ['l + o → lo', 'lo + w → low', 'e + s → es', 'es + t → est', 'low + est → lowest'];

function BpeMergeExplorer() {
  const [step, setStep] = useState(2);
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <p className="mb-3 text-xs font-bold text-foreground">Corpus에서 학습을 마친 merge rank를 새 문자열에 적용</p>
        <label htmlFor="bpe-step" className="block text-xs font-semibold text-muted-foreground">학습된 merge 적용 수 · {step}/{mergeRules.length}
          <input id="bpe-step" type="range" min="0" max={mergeRules.length} step="1" value={step} onChange={(event) => setStep(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-bold text-muted-foreground">lowest의 현재 분절</p>
          <div className="flex min-h-14 flex-wrap items-center gap-2">
            {mergeStates[step].map((token, index) => <span key={`${token}-${index}`} className="rounded-md border border-blue-500/35 bg-blue-500/5 px-3 py-2 font-mono text-sm font-bold">{token}</span>)}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Corpus에서 가장 자주 붙어 나타나는 인접 pair를 vocabulary에 추가한다. 전체 단어를 외우지 않아도 자주 쓰는 조각은 짧아진다.</p>
        </div>
        <ol className="space-y-1 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          {mergeRules.map((rule, index) => <li key={rule} className={`rounded px-2 py-1.5 font-mono text-xs ${index < step ? 'bg-muted font-bold text-foreground' : 'text-muted-foreground'}`}>{index + 1}. {rule}</li>)}
        </ol>
      </div>
    </div>
  );
}

type Algorithm = 'bpe' | 'wordpiece' | 'unigram' | 'sentencepiece';
const algorithms: Record<Algorithm, { objective: string; decision: string; strength: string; risk: string }> = {
  bpe: { objective: '가장 빈번한 인접 pair를 반복 병합', decision: '학습된 merge 순서를 deterministic하게 적용', strength: '구현이 단순하고 byte fallback과 결합하기 쉽다.', risk: '빈도 기준이 downstream likelihood와 직접 같지는 않다.' },
  wordpiece: { objective: '공개 문헌의 재구성에서는 pair 빈도를 부분 빈도로 보정', decision: '현재 위치에서 vocabulary의 가장 긴 조각을 선택', strength: 'Raw pair 빈도보다 두 조각의 결합 특이성을 반영한다.', risk: '원 Google trainer는 비공개이며 한 구간도 표현하지 못하면 전체 단어가 unknown이 될 수 있다.' },
  unigram: { objective: '큰 후보 vocabulary에서 손실이 작은 조각을 제거', decision: '가능한 분절들의 확률을 비교해 최적 경로 선택', strength: '여러 분절 후보를 확률적으로 다룰 수 있다.', risk: '확률 모델 학습과 pruning이 더 복잡하다.' },
  sentencepiece: { objective: '공백까지 일반 symbol로 취급하는 raw-text 학습', decision: 'BPE 또는 Unigram 모델을 문자열에 직접 적용', strength: '언어별 사전 분절기에 덜 의존하고 공백 복원이 쉽다.', risk: '알고리즘 이름이 아니라 구현 프레임워크라는 점을 혼동하기 쉽다.' },
};

function AlgorithmWorkbench() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('bpe');
  const selected = algorithms[algorithm];
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <SegmentedControl label="Subword 알고리즘" options={[{ value: 'bpe', label: 'BPE' }, { value: 'wordpiece', label: 'WordPiece' }, { value: 'unigram', label: 'Unigram' }, { value: 'sentencepiece', label: 'SentencePiece' }]} value={algorithm} onChange={setAlgorithm} />
      <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {[['학습 목표', selected.objective], ['추론 시 결정', selected.decision], ['강점', selected.strength], ['주의점', selected.risk]].map(([term, detail]) => <div key={term} className="bg-background p-4"><dt className="text-xs font-bold text-muted-foreground">{term}</dt><dd className="mt-1 text-sm leading-relaxed">{detail}</dd></div>)}
      </dl>
    </div>
  );
}

function EvaluationWorkbench() {
  const [strategy, setStrategy] = useState<'word' | 'subword' | 'byte'>('subword');
  const evaluationCorpus = '초거대LLM은 C++17과 🚀를 읽는다';
  const words = evaluationCorpus.trim().split(/\s+/).length;
  const bytes = new TextEncoder().encode(evaluationCorpus).length;
  const metrics = {
    word: { tokens: 9, unknown: 2, roundtrip: '실패 가능', sequence: '짧음' },
    subword: { tokens: 14, unknown: 0, roundtrip: '성공', sequence: '균형' },
    byte: { tokens: bytes, unknown: 0, roundtrip: '성공', sequence: '김' },
  }[strategy];
  const fertility = metrics.tokens / words;
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-bold">평가 corpus · 공백 기준 {words}개 단어</p><p className="mt-1 font-mono text-xs text-muted-foreground">{evaluationCorpus}</p></div>
        <SegmentedControl label="평가할 전략" options={[{ value: 'word', label: '단어 vocab' }, { value: 'subword', label: 'subword' }, { value: 'byte', label: 'byte' }]} value={strategy} onChange={setStrategy} />
      </div>
      <MetricGrid items={[
        { label: 'fertility', value: fertility.toFixed(2), note: '단어당 token 수. 낮을수록 같은 문맥을 덜 소비한다.' },
        { label: 'unknown', value: String(metrics.unknown), note: '표현할 수 없어 정보가 사라진 구간 수다.', accent: metrics.unknown === 0 },
        { label: 'round-trip', value: metrics.roundtrip, note: 'decode(encode(text))가 원문을 복원하는지 본다.' },
        { label: 'sequence', value: metrics.sequence, note: 'Vocabulary와 sequence length의 trade-off다.' },
      ]} />
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[{ icon: Languages, label: '언어', text: '한국어 조사·합성어·혼합 문자를 별도 slice로 본다.' }, { icon: FileCode2, label: '코드', text: '공백과 기호 보존, indentation, identifier 분절을 본다.' }, { icon: Braces, label: '제어 token', text: 'BOS·EOS·PAD·role token이 일반 문자열과 충돌하지 않게 한다.' }].map(({ icon: Icon, label, text }) => <div key={label} className="border-t border-border pt-3"><Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" /><p className="mt-2 text-sm font-bold">{label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p></div>)}
      </div>
    </div>
  );
}

export default function RebuiltTokenizer() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="모델은 문자열을 직접 읽지 않는다" title="Token 경계를 정하는 순간 모델의 계산 단위가 결정된다">
        <BeginnerBridge title="문장을 계산하려면 먼저 조각마다 번호표를 붙여야 한다">
          Tokenizer는 문자열을 여러 조각으로 나누고 각 조각을 정수 ID로 바꾼다. 너무 잘게 나누면 문장이 길어져 계산량이 늘고, 너무 크게 나누면 드문 단어나 새 표기를 표현할 조각이 부족해진다.
        </BeginnerBridge>
        <QuestionLead question="좋은 tokenizer는 단어를 가장 자연스럽게 나누는 도구일까?" answer="아니다. 모든 입력을 손실 없이 ID로 바꾸면서도, 자주 쓰는 패턴은 적은 token으로 표현하고, 제한된 vocabulary 안에서 학습 신호가 충분히 공유되게 만드는 압축 설계다." />
        <ConceptPrimer items={[
          { term: 'token', meaning: '모델이 하나의 ID로 받는 문자열 또는 byte 조각이다.', why: 'Embedding lookup과 sequence length의 단위가 된다.' },
          { term: 'vocabulary', meaning: 'Token 문자열과 정수 ID의 고정 mapping이다.', why: '크기가 커지면 embedding·output matrix가 커지고, 작아지면 sequence가 길어진다.' },
          { term: 'normalization', meaning: '겉보기는 같지만 code point가 다른 문자열을 일정한 표현으로 맞춘다.', why: '같은 의미가 별도 token 통계로 갈라지는 것을 줄인다.' },
          { term: 'round-trip', meaning: 'Decode(encode(text))가 원문 또는 명시된 정규화 결과를 복원하는 성질이다.', why: '코드·숫자·이름에서 조용한 정보 손실을 막는다.' },
        ]} />
        <FlowRow items={[{ label: 'Text', value: '문자열', note: '아직 tensor가 아니다.' }, { label: 'Tokenizer', value: '경계 + vocab', note: '문자열을 조각과 ID로 바꾼다.' }, { label: 'Model input', value: '[17, 208, 91]', note: 'Embedding lookup의 index가 된다.' }]} activeIndex={1} />
        <VocabularyBudgetExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{P_{\mathrm{vocab}}}_{\text{token weight 수}}=\underbrace{|V|d}_{\text{입력 embedding}}+\underbrace{\mathbf 1_{\mathrm{untied}}|V|d}_{\text{공유하지 않은 출력 projection}}`}</MathFormula></div>
        <FormulaNote meaning="각 token ID마다 d차원 행 하나가 필요하므로 vocabulary 크기와 hidden size를 곱한다. Output projection이 input embedding과 weight tying을 하지 않으면 같은 크기의 행렬을 한 번 더 더한다. 이 식은 optimizer state와 activation을 제외한 token weight만 센다." symbols={[[String.raw`|V|`, 'Vocabulary에 등록된 token ID 수'], [String.raw`d`, 'Embedding과 model hidden dimension'], [String.raw`\mathbf 1_{\mathrm{untied}}`, 'Weight를 공유하지 않을 때만 1인 indicator']]} />
      </NlpSection>

      <NlpSection id="unicode" marker="02" tone="blue" question="보이는 한 글자와 저장된 byte는 같지 않다" title="Unicode·정규화·byte fallback의 경계를 먼저 고정한다">
        <p>Tokenizer가 분절을 시작하기 전에 입력 문자열의 표현부터 결정해야 한다. NFC는 Unicode가 표준적으로 같은 글자라고 정한 조합만 합친다(canonical equivalence). 예를 들어 따로 저장된 A와 결합 고리를 Å로, 분해된 한글 자모를 완성형 음절로 모으지만 전각 문자 차이는 유지한다. NFKC는 호환상 같은 표기까지 합쳐(compatibility equivalence) 전각 Ａ를 ASCII A처럼 바꾼다. 이모지는 여러 code point가 결합해 하나의 grapheme으로 보이기도 한다.</p>
        <TextBoundaryExplorer />
        <Misconception>NFKC가 항상 정답은 아니다. 전각 문자나 호환 문자를 합쳐 vocabulary 낭비를 줄이지만, 수학 기호·식별자처럼 표면 차이가 의미인 영역에서는 정보가 바뀔 수 있다. 정규화 정책도 모델 계약의 일부다.</Misconception>
        <Takeaway>Byte fallback은 “byte만 쓰자”가 아니다. 자주 쓰는 문자열은 subword로 짧게 표현하고 vocabulary에 없는 꼬리만 byte로 내려가 손실을 막는다. 입력 전체의 byte sequence는 round-trip할 수 있지만, 생성 중 임의 token prefix는 아직 완전한 UTF-8 문자가 아닐 수 있어 decoder가 뒤 byte를 기다려야 한다.</Takeaway>
      </NlpSection>

      <NlpSection id="bpe" marker="03" tone="violet" question="모든 단어를 외우지 않고 자주 쓰는 조각을 짧게 만든다" title="BPE는 corpus 빈도가 높은 인접 pair를 vocabulary로 승격한다">
        <p>초기 vocabulary를 문자 또는 byte로 두면 모든 입력을 표현할 수 있지만 sequence가 길다. BPE 학습은 corpus 전체에서 자주 붙는 인접 pair를 하나의 새 token으로 합치고 그 순서를 merge rank로 저장한다. 실제 encode는 빈도를 다시 세지 않고, 저장된 rank를 새 문자열에 적용한다.</p>
        <BpeMergeExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`(a,b)^*=\arg\max_{(a,b)}\;\mathrm{count}(a,b)`}</MathFormula></div>
        <FormulaNote meaning="현재 corpus에서 인접 token pair의 등장 횟수를 세고 가장 큰 pair 하나를 다음 merge로 고른다. Argmax를 쓰는 이유는 한 단계에서 sequence 길이를 가장 많이 줄이는 재사용 가능한 조각을 선택하기 위해서다." symbols={[[String.raw`(a,b)`, '인접한 두 token'], ['count', 'corpus 전체의 pair 빈도'], ['arg max', '빈도가 가장 큰 pair를 고르는 연산']]} />
      </NlpSection>

      <NlpSection id="algorithms" marker="04" tone="amber" question="Subword라는 목표는 같아도 학습과 분절 기준은 다르다" title="BPE·WordPiece·Unigram·SentencePiece를 알고리즘 수준에서 구분한다">
        <p>BPE는 빈번한 pair를 아래에서 위로 합친다. WordPiece 추론은 현재 위치에서 가능한 가장 긴 vocabulary 조각을 고른다. Google은 원 WordPiece trainer를 공개하지 않았으므로 아래 pair score는 공개 문헌을 바탕으로 널리 쓰는 재구성이지 BERT trainer의 완전한 원본 명세가 아니다. Unigram은 큰 후보 집합에서 시작해 corpus likelihood 손실이 작은 조각을 제거한다. SentencePiece는 BPE와 경쟁하는 네 번째 목적함수라기보다 raw text에서 BPE·Unigram을 학습·실행하는 도구다.</p>
        <AlgorithmWorkbench />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\operatorname{score}(a,b)}_{\text{WordPiece merge 후보 점수}}=\frac{\underbrace{f(a,b)}_{\text{함께 나온 횟수}}}{\underbrace{f(a)f(b)}_{\text{각 조각의 기본 빈도}}}`}</MathFormula></div>
        <FormulaNote meaning="단순 pair 횟수를 두 조각의 개별 빈도로 나누면 흔한 조각끼리 우연히 많이 붙는 효과가 줄어든다. 따라서 BPE와 달리 raw count가 가장 큰 pair가 항상 먼저 합쳐지지 않는다. 이 식은 공개된 WordPiece 설명에 근거한 재구성이라는 범위를 유지한다." symbols={[[String.raw`f(a,b)`, '인접 pair의 corpus 빈도'], [String.raw`f(a)f(b)`, '두 부분이 각각 흔한 정도의 곱'], [String.raw`\operatorname{score}`, 'Merge 우선순위를 비교하는 값']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{z^*}_{\text{선택한 Unigram 분절}}=\arg\max_{z\in\mathcal S(x)}\underbrace{\sum_i\log p(z_i)}_{\text{분절 경로의 log likelihood}}`}</MathFormula></div>
        <FormulaNote meaning="한 문자열 x를 만드는 가능한 token sequence를 모두 후보 경로로 두고 각 token 확률의 log를 더한다. 곱 대신 log 합을 쓰면 긴 경로의 매우 작은 확률을 안정적으로 비교할 수 있고, argmax가 가장 가능성 높은 분절 하나를 고른다." symbols={[[String.raw`\mathcal S(x)`, '문자열 x를 복원하는 가능한 token 분절 집합'], [String.raw`p(z_i)`, 'Unigram model이 token 조각에 준 확률'], [String.raw`z^*`, '동적 계획법으로 찾은 최적 분절']]} />
        <Misconception>같은 vocabulary를 써도 pre-tokenization, 정규화, special token 규칙이 다르면 token ID sequence가 달라진다. 모델 weight와 tokenizer 파일은 분리해서 바꿀 수 있는 부속품이 아니라 함께 버전 관리할 계약이다.</Misconception>
      </NlpSection>

      <NlpSection id="evaluation" marker="05" tone="green" question="평균 길이 하나로는 tokenizer 품질을 판단할 수 없다" title="Fertility·unknown·round-trip을 언어와 workload별로 측정한다">
        <p>큰 vocabulary는 sequence를 줄이지만 embedding과 output projection을 키운다. 반대로 byte에 가까워질수록 모든 입력을 보존하지만 같은 문장을 더 많은 step으로 처리한다. 전체 평균은 다수 언어의 성능으로 소수 언어의 과도한 분절을 가릴 수 있으므로 언어·코드·도메인별 slice가 필요하다.</p>
        <EvaluationWorkbench />
        <p className="text-xs leading-relaxed text-muted-foreground">위 수치는 동일한 교육용 문자열에서 세 전략의 trade-off를 드러내기 위한 고정 예시다. 실제 배포 판단에는 후보 tokenizer를 같은 held-out corpus에 실행해 이 값을 다시 측정한다.</p>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\mathrm{fertility}=\frac{\text{token 수}}{\text{공백 단어 수}}`}</MathFormula></div>
        <FormulaNote meaning="같은 문장을 표현하는 데 단어 하나당 몇 token을 소비하는지 나타낸다. 나누기를 쓰는 이유는 문장 길이가 다른 언어·corpus를 같은 척도로 비교하기 위해서다. 낮을수록 효율적이지만, 정보 손실이나 지나치게 큰 vocabulary까지 자동으로 좋은 것은 아니다." symbols={[[String.raw`\text{token 수}`, 'Tokenizer가 출력한 ID 개수'], [String.raw`\text{공백 단어 수}`, '비교를 위한 거친 길이 기준']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\frac{C'_{\mathrm{attn}}}{C_{\mathrm{attn}}}}_{\text{full-attention score cell 비율}}\approx\underbrace{\left(\frac{42}{14}\right)^2}_{\text{byte와 subword 길이 비의 제곱}}=\underbrace{9}_{\text{아홉 배}}`}</MathFormula></div>
        <FormulaNote meaning="Full self-attention prefill은 모든 query-key 위치쌍을 비교하므로 score cell 수가 sequence 길이의 제곱에 비례한다. 이 문자열이 14 subword token에서 42 byte token으로 늘면 이 부분은 9배가 된다. 다만 MLP, projection, cached decoding까지 포함한 전체 LLM 시간도 정확히 아홉 배라는 뜻은 아니다." symbols={[[String.raw`C_{\mathrm{attn}}`, '기준 sequence의 attention score 계산량'], [String.raw`42/14`, '같은 문자열의 byte/subword token 길이 비'], [String.raw`n^2`, '모든 token pair를 비교하는 full attention의 성장률']]} />
        <div data-tokenizer-expansion-contract className="not-prose my-8 border-y border-border py-6">
          <p className="text-xs font-black uppercase text-muted-foreground">이미 학습된 모델에 새 언어를 넣는 경우</p>
          <h3 className="mt-2 text-lg font-bold">Tokenizer를 바꾸는 순간 embedding의 행 의미도 바뀐다</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">기존 모델은 token ID와 embedding row의 대응을 이미 학습했다. 새 tokenizer를 독립적으로 다시 학습해 같은 ID에 다른 문자열을 배치하면 tensor shape가 같아도 의미가 깨진다. 먼저 새 언어 held-out corpus의 fertility·round-trip·실제 decode latency를 재고, 손해가 허용되면 기존 tokenizer와 ID를 그대로 유지하는 것이 가장 작은 변경이다.</p>
          <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            {[
              { label: '01 · 유지', condition: '새 언어도 byte fallback으로 손실 없이 읽고 fertility·latency가 예산 안이다.', action: 'Tokenizer hash를 고정하고 data mixture만 바꾼다.' },
              { label: '02 · ID 보존 확장', condition: '새 언어의 과도한 분절이 compute·latency를 지배한다.', action: '기존 ID와 merge를 보존한 채 token을 뒤에 추가하고 새 row만 적응시킨다.' },
              { label: '03 · 완전 교체', condition: 'Vocabulary 전체를 재설계할 이득이 재학습 비용보다 크다.', action: 'Embedding·LM head remap과 재학습을 포함한 새 model version으로 취급한다.' },
            ].map((item) => (
              <div key={item.label} className="min-w-0 bg-background p-4">
                <strong className="text-sm">{item.label}</strong>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.condition}</p>
                <p className="mt-3 border-t border-border pt-3 text-xs leading-6">{item.action}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\Delta P_{\mathrm{vocab}}}_{\text{확장으로 늘어난 token weight}}=\underbrace{\Delta |V|\,d}_{\text{새 embedding row}}+\underbrace{\mathbf 1_{\mathrm{untied}}\Delta |V|\,d}_{\text{공유하지 않은 새 출력 row}}`}</MathFormula></div>
          <FormulaNote meaning="기존 token ID를 그대로 두고 Δ|V|개의 새 token을 뒤에 추가하면 입력 embedding에는 token마다 d개 parameter가 늘어난다. Input과 output weight를 공유하지 않는 모델은 LM head에도 같은 수가 한 번 더 늘어난다. 새 row는 기존 sub-token decomposition의 row를 평균하는 식으로 초기화할 수 있지만, 그것만으로 학습이 끝난 것은 아니므로 embedding 적응과 continued pre-training을 별도 gate로 검증한다." symbols={[[String.raw`\Delta |V|`, '기존 ID 뒤에 새로 추가한 token 수'], [String.raw`d`, 'model hidden dimension'], [String.raw`\mathbf 1_{\mathrm{untied}}`, 'input embedding과 LM head를 공유하지 않을 때 1'], [String.raw`\Delta P_{\mathrm{vocab}}`, 'tokenizer 확장으로 추가되는 parameter 수']]} />
          <p className="mt-4 text-xs leading-6 text-muted-foreground">BPE-dropout은 학습 중 기존 merge 일부를 확률적으로 건너뛰는 subword regularization이지 새 vocabulary row를 만드는 방법이 아니다. Adapter도 새 token ID의 row 의미나 긴 sequence 자체를 자동으로 고치지 않는다. 확장 모델은 tokenizer·embedding·LM head·prompt cache가 함께 바뀐 새 version이며, 기존 version의 token ID나 KV cache를 섞지 않는다.</p>
        </div>
        <Takeaway>32k처럼 vocabulary 예산이 고정되면 정규화로 중복 표기를 통제하고, subword로 자주 쓰는 패턴을 압축하며, byte fallback으로 열린 입력 공간을 보존한다. 최종 선택은 문맥 길이·embedding 비용·실제 사용자 입력의 slice 평가로 결정한다.</Takeaway>
        <p>이제 token ID가 정해졌다. 다음 단계는 ID 자체가 아니라 주변에 어떤 ID가 나타났는지를 세어 의미 좌표를 만드는 <InternalLink slug="distributional-semantics">분포 의미론</InternalLink>이다.</p>
        <CapabilityCheck items={['문자·grapheme·byte·subword 경계를 구분할 수 있다.', 'NFC와 NFKC가 합치는 동등성의 범위를 구분할 수 있다.', 'Vocabulary 크기와 tying 여부에서 token weight 메모리를 계산할 수 있다.', 'BPE merge가 vocabulary와 sequence 길이에 주는 영향을 설명할 수 있다.', '입력 byte round-trip과 생성 prefix의 UTF-8 유효성을 구분할 수 있다.', 'BPE·WordPiece·Unigram·SentencePiece의 공개 범위와 학습 방향을 구분할 수 있다.', '새 언어에서 기존 tokenizer 유지·ID 보존 확장·완전 교체의 비용과 호환성 경계를 결정할 수 있다.', '언어별 tokenizer 회귀 테스트를 설계할 수 있다.']} />
        <SourceNotes sources={[
          { label: 'Unicode Normalization Forms', href: 'https://unicode.org/reports/tr15/', note: 'NFC·NFKC가 문자열을 어떤 규칙으로 정규화하는지 정의한다.' },
          { label: 'Unicode Text Segmentation', href: 'https://unicode.org/reports/tr29/', note: '사용자가 한 글자로 인식하는 extended grapheme cluster의 경계를 정의한다.' },
          { label: 'Neural Machine Translation of Rare Words with Subword Units', href: 'https://arxiv.org/abs/1508.07909', note: 'NMT에 BPE subword를 적용한 핵심 논문이다.' },
          { label: 'SentencePiece', href: 'https://arxiv.org/abs/1808.06226', note: '언어별 사전 분절 없이 raw sentence에서 subword를 학습한다.' },
          { label: 'Fast WordPiece Tokenization', href: 'https://aclanthology.org/2021.emnlp-main.160/', note: 'WordPiece의 longest-match-first runtime과 linear-time 구현을 확인한다.' },
          { label: 'OpenAI tiktoken', href: 'https://github.com/openai/tiktoken', note: 'Reversible byte BPE와 byte 단위 decode·UTF-8 경계를 실제 구현에서 확인한다.' },
          { label: 'In-Place Tokenizer Expansion for Pre-trained LLMs', href: 'https://arxiv.org/abs/2607.15232', note: '기존 BPE merge와 token row를 보존하면서 새 token을 추가하고 embedding-only 적응 뒤 continued pre-training을 수행한 최신 원문.' },
          { label: 'BPE-Dropout', href: 'https://aclanthology.org/2020.acl-main.170/', note: 'BPE merge를 확률적으로 건너뛰는 subword regularization이며 vocabulary 확장과는 다른 기법임을 확인한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
