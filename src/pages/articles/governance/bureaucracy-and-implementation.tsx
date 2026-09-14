import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ImplementationChainViz from "./bureaucracy-and-implementation/viz/ImplementationChainViz";
import MeasurementDistortionViz from "./bureaucracy-and-implementation/viz/MeasurementDistortionViz";

/**
 * 결정된 것과 실제로 일어나는 것은 다릅니다
 *
 * 앞 일곱 글이 전부 "결정이 어떻게 만들어지는가"였으니, 결정에서 결과까지의
 * 나머지 사슬을 받는다. 위임의 불가피성에서 출발해 정보 비대칭·규칙과 재량·
 * 측정 왜곡·통제 장치까지 가고, 국가 사이의 문제는 다음 글이 소유한다.
 */
export default function BureaucracyAndImplementationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          표결이 끝난 자리에서 다시 긴 사슬이 시작됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기까지 일곱 글은 전부 하나의 질문을 다뤘습니다. 여럿의 뜻이 어떻게
            하나의 결정이 되는가입니다. 집합적 결정에서 출발해 강제력, 헌법,
            정부 형태, 선거, 집계의 한계, 그리고 그 앞에서 선택지를 줄이는
            장치까지 왔습니다.
          </p>

          <p className="leading-7">
            그런데 결정문이 곧 현실은 아닙니다. 법률에 적힌 것은 일반적인
            문장이고 현실은 개별 사안이라, 둘 사이를 잇는 일이 따로 남습니다.
            그 일을 하는 조직이 있고, 그 조직을 거치는 동안 결정된 것이 조금씩
            달라집니다.
          </p>

          <p className="leading-7">
            이 달라짐을 누군가의 태만이나 부패로 읽는 설명이 흔합니다. 그런데
            아무도 잘못하지 않아도 같은 차이가 남습니다. 어디서 생기는지를 보면
            그 이유가 보입니다.
          </p>
        </div>

        <ImplementationChainViz />

        <ContentBoundary article="bureaucracy-and-implementation" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              결정을 집행하려면 맡겨야 하는데, 맡기고 나면 왜 결정한 대로
              되지 않고 그 간극을 어디까지 줄일 수 있는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 맡길 수밖에 없는 이유, 맡기는 순간 갈라지는 정보, 규칙과
            재량 사이의 맞바꿈, 무엇을 재는지가 무엇을 하는지를 정한다는 문제,
            그리고 통제 장치들이 각각 무엇을 값으로 치르는지입니다.
          </p>

          <p className="leading-7">
            여기까지가 한 국가 안의 이야기입니다. 국가들 사이에는 이 사슬의
            맨 위에 있던 강제력 자체가 없고, 그러면 앞의 모든 구조가 다시
            쓰여야 합니다. 그 문제는 다음 글{" "}
            <Link to="/politics/governance/international-anarchy">
              국제 무정부
            </Link>
            가 맡습니다.
          </p>
        </div>
      </section>

      <section id="why-delegate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 맡기는 것은 고르는 일이 아니라 피할 수 없는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            의회가 모든 것을 직접 정하면 되지 않느냐는 생각이 자연스럽습니다.
            그런데 그것이 불가능한 이유가 셋 있고, 셋 다 의지의 문제가
            아닙니다.
          </p>

          <p className="leading-7">
            첫째는 양입니다. 하나의 법률이 적용되는 개별 사안은 수만 건에서
            수백만 건에 이릅니다. 결정하는 자리에 앉은 수백 명이 처리할 수 있는
            양이 아닙니다.
          </p>

          <p className="leading-7">
            둘째는 전문성입니다. 어떤 물질이 위험한지, 어떤 구조물이 안전한지는
            표결로 정할 수 있는 것이 아닙니다. 다수결은 선호를 모으는 장치이지
            사실을 밝히는 장치가 아닙니다.
          </p>

          <p className="leading-7">
            셋째는 시간입니다. 법률은 만들어지기까지 오래 걸리고 자주 고칠 수
            없는데, 현실은 그보다 훨씬 빨리 바뀝니다. 바뀔 때마다 법률을 다시
            만들어야 한다면 대응이 늘 늦습니다.
          </p>

          <p className="leading-7">
            그래서 결정하는 쪽은 뼈대만 정하고 나머지를 맡깁니다. 한국 헌법도
            이 구조를 전제하고 있어서, 대통령령을 발할 수 있게 하되 법률이
            구체적으로 범위를 정해 위임한 사항으로 한정합니다. 맡기는 것을
            금지하는 대신 맡기는 방식에 조건을 거는 쪽을 택한 것입니다.
          </p>
        </div>

        <CitationBlock
          source="대한민국헌법 제75조 · 제96조 (한국법제연구원 영문 번역본)"
          citeKey={1}
          href="https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG"
        >
          제75조는 대통령이 &ldquo;법률에서 구체적으로 범위를 정하여 위임받은
          사항과 법률을 집행하기 위하여 필요한 사항&rdquo;에 관해 대통령령을
          발할 수 있다고 정합니다. 위임 자체를 허용하되 &lsquo;구체적으로 범위를
          정하여&rsquo;라는 조건을 붙인 것이 이 조문의 핵심입니다. 제96조는
          &ldquo;행정각부의 설치·조직과 직무범위는 법률로 정한다&rdquo;고 하여
          집행 조직의 구성 자체도 입법의 통제 아래 둡니다. 위 본문에서 위임이
          불가피하되 조건이 붙는다고 한 근거가 이 두 조문입니다. 번역본은
          참조용이며 법적 효력은 국문 원문에 있다고 이 사이트가 명시합니다.
        </CitationBlock>
      </section>

      <section id="agency" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 맡기는 순간 아는 것이 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            맡긴 쪽과 맡은 쪽은 서로 다른 것을 압니다. 맡긴 쪽은 무엇을 원하는지
            알고, 맡은 쪽은 현장에서 무슨 일이 일어나는지 압니다. 이 어긋남이
            이 글 나머지 문제의 뿌리입니다.
          </p>

          <p className="leading-7">
            어긋남은 두 갈래로 나타납니다. 하나는 맡은 쪽이 가진 정보를 맡긴
            쪽이 확인할 수 없다는 것입니다. 어떤 규제가 필요한지, 인력이 얼마나
            드는지에 대한 답을 그 일을 하는 조직에서 들어야 하는데, 그 답이
            조직에 유리한 쪽으로 기울어도 검증할 방법이 마땅치 않습니다.
          </p>

          <p className="leading-7">
            다른 하나는 실제로 무엇을 했는지 보이지 않는다는 것입니다. 결과만
            보고 노력을 역산하려 해도, 결과에는 담당자가 어쩔 수 없는 사정이
            섞여 있어 나쁜 결과가 게으름 때문인지 운 때문인지 가릴 수 없습니다.
          </p>

          <p className="leading-7">
            여기서 중요한 것은 이 어긋남이 나쁜 사람 때문에 생기는 것이 아니라는
            점입니다. 맡긴다는 것은 곧 자기가 하지 않는다는 뜻이고, 하지 않으면
            보이지 않습니다. 그래서 완전히 정직한 조직에서도 같은 문제가 남습니다.
          </p>
        </div>

        <TermBreakdown
          title="어긋남이 나타나는 두 갈래와 그에 대한 흔한 대응"
          items={[
            {
              term: "가진 정보가 보이지 않음",
              description:
                "맡은 쪽만 아는 사실이 있고, 그것을 근거로 한 판단을 맡긴 쪽이 검증할 수 없습니다.",
              example:
                "필요한 예산과 인력의 규모를 그 일을 하는 조직에서 들어야 하는데, 부풀려도 확인할 방법이 마땅치 않습니다.",
              boundary:
                "정보를 다른 경로로도 얻으면 완화됩니다. 여러 기관에 비슷한 일을 시켜 답을 비교하는 방식이 그래서 쓰입니다.",
            },
            {
              term: "한 일이 보이지 않음",
              description:
                "결과만 보고 노력을 역산하려 해도 결과에 운이 섞여 있어 가려낼 수 없습니다.",
              example:
                "사고가 줄지 않았을 때 그것이 감독을 소홀히 해서인지 그해에 사정이 나빴기 때문인지 구분되지 않습니다.",
              boundary:
                "결과 대신 절차를 검사하면 이 문제를 피하지만, 절차를 지켰는지만 남고 결과가 좋아졌는지는 빠집니다.",
            },
            {
              term: "그래서 지표를 만든다",
              description:
                "보이지 않는 것을 관리하려고 셀 수 있는 무언가를 정해 그것으로 평가합니다.",
              example:
                "처리 건수, 적발 실적, 민원 처리 기간처럼 숫자로 떨어지는 것이 지표가 됩니다.",
              boundary:
                "셀 수 있는 것과 중요한 것이 다르면 다음 절의 문제가 그대로 생깁니다. 지표는 해법이면서 새 문제입니다.",
            },
          ]}
        />
      </section>

      <section id="rules-or-discretion" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 규칙으로 묶으면 재량이 죽고 재량을 주면 통제가 죽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            어긋남에 대한 첫 번째 대응은 미리 적어 두는 것입니다. 무엇을 어떤
            순서로 어떻게 처리할지를 규칙으로 정해 두면 맡은 쪽이 다르게 할 여지가
            줄어듭니다. 실제로 행정 조직이 두꺼운 절차를 갖는 이유가 여기 있습니다.
          </p>

          <p className="leading-7">
            규칙이 주는 것은 통제만이 아닙니다. 같은 사안을 누가 맡아도 같은 답이
            나오므로 예측할 수 있게 되고, 대상자가 이의를 제기할 근거도 생깁니다.
            앞 글들에서 본 자의적 권력 문제가 여기서도 같은 방식으로 다뤄집니다.
          </p>

          <p className="leading-7">
            대가는 분명합니다. 규칙은 만들 때 알고 있던 사안만 담을 수 있는데
            현실은 그 목록 밖으로 계속 나갑니다. 규칙에 없는 사정이 있어도 담당자는
            규칙대로 처리하고, 그러면 결과가 명백히 나빠도 아무도 책임지지
            않습니다. 규칙을 지킨 것이 잘못일 수 없기 때문입니다.
          </p>

          <p className="leading-7">
            그래서 문제는 규칙이냐 재량이냐를 고르는 것이 아니라 어느 쪽에 얼마나
            둘지를 사안마다 정하는 것이 됩니다. 아래 절차가 그 판정을 옮긴
            것입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="규칙으로 묶을지 재량을 줄지 판정하는 절차"
          input={[
            "그 업무에서 생길 수 있는 사안의 종류와 그것을 미리 적어 둘 수 있는 정도",
            "결과를 관찰할 수 있는 정도와 그 결과에 섞인 운의 크기",
            "잘못 처리했을 때의 손해가 한쪽으로 쏠리는지 여부",
          ]}
          steps={[
            {
              code: "사안의 종류를 미리 적어 둘 수 있는지 본다. 적어 둘 수 있으면 규칙 쪽으로 기운다.",
              note: "정형화된 신청 처리처럼 경우의 수가 닫혀 있으면 규칙이 재량보다 낫습니다. 예측 가능성을 얻고 잃는 것이 거의 없습니다.",
            },
            {
              code: "결과를 관찰할 수 있고 운의 몫이 작은지 본다. 그렇다면 재량을 주고 결과로 평가한다.",
              note: "운이 크게 섞이면 결과 평가가 담당자를 잘못 벌하거나 잘못 상 주므로, 이 경우 절차 검사 쪽이 낫습니다.",
            },
            {
              code: "잘못의 손해가 한쪽으로 크게 쏠리는지 본다. 쏠리면 그 방향을 막는 규칙을 먼저 박는다.",
              note: "놓쳤을 때의 손해가 과잉 조치의 손해보다 훨씬 크면 최소 기준을 규칙으로 두고 그 위에서만 재량을 줍니다.",
            },
            {
              code: "규칙에 없는 사정이 나타났을 때의 통로를 함께 만든다.",
              note: "예외를 신청하고 기록하고 사후에 검토하는 경로가 없으면, 규칙은 반드시 어느 시점에 현실과 어긋난 채 유지됩니다.",
            },
            {
              code: "재량을 준 만큼 사후에 설명을 요구한다.",
              note: "재량과 설명 의무는 짝입니다. 설명을 요구하지 않는 재량은 통제 없는 권한이 되고, 설명만 요구하고 재량을 주지 않으면 서류만 늘어납니다.",
            },
          ]}
          output="업무별로 규칙에 둘 부분과 재량에 둘 부분의 경계, 예외 통로의 설계, 그리고 재량에 붙일 설명 의무의 형태"
        />

        <div id="street-level" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            마지막 창구에서 정책이 다시 쓰입니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              규칙을 아무리 촘촘히 적어도 마지막에는 사람이 개별 사안을 봅니다.
              창구의 담당자, 현장의 감독관, 교실의 교사가 그 자리입니다. 이들은
              규칙을 적용하는 사람이지만 동시에 규칙이 닿지 않는 틈을 메우는
              사람입니다.
            </p>

            <p className="leading-7">
              이 자리의 특징은 자원이 늘 모자란다는 것입니다. 시간과 인력이
              사안 수보다 적으면 무언가를 먼저 처리하고 무언가를 미뤄야 하고,
              그 순서를 정하는 기준은 대개 규칙에 적혀 있지 않습니다. 담당자가
              스스로 만든 요령이 그 자리를 채웁니다.
            </p>

            <p className="leading-7">
              그래서 실제 정책은 법률이 아니라 이 요령의 총합에 가까워집니다.
              무엇을 먼저 보고 무엇을 넘기는지, 어떤 사람을 더 자세히 들여다보고
              어떤 사람을 빨리 통과시키는지가 쌓여 결과를 만듭니다.
            </p>

            <p className="leading-7">
              여기서 읽어야 할 것은 이 요령이 규칙 위반이 아니라는 점입니다.
              규칙이 모든 순서를 정해 주지 않았으므로 누군가는 정해야 하고,
              그 자리에 있는 사람이 정합니다. 집행을 바꾸려면 이 자리의 조건을
              바꿔야 하지 법문만 고쳐서는 닿지 않습니다.
            </p>
          </div>
        </div>
      </section>

      <section id="measurement" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 무엇을 재는지가 무엇을 하는지를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절에서 지표가 나왔습니다. 보이지 않는 것을 관리하려면 셀 수 있는
            무언가를 정해야 한다는 것이었습니다. 그런데 이 해법이 특정한 방식으로
            망가집니다.
          </p>

          <p className="leading-7">
            공공 업무에는 셀 수 있는 부분과 셀 수 없는 부분이 섞여 있습니다.
            처리 건수는 셀 수 있지만 판단의 질은 셀 수 없고, 적발 실적은 셀 수
            있지만 어려운 사안을 끝까지 파고들었는지는 셀 수 없습니다. 그리고 두
            부분은 같은 시간을 두고 다툽니다.
          </p>

          <p className="leading-7">
            그러면 셀 수 있는 쪽에만 보상을 걸었을 때 어떤 일이 생기는지가
            계산됩니다. 결과는 직관보다 강합니다. 보상을 강하게 걸수록 셀 수
            없는 쪽의 노력이 줄어들고, 어느 지점에서는 정확히 0이 됩니다.
          </p>
        </div>

        <ExplainedFormula
          question="셀 수 있는 것에만 보상을 걸면 나머지는 어떻게 되는가?"
          idea="담당자가 두 가지 일에 시간을 나눠 쓰고, 두 일이 서로 시간을 뺏는다고 둡니다. 셀 수 있는 일에는 성과급이 걸려 있고 셀 수 없는 일에는 직업의식만 걸려 있습니다. 각 일에서 한 단위 더 했을 때 얻는 것과 드는 것이 같아지는 지점을 함께 풀면 두 노력이 동시에 정해지고, 성과급 계수를 올릴 때 두 값이 어떻게 움직이는지가 나옵니다."
          formula={String.raw`e_1^{*} = \frac{\beta - \gamma\mu}{1-\gamma^{2}}, \qquad e_2^{*} = \frac{\mu - \gamma\beta}{1-\gamma^{2}}, \qquad \frac{\partial e_2^{*}}{\partial \beta} = -\,\frac{\gamma}{1-\gamma^{2}} < 0`}
          annotatedFormula={String.raw`e_1^{*} = \frac{\beta - \gamma\mu}{1-\gamma^{2}}, \qquad e_2^{*} = \underbrace{\frac{\mu - \gamma\beta}{1-\gamma^{2}}}_{\text{셀 수 없는 일에 남는 노력}}, \qquad \underbrace{\frac{\partial e_2^{*}}{\partial \beta} = -\,\frac{\gamma}{1-\gamma^{2}}}_{\text{성과급을 올릴 때 줄어드는 양}} < 0`}
          operations={[
            {
              expression: String.raw`\gamma`,
              annotation: [
                "두 일이 서로 시간을 뺏는 정도입니다. 0이면 완전히 별개의 일이고 1에 가까우면 하나를 하면 다른 하나를 거의 못 합니다.",
                "이 값이 0이면 성과급을 아무리 올려도 다른 일이 줄지 않습니다. 문제가 생기는 것은 두 일이 다툴 때뿐입니다.",
              ],
            },
            {
              expression: String.raw`\mu - \gamma\beta`,
              annotation: [
                "셀 수 없는 일에 남는 유인입니다. 직업의식에서 성과급이 끌어당기는 몫을 뺀 값입니다.",
                "β가 μ/γ를 넘으면 이 값이 0 아래로 내려가, 셀 수 없는 일에 쓰는 시간이 사라집니다.",
              ],
            },
            {
              expression: String.raw`-\,\frac{\gamma}{1-\gamma^{2}}`,
              annotation: [
                "성과급 계수를 한 단위 올릴 때 셀 수 없는 일의 노력이 줄어드는 양이며 언제나 음수입니다.",
                "두 일이 많이 다툴수록(γ가 클수록) 이 값의 절댓값이 커져 같은 성과급이 더 큰 피해를 냅니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\beta`,
              name: "성과급 계수",
              description:
                "셀 수 있는 일을 한 단위 더 했을 때 담당자가 받는 보상의 크기입니다.",
            },
            {
              symbol: String.raw`\mu`,
              name: "직업의식",
              description:
                "셀 수 없는 일을 한 단위 더 했을 때 담당자가 스스로 느끼는 보람이며, 외부 보상이 없을 때 그 일을 하게 하는 유일한 힘입니다.",
            },
            {
              symbol: String.raw`\gamma`,
              name: "두 일이 다투는 정도",
              description:
                "0과 1 사이의 값이며, 한 일에 시간을 쓸수록 다른 일의 부담이 얼마나 커지는지를 나타냅니다.",
            },
          ]}
          assumptions={[
            "두 일의 노력을 담당자가 자유롭게 나눌 수 있다고 둡니다. 근무 시간의 상당 부분이 규칙으로 고정되어 있으면 움직일 폭이 좁아집니다.",
            "직업의식이 성과급과 무관하게 일정하다고 둡니다. 성과급을 도입하면 직업의식 자체가 줄어든다는 관찰도 있으며, 그렇다면 결과는 여기보다 나빠집니다.",
            "셀 수 없는 일에는 어떤 보상도 걸 수 없다고 둡니다. 부분적으로라도 관찰할 수 있으면 그만큼 문제가 완화됩니다.",
          ]}
          interpretation="두 일이 다투는 정도를 0.5, 직업의식을 10으로 두고 계산하면 성과급 계수가 5일 때 셀 수 있는 일에 쓰는 노력이 0, 셀 수 없는 일에 10이 됩니다. 계수를 10으로 올리면 6.67과 6.67, 15면 13.33과 3.33, 20이면 20과 0이 됩니다. 사회가 보는 가치를 셀 수 있는 쪽 1, 셀 수 없는 쪽 3으로 두면 합계가 30에서 26.67, 23.33, 20으로 계속 줄어듭니다. 여기서 읽어야 할 것은 지표가 좋아지는 것과 일이 잘되는 것이 반대 방향으로 움직일 수 있다는 점입니다. 성과급을 올리면 관리 화면의 숫자는 예외 없이 좋아지고, 그 숫자만 보는 한 개선으로 보입니다. 읽으면 안 되는 것은 성과급이 언제나 해롭다는 결론입니다. 셀 수 없는 쪽의 가치가 작거나 두 일이 시간을 두고 다투지 않으면 같은 계산에서 성과급이 순이익을 냅니다."
        />

        <MeasurementDistortionViz />

        <CitationBlock
          source="Bengt Holmström · Paul Milgrom · Multitask Principal–Agent Analyses (Journal of Law, Economics, and Organization 7권 특별호, 1991, 24~52쪽)"
          citeKey={2}
          href="https://www.jstor.org/stable/764957"
        >
          한 사람이 여러 일을 맡거나 한 가지 일에 여러 측면이 있을 때 유인
          설계가 어떻게 달라지는지를 다룬 논문입니다. 시험 점수로 교사에게
          성과급을 주는 논쟁을 예로 들면서, 반대 측의 주장을 &ldquo;교사들이
          표준화 시험으로 측정되는 좁게 정의된 기초 능력을 가르치기 위해 호기심과
          창의적 사고를 북돋우거나 학생의 구술·작문 능력을 다듬는 활동을 희생하게
          되리라는 것&rdquo;으로 정리합니다. 모형의 결론은 &ldquo;어떤 한 활동에
          유인을 제공하는 것이 바람직한 정도는, 그 사람의 시간과 주의를 두고
          경쟁하는 다른 활동들의 성과를 측정하기 어려울수록 낮아진다&rdquo;는
          것이며, 그래서 측정된 성과와 무관한 고정급이 최적일 수 있다고 말합니다.
          위 식은 이 논문의 모형을 그대로 옮긴 것이 아니라 같은 결론을 가장 짧게
          보이려고 이 글에서 단순화해 전개한 것입니다. 대학 서버에 공개된 사본에서
          전문을 확인했고 링크는 출판사 쪽 서지 항목을 가리킵니다.
        </CitationBlock>

        <ProgressiveDetail
          title="그러면 지표를 쓰지 말아야 하는가?"
          preview="지표를 없애면 보이지 않는 것이 늘어날 뿐 관리가 좋아지지는 않습니다."
        >
          <p className="leading-7">
            지표를 없애면 앞 절의 문제로 돌아갑니다. 한 일이 보이지 않으니 평가할
            근거가 사라지고, 그러면 통제는 절차를 지켰는지만 보는 형태로 남습니다.
            결과가 좋아졌는지는 여전히 아무도 모릅니다.
          </p>
          <p className="leading-7">
            계산이 가리키는 것은 지표를 없애라는 것이 아니라 보상의 세기를
            조절하라는 것입니다. 셀 수 없는 쪽이 중요할수록 셀 수 있는 쪽에 거는
            보상을 약하게 두어야 하고, 그 극단에서는 성과와 무관한 고정급이
            최선이 됩니다. 공공 부문의 보수가 성과에 덜 연동되는 것이 반드시
            후진적인 설계는 아닙니다.
          </p>
          <p className="leading-7">
            다른 방향의 해법도 같은 계산에서 나옵니다. 두 일이 다투지 않게
            사람을 나누는 것입니다. 셀 수 있는 일을 맡는 자리와 셀 수 없는 일을
            맡는 자리를 분리하면 서로 시간을 뺏지 않으므로, 앞쪽에는 강한 보상을
            걸고 뒤쪽에는 걸지 않는 조합이 가능해집니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="control" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 통제 장치들은 각각 다른 것을 값으로 치릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            남은 것은 맡긴 쪽이 쓸 수 있는 수단들입니다. 크게 넷이고, 넷 다 무언가를
            얻는 대신 무언가를 내놓습니다.
          </p>

          <p className="leading-7">
            먼저 일이 벌어지기 전에 조건을 거는 방법이 있습니다. 조직을 어떻게
            만들지, 누구를 임명할지, 어떤 절차를 거치게 할지를 미리 정하는
            것입니다. 값싸고 확실하지만 앞 절의 규칙 문제가 그대로 따라옵니다.
          </p>

          <p className="leading-7">
            다음은 벌어진 뒤에 확인하는 방법입니다. 감사, 국정조사, 예산 심의가
            여기 속합니다. 개별 사안을 실제로 들여다보므로 정확하지만 비용이 크고,
            비용이 크므로 드물게만 할 수 있습니다. 그래서 이 방식은 문제가 소리를
            내야 작동합니다.
          </p>

          <p className="leading-7">
            셋째는 여럿에게 시켜 서로 견주는 방법입니다. 비슷한 일을 하는 기관을
            여럿 두면 답을 비교할 수 있어 앞 절의 정보 비대칭이 완화됩니다. 대신
            같은 일을 겹쳐서 하게 되고 기관 사이의 다툼이 새 비용이 됩니다.
          </p>

          <p className="leading-7">
            넷째는 밖에서 보이게 하는 방법입니다. 자료를 공개하고 결정 과정을
            기록으로 남기면 감시하는 눈이 늘어납니다. 다만 앞 글에서 봤듯 그 눈은
            조직된 쪽에 훨씬 많이 있어, 공개가 언제나 고르게 작동하지는 않습니다.
          </p>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          집행 실패를 태도 문제로 읽으면 고칠 곳을 찾지 못합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글에서 나온 간극은 전부 구조에서 나왔습니다. 맡기면 보이지 않고,
            규칙은 모든 사안을 담지 못하며, 셀 수 있는 것과 중요한 것은 다르고,
            통제 수단은 각각 값을 치릅니다. 어느 것도 담당자의 성실성으로 없앨 수
            있는 것이 아닙니다.
          </p>

          <p className="leading-7">
            그래서 집행이 잘 안 될 때 물어야 할 것이 바뀝니다. 누가 게을렀는가가
            아니라 어느 단계의 조건이 그런 결과를 만들었는가입니다. 지표가 잘못
            걸려 있는지, 규칙이 현실과 어긋난 채 유지되고 있는지, 마지막 창구의
            자원이 사안 수보다 적은지가 실제로 고칠 수 있는 지점입니다.
          </p>

          <p className="leading-7">
            여기까지가 한 국가 안의 이야기입니다. 강제력이 한 곳에 모여 있고,
            그 힘을 헌법이 묶고, 선거가 그 자리를 채우고, 조직이 결정을
            집행합니다. 여덟 글이 이 구조를 쌓았습니다.
          </p>

          <p className="leading-7">
            그런데 국가들 사이에는 이 구조의 맨 아래가 없습니다. 위에 더 큰
            강제력이 없으면 약속을 지키게 할 방법도, 분쟁을 최종적으로 판정할
            자리도 사라집니다. 다음 글{" "}
            <Link to="/politics/governance/international-anarchy">
              국제 무정부
            </Link>
            가 그 조건에서 무엇이 달라지는지를 맡습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
