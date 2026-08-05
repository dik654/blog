import DraftVerify from './vllm-spec-decode/DraftVerify';
import EagleMtp from './vllm-spec-decode/EagleMtp';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { specDecodeCodeRefs } from './vllm-serving/codeRefsSpecDecode';
import { sharedCodeRefs } from './vllm-serving/sharedCodeRefs';
import { vllmTree } from './vllm-serving/fileTrees';
import ServingDepthGuide from './llm-serving-ops/ServingDepthGuide';
import { SpeculativeCommitViz } from './vllm-runtime/viz/VllmRuntimeViz';

const allRefs = { ...sharedCodeRefs, ...specDecodeCodeRefs };

export default function VLLMSpecDecodeArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <SpecialistEntry
        title="Autoregressive decoding의 확정 경계를 빠르게 만드는 고급 글"
        description="작은 proposer가 여러 후보 token을 미리 만들고 큰 target이 한 번에 검증하는 speculative decoding을 확률식과 vLLM code 경로로 읽는다. 일반적인 한-token decode와 scheduler 흐름은 이미 안다고 가정한다."
        prerequisites={[
          'Autoregressive model이 확정된 prefix에서 다음 token 하나의 확률을 만든다는 뜻을 안다.',
          'Logit과 sampling distribution이 최종 출력 품질을 결정한다는 점을 안다.',
          'KV cache, batch와 scheduler가 decode step의 runtime state를 소유함을 안다.',
        ]}
        links={[
          { slug: 'vllm-serving', title: 'vLLM serving 전체 흐름', reason: 'Request, scheduler, worker와 KV cache의 소유권을 먼저 잡는다.' },
          { slug: 'vllm-scheduler', title: 'vLLM scheduler', reason: 'Token budget과 batch가 매 step 어떻게 결정되는지 배운다.' },
          { slug: 'efficient-inference-on-device', title: 'LLM 추론 병목', reason: 'FLOPs보다 memory movement와 decode latency가 중요해지는 이유를 보강한다.' },
        ]}
      />
      <section id="overview" className="mb-16 scroll-mt-20">
        <QuestionLead
          question="작은 model이 네 token을 먼저 썼는데, 큰 target model은 왜 한 번의 forward로 여러 token을 확정하면서도 자기 분포를 유지할 수 있을까?"
          answer={<>Draft는 정답을 대신하지 않고 <strong>계산할 후보 위치</strong>를 제안한다. Target이 각 위치의 확률을 계산하고 올바른 acceptance ratio와 recovery distribution으로 commit 경계를 정하면, sampling 결과는 target만 순차 실행한 분포와 일치하도록 보정할 수 있다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Autoregressive target은 보통 한 번의 decode step에서 token 하나를 확정한다. 이 과정이 memory bandwidth에 묶이면 큰 model을 여러 번 부르는 비용이 지연을 지배한다. Speculative decoding은 저렴한 proposer가 앞으로의 K개 후보를 만들고 target이 그 K개 위치를 병렬 검증해 target call당 확정 token 수를 늘리려는 방법이다.</p>
          <p>핵심 상태는 세 가지다. <strong>proposed</strong> token은 아직 답이 아니고, <strong>verified</strong> probability는 target이 계산한 증거이며, <strong>committed</strong> prefix만 output과 다음 KV state에 남을 수 있다. 거부된 위치 뒤의 draft와 lookahead slot은 폐기하거나 rollback한다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Draft / proposer', meaning: 'Target보다 싸게 다음 K개 후보 token과 제안 확률 q를 만든다.', why: 'Target 호출 사이에 미리 검증할 위치를 채운다.' },
          { term: 'Target / verifier', meaning: '실제 서비스 분포 p를 정의하고 draft 위치를 한 번에 평가한다.', why: '품질 기준과 최종 commit 권한은 target에 남아 있어야 한다.' },
          { term: 'Accepted prefix', meaning: '왼쪽부터 연속해서 수락된 draft token 구간이다.', why: '첫 거부 뒤 token은 이미 잘못된 조건에 의존하므로 함께 확정할 수 없다.' },
          { term: 'Recovery / bonus', meaning: '거부 지점의 보정 token 또는 K개 모두 수락했을 때 target의 다음 token이다.', why: 'Target 분포를 보존하면서 verifier 계산을 낭비하지 않게 한다.' },
        ]} />
        <SpeculativeCommitViz />
      </section>

      <section id="acceptance-math" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수락률과 속도 향상을 같은 숫자로 읽지 않는다</h2>
        <M display>{String.raw`\begin{aligned}
\underbrace{a_i}_{\text{위치 }i\text{의 수락 확률}}&=\min\!\left(1,\underbrace{\frac{p_i(x_i)}{q_i(x_i)}}_{\text{target 대 draft 확률비}}\right)\\
\underbrace{r_i(x)}_{\text{거부 지점의 보정 분포}}&=\frac{\underbrace{\left(p_i(x)-q_i(x)\right)_+}_{\text{target에 남은 확률 질량}}}{\underbrace{\sum_y\left(p_i(y)-q_i(y)\right)_+}_{\text{확률로 다시 정규화}}}
\end{aligned}`}</M>
        <FormulaNote
          meaning={'Draft가 어떤 token을 target보다 더 자주 제안했다면 p/q 비율만큼만 받아 과대표집을 제거한다. 처음 거부된 위치에서는 target에 남은 확률 질량 p-q의 양수 부분을 다시 정규화해 한 token을 뽑는다. 이 두 단계가 target distribution을 복원한다.'}
          symbols={[
            [String.raw`q_i(x)`, 'Draft가 위치 i에서 token x에 준 확률'],
            [String.raw`p_i(x)`, '같은 prefix 조건에서 target이 준 확률'],
            [String.raw`a_i`, 'Draft가 실제 제안한 token을 받아들일 조건부 확률'],
            [String.raw`(z)_+`, 'max(0, z): 음수 확률 질량을 버리는 연산'],
          ]}
        />
        <M display>{String.raw`\begin{aligned}
\underbrace{\mathbb{E}[Y]}_{\text{verifier 호출당 기대 확정 토큰}}&\approx\underbrace{1+\sum_{j=1}^{K}\alpha^j}_{\text{recovery 또는 bonus를 포함한 단순 근사}}\\
\underbrace{S}_{\text{지연시간 속도비}}&\approx\frac{\underbrace{\mathbb{E}[Y]\,t_{\mathrm{target},1}}_{\text{순차 target 기준 비용}}}{\underbrace{t_{\mathrm{draft}}(K)+t_{\mathrm{verify}}(K)}_{\text{실제 draft와 검증 비용}}}
\end{aligned}`}</M>
        <FormulaNote
          meaning={'설명용으로 각 위치의 조건부 수락률이 모두 같은 α이고 서로 독립이라고 근사하면 K=4, α=0.75에서 E[Y]=3.0508이다. 하지만 target verifier가 네 위치를 계산하는 시간과 draft 비용이 0이 아니므로 실제 speedup은 반드시 아래 비용 분모까지 측정해야 한다.'}
          symbols={[
            [String.raw`Y`, '한 target verifier call 뒤 commit되는 token 수'],
            [String.raw`K=4`, '한 번에 제안한 최대 draft token 수'],
            [String.raw`\alpha=0.75`, '설명용 동일·독립 조건부 acceptance 근사'],
            [String.raw`t_{\mathrm{verify}}(K)`, 'Target이 K개 후보 위치를 검증하는 실제 시간'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><code>1 + 0.75 + 0.75² + 0.75³ + 0.75⁴ = 3.0508</code>은 처리량 예측의 출발점일 뿐 결론이 아니다. 높은 QPS에서는 verifier batch가 커져 memory-bound 이점이 줄거나 draft가 GPU 자원을 차지해 오히려 느려질 수 있다. 현재 vLLM 문서도 이 기능의 기대 이점을 주로 medium·low-QPS memory-bound workload에 한정한다.</p>
        </div>
        <Misconception>Acceptance rate가 75%라고 1.75배 또는 3배 빨라지는 것이 아니다. Draft latency, target의 multi-token verifier kernel, batch 크기, KV lookahead와 rollback 비용을 포함한 end-to-end TPOT로 비교해야 한다.</Misconception>
      </section>

      <DraftVerify onCodeRef={sidebar.open} />
      <EagleMtp onCodeRef={sidebar.open} />

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음 글에 넘길 산출물: 확정된 token 경계</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Verifier가 accepted prefix와 recovery 또는 bonus token을 정하면 scheduler는 rejected lookahead를 rollback하고 committed token까지만 다음 state로 넘긴다. Text-only에서는 여기서 닫히지만 이미지가 들어오면 proposer와 target이 같은 media embedding과 placeholder 정렬을 이해하는지 먼저 확인해야 한다. 그 경계는 <InternalLink slug="vllm-vlm-serving">VLM Serving</InternalLink>이 소유한다.</p>
        </div>
        <CapabilityCheck items={[
          'Target/draft 확률에서 올바른 p/q acceptance와 recovery distribution의 역할을 설명할 수 있다.',
          'K와 acceptance로 verifier당 기대 token을 계산하고 실제 speedup에는 draft·verify 비용이 필요함을 판단할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Leviathan et al. · Speculative Decoding', href: 'https://proceedings.mlr.press/v202/leviathan23a.html', note: '분포를 보존하는 speculative sampling의 acceptance와 recovery 기준.' },
          { label: 'vLLM Speculative Decoding', href: 'https://docs.vllm.ai/en/latest/features/speculative_decoding/', note: '현재 지원 범위, workload 기대 조건, lossless·numerical caveat와 version-sensitive 설정.' },
          { label: 'vLLM EAGLE', href: 'https://docs.vllm.ai/en/latest/features/speculative_decoding/eagle/', note: '현재 EAGLE 계열 proposer 사용과 제약.' },
          { label: 'Speculators decision guide', href: 'https://docs.vllm.ai/projects/speculators/en/latest/user_guide/algorithms/decision_guide/', note: 'Draft 방법을 workload와 hardware 조건으로 고르는 현재 안내.' },
        ]} />
      </section>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ServingDepthGuide guideKey="specDecode" />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={allRefs}
        fileTrees={{ vllm: vllmTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
