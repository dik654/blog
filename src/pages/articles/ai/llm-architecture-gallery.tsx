import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, BeginnerOpening, CapabilityCheck, ConceptPrimer, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { articlePath } from '@/lib/paths';
import ArchitectureFingerprintLab from './llm-architecture-gallery/viz/ArchitectureFingerprintLab';
import ArchitectureLineageDiagram, {
  type ArchitectureDiagramKind,
} from './llm-architecture-gallery/viz/ArchitectureLineageDiagram';
import CurrentArchitectureCompass from './llm-architecture-gallery/viz/CurrentArchitectureCompass';

type ArchitectureMilestone = {
  order: string;
  model: string;
  image: string;
  diagram: ArchitectureDiagramKind;
  question: string;
  inherited: string;
  change: string;
  flow: string;
  gain: string;
  cost: string;
};

const architectureImageBase = 'https://sebastianraschka.com';

const architectureMilestones: ArchitectureMilestone[] = [
  {
    order: '01',
    model: 'GPT-2 XL · dense 기준점',
    image: '/llm-architecture-gallery/images/architectures/gpt-2-xl.webp',
    diagram: 'gpt2',
    question: '언어 모델을 하나의 반복 가능한 decoder block으로 만들 수 있는가?',
    inherited: 'Transformer decoder의 causal self-attention과 residual connection을 그대로 가져온다.',
    change: '모든 token이 모든 layer의 attention과 MLP를 통과하는 단순한 dense 계약을 기준점으로 만든다.',
    flow: 'token + 위치 임베딩 → LN₁ → causal MHA → residual add → LN₂ → GELU MLP → residual add → final LN → 다음 token logit',
    gain: 'router나 상태 메모리가 없어 구조와 오류를 추적하기 쉽다.',
    cost: '문맥이 길어질수록 attention 쌍과 MHA의 KV cache가 함께 커진다.',
  },
  {
    order: '02',
    model: 'Llama 3 · 현대 dense 기준점',
    image: '/llm-architecture-gallery/images/architectures/llama-3-8b.webp',
    diagram: 'llama3',
    question: 'dense 구조를 유지하면서 학습 안정성과 서빙 메모리를 개선할 수 있는가?',
    inherited: 'GPT 계열의 decoder-only, causal attention, residual stream은 유지한다.',
    change: 'RMSNorm, RoPE, SwiGLU, GQA를 결합해 현재 open-weight dense 모델의 공통 문법을 만든다.',
    flow: 'hidden → RMSNorm₁ → RoPE Q/K·GQA → residual add → RMSNorm₂ → SwiGLU MLP → residual add',
    gain: 'GQA가 query 표현력은 유지하면서 token마다 저장할 K/V head 수를 줄인다.',
    cost: 'K/V를 더 많이 공유할수록 세밀한 retrieval 품질과 메모리 절감 사이의 절충이 생긴다.',
  },
  {
    order: '03',
    model: 'Gemma 3 · local/global 문맥',
    image: '/llm-architecture-gallery/images/architectures/gemma-3-27b.webp',
    diagram: 'gemma3',
    question: '128K 문맥에서 모든 layer가 전체 token을 보지 않아도 되는가?',
    inherited: 'Llama와 같은 RMSNorm, RoPE, GQA 기반 dense decoder를 사용한다.',
    change: '대부분은 sliding-window attention, 일부는 global attention으로 배치하고 QK-Norm을 더한다.',
    flow: '가까운 문맥을 반복 처리하는 local layer × 5 → 먼 token을 섞는 global layer × 1 → 반복',
    gain: '대부분의 계산을 local window 안으로 제한하면서 주기적으로 전역 정보를 전달한다.',
    cost: 'global layer 간격과 window 밖 정보가 실제 과제에 충분한지 별도로 검증해야 한다.',
  },
  {
    order: '04',
    model: 'DeepSeek V3 · MLA + Sparse MoE',
    image: '/llm-architecture-gallery/images/architectures/deepseek-v3-r1-671-billion.webp',
    diagram: 'deepseek-v3',
    question: '모델 전체 용량은 키우되 token당 계산과 KV 저장은 억제할 수 있는가?',
    inherited: 'causal decoder와 attention/MLP 반복이라는 골격은 그대로다.',
    change: 'MLA가 K/V를 latent로 압축하고 router가 각 token에 필요한 일부 expert만 고른다.',
    flow: 'hidden → MLA로 문맥 혼합 → router score → Top-k routed experts + shared expert → 가중합',
    gain: '671B 전체 용량 중 약 37B 경로만 활성화해 큰 지식 용량과 제한된 계산량을 분리한다.',
    cost: 'expert load imbalance와 GPU 사이 all-to-all 통신이 FLOPs보다 큰 병목이 될 수 있다.',
  },
  {
    order: '05',
    model: 'Kimi Linear · state + attention hybrid',
    image: '/llm-architecture-gallery/images/architectures/kimi-linear-48b-a3b.webp',
    diagram: 'kimi-linear',
    question: '백만 token 문맥에서 KV를 계속 쌓지 않고 필요한 전역 검색도 남길 수 있는가?',
    inherited: 'attention이 제공하는 정확한 token-to-token 검색 능력은 일부 layer에 남긴다.',
    change: '대부분은 Kimi Delta Attention의 누적 state로 처리하고, 주기적으로 MLA가 전역 문맥을 다시 섞는다.',
    flow: '현재 token → 압축 state 갱신 × 여러 layer → MLA 전역 혼합 → 다시 state 갱신',
    gain: '긴 문맥의 cache와 계산 증가를 크게 누르면서 전역 attention을 완전히 버리지 않는다.',
    cost: '압축 state가 오래된 세부 정보를 얼마나 보존하는지 needle retrieval로 확인해야 한다.',
  },
];

export default function LLMArchitectureGalleryArticle() {
  return (
    <div className="space-y-16">
      <section id="current-anchor" className="scroll-mt-20">
        <BeginnerOpening
          title="LLM 아키텍처는 다음 글자 조각을 고르는 공장의 내부 배치도다"
          description={<>LLM(Large Language Model)은 지금까지 들어온 문장을 작은 <strong className="text-foreground">token</strong> 조각으로 읽고, 다음에 올 token의 점수를 계산한다. 아키텍처는 그 계산을 어떤 순서와 부품으로 실행하고, 과거 정보를 어디에 남길지 정한 설계다.</>}
          familiarScene={<>휴대전화 자동완성이 다음 단어 후보를 보여 주는 장면을 떠올리면 된다. LLM은 후보를 하나 고른 뒤 그 token을 입력 뒤에 붙이고, 같은 과정을 반복한다. 모델이 길고 자연스러운 문장을 쓰는 것도 이 한 단계가 매우 정교하게 반복된 결과다.</>}
          steps={[
            { label: '입력을 숫자로 바꾼다', detail: 'Token을 hidden vector로 바꿔 계산할 수 있는 상태를 만든다.' },
            { label: '문맥과 특징을 갱신한다', detail: '여러 layer가 attention과 FFN을 반복해 지금까지의 뜻을 섞고 변환한다.' },
            { label: '다음 token을 고른다', detail: '마지막 hidden에서 vocabulary 전체의 점수를 만들고 한 token을 선택해 다시 입력에 붙인다.' },
          ]}
        />
        <ConceptPrimer
          title="최신 모델 이름 전에 잡을 다섯 단어"
          items={[
            { term: 'Token', meaning: '글자·단어 일부처럼 모델이 한 단계에서 읽고 쓰는 최소 조각이다.', why: '모든 계산량과 문맥 길이가 token 수에서 시작한다.' },
            { term: 'Hidden vector', meaning: '현재 token이 문맥 속에서 어떤 뜻을 갖는지 숫자 묶음으로 표현한 상태다.', why: 'Attention과 FFN이 실제로 주고받는 값이다.' },
            { term: 'Layer', meaning: 'Hidden vector를 한 번 갱신하는 계산 블록이며 같은 종류의 블록이 깊이 방향으로 반복된다.', why: '새 구조가 어느 층과 연결을 바꿨는지 찾는 단위다.' },
            { term: 'Attention', meaning: '현재 token이 앞의 어느 token에서 정보를 가져올지 정하는 문맥 혼합 장치다.', why: '긴 문맥의 계산과 KV memory가 생기는 출발점이다.' },
            { term: 'FFN', meaning: '각 token 위치의 hidden 안에서 필요한 특징을 키우고 줄이는 변환층이다.', why: 'Dense와 Sparse MoE가 갈라지는 부품이다.' },
          ]}
        />
        <p className="mb-8 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          이제 최신 모델을 보더라도 이름부터 외우지 않는다. <strong className="text-foreground">입력은 어디서 합류하는가, 과거 token을 어떻게 읽는가, FFN 용량을 얼마나 켜는가, 기억을 목록과 state 중 무엇으로 남기는가, 이전 layer를 어떻게 이어 받는가</strong>를 차례로 묻는다. 아래 2026 사례는 이 다섯 질문이 왜 필요한지 보여 주는 현재 목표다.
        </p>
        <div className="border-y border-border py-7">
          <div className="min-w-0 max-w-4xl">
            <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">CURRENT QUESTION · 2026-06까지 공개된 근거</p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight sm:text-3xl">최신 구조는 이제 token 안쪽만 바꾸지 않는다</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              2026년 공개 자료를 함께 보면 변화는 attention과 MoE 안에서 끝나지 않는다. DeepSeek-V4는 token 사이의 접근과 residual 경로를 함께 바꾸고,
              Attention Residuals는 layer 깊이 방향을 새로운 attention 축으로 만들며, Gemma 4 12B는 별도 vision·audio encoder를 줄여 modality가 backbone에 들어오는 경계까지 바꾼다.
              따라서 현재 모델은 <strong className="text-foreground">입력 경계·문맥 혼합·용량 배분·상태 저장·깊이 혼합</strong>의 다섯 축으로 읽어야 한다.
            </p>
          </div>
        </div>
        <CurrentArchitectureCompass />
        <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
          위 다섯 축은 세 회사가 동일하게 제시한 분류표가 아니라, 공개된 구조 변화를 서로 비교해 만든 이 글의 재구성이다. 기본 경로는 아래 GPT-2의 최소 기준점에서 시작하고,
          여러 축이 한 번에 결합된 사례는 마지막 <Link to={articlePath('ai', 'research-deepseek-v3-2-2025')} className="font-semibold text-foreground underline decoration-border underline-offset-4">DeepSeek-V3.2 보고서 재구성</Link>에서 검산한다.
        </p>
        <SourceNotes sources={[
          { label: 'DeepSeek — DeepSeek-V4 technical report', href: 'https://arxiv.org/abs/2606.19348', note: 'Hybrid long-context attention, mHC와 MoE routing의 공식 기술 보고서 범위를 확인한다.' },
          { label: 'Moonshot AI — Attention Residuals', href: 'https://github.com/MoonshotAI/Attention-Residuals', note: '이전 layer 표현을 depth attention으로 선택하는 Full·Block AttnRes의 공식 논문과 구현이다.' },
          { label: 'Google DeepMind — Gemma 4 12B', href: 'https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12B/', note: 'Encoder-free multimodal input과 MTP drafter라는 release architecture를 확인한다. 성능 평가는 vendor 발표 범위로 제한한다.' },
        ]} />
      </section>

      <section id="foundation-contract" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">먼저 고정할 하나의 Transformer 계약</h2>
        <BeginnerBridge title="새 자동차를 비교하려면 먼저 엔진·변속기·연료통이 맡는 일을 고정해야 한다">
          Transformer도 먼저 문맥을 섞는 부분, token마다 특징을 바꾸는 부분, 과거 정보를 저장하는 부분을 나눠 본다. 이 기준점이 있으면 새 모델 이름을 외우지 않아도 어느 부품의 계산·메모리·연결 방식이 바뀌었는지 읽을 수 있다.
        </BeginnerBridge>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <QuestionLead
            question="새 모델 이름을 외우지 않고도 구조 그림만 보고 무엇이 바뀌었는지 설명할 수 있을까?"
            answer="가능하다. 모든 모델을 같은 목록으로 비교하지 말고, dense 기준점에서 문맥 혼합·KV 저장·MLP 용량·상태 기억이 어떻게 달라졌는지 순서대로 추적하면 된다."
          />
          <p>
            GPT-2부터 최신 hybrid 모델까지 비교 기준이 되는 decoder 골격은 단순하다. token을 hidden vector로 바꾸고, context mixer로 문맥을 섞고,
            channel mixer로 token별 feature를 변환한 뒤 residual stream에 더한다. 2025년까지의 큰 변화는 주로 <strong>문맥 혼합·용량 배분·상태 저장</strong>에 집중됐고,
            2026년 공개 연구는 <strong>이전 layer를 어떻게 선택하는가</strong>와 <strong>다른 modality가 어디서 합류하는가</strong>까지 경계를 넓혔다.
          </p>
          <FormulaSequence
            formulas={[
              String.raw`z_0^{\mathrm{text}}=E_{\mathrm{text}}(x_{\mathrm{text}})`,
              String.raw`z_0^{\mathrm{img}}=P_{\mathrm{img}}(x_{\mathrm{img}}),\qquad z_0^{\mathrm{audio}}=P_{\mathrm{audio}}(x_{\mathrm{audio}})`,
              String.raw`z_0=\left[z_0^{\mathrm{text}};z_0^{\mathrm{img}};z_0^{\mathrm{audio}}\right]`,
            ]}
            meaning="첫 줄은 text만 받는 기준 입력이다. 둘째 줄은 image와 audio를 같은 hidden 차원으로 바꾸고, 셋째 줄은 세 modality를 하나의 token sequence로 연결한다."
            symbols={[[String.raw`E_{\mathrm{text}}`, 'text token을 backbone hidden 차원으로 바꾸는 embedding'], [String.raw`P_{\mathrm{img}},P_{\mathrm{audio}}`, 'image·audio 특징을 공통 hidden 차원과 token 순서로 맞추는 projector'], [String.raw`[\,;\,]`, '서로 다른 modality token을 하나의 backbone 입력 sequence로 이어 붙인다는 비교 표기'], [String.raw`z_0`, '별도 encoder가 대부분의 처리를 끝내는지, 얕은 projector 뒤 공통 backbone이 처리하는지 확인할 입력 경계']]}
          />
          <FormulaSequence
            formulas={[
              String.raw`S=\frac{QK^\top}{\sqrt{d}}`,
              String.raw`A=\mathrm{softmax}(S)`,
              String.raw`\mathrm{Attention}(Q,K,V)=AV`,
            ]}
            meaning="먼저 query와 key의 방향이 얼마나 맞는지 점수 S를 만들고, softmax로 선택 비율 A를 만든 뒤, 그 비율만큼 value를 가져온다. 긴 한 줄 대신 실제 계산 순서대로 읽는다."
            symbols={[['Q', '현재 token이 찾는 정보'], ['K', '각 과거 token의 검색 주소'], ['V', '선택되면 가져올 실제 내용'], [String.raw`\mathrm{softmax}`, '유사도를 합이 1인 선택 비율로 변환'], [String.raw`\sqrt d`, '차원이 커져 점수가 과도하게 커지는 현상을 보정']]}
          />
          <FormulaSequence
            formulas={[
              String.raw`D_{\mathrm{KV}}=H_{\mathrm{KV}}d_h`,
              String.raw`M_{\mathrm{KV/token}}=2D_{\mathrm{KV}}b`,
              String.raw`M_{\mathrm{KV}}=BLN M_{\mathrm{KV/token}}`,
              String.raw`B{=}2,\quad L{=}48,\quad N{=}8192`,
              String.raw`H_{\mathrm{KV}}{=}4,\quad d_h{=}128,\quad b{=}2`,
              String.raw`M_{\mathrm{KV}}=1.50\ \mathrm{GiB}`,
            ]}
            meaning="KV head 너비와 token 하나의 K·V byte를 먼저 구한 뒤 batch·layer·context 길이만큼 확장한다. 예시는 아래 판독기의 기본값과 같아서 손계산 결과 1.50 GiB를 UI에서 바로 검산할 수 있다."
            symbols={[['2', 'K와 V 두 배열을 모두 저장'], ['B', '동시에 decode하는 sequence 또는 batch 수'], ['L', '모든 decoder layer에서 따로 저장'], [String.raw`H_{\mathrm{KV}}`, 'GQA·MQA가 직접 줄이는 KV head 수'], ['N', '문맥이 길어질 때 선형으로 증가'], ['b', 'FP16이면 보통 원소당 2 byte']]}
          />
          <FormulaSequence
            formulas={[
              String.raw`\rho_{\mathrm{active}}=\frac{P_{\mathrm{active}}}{P_{\mathrm{total}}}`,
              String.raw`P_{\mathrm{active}}=37\mathrm{B},\qquad P_{\mathrm{total}}=671\mathrm{B}`,
              String.raw`\rho_{\mathrm{active}}\approx\frac{37}{671}\approx5.5\%`,
            ]}
            meaning="MoE에서는 저장된 전체 파라미터와 token 하나가 실제로 계산한 파라미터를 분리한다. DeepSeek V3의 37B active parameter는 routed expert만이 아니라 attention, shared expert와 token이 실제로 통과하는 dense·selected 경로를 합친 전체 token당 active ledger다."
            symbols={[[String.raw`P_{\mathrm{active}}`, 'Attention·shared/dense 부분과 이번 token이 선택한 routed experts를 합친 실제 활성 parameter'], [String.raw`P_{\mathrm{total}}`, '모든 expert를 포함한 모델 전체 용량'], [String.raw`\rho_{\mathrm{active}}`, '전체 저장 용량 중 token 하나가 실제 계산에 사용한 몫']]}
          />
          <p><strong>다음 depth 식은 Attention Residuals의 구현 식을 그대로 옮긴 것이 아니라 비교 축을 설명하는 저자 재구성이다.</strong> 원문 구현은 learned pseudo-query, RMSNorm과 이전 layer output에 대한 softmax weight를 포함하므로 실제 재현에서는 공식 식과 code를 사용한다.</p>
          <FormulaSequence
            formulas={[
              String.raw`u_l^{\mathrm{base}}=h_{l-1}`,
              String.raw`u_l^{\mathrm{depth}}=\sum_{i<l}\alpha_{i\to l}v_i`,
              String.raw`h_l=u_l+F_l(u_l)`,
            ]}
            meaning="기준 Transformer는 직전 layer 하나를 읽는다. Depth mixer는 여러 이전 layer 중 필요한 표현을 고른 뒤, 선택된 입력에 현재 block의 변화량을 residual로 더한다."
            symbols={[[String.raw`u_l^{\mathrm{base}}`, '기준 Transformer의 l번째 block 입력으로, 직전 출력 하나만 받음'], [String.raw`u_l^{\mathrm{depth}}`, 'depth mixing을 쓸 때 여러 이전 layer 표현을 섞어 만든 현재 block 입력'], [String.raw`\alpha_{i\to l}`, '현재 입력에 따라 이전 layer i를 얼마나 가져올지 정한 선택 비율'], [String.raw`F_l`, 'l번째 attention·MLP block이 계산한 변화량'], [String.raw`u_l+F_l(u_l)`, '깊이 선택이 달라져도 block 입력에 계산된 변화량을 더하는 residual 계약은 유지']]}
          />
          <p>
            따라서 모델 표에서 128K, 671B 같은 큰 숫자만 보는 것은 부족하다. attention 방식은 문맥 혼합 비용을, KV/token은 동시 서빙 메모리를,
            active ratio는 실제 token당 계산량을 설명한다. 여기에 depth mixer와 modality adapter의 위치를 표시하면 2026년 구조도 기존 decoder 기준선 위의 변경으로 읽힌다.
          </p>
          <p>
            수식 자체가 낯설다면 먼저 <Link to={articlePath('ai', 'transformer-architecture')}>Transformer 구조</Link>와{' '}
            <Link to={articlePath('ai', 'paper-transformer-2017')}>Attention Is All You Need 재구성</Link>을 읽고 돌아오면 된다.
          </p>
        </div>
      </section>

      <section id="architecture-fingerprint" className="scroll-mt-20">
        <h2 className="mb-3 text-2xl font-bold">처음 보는 모델을 숫자로 판독하기</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          이제 설명을 새 모델에 옮겨 본다. 아래 모델은 실재 제품이 아니라 여러 구조 축을 한 번에 검산하기 위한 합성 사양이다.
          이름과 benchmark를 가린 채 KV 메모리, local/global 배치, expert 활성 경로와 depth mixing을 계산하면 무엇을 더 확인해야 하는지가 드러난다.
        </p>
        <ArchitectureFingerprintLab />
        <SourceNotes sources={[
          { label: 'Ainslie et al. — Grouped-Query Attention', href: 'https://arxiv.org/abs/2305.13245', note: 'Query head보다 적은 KV head를 공유해 MHA와 MQA 사이의 품질·속도 절충을 만드는 원문이다.' },
          { label: 'DeepSeek-AI — DeepSeek-V3 Technical Report', href: 'https://arxiv.org/abs/2412.19437', note: 'Total 671B와 token당 active 37B, MLA, DeepSeekMoE를 분리해 읽는 근거다.' },
          { label: 'Moonshot AI — Kimi Linear', href: 'https://github.com/MoonshotAI/Kimi-Linear', note: '3:1 KDA/MLA hybrid와 1M context에서 state 경로와 attention 경로를 함께 쓰는 공식 보고서·구현이다.' },
        ]} />
      </section>

      <section id="five-milestones" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-3">최소 다섯 구조로 기준 계보 잡기</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          70여 개 모델을 한꺼번에 비교하지 않는다. 먼저 구조가 실제로 갈라진 다섯 순간을 순서대로 읽고, 나머지 모델은 이 좌표 위에 배치한다.
        </p>
        <ArchitectureMilestoneSequence />
      </section>

      <section id="branch-reading" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-3">이제 병목을 하나씩 분리해 읽기</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          아래 글은 병렬 카탈로그가 아니다. Dense 실행 계약 뒤 KV 메모리와 expert 용량까지는 공통 기준으로 읽는다. Hybrid·state는 Kimi·Qwen처럼 attention 대체가 실제 목표에 들어올 때만 여는 선택 분기이며, 마지막에는 실제 보고서 한 편을 다시 검산한다.
        </p>
        <p className="mt-3 max-w-3xl border-l-2 border-emerald-500 pl-4 text-sm leading-7 text-muted-foreground">
          DeepSeek-V3.2는 이 분기 중 하나가 아니라 <strong className="text-foreground">02의 MLA·sparse attention과 03의 Sparse MoE를 합친 구조</strong>다.
          아래에서는 합쳐진 모델을 기준선부터 다시 분해하고, 마지막에 통합 보고서로 돌아가 각 변경의 비용을 검산한다.
        </p>
        <div className="mt-8 divide-y divide-border border-y border-border">
          <ArchitectureRoute order="01" slug="llm-architecture-dense-transformers" title="Dense Transformer" body="GPT-2에서 시작해 Llama·Qwen·Gemma의 block delta를 읽는다. 이후 모든 구조가 상속하는 기준점이다." />
          <ArchitectureRoute order="02" slug="llm-architecture-kv-long-context" title="KV Cache와 Long Context" body="GQA·MQA·MLA와 local/global attention이 메모리와 가시 범위를 어떻게 바꾸는지 계산한다." />
          <ArchitectureRoute order="03" slug="llm-architecture-sparse-moe" title="Sparse MoE" body="dense MLP를 router와 expert로 바꾸고, total parameter와 active parameter가 왜 분리되는지 추적한다." />
          <ArchitectureRoute order="선택" slug="llm-architecture-hybrid-linear" title="Hybrid·Linear Attention" body="Kimi·Qwen처럼 state 경로가 필요한 경우에만 열어, attention 일부를 state update로 바꿀 때 얻는 속도와 잃을 수 있는 정확한 검색 능력을 비교한다." />
          <ArchitectureRoute order="05" slug="research-deepseek-v3-2-2025" title="실제 보고서 검산 · DeepSeek-V3.2" body="DeepSeek Sparse Attention(DSA), MoE, 안정화·확장한 GRPO 기반 RL protocol과 agent synthesis를 분리하고 각 주장에 필요한 원문 증거와 재현 경계를 확인한다." />
        </div>
      </section>

      <section id="paper-protocol" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">새 모델 논문에서 답해야 할 여섯 질문</h2>
        <ol className="grid gap-0 border-y border-border md:grid-cols-2">
          {[
            ['01', '기준 모델', '저자가 비교 기준으로 삼은 이전 구조는 무엇인가?'],
            ['02', '구조 변화', 'attention, MLP, normalization, position 중 실제로 바뀐 block은 어디인가?'],
            ['03', 'token 경로', 'token 하나가 입력부터 logit까지 어떤 순서로 계산되는가?'],
            ['04', '학습과 추론', '학습 때만 쓰는 장치와 추론 때 남는 장치를 구분했는가?'],
            ['05', '비용 이동', 'FLOPs를 줄인 대신 KV 메모리나 GPU 통신을 늘리지는 않았는가?'],
            ['06', '증거', 'ablation이 구조 변화 자체의 효과를 분리해 보여 주는가?'],
          ].map(([order, title, body]) => (
            <li key={order} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-b border-border py-5 md:px-5 md:odd:border-r md:nth-last-[-n+2]:border-b-0">
              <span className="text-sm font-semibold text-primary">{order}</span>
              <div><strong>{title}</strong><p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p></div>
            </li>
          ))}
        </ol>
        <CapabilityCheck
          title="이 글을 읽은 뒤 확인할 것"
          items={[
            '모델 이름을 가린 구조 그림에서도 dense, KV-efficient, MoE, hybrid를 구분할 수 있다.',
            'context 길이, KV/token, active parameter가 각각 다른 비용을 설명한다는 점을 말할 수 있다.',
            '2026년의 depth mixing과 modality input 변화가 기존 세 비용 축 밖에 무엇을 추가하는지 설명할 수 있다.',
            '새 논문의 개선 주장과 그 대가를 같은 문장 안에서 설명할 수 있다.',
          ]}
        />
        <CitationBlock source="Sebastian Raschka, LLM Architecture Gallery" citeKey={1} href="https://sebastianraschka.com/llm-architecture-gallery/">
          <p>모델별 구조 그림과 정량 정보는 원문 갤러리를 검산 자료로 사용했다. 이 글은 표를 복제하지 않고 구조가 갈라진 이유와 학습 순서로 재구성한다.</p>
        </CitationBlock>
      </section>
    </div>
  );
}

function ArchitectureMilestoneSequence() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const milestone = architectureMilestones[selectedIndex];
  const previous = selectedIndex > 0 ? architectureMilestones[selectedIndex - 1] : null;
  const next = selectedIndex < architectureMilestones.length - 1 ? architectureMilestones[selectedIndex + 1] : null;

  return (
    <div className="mt-8 min-w-0 scroll-mt-20 border-y border-border" data-architecture-milestone-sequence>
      <div className="grid grid-cols-5 border-b border-border" role="tablist" aria-label="LLM 구조의 최소 다섯 계보">
        {architectureMilestones.map((item, index) => {
          const active = index === selectedIndex;
          return (
            <button
              key={item.model}
              type="button"
              role="tab"
              aria-label={shortModelName(item.model)}
              aria-selected={active}
              aria-controls="architecture-milestone-panel"
              onClick={() => setSelectedIndex(index)}
              className={`min-h-[70px] min-w-0 border-r border-border px-1.5 py-3 text-left transition-colors last:border-r-0 sm:px-3 ${active ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
            >
              <span className="block font-mono text-xs font-bold">{item.order}</span>
              <span className="mt-1 block text-xs font-bold leading-4 sm:text-sm sm:leading-5">{compactModelName(item.model)}</span>
            </button>
          );
        })}
      </div>

      <article id="architecture-milestone-panel" role="tabpanel" className="grid min-w-0 gap-7 py-8 sm:py-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="font-mono text-xs font-bold text-primary">STEP {milestone.order} / 05</div>
            <div className="text-xs text-muted-foreground">{previous ? `${shortModelName(previous.model)}에서 이어짐` : '모든 비교가 시작되는 최소 기준점'}</div>
          </div>
          <h3 className="mt-3 text-xl font-semibold sm:text-2xl">{milestone.model}</h3>
          <p className="mt-3 max-w-3xl text-base font-medium leading-7">{milestone.question}</p>

          <dl className="mt-7 grid border-y border-border md:grid-cols-2">
            <MilestoneFact label="상속한 것" value={milestone.inherited} />
            <MilestoneFact label="바꾼 것" value={milestone.change} changed />
          </dl>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-xs font-bold text-muted-foreground">TOKEN 하나가 지나는 순서</p>
            <p className="mt-2 text-sm font-semibold leading-7">{milestone.flow}</p>
          </div>

          <div className="mt-6 grid gap-5 border-t border-border pt-5 md:grid-cols-2">
            <MilestoneOutcome label="얻는 것" value={milestone.gain} />
            <MilestoneOutcome label="치르는 대가" value={milestone.cost} />
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">상속·변경·token 흐름은 공개 구조를 이 글의 공통 순서로 재구성한 설명이다. “얻는 것·치르는 대가”는 원문에 명시된 측정 결과가 아닌 경우 저자 해석이며, 실제 채택은 해당 모델의 ablation과 runtime trace로 다시 확인한다.</p>
        </div>

        <ArchitectureLineageDiagram
          kind={milestone.diagram}
          model={milestone.model}
          sourceHref={`${architectureImageBase}${milestone.image}`}
        />

        <div className="grid grid-cols-2 border-t border-border pt-5">
          <button
            type="button"
            disabled={!previous}
            onClick={() => setSelectedIndex((index) => Math.max(0, index - 1))}
            className="inline-flex min-h-11 items-center justify-start gap-2 text-left text-sm font-semibold text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {previous ? shortModelName(previous.model) : '이전 단계 없음'}
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => setSelectedIndex((index) => Math.min(architectureMilestones.length - 1, index + 1))}
            className="inline-flex min-h-11 items-center justify-end gap-2 text-right text-sm font-semibold text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            {next ? shortModelName(next.model) : '계보 완료'}
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </article>
    </div>
  );
}

function shortModelName(model: string) {
  return model.split(' · ')[0];
}

function compactModelName(model: string) {
  const name = shortModelName(model);
  if (name.startsWith('DeepSeek V3')) return 'DS-V3';
  return name.split(' ')[0];
}

function FormulaSequence({
  formulas,
  meaning,
  symbols,
}: {
  formulas: string[];
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-sequence className="not-prose my-6 min-w-0">
      <div className="grid min-w-0 gap-2 rounded-md border border-border bg-muted/10 p-3 sm:p-4">
        {formulas.map((formula, index) => (
          <div
            key={formula}
            className="grid min-w-0 gap-2 sm:grid-cols-[28px_minmax(0,1fr)] sm:items-center"
          >
            <span className="font-mono text-xs font-bold text-muted-foreground" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <M display className="my-0 text-sm sm:text-base">{formula}</M>
          </div>
        ))}
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function MilestoneFact({ label, value, changed = false }: { label: string; value: string; changed?: boolean }) {
  return (
    <div className={`min-w-0 py-5 md:px-5 ${changed ? 'border-t border-border bg-sky-50/45 md:border-l md:border-t-0 dark:bg-sky-950/15' : ''}`}>
      <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-sm font-semibold leading-7 text-foreground">{value}</dd>
    </div>
  );
}

function MilestoneOutcome({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-7 text-foreground/80">{value}</p>
    </div>
  );
}

function ArchitectureRoute({ order, slug, title, body }: { order: string; slug: string; title: string; body: string }) {
  return (
    <Link to={articlePath('ai', slug)} className="group grid gap-3 py-6 sm:grid-cols-[52px_minmax(0,1fr)_24px] sm:items-center">
      <span className="text-sm font-semibold text-primary">{order}</span>
      <span><strong className="text-base">{title}</strong><span className="mt-1 block text-sm leading-6 text-muted-foreground">{body}</span></span>
      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}
