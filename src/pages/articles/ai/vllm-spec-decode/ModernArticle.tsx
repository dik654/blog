import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { Link } from "react-router-dom";
import SpeedupTable from "./SpeedupTable";
import SpecTraceViz from "./viz/SpecTraceViz";
import { codeRefs } from "./codeRefs";
import { vllmSpecDecodeTree } from "./fileTree";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return <>
    <section id="overview" data-teach-level="S" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1. 결론부터: 후보를 한 번에 채점해 여러 토큰을 확정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8"><strong>이 글의 범위:</strong> 추측 디코딩의 공통 원리부터 첫 거부, 원래 분포 복원, KV 기록 갱신, vLLM의 손익 계산까지 다룹니다. 원리를 이미 알고 Medusa·LayerSkip·MTP·SuffixDecoding의 차이를 비교하려면 <Link to="/cs/ai/speculative-decoding-variants">추측 디코딩 변형 비교</Link>로 이어가면 됩니다.</p>
        <p className="leading-8"><strong>vLLM 추측 디코딩은 후보 여러 개를 큰 모델이 한 번에 검사해 순차 실행 횟수를 줄이는 기술입니다.</strong></p>
        <p className="leading-8">이 답은 바로 다음 질문을 만듭니다. 후보가 큰 모델의 선택과 다르면 어디까지 남겨야 할까요? 교체한 뒤에도 큰 모델의 선택 비중은 어떻게 지킬까요?</p>
        <p className="leading-8">이 글에서는 A → B → B → A라는 후보 네 개를 끝까지 따라갑니다. 셋째 B에서 멈추고 A로 바꿔 A → B → A를 확정합니다. 이어서 출력은 일곱 자리인데 다음 계산 기록은 왜 여섯 자리인지 실제 vLLM 코드에서 확인합니다.</p>
        <p className="leading-8">마지막에는 후보를 준비한 시간까지 더합니다. 여러 토큰을 확정했다는 사실과 실제로 빨라졌다는 판단은 서로 다른 질문이기 때문입니다.</p>
      </div>
    </section>

    <section id="black-box" data-teach-level="B" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2. 왜 여러 토큰을 확정하면 큰 모델 실행이 줄어들까요?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">큰 모델이 토큰 세 개를 평소대로 만들면 실행도 세 번 이어집니다. 첫 실행이 고른 토큰이 둘째 실행의 입력이 되고, 둘째 결과가 셋째 입력이 되므로 앞 실행을 기다려야 합니다.</p>
        <p className="leading-8">후보를 미리 준비하면 큰 모델은 후보가 놓인 여러 위치를 한 실행에서 계산할 수 있습니다. 각 위치는 자기 앞 후보만 읽고 다음 토큰의 점수를 냅니다. 앞에서부터 점수가 맞은 후보를 확인하면, 큰 모델 한 번으로 여러 토큰을 확정할 수 있습니다.</p>
        <p className="leading-8">이 실행에는 한 위치보다 많은 계산이 들어갑니다. 다만 짧은 생성에서는 큰 모델의 가중치를 읽고 GPU 커널을 시작하는 시간이 큰 몫을 차지합니다. 여러 위치를 작은 묶음으로 계산하면 한 번 읽은 가중치를 여러 위치에 씁니다. 그래서 세 번 따로 실행할 때보다 실제 시간이 덜 늘어날 수 있습니다.</p>
        <p className="leading-8">이미 큰 배치(batch)가 GPU를 채우면 추가 계산의 비용이 그대로 드러납니다. 후보가 길 때도 KV·통신 비용이 커집니다. 따라서 “큰 모델 한 번”을 “한 토큰과 같은 비용”으로 보면 안 됩니다. 후보 준비·검증·기록 정리까지 합친 시간을 재야 합니다.</p>
      </div>
      <figure data-viz className="not-prose my-8 min-w-0 border-y border-border/70 py-6">
        <figcaption className="text-base font-bold">세 토큰을 만드는 두 실행 순서</figcaption>
        <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-border/70 bg-card p-4">
            <p className="text-xs font-bold text-primary">평소 생성 · 큰 모델 세 번</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>1. 첫 토큰을 고르고 기다림</li>
              <li>2. 첫 토큰을 입력해 둘째를 고름</li>
              <li>3. 둘째까지 입력해 셋째를 고름</li>
            </ol>
          </article>
          <article className="min-w-0 rounded-xl border border-border/70 bg-card p-4">
            <p className="text-xs font-bold text-primary">후보 검증 · 큰 모델 한 번</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>1. 값싼 부품이 후보 세 개를 준비</li>
              <li>2. 큰 모델이 세 위치를 한 묶음으로 채점</li>
              <li>3. 앞에서부터 통과한 토큰만 확정</li>
            </ol>
          </article>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">후보가 모두 맞으면 큰 모델을 기다리는 횟수가 3회에서 1회로 줄어듭니다. 실제 시간 이득은 11절에서 전체 비용으로 다시 판단합니다.</p>
      </figure>
    </section>

    <section id="small-case" data-teach-level="0" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3. 앞의 둘을 남기고 셋째를 A로 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">다음 토큰이 A와 B 두 종류뿐이라고 합시다. 큰 모델은 A를 70%, B를 30% 비중으로 고릅니다. 빠른 부품은 A를 40%, B를 60% 비중으로 제안합니다. 이 글에서 <strong>가정</strong>은 논문 실측값이 아니라 동작을 계산하려고 정한 숫자라는 뜻입니다.</p>
        <p className="leading-8">A 제안은 모두 받아들이면 전체의 40%가 남습니다. B 제안은 절반만 받아들이면 60%×50%=30%가 남습니다. 지금까지 A 40%, B 30%이므로 전체의 30%가 비어 있습니다.</p>
        <p className="leading-8">비어 있는 30%에서 A를 고르면 A는 40%+30%=70%, B는 30%가 됩니다. 거부 뒤 큰 모델의 70%·30%에서 다시 뽑으면 A 61%, B 39%가 되어 원래 선택 비중이 깨집니다. 부족한 쪽만 채워야 하는 이유입니다.</p>
        <p className="leading-8">이제 후보 A → B → B → A와 비교값 0.6, 0.4, 0.8, 0.2를 놓습니다. 첫 A는 통과하고, 둘째 B는 0.4가 수락 경계 0.5보다 작아 통과합니다. 셋째 B는 0.8이 0.5보다 커서 거부되며 그 자리에 A를 넣습니다. 결과는 A → B → A입니다.</p>
        <p className="leading-8">넷째 A의 비교값은 0.2라서 작아 보입니다. 그래도 셋째가 바뀐 순간 넷째가 가정한 앞 문장도 달라집니다. 다음 절에서는 이 후보를 왜 이어 쓸 수 없는지 살펴봅니다.</p>
      </div>
      <SpecTraceViz />
    </section>

    <section id="causal-stop" data-teach-level="1" className="mb-16 scroll-mt-20">
      <span id="cycle-map" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">4. 첫 거부 뒤의 후보는 다른 앞 문장을 가정했습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">넷째 후보는 앞에 A·B·B가 있다고 보고 만들어졌습니다. 실제 확정 글은 셋째를 바꾼 A·B·A입니다. 같은 글자 A라도 앞 문장이 다르면 점수와 계산 기록도 달라집니다. 따라서 넷째 후보를 그대로 이어 쓸 수 없습니다.</p>
        <p className="leading-8">그래서 각 위치를 따로 통과시킨 뒤 수락 표시를 모으면 안 됩니다. 앞에서부터 확인하다가 첫 거부에서 멈춥니다. 그 자리에 새 토큰 하나를 넣고 나머지 후보를 버립니다.</p>
        <p className="leading-8">후보 네 개를 모두 받아들이면 큰 모델이 계산한 다음 위치의 점수를 쓸 수 있습니다. 이 점수에서 보너스 토큰 하나를 더 고릅니다. 이때 후보 네 개와 보너스 하나로 최대 다섯 토큰을 확정합니다. 종료 토큰이나 최대 길이에 닿으면 실제 출력은 더 짧아집니다.</p>
        <p className="leading-8">후보가 틀려도 출력은 만들 수 있지만, 앞부분에서 자주 틀리면 준비한 뒤쪽 후보가 계속 버려집니다. 이 손실이 후보 깊이를 무작정 늘릴 수 없는 첫 번째 이유입니다.</p>
      </div>
    </section>

    <section id="why-components" data-teach-level="2" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5. 출력 규칙과 다음 계산 기록을 함께 맞춰야 합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">첫 번째 할 일은 큰 모델의 선택 비중을 보존하는 것입니다. 공통으로 겹치는 확률은 후보를 그대로 받아들이고, 거부된 비중은 큰 모델 쪽에 부족했던 토큰으로 채웁니다.</p>
        <p className="leading-8">두 번째 할 일은 첫 거부 뒤를 자르는 것입니다. 바뀐 토큰 뒤의 후보는 다른 앞 문장을 가정하므로 출력과 중간 계산 기록에서 모두 제외합니다.</p>
        <p className="leading-8">세 번째 할 일은 확정한 글의 길이와 다시 쓸 수 있는 계산 기록의 길이를 구분하는 것입니다. 교체 토큰은 글에 붙지만, 그 토큰을 입력으로 넣어 다음 자리를 계산하는 일은 다음 회차에 합니다. 그래서 글이 먼저 한 자리 길어질 수 있습니다.</p>
        <p className="leading-8">마지막으로 이 모든 일을 한 회차의 시간 장부에 넣습니다. 후보가 잘 맞아도 후보 준비와 검증이 오래 걸리면 순차 생성보다 느립니다. 이 네 조건이 맞아야 정확성과 속도를 함께 얻습니다.</p>
      </div>
    </section>

    <section id="names" data-teach-level="3" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">6. 네 동작에 이름을 붙입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">후보를 만드는 부품은 <strong className="whitespace-nowrap">초안 모델(draft)</strong> 또는 <strong className="whitespace-nowrap">제안기(proposer)</strong>입니다. 최종 출력 규칙을 정하는 큰 모델은 <strong className="whitespace-nowrap">기준 모델(target)</strong>입니다. 후보를 유지하는 일은 <strong className="whitespace-nowrap">수락(acceptance)</strong>입니다. 거부된 자리에서 부족한 비중으로 새 토큰을 뽑는 일은 <strong className="whitespace-nowrap">교체 표집(residual sampling)</strong>입니다.</p>
        <p className="leading-8">앞 토큰을 다시 계산하지 않도록 층마다 남긴 키·값 기록은 <strong className="whitespace-nowrap">KV 캐시(cache)</strong>입니다. 거부 뒤 후보의 기록을 버리고 유효 길이만 남기는 일은 <strong className="whitespace-nowrap">되돌리기(rollback)</strong>입니다.</p>
        <p className="leading-8">이제 같은 A·B·B·A 사례를 vLLM의 배열과 코드에 넣어 보겠습니다.</p>
      </div>
      <TermBreakdown title="A·B·B·A에서 이미 본 역할에 이름을 붙입니다" description="이름은 새 동작을 추가하지 않습니다. 앞의 숫자 사례에서 맡았던 역할을 가리킵니다." items={[
        { term: "초안 모델 · 제안기", description: "draft 또는 proposer라고 하며, 큰 모델보다 싸게 다음 후보를 만듭니다.", example: "A·B·B·A 네 후보를 준비합니다.", boundary: "후보를 최종 답으로 바로 내보내지 않습니다." },
        { term: "기준 모델", description: "target이라고 하며, 최종 선택 비중과 후보의 통과 여부를 정합니다.", example: "A 70%·B 30%를 기준으로 검사합니다." },
        { term: "수락", description: "acceptance라고 하며, 후보와 기준 모델이 함께 가진 확률 비중에서 후보를 유지합니다.", example: "첫 A와 둘째 B를 그대로 남깁니다." },
        { term: "교체 표집", description: "residual sampling이라고 하며, 거부된 비중을 기준 모델에 부족했던 토큰으로 채웁니다.", example: "셋째 B를 A로 바꿉니다." },
        { term: "KV 캐시 되돌리기", description: "rollback이라고 하며, 다른 앞 문장을 가정한 뒤쪽 계산 기록을 유효 길이에서 제외합니다.", example: "잠정 8자리 기록에서 두 자리를 빼 6자리만 남깁니다." },
      ]} />
      <ContentBoundary article="vllm-spec-decode" />
    </section>

    <section id="request-trace" data-teach-level="4" className="mb-16 scroll-mt-20">
      <span id="rejection-point" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7. 후보 준비부터 다음 회차까지 한 요청을 추적합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">확정된 글은 네 토큰이고, 그중 앞 세 토큰의 KV만 계산됐다고 합시다. 마지막 확정 토큰과 후보 네 개를 큰 모델에 넣으면 입력 위치 다섯 개의 점수가 나옵니다. 첫 점수는 첫 후보를 판단합니다. 다음 세 점수는 둘째부터 넷째 후보를 판단합니다. 마지막 점수는 모두 수락했을 때의 보너스를 판단합니다. (가정)</p>
        <p className="leading-8">vLLM의 고정 코드에서 전체 점수 주소는 `logits_indices=[0,1,2,3,4]`입니다. 후보 판단 주소는 `target_logits_indices=[0,1,2,3]`입니다. 보너스 주소는 `bonus_logits_indices=[4]`입니다. 0번 위치의 점수는 1번 입력 토큰을 예측합니다. 따라서 0번 점수와 비교할 후보 ID는 입력 목록의 1번, 곧 오른쪽 한 칸에서 읽습니다.</p>
        <p className="leading-8">수락 확률은 `min(1,p(x)/q(x))`입니다. A는 .7/.4를 1로 제한하고 B는 .3/.6=.5를 씁니다. 비교값 .6과 .4는 통과하지만 셋째 B의 .8은 .5보다 커서 첫 거부가 됩니다.</p>
        <p className="leading-8">앞의 A·B를 남기고 셋째를 A로 교체하면 수락 후보 수는 2, 이번 회차의 확정 출력 수는 3입니다. 마지막 후보와 보너스는 버립니다. 다음 회차는 확정 글 A·B·A를 조건으로 다시 시작합니다.</p>
      </div>
      <CodeViewButton label="후보와 보너스의 실제 인덱스 계산" onClick={() => sidebar.open("metadata", codeRefs["metadata"])} />
    </section>

    <section id="distribution-proof" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">8. 수락 경로와 교체 경로를 더하면 기준 모델 분포가 됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">한 위치만 떼어 보겠습니다. 후보 x를 제안할 확률 q(x)에 수락 확률을 곱하면 min(p(x),q(x))만 남습니다. 두 분포가 공통으로 가진 비중을 먼저 사용하는 것입니다. 전체 수락 비중은 이번 예에서 .4+.3=.7입니다.</p><p className="leading-8">거부된 경우 사용할 부족분은 각 후보에서 p−q가 양수인 부분입니다. 이번에는 (.3,0)이고 그 합은 .3입니다. 이 합을 수식에서는 Z라고 부릅니다. (.3,0)을 Z=.3으로 나누면 거부 뒤 선택 비중 (1,0)을 얻습니다.</p><p className="leading-8">수락 경로 (.4,.3)와 보충 경로 (.3,0)를 더해 (.7,.3)을 얻습니다. 이 한 위치의 보존을 실제로 확정된 앞 글마다 반복하면 연속 생성의 분포도 기준 모델과 맞습니다. 뒤 후보의 조건을 유지하지 못하면 이 반복 논리를 쓸 수 없습니다.</p><p className="leading-8">q(x)=0인 후보는 q에서 뽑힐 사건이 없으므로 그 비율을 계산할 필요가 없습니다. p=q이면 거부 비중이 0이며 부족분의 정규화에도 도달하지 않습니다. 0/0을 무조건 계산한 뒤 예외값으로 해결하는 공식이 아닙니다.</p></div><span id="draft-verify" className="scroll-mt-20" /><span id="paper-speculative-decoding" className="scroll-mt-20" /><ExplainedFormula question="후보를 받아들이거나 고친 두 경로가 같은 p를 만들까요?" idea="수락된 비중과 거부 때 채우는 부족분을 각각 센 뒤 더합니다." formula={String.raw`\begin{aligned}\rho(x)&=\frac{p(x)}{q(x)}\\ a(x)&=\min(1,\rho(x))\\ d(x)&=(p(x)-q(x))_+\\ Z&=\sum_z d(z)\\ r(x)&=d(x)/Z\quad(Z>0)\\ m(x)&=\min(p(x),q(x))\\ P(x)&=m(x)+d(x)=p(x)\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{\rho(x)}_{\text{기준÷제안}}
&=\frac{\overbrace{p(x)}^{\text{기준 비중}}}{\underbrace{q(x)}_{\text{제안 비중}}}\\
\underbrace{a(x)}_{\text{유지 확률}}
&=\min\!\left(1,\rho(x)\right)\\
\underbrace{d(x)}_{\text{교체 경로}}
&=(p(x)-q(x))_+\\
\underbrace{Z}_{\text{부족분 합}}
&=\sum_z d(z)\\
\underbrace{r(x)}_{\text{교체 분포}}
&=d(x)/Z\quad(Z>0)\\
\underbrace{m(x)}_{\text{수락 경로}}
&=\min(p(x),q(x))\\
\underbrace{P(x)}_{\text{출력 분포}}
&=m(x)+d(x)=p(x)
\end{aligned}`} terms={[{"symbol": "\\rho(x)", "name": "기준 대 제안 비율", "description": "기준 모델 비중 p(x)를 제안 비중 q(x)로 나눈 값입니다."}, {"symbol": "a(x)", "name": "조건부 수락 확률", "description": "제안된 x를 유지할 확률입니다."}, {"symbol": "Z", "name": "전체 거부 비중", "description": "이번 예에서는 .3이며 부족분의 합과 같습니다."}, {"symbol": "r(x)", "name": "거부 뒤 선택 분포", "description": "이번 예에서는 A만 고르는 (1,0)입니다."}, {"symbol": "m(x),d(x)", "name": "수락·교체 경로", "description": "공통 비중과 기준 모델에 부족했던 비중을 따로 셉니다."}]} operations={[{"expression": "\\min(p(x),q(x))", "annotation": ["제안과 수락을 함께 셉니다.", "A .4, B .3입니다."]}, {"expression": "(p(x)-q(x))_+", "annotation": ["부족한 비중만 남깁니다.", "A .3, B 0입니다."]}]} assumptions={["같은 확정된 앞 글(prefix)과 어휘 집합의 정규화된 p·q이며 실제 후보가 q에서 나옵니다.", "Z=0이면 거부 경로가 발생하지 않습니다. 유한 정밀도 구현의 오차는 별도 확인합니다."]} interpretation="거부 뒤 p 전체에서 뽑으면 (.61,.39)가 되어 보존에 실패합니다."/><CitationBlock citeKey={7} source="Leviathan et al. — Algorithm 1 and Appendix A.1" href="https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf">한 위치의 확률 보존을 실제 앞 글마다 적용하는 원문의 전제를 같은 두 후보에 대입합니다.</CitationBlock>
      <ProgressiveDetail title="실제 vLLM 커널은 첫 거부와 교체를 어떻게 처리할까요?" preview="고정한 v0.27.1 코드에서 p·q의 배열 주소, 첫 거부 flag, 양의 부족분 표집을 같은 A·B·B·A에 대입합니다.">
        <div id="source-accept" className="scroll-mt-20"><h3>실제 커널은 첫 거부에서 어떻게 멈출까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">이제 vLLM v0.27.1의 커밋 6e448d0에 담긴 rejection_sampler.py 전체를 읽습니다. 아래 패널은 Triton 함수의 포인터와 분기를 포함한 원문입니다. 포인터가 읽는 값과 첫 거부 뒤의 분기를 작은 사례에 맞춰 보겠습니다.</p><p className="leading-8">774–850행의 rejection_random_sample_kernel은 요청별 구간을 정합니다. 이어서 pos를 앞에서부터 훑습니다. 어휘 수가 2인 이번 예에서 셋째 B는 한 줄로 편 확률 배열의 5번 값을 읽습니다. 주소 계산은 2×2+1=5이고, 이곳의 q=.6과 p=.3을 가져옵니다.</p><p className="leading-8">원문의 조건은 draft_prob&gt;0입니다. 이어서 target_prob/draft_prob&gt;=uniform_prob을 확인합니다. .3/.6&gt;=.8은 거짓이므로 recovered ID 0을 씁니다. rejected가 켜지면 다음 위치의 판정과 쓰기를 건너뜁니다. 보너스도 추가하지 않습니다.</p><p className="leading-8">실제 함수 본문을 CPU의 포인터·tl 대역과 함께 실행하면 출력은 [0,1,0,−1,−1]입니다. 이 값은 원문의 제어 흐름을 작은 사례에 적용한 결과입니다. Triton을 컴파일하거나 GPU 성능을 잰 결과는 아닙니다. 비교 연산의 등호도 원문 그대로 확인했습니다.</p></div><CodeViewButton label="실제 확률 수락·첫 거부 커널" onClick={() => sidebar.open("rejection-test", codeRefs["rejection-test"])}/></div>
        <div id="source-residual" className="scroll-mt-20"><h3>거부된 자리의 교체 토큰은 실제로 어떻게 뽑을까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">원문은 거부 위치를 찾은 뒤에야 전체 분포를 새로 만들지 않습니다. sample_recovered_tokens가 위치마다 교체 후보를 미리 준비합니다. 첫 거부가 나면 그 자리의 ID를 가져옵니다. 실제로 쓰는 교체 토큰은 하나뿐입니다.</p><p className="leading-8">914–943행은 일반 분기에서 max(target_prob−draft_prob,0)을 만듭니다. 이번 입력은 (.3,0)입니다. 원문은 이 값에 난수로 만든 양의 배율을 곱하고 최댓값을 고릅니다. 모든 부족분을 합으로 나누는 배율은 최댓값 순서를 바꾸지 않으므로 생략합니다.</p><p className="leading-8">이 배율은 토큰마다 따로 뽑은 지수분포 난수의 역수입니다. 코드 변수 inv_q의 q는 앞에서 쓴 초안 모델의 확률 q(x)가 아닙니다. 난수 변수의 이름일 뿐이므로 역할이 다른 두 q를 같은 값으로 대입하면 안 됩니다.</p><p className="leading-8">이 예에서는 B의 부족분이 0이고 A만 양수이므로 교체 토큰은 A입니다. 어휘가 더 크면 여러 부족분 사이의 확률까지 코드가 보존하는지 확인해야 합니다. 음수 차이를 그대로 쓰거나 부족분이 가장 큰 토큰만 늘 고르는 규칙과도 다릅니다.</p></div><CodeViewButton label="교체 후보의 난수 준비 원문" onClick={() => sidebar.open("recovered-setup", codeRefs["recovered-setup"])}/><CodeViewButton label="양의 부족분과 실제 선택 원문" onClick={() => sidebar.open("recovered-residual", codeRefs["recovered-residual"])}/></div>
      </ProgressiveDetail>
    </section>

    <section id="state-commit" data-teach-level="6" className="mb-16 scroll-mt-20">
      <span id="verification-pass" className="scroll-mt-20" />
      <span id="kv-commit" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">9. 출력은 일곱 자리지만 유효 KV는 여섯 자리입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">확정된 글의 길이가 4이고 첫 3위치의 KV가 계산되었다고 합시다. 마지막 확정 토큰 하나와 후보 네 개를 이번 순전파(forward)에 넣습니다. 다섯 입력 위치에서 다음 토큰 점수가 나옵니다. 이 점수들은 첫 후보부터 넷째 후보, 그다음 보너스를 차례로 판단합니다. (가정)</p><p className="leading-8">마지막 입력 토큰에서 나온 점수로 첫 후보를 평가한다는 한 칸 이동을 지켜야 합니다. 후보 A의 입력 위치에서 나온 점수는 그다음 토큰의 점수입니다. 이를 A의 확률로 읽으면 한 칸을 잘못 가져옵니다. 확정된 앞 글(prefix) 전체를 매번 다시 계산한다는 뜻도 아닙니다.</p><p className="leading-8">고정한 gpu_model_runner.py 2851–2923행의 _calc_spec_decode_metadata는 이 인덱스를 따로 만듭니다. 한 요청에 입력이 5개라고 합시다. 전체 점수 주소는 logits_indices=[0,1,2,3,4]입니다. 후보 판단 주소는 target_logits_indices=[0,1,2,3]이고 보너스 주소는 [4]입니다.</p><p className="leading-8">같은 함수는 입력 ID 목록에서 target_logits_indices+1을 사용합니다. 이렇게 후보 ID 네 개를 얻고 점수와 후보 사이의 한 칸 차이를 맞춥니다. 여러 요청을 합치면 누적 시작점까지 더해야 합니다. 단일 요청의 인덱스를 그대로 복사하면 안 됩니다.</p></div><CodeViewButton label="후보와 보너스의 실제 인덱스 계산" onClick={() => sidebar.open("metadata", codeRefs["metadata"])}/>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">글 길이 4·계산 완료 길이(computed) 3에서 다섯 위치를 검증합니다. 그러면 KV를 계산한 길이는 잠정적으로 8이 됩니다. 그런데 후보 네 개 중 두 개만 수락했습니다. scheduler.py는 num_accepted=len(generated_token_ids)−1로 수락 수 2를 얻습니다. 이어서 num_rejected=4−2로 거부 수 2를 구합니다.</p><p className="leading-8">계산 완료 길이에서 거부 수를 빼면 8−2=6입니다. 글에는 원래 4자리에 수락 2자리와 교체 토큰 1자리가 붙어 7자리가 됩니다. 새 교체 토큰은 위치 6에 있지만, 그 ID를 입력으로 만든 KV는 아직 없습니다. 다음 계산이 이 위치에서 시작합니다.</p><p className="leading-8">따라서 글 길이 7까지 KV를 모두 확정했다고 설명하면 한 자리를 앞서 갑니다. 원래 후보의 셋째 B가 만든 KV를 새 A의 KV처럼 쓰지 않습니다. 유효 길이를 되돌리는 일과 물리 블록을 즉시 모두 반환하는 일도 서로 다릅니다.</p><p className="leading-8">원문 1772–1784행의 차감 구간을 요청 객체와 함께 실행해 계산 완료 길이 6을 확인했습니다. 다른 회차에서 늦게 온 출력(stale), 아직 값이 없는 비동기 자리(placeholder), 메모리를 비우는 선점에는 추가 분기가 있습니다. 여기서는 늦은 출력과 빈자리가 없는 동기 경로를 고정합니다.</p></div><CodeViewButton label="거부 수만큼 계산 완료 길이를 되돌리는 원문" onClick={() => sidebar.open("rollback", codeRefs["rollback"])}/>
      <ProgressiveDetail title="버퍼 다섯 칸과 실제 출력 길이는 어떻게 구분할까요?" preview="빈 자리 -1, 모두 수락했을 때의 보너스, 종료 토큰과 최대 길이 절단을 실제 parse 함수와 연결합니다.">
        <div id="acceptance-length" className="scroll-mt-20"><h3>버퍼 길이와 사용자에게 보낸 길이는 왜 다를까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">K=4의 출력 버퍼는 다섯 칸입니다. 앞 예의 실제 값은 [0,1,0,−1,−1]이며 −1은 빈 자리 표시입니다. parse_output은 이 표시를 걸러 [0,1,0]을 돌려줍니다. 버퍼의 다섯 칸을 확정 토큰 다섯 개로 세면 안 됩니다.</p><p className="leading-8">후보 네 개가 전부 수락되고 보너스가 B라면 [A,B,B,A,B]가 됩니다. 수락 수 A=4, 검증 출력 수 Y=5입니다. 첫 거부가 나면 앞에서 수락한 수에 교체 토큰 하나를 더합니다. 따라서 두 경로 모두 종료 처리 전에는 Y=A+1입니다.</p><p className="leading-8">그 뒤 종료 토큰이나 최대 출력 길이에 맞춰 자르면 사용자에게 실제로 보낸 수는 더 작습니다. 예를 들어 B가 종료 토큰이고 둘째 위치에서 멈춘다면 다섯 개짜리 검증 결과를 모두 내보내지 않습니다. 지표가 어느 처리 뒤의 길이를 세는지 확인해야 합니다.</p></div><CodeViewButton label="첫 거부 뒤의 쓰기와 보너스 조건" onClick={() => sidebar.open("prefix-stop", codeRefs["prefix-stop"])}/><CodeViewButton label="빈 출력 칸을 거르는 실제 함수" onClick={() => sidebar.open("parse-output", codeRefs["parse-output"])}/></div>
      </ProgressiveDetail>
    </section>

    <section id="acceptance-tail" data-teach-level="6" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10. 평균 확정 수는 첫 거부가 어디서 나는지를 모두 더한 값입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">수락 길이가 0·2·4인 세 바퀴를 관찰했다고 합시다. 첫 후보까지 수락한 비율은 2/3이고 둘째까지도 2/3입니다. 셋째와 넷째까지는 각각 1/3입니다. 이 네 비율을 더하면 평균 수락 길이 2가 됩니다. (가정)</p><p className="leading-8">이 계산은 각 위치의 사건이 독립이라고 가정하지 않아도 성립합니다. 매 바퀴에서 길이가 2라면 첫 두 위치의 표시가 1이고 뒤는 0입니다. 표시를 먼저 더하든 바퀴별 길이를 먼저 평균하든 같은 전체 합을 세기 때문입니다.</p><p className="leading-8">K=2에서 두 위치의 수락 사건이 각각 절반이라도 둘이 항상 함께 일어나면 두 위치까지의 확률은 .5입니다. 독립이면 .25입니다. 확정 길이의 평균은 각각 2와 1.75로 달라집니다. 개별 평균 하나만 보고 연속 수락의 꼬리까지 정할 수 없습니다.</p></div><ExplainedFormula question="독립 가정 없이 평균 수락 길이를 어떻게 셀까요?" idea="i번째까지 전부 수락되었는지를 각 바퀴에서 표시한 뒤 합합니다." formula={String.raw`\begin{aligned}I_i&=\mathbf1\{A\ge i\}\\ A&=\sum_{i=1}^{K}I_i\\ \mathbb E[Y]&=1+\sum_{i=1}^{K}\Pr(A\ge i)\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{I_i}_{\text{i번째까지 수락}}
&=\mathbf1\{A\ge i\}\\
\underbrace{A}_{\text{연속 수락 후보 수}}
&=\sum_{i=1}^{K}I_i\\
\underbrace{\mathbb E[Y]}_{\text{평균 확정 수}}
&=\underbrace{1}_{\text{교체·보너스}}\\
&\quad+\underbrace{\sum_{i=1}^{K}\Pr(A\ge i)}_{\text{평균 수락 후보 수}}
\end{aligned}`} terms={[{"symbol": "A", "name": "수락 후보 길이", "description": "첫 거부 전까지의 연속 길이입니다."}, {"symbol": "I_i", "name": "연속 수락 표시", "description": "i번째까지 모두 수락되면 1입니다."}, {"symbol": "Y", "name": "검증 출력 길이", "description": "종료 처리 전 교체 토큰이나 보너스 하나를 포함합니다."}]} operations={[{"expression": "\\Pr(A\\ge i)", "annotation": ["세 바퀴 예의 비율은", "2/3,2/3,1/3,1/3입니다."]}, {"expression": "1+\\sum_i\\Pr(A\\ge i)", "annotation": ["비율 합 2에 교체 또는 보너스 1을 더해", "평균 출력 3을 얻습니다."]}]} assumptions={["첫 거부에서 멈추는 길이 K의 한 줄 후보이며 종료 길이로 잘리기 전입니다.", "독립 가정 없이 성립하지만 후보 트리·묶음 검증은 지표를 따로 정의해야 합니다."]} interpretation="평균 수락은 2, 평균 검증 출력은 3입니다. 두 지표의 이름을 섞지 않습니다."/>
      <ProgressiveDetail title="모든 위치의 수락률이 같다고 두면 왜 등비 합이 될까요?" preview="독립·동일 수락률 α를 가정해 K=4의 평균 2.7731과 α=0·1 경계를 계산합니다.">
        <div id="cost-model" className="scroll-mt-20"><h3>독립·동일 수락률을 가정하면 등비 합은 어떻게 나오나요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">이제 모든 위치의 수락을 서로 독립이고 같은 확률 α라고 두는 별도 비용 모형을 씁니다. 한 위치의 두 분포가 고정되어 있다면 α=Σmin(p,q)이며 앞의 예에서는 .7입니다. 실제 요청마다 이 값이 같다는 주장은 아닙니다.</p><p className="leading-8">원 논문의 거리 D_LK는 1−Σmin(p,q)이며 정규화된 분포에서는 ½Σ|p−q|와 같습니다. 이번에는 ½(.3+.3)=.3이어서 α=1−.3=.7입니다. 이 한 위치의 일치 비중을 모든 위치에 같은 값으로 적용하는 것은 추가 가정입니다.</p><p className="leading-8">
            K=4에서 기대 확정 길이는 1+.7+.49+.343+.2401=2.7731입니다. α=1이면 다섯 위치가 항상 확정되어 5이고 α=0이면 교체 토큰 하나뿐이라
            1입니다. α=1을 분모 1−α인 닫힌 식에 그대로 넣지 않습니다.
          </p><p className="leading-8">같은 모형의 α=.8, K=3 사례는 2.952이고 K=8은 약 4.328911입니다. α&lt;1을 고정한 무한 합의 상한은 1/(1−α)이지만 실제 검증 비용은 K와 함께 달라집니다. 큰 기대 길이만으로 가장 빠른 K가 정해지지는 않습니다.</p></div><span id="speculation-length" className="scroll-mt-20" /><span id="acceptance-rate" className="scroll-mt-20" /><ExplainedFormula question="같은 α를 독립적으로 반복하면 얼마나 확정하나요?" idea="i번째까지 이어질 확률 α의 i제곱을 K까지 더합니다." formula={String.raw`\begin{aligned}\alpha&=\sum_x\min(p(x),q(x))\\ \mathbb E[Y_K]&=\sum_{i=0}^{K}\alpha^i\\ 0\le\alpha<1&:\ \mathbb E[Y_K]=\frac{1-\alpha^{K+1}}{1-\alpha}\\ \alpha=1&:\ \mathbb E[Y_K]=K+1\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{\alpha}_{\text{공통 비중}}
&=\sum_x\min(p(x),q(x))\\
\underbrace{\mathbb E[Y_K]}_{\text{평균 확정 수}}
&=\sum_{i=0}^{K}\underbrace{\alpha^i}_{\text{i까지 모두 수락}}\\
\alpha<1&:\quad
\mathbb E[Y_K]=\dfrac{1-\alpha^{K+1}}{1-\alpha}\\
\alpha=1&:\quad \mathbb E[Y_K]=K+1
\end{aligned}`} terms={[{"symbol": "\\alpha", "name": "모형의 수락 확률", "description": "여기서는 .7을 모든 위치에 독립적으로 가정합니다."}, {"symbol": "K", "name": "후보 깊이", "description": "한 바퀴에 확인할 후보 수로 이번에는 4입니다."}]} operations={[{"expression": "\\alpha^i", "annotation": ["i번째까지 앞 후보가 모두 살아남을 확률입니다.", "i=2이면 .49입니다."]}, {"expression": "\\sum_{i=0}^K\\alpha^i", "annotation": ["교체 토큰 또는 보너스 1을 포함해", "1+.7+.49+.343+.2401을 더합니다."]}]} assumptions={["위치별 수락 확률이 독립·동일한 단순화이며 종료 길이 잘림을 제외합니다.", "현실에서는 앞 글별 분포·연속 수락 비율·실제 출력 길이를 측정합니다."]} interpretation="같은 K=4에서 E[Y]=2.7731이며 이는 한 번의 실행에서 반드시 나오는 정수 길이가 아닙니다."/></div>
      </ProgressiveDetail>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">다음 절은 위치마다 수락 확률이 .7로 같고 서로 독립이라는 단순 가정을 씁니다. 이때 K=4의 평균 확정 수는 1+.7+.49+.343+.2401=2.7731입니다. 이 가정값과 실제 한 회차 시간을 비교해 속도를 판단합니다.</p>
      </div>
    </section>

    <section id="serving-break-even" data-teach-level="6" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">11. 평균 2.7731개를 확정해도 한 회차가 33ms면 느립니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">같은 요청 조건에서 기준 모델만으로 토큰 하나를 만드는 시간을 10ms라고 둡니다. 후보 네 개를 만드는 데 2ms, 검증에 12ms, 나머지 처리에 1ms가 든다면 한 회차는 15ms입니다. 앞의 α=.7 모형에서 평균 2.7731개를 기준 모델만으로 만들면 27.731ms가 걸립니다. (가정)</p><p className="leading-8">시간 비는 27.731/15≈1.848733입니다. 검증 시간만 30ms로 커지면 전체는 33ms이고 비는 약 .840333으로 떨어집니다. 수락 확률이 같아도 실제로 빨라지는지는 달라집니다.</p><p className="leading-8">회차마다 시간과 확정 수가 흔들리면 전체 시간의 합과 전체 확정 수를 비교합니다. 충분히 길고 안정적인 측정에서 평균 회차 시간 E[T_C]와 평균 확정 길이 E[Y]로 비율을 구합니다. 회차마다 계산한 속도비 E[Y/T_C]를 그대로 평균한 값과는 다를 수 있습니다.</p><p className="leading-8">아래 식은 차례로 실행해 잰 세 시간을 더합니다. 초안 모델과 기준 모델을 겹쳐 실행한다면 단순 합 대신 실제로 작업 완료를 막는 경로의 시간을 써야 합니다. 대기열·다른 요청과의 자원 경쟁·긴 꼬리 지연도 이 한 요청의 평균 비율만으로는 알 수 없습니다.</p></div><ExplainedFormula question="후보를 만든 비용까지 포함해도 이득일까요?" idea="같은 확정 수를 단독으로 만들 기준 시간과 실제 한 회차 시간을 비교합니다." formula={String.raw`\begin{aligned}T_C&=T_D+T_V+T_R\\ S&\approx\frac{\mathbb E[Y]\,t_T}{\mathbb E[T_C]}\\ \mathrm{benefit}&\Longleftrightarrow\mathbb E[Y]\,t_T>\mathbb E[T_C]\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{T_C}_{\text{한 회차 시간}}
&=\underbrace{T_D}_{\text{후보 준비}}+\underbrace{T_V}_{\text{큰 모델 검증}}\\
&\quad+\underbrace{T_R}_{\text{기록 정리}}\\
\underbrace{S}_{\text{시간 개선}}
&\approx\frac{\overbrace{\mathbb E[Y]t_T}^{\text{기준 시간}}}{\underbrace{\mathbb E[T_C]}_{\text{회차 시간}}}\\
\underbrace{S>1}_{\text{속도 이득}}
&\Longleftrightarrow\mathbb E[Y]t_T>\mathbb E[T_C]
\end{aligned}`} terms={[{"symbol": "T_D,T_V,T_R", "name": "직렬 경로의 시간", "description": "후보 준비·검증·그 밖의 처리 시간입니다."}, {"symbol": "t_T", "name": "단독 기준 시간", "description": "같은 조건에서 기준 모델이 토큰 하나를 만드는 시간이며 가정값은 10ms입니다."}, {"symbol": "S", "name": "시간 개선 비", "description": "1보다 크면 이 가정에서 같은 출력량을 더 빨리 만듭니다."}]} operations={[{"expression": "2+12+1", "annotation": ["후보·검증·나머지 처리를 더해", "15ms를 얻습니다."]}, {"expression": "2.7731\\times10/15", "annotation": ["같은 평균 출력의 기준 27.731ms를", "15ms로 나눕니다."]}]} assumptions={["같은 모델·표집기·부하·장치·출력 조건을 비교하고 직렬 비용을 겹치지 않게 셉니다.", "긴 안정 구간의 평균 근사이며 한 회차의 확정 수나 실제 서비스 처리량을 보장하지 않습니다."]} interpretation="곱셈은 E[Y]×t_T입니다. 검증이 30ms가 되면 비는 .840333으로 손해입니다."/>
      <ProgressiveDetail title="원 논문의 α·c 비용 모형은 어디까지 쓸 수 있을까요?" preview="검증 비용을 1로 고정한 모형의 α&gt;c 조건, K=1~8 탐색표와 실제 임계 경로의 차이를 확인합니다.">
        <div id="speedup-model" className="scroll-mt-20"><h3>원 논문의 단순 비용 모형에서 α와 c는 무엇을 뜻할까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">Leviathan 등의 단순 모형은 기준 모델만 쓸 때의 시간을 1로 둡니다. 후보 검증도 같은 시간 1에 끝난다고 가정합니다. 초안 모델이 후보 한 단계를 만드는 시간 비가 c이면, 후보 K개의 비용은 Kc입니다. 스케줄러·동기화 같은 나머지 비용은 이 식에서 0입니다.</p><p className="leading-8">α=.8, c=.05, K=5의 예는 기대 길이 3.68928을 1.25로 나눠 2.951424입니다. c=.5이면 분모 3.5로 약 1.05408입니다. 같은 α와 K에서도 후보의 실제 시간 비가 결과를 바꿉니다.</p><p className="leading-8">
            K=1의 비 (1+α)/(1+c)가 1보다 클 조건은 α&gt;c입니다. 이 모형 안에서는 이득을 얻는 어떤 K가 존재할 조건입니다. 모든 고정 K의 이득을 보장하지 않습니다.
            α=c이면 K=1은 같고 α≤c이면 Σαⁱ≤Kα≤Kc로 어떤 양의 K도 1을 넘지 못합니다.
          </p><p className="leading-8">c=.05를 두고 K를 1~8만 훑으면 α=.6의 최댓값이 K=4, α=.9는 K=8에서 가장 큽니다. 뒤쪽 경우는 탐색한 범위의 최댓값이며 전체 정수 K의 최적이라는 뜻이 아닙니다. 실제로 허용하는 깊이·메모리·시간까지 후보 범위를 고정해야 합니다.</p></div><ExplainedFormula question="α>c가 정확히 무엇을 보장하나요?" idea="검증을 1로 고정한 비용 모형에 K=1을 대입하고 더 긴 후보의 상한을 비교합니다." formula={String.raw`\begin{aligned}c&=t_D/t_T\\N(K)&=\sum_{i=0}^{K}\alpha^i\\C(K)&=1+Kc\\S(K)&=N(K)/C(K)\\S(1)>1&\iff\alpha>c\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{c}_{\text{후보 시간 비}}
&=t_D/t_T\\
\underbrace{N(K)}_{\text{평균 확정 수}}
&=\sum_{i=0}^{K}\alpha^i\\
\underbrace{C(K)}_{\text{전체 비용}}
&=\underbrace{1}_{\text{검증}}+\underbrace{Kc}_{\text{후보 준비}}\\
\underbrace{S(K)}_{\text{시간 개선 비}}
&=N(K)/C(K)\\
\underbrace{S(1)>1}_{\text{한 후보부터 이득}}
&\iff\frac{1+\alpha}{1+c}>1\\
&\iff\underbrace{\alpha>c}_{\text{수락 비중}>\text{후보 비용}}
\end{aligned}`} terms={[{"symbol": "c", "name": "후보 한 단계의 시간 비", "description": "모델 크기의 비가 아니라 같은 조건에서 실제로 잰 시간의 비입니다."}, {"symbol": "N(K)", "name": "평균 확정 수", "description": "교체 또는 보너스 한 자리와 연속 수락 후보를 합친 값입니다."}, {"symbol": "C(K)", "name": "가정한 전체 비용", "description": "검증 1회와 초안 모델의 후보 준비 K회를 더한 값입니다."}, {"symbol": "S(K)", "name": "시간 개선 비", "description": "평균 확정 수를 전체 비용으로 나눈 값입니다."}]} operations={[{"expression": "3.68928/(1+5\\times.05)", "annotation": ["기존 α=.8,K=5의 기대 길이를", "비용 1.25로 나눠 2.951424를 얻습니다."]}, {"expression": "\\sum_{i=1}^{K}\\alpha^i\\le K\\alpha", "annotation": ["α≤c이면 분자의 추가 이득이", "추가 비용 Kc를 넘지 못합니다."]}]} assumptions={["위치마다 수락 확률 α가 독립·동일하고, 후보 한 단계의 비용은 일정하며, 검증 비용은 1이고 나머지 비용은 0인 모형입니다.", "생성이 충분히 길어서 마지막 회차가 잘리는 효과를 무시합니다."]} interpretation="검증 시간이 커지거나 다른 비용이 생기면 이 식의 조건도 다시 계산합니다."/><CitationBlock citeKey={16} source="Leviathan et al. — §3.3, Theorem 3.8 and Corollary 3.9" href="https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf">원문의 시간 비용 가정을 유지해 같은 숫자로 식과 적용할 수 없는 경우를 확인합니다.</CitationBlock><SpeedupTable/></div>
      </ProgressiveDetail>
      <ProgressiveDetail title="왜 가중치 읽기 장부만으로 실제 속도를 결론내릴 수 없을까요?" preview="배치 크기, 추가 위치 계산, KV·통신, 전력·FLOP·시간의 서로 다른 측정량을 구분합니다.">
        <div id="weight-traffic" className="scroll-mt-20"><h3>가중치 읽기를 나눠 부담한다는 말은 실제 시간과 어떻게 다를까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">검증 한 번에 기준 모델의 가중치 40MiB를 읽는다고 따로 가정합시다. 평균 확정 수는 2.7731입니다. 그러면 토큰 하나가 부담하는 읽기량은 40/2.7731≈14.4243MiB입니다. 원래 토큰 하나마다 40MiB를 읽는 조건과 비교할 수 있습니다. (가정)</p><p className="leading-8">이 계산은 메모리 대역폭 자체가 커졌다는 뜻이 아닙니다. 같은 가중치 읽기를 여러 출력이 나눠 부담한 것입니다. 후보 모델의 가중치, 중간값(activation)·KV 읽기, 검증의 추가 계산은 여기에 들어 있지 않습니다.</p><p className="leading-8">큰 배치는 이미 여러 요청이 가중치 읽기를 나눠 씁니다. 이때 K를 늘리면 검증 위치와 중간 상태도 늘어납니다. 그러면 계산·KV·통신 비용이 눈에 띌 수 있습니다. 실제 시간이 K+1에 반드시 비례하지는 않습니다. 작은 배치에서 검증 비용이 언제나 1인 것도 아닙니다.</p><p className="leading-8">
            연산량도 비교 기준을 적어야 합니다. 단순한 밀집(dense) 모형에서는 추가 후보와 버린 위치의 검증이 비용을 늘립니다. 다만 받아들인 위치를 기준 모델로 계산하는 일은 원래 생성에도 필요합니다.
            전력·총 FLOP·시간·처리량 중 어떤 양인지 구분해 측정합니다.
          </p></div><span id="not-always-faster" className="scroll-mt-20" /><p className="leading-8">기록 한 자리의 크기를 정하는 원리는 <Link to="/cs/ai/kv-cache-fundamentals">KV cache의 구조</Link>에서 이어집니다. 검증 비용을 읽기와 연산으로 나누는 계산은 <Link to="/cs/ai/prefill-decode-phase-dynamics">입력 처리와 생성의 비용</Link>에서 더 자세히 다룹니다.</p></div>
      </ProgressiveDetail>
      <ProgressiveDetail title="원 논문이 보고한 속도는 어떤 조건에서 나왔을까요?" preview="T5·TPU·배치 크기·K 조건을 이 글의 설명용 15ms 사례와 분리해 읽습니다.">
        <div id="paper-measurements" className="scroll-mt-20"><h3>논문이 보고한 속도는 어떤 장치와 조건에서 나왔을까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">Leviathan 등의 부록 Table 4는 ENDE 과제와 T5-small 제안 모델을 평가합니다. 한 행은 temperature 0, 깊이 7, α=.75, c=.02 조건입니다. 이 행에서 예상 3.2배와 실험 3.4배의 개선을 보고합니다. 앞의 .7·K=4·15ms는 이 실험값이 아니라 계산용 가정입니다.</p><p className="leading-8">Chen 등은 Chinchilla 70B와 4B 초안 모델을 TPU v4 16개에서 평가했습니다. XSum·HumanEval의 배치 크기 1, K=4 조건입니다. 생성 시간이 약 2~2.5배 개선됐다고 보고했습니다. 이때 후보 점수의 병렬 계산 시간은 토큰 하나를 생성할 때와 비슷했습니다. 따라서 이 장치·부하 조건을 함께 봐야 합니다.</p><p className="leading-8">분포가 같다는 알고리즘의 성질과 같은 난수 시드(seed)에서 매번 같은 문자열이 나온다는 성질도 다릅니다. 난수를 쓰는 순서와 부동소수점 계산 경로가 달라질 수 있습니다. 기준 모델만 실행할 때와 같은 표집기·정밀도 조건을 고정해야 합니다. 그 뒤 분포·과제 결과·실패 양상을 비교합니다.</p></div><CitationBlock citeKey={18} source="Chen et al. — speculative sampling §4 and §6" href="https://arxiv.org/html/2302.01318v1">원문의 기준 모델(target) 기호는 q, 초안 모델(draft) 기호는 p로 이 글과 반대입니다. 기호 이름보다 각 분포의 역할을 맞추어 읽습니다.</CitationBlock></div>
      </ProgressiveDetail>
    </section>

    <section id="boundary" data-teach-level="7" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">12. 후보 방식보다 먼저 분포·상태·전체 시간을 확인합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            이번 확률 사례는 초안 모델의 분포 q를 함께 주는 표준 무작위(standard random) 경로입니다. 고정한 설정의 기본 draft_sample_method는 가장 점수가 높은 토큰을 고르는 greedy입니다.
            이 결정적 제안은 실제로 뽑는 분포를 한 토큰만 1인 원핫(one-hot) 분포로 취급합니다. 모델의 softmax 확신도를 그대로 q로 넣는 것과 다릅니다.
          </p><p className="leading-8">p=(.7,.3)인 기준 모델에 A만 제안한다면 q=(1,0)입니다. A를 .7 확률로 수락하고 나머지 .3은 B로 바꾸면 같은 p를 얻습니다. 기준 모델도 greedy이면 점수가 가장 높은 ID와 후보 ID가 같은지 확인합니다.</p><p className="leading-8">고정한 원문은 temperature·top-k/top-p를 적용합니다. 로짓 처리기(logits processor)도 거친 기준 모델의 확률을 사용합니다. 클래스 맨 위의 오래된 주석만 보고 모든 제약을 지원하지 않는다고 결론내리면 안 됩니다. 실제 마스크와 초안 분포가 만들어지는 조건을 호출 경로에서 대조합니다.</p><p className="leading-8">수학에서 요구하는 정규화·같은 앞 글 전제와 유한 정밀도 구현도 구별합니다. q=0 방어, 패딩 ID, 정밀도 변경, 상태 되돌리기와 종료 처리를 확인합니다. 이어서 기준 모델만 쓴 결과와 비교합니다. 작은 난수 한 세트만으로 모든 입력에서 분포가 보존된다고 증명할 수는 없습니다.</p><p className="leading-8">이 글은 특정 버전으로 고정한 전체 원문을 확인했습니다. 선택한 함수의 CPU 대역 실행과 유리수 산술도 확인했습니다. GPU 커널을 컴파일하거나 실제 서버 처리량을 재지는 않았습니다. 실제 성능을 비교할 때는 모델과 버전(revision), 표집기, 후보 깊이, 부하를 고정합니다. 첫 토큰 지연(TTFT)·토큰 사이 지연(ITL)과 자원 사용량도 함께 기록합니다.</p></div><CodeViewButton label="표준 경로·초안 모델의 기본 설정" onClick={() => sidebar.open("sampling-config", codeRefs["sampling-config"])}/><CodeViewButton label="실제 표집 제약 적용" onClick={() => sidebar.open("sampling-constraints", codeRefs["sampling-constraints"])}/>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">후보 방식이 여러 갈래로 나뉜 이유는 후보 준비 시간을 줄이면서 더 많은 후보를 맞히기 위해서입니다. 작은 모델·중간 표현·여러 미래 예측·문자열 검색은 이 두 값을 서로 다르게 바꿉니다. 따라서 이름으로 고르지 말고, 같은 부하에서 후보 비용·연속 수락 길이·검증 시간·KV 사용량을 비교해야 합니다. 어떤 방식을 써도 기준 모델의 분포 보존과 첫 거부 뒤 기록 정리는 그대로 남습니다.</p>
      </div>
      <ProgressiveDetail title="EAGLE과 여러 미래 예측 부품은 왜 별도 후보 방식일까요?" preview="후보의 입력과 학습 구조는 달라도 기준 모델의 검증과 상태 갱신은 남는다는 공통 경계를 확인합니다.">
        <div id="paper-eagle" className="scroll-mt-20"><h3>EAGLE은 후보를 만들 때 무엇을 더 사용하나요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">별도 작은 모델은 확정된 토큰 열을 읽고 후보 분포를 만듭니다. EAGLE은 기준 모델의 중간 표현(feature)과 토큰 정보를 함께 받습니다. 그런 다음 다음 중간 표현을 예측합니다. 같은 기준 모델로 검증하더라도 후보의 입력과 학습된 가중치는 다릅니다.</p><p className="leading-8">EAGLE에서 불확실성은 다음 토큰을 고를 때 생깁니다. 같은 중간 표현 뒤에서 A를 뽑느냐 B를 뽑느냐에 따라 다음 중간 표현도 달라집니다. 이미 고른 다음 토큰을 한 시점 앞선 입력에 함께 넣어 어느 갈래를 예측할지 알려 줍니다.</p><p className="leading-8">따라서 토큰을 정한 뒤에도 똑같은 앞 글에서 중간 표현이 마음대로 여러 개 생긴다는 설명은 맞지 않습니다. 학습된 제안기의 예측 오차와 다음 토큰 선택의 불확실성을 구분해야 합니다. 호환되는 학습 가중치(checkpoint) 없이 아무 기준 모델에나 붙일 수도 없습니다.</p><p className="leading-8">EAGLE이 이 글의 A·B·B·A를 제안해도 뒤의 검증·상태 갱신 규칙은 필요합니다. 다만 트리 제안과 EAGLE 세대별 중간 표현 구성은 K=4의 한 줄 사례와 다릅니다. 그 구조는 연결한 변형 글에서 따로 비교합니다.</p></div><CitationBlock citeKey={19} source="EAGLE v3 — §3 and Figure 3" href="https://arxiv.org/html/2401.15077v3">같은 현재 중간 표현에 서로 다른 다음 토큰이 이어지는 경우를 두 후보 A·B에 대응합니다.</CitationBlock><p className="leading-8">후보를 만드는 부품이나 트리 구조가 달라지는 경우는 <Link to="/cs/ai/speculative-decoding-variants">추측 디코딩 변형 비교</Link>로 이어집니다. 같은 이름 아래에 있는 학습 구조와 실행 정책을 구분해 읽습니다.</p></div>
        <div id="paper-mtp" className="scroll-mt-20"><h3>여러 미래를 학습한 부품도 왜 검증을 거칠까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">다중 토큰 예측(Multi-token prediction) 원 논문은 몸통(trunk)을 공유합니다. 여러 출력 머리(output head)는 각각 더 먼 미래 토큰을 예측하도록 학습합니다. 표현 학습의 효과와 예측 결과를 실제 생성에 쓴 효과는 나눠서 평가해야 합니다.</p><p className="leading-8">
            이런 모듈을 제안기로 쓰는 내장형(native) MTP에서도 후보 네 개가 저절로 확정되지는 않습니다. 실제 모델의 모듈 구조와 학습 가중치를 확인하고,
            첫 거부가 난 뒤에는 출력과 계산 기록을 정리해야 합니다.
          </p><p className="leading-8">고정한 SpeculativeConfig는 여러 MTP 구조를 서로 다른 이름으로 구분합니다. 원 논문의 병렬 출력 머리가 모든 내장형 MTP 모델의 실제 구조는 아닙니다. 모델에 따라 모듈을 차례로 연결하거나 중간 표현을 공유하는 방법도 살펴봐야 합니다.</p><p className="leading-8">SpecInfer처럼 후보를 트리로 묶으면 여러 갈래의 점수·임시 KV·경로 선택이 생깁니다. 이는 한 줄 후보의 깊이만 정하는 경우와 다릅니다. N-gram·suffix처럼 모델 없이 반복 문자열을 찾는 제안도 있습니다. 후보 출처가 달라지면 제안 분포와 검증 알고리즘을 함께 확인해야 합니다.</p></div><span id="eagle-mtp" className="scroll-mt-20" /><span id="native-mtp" className="scroll-mt-20" /><span id="paper-specinfer" className="scroll-mt-20" /><CitationBlock citeKey={20} source="Gloeckle et al. — Multi-token Prediction" href="https://arxiv.org/abs/2404.19737v1">몸통을 공유하고 미래 위치마다 출력 머리를 둔 원 논문의 학습 구조를 모든 내장형 서빙 구현에 그대로 적용하지 않습니다.</CitationBlock><CitationBlock citeKey={20} source="SpecInfer v4 — tree-based inference and verification" href="https://arxiv.org/html/2305.09781v4">후보 트리의 폭과 경로 검증은 위 한 줄 후보의 K와 같은 양이 아닙니다.</CitationBlock><p className="leading-8">장치와 모델을 고정한 적용 사례는 <Link to="/cs/ai/sionic-glm-b300#mtp">GLM·B300의 MTP 적용</Link>에서 확인합니다. 그 사례의 수락률과 처리량은 해당 설정에서 잰 값입니다. 이를 위 가정식의 보편적 성능으로 바꾸어 읽으면 안 됩니다.</p></div>
      </ProgressiveDetail>
      <ProgressiveDetail title="vLLM의 동적 깊이는 실제로 무엇을 조회할까요?" preview="현재 배치 크기로 사용자 설정표를 읽는 구현과 수락률을 학습하는 정책을 구분합니다.">
        <div id="dynamic-policy" className="scroll-mt-20"><h3>vLLM의 동적 깊이는 무엇을 보고 후보 수를 바꿀까요?</h3><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">K를 상황에 따라 바꾸는 정책도 실제 입력을 확인해야 합니다. 고정한 scheduler.py 1192–1198행은 이번에 배정한 요청 수를 봅니다. 이 수로 dynamic_sd_lookup을 조회합니다. 최근 수락률을 배워 최적 K를 계산하는 분기는 아닙니다.</p><p className="leading-8">공식 예제에는 [1,64,3], [65,128,1], [129,512,0]이 있습니다. 배치 크기 64에서는 K=3, 65에서는 K=1, 129에서는 K=0을 고릅니다. 사용자가 넣는 정책의 예일 뿐, 모든 배포에서 통하는 최적 경계는 아닙니다.</p><p className="leading-8">고정한 dynamic/utils.py는 구간을 조회표로 펼칩니다. 비어 있는 구간과 마지막 이후는 직전 K로 채웁니다. 전체 허용 깊이와 비교해 더 작은 값을 고르는 조건도 있습니다. [1,2,4], [4,6,1]에서 허용 깊이가 3이면 배치 3은 3을, 배치 7은 1을 받습니다. (가정)</p><p className="leading-8">후보를 껐을 때의 시간과 실제 확정 길이를 같은 부하에서 비교해야 합니다. 대기 시간과 KV 사용량도 함께 봐야 정책을 고를 수 있습니다. 변수 이름이 optimal_K라는 사실만으로 최적성이 증명되지는 않습니다. 모델 실행기(runner)와 병렬 구성의 지원 조건도 고정 버전에서 확인합니다.</p><p className="leading-8">검증 방식도 따로 정합니다. 합성(synthetic) 방식은 수락 비율을 인위적으로 넣습니다. 블록(block) 방식은 후보 묶음을 함께 검증합니다. 둘 다 위 확률 비율의 순차 판정과 다릅니다. 깊이가 같다고 해서 같은 검증 알고리즘을 쓰는 것은 아닙니다.</p></div><CodeViewButton label="현재 배치 크기의 실제 K 조회" onClick={() => sidebar.open("dynamic-policy", codeRefs["dynamic-policy"])}/><CodeViewButton label="비어 있는 범위와 최대 깊이의 처리" onClick={() => sidebar.open("dynamic-table", codeRefs["dynamic-table"])}/></div>
      </ProgressiveDetail>
    </section>

    <section id="prediction-questions" data-teach-level="review" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">13. 결론에서 생긴 세 질문에 답해 보세요</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">거부된 30%에서 부족분 대신 기준 모델의 70%·30%로 다시 뽑았다고 합시다. 최종 A·B 비중은 왜 70%·30%가 아닐까요? (답: 8절)</p><p className="leading-8">글 길이 4·계산 완료 길이 3에서 후보 네 개를 검증했습니다. 두 개만 수락하고 교체 토큰 하나를 냈습니다. 왜 글은 7자리인데 유효 KV는 6자리일까요? (답: 9절)</p><p className="leading-8">평균 확정 수 2.7731과 기준 모델 단독 시간은 10ms로 같습니다. 검증이 12ms에서 30ms로 늘면 왜 이득이 사라질까요? (답: 11절)</p></div>
    </section>

    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ vllm: vllmSpecDecodeTree }}
      projectMetas={{ vllm: { id: "vllm", label: "vLLM v0.27.1 고정 원문", badgeClass: "bg-primary/10 border-primary text-primary" } }}
    />
  </>;
}
