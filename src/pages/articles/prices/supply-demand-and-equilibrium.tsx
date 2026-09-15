import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MarketLadderViz from "./supply-demand-and-equilibrium/viz/MarketLadderViz";
import ShiftVsMoveViz from "./supply-demand-and-equilibrium/viz/ShiftVsMoveViz";

/**
 * 아무도 정하지 않은 숫자가 정해집니다
 *
 * 경제 시리즈 3편. 2편이 남긴 "구간 안 어디로 정해지는가"를 받는다. 두 줄의
 * 정체와 값이 움직이는 이유, 그리고 곡선 이동과 곡선 위 이동의 구분까지가
 * 범위다. 그 결과가 좋은 것인지는 4편의 몫이다.
 */
export default function SupplyDemandAndEquilibriumArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          아무에게도 물어보지 않고 숫자 하나가 정해집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 둘 다 이득인 교환 비율의 구간이 있다는 데까지 갔습니다.
            그런데 구간 안 어디로 정해지는지는 답하지 못했습니다. 마주 앉아
            다투면 정해지겠지만 시장에는 마주 앉을 상대가 수천 명입니다.
          </p>

          <p className="leading-7">
            그리고 그 수천 명은 서로의 사정을 모릅니다. 내가 얼마까지 낼 수
            있는지 파는 사람은 모르고, 만드는 데 얼마가 드는지 나는 모릅니다.
          </p>

          <p className="leading-7">
            그런데도 값은 하나로 정해집니다. 정하는 사람이 따로 없는데
            정해집니다. 아래 그림이 그 일이 벌어지는 자리입니다.
          </p>
        </div>

        <MarketLadderViz />

        <ContentBoundary article="supply-demand-and-equilibrium" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              아무도 정하지 않는데 값은 어떻게 하나로 정해지는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 사려는 줄이 무엇으로 이루어졌는지, 팔려는 줄이 무엇으로
            이루어졌는지, 두 줄의 길이가 어긋나면 무슨 일이 일어나는지, 그리고
            값이 바뀌었을 때 무엇이 움직인 것인지를 어떻게 가르는지입니다.
          </p>

          <p className="leading-7">
            정해진 값이 좋은 것인지는 다루지 않습니다. 이 글은 어떻게 정해지는지
            까지만 봅니다.
          </p>
        </div>
      </section>

      <section id="demand-side" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 사려는 줄은 낼 수 있는 값의 내림차순입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사려는 사람마다 그것에 낼 수 있는 최대 금액이 있습니다. 그보다
            비싸면 사지 않고 그보다 싸면 삽니다.
          </p>

          <p className="leading-7">
            이 최대 금액이 어디서 오는지는 앞 두 글이 이미 답했습니다. 그 돈을 다른 데 썼을 때 얻을 수 있는 것이 그 사람의 기준이고 그것이 기회비용입니다. 지불용의는 취향의 문제가
            아니라 대안의 문제입니다.
          </p>

          <p className="leading-7">
            사람마다 대안이 다르므로 이 금액도 다릅니다. 여섯 명을 금액이 큰
            순서로 세우면 10, 9, 8, 7, 6, 5가 됩니다.
          </p>

          <p className="leading-7">
            이제 값을 하나 부르면 몇 명이 사는지가 셈으로 나옵니다. 값이 7이면 10부터 7까지 네 명이 남고 값이 8이면 세 명이 남습니다. 값을 올릴수록 줄이 짧아지는 이유가
            이것뿐입니다.
          </p>

          <p className="leading-7">
            그래서 사려는 줄은 취향의 목록이 아니라 기회비용의 내림차순입니다.
            줄의 모양은 사람들이 무엇을 포기할 수 있는지가 정합니다.
          </p>
        </div>
      </section>

      <section id="supply-side" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 팔려는 줄은 드는 값의 오름차순입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            파는 쪽도 같은 구조입니다. 한 개를 더 만드는 데 드는 값보다 많이
            받으면 만들고 적게 받으면 만들지 않습니다.
          </p>

          <p className="leading-7">
            이것은 1편의 한 단위 판정을 그대로 쓴 것입니다. 전체가 남는 장사인지가
            아니라 이 한 개가 남는지를 묻습니다. 그래서 파는 쪽의 기준은 평균이
            아니라 한계입니다.
          </p>

          <p className="leading-7">
            여섯을 드는 값이 작은 순서로 세우면 4, 5, 6, 7, 8, 9가 됩니다. 값이 7이면 4부터 7까지 네 개가 나오고 값이 6이면 세 개가 나옵니다.
          </p>

          <p className="leading-7">
            여기서도 드는 값의 정체가 기회비용입니다. 그 시간과 재료를 다른 데 썼다면 얻었을 것이고 앞 글의 표현으로는 그 사람이 직접 만들 때 치르는 값입니다.
          </p>

          <p className="leading-7">
            그러니까 두 줄은 서로 다른 것이 아닙니다. 같은 기회비용을 사는 쪽에서
            본 것과 파는 쪽에서 본 것입니다. 값은 그 둘 중 하나가 정하지 않습니다.
          </p>
        </div>

        <CitationBlock
          source="Alfred Marshall, Principles of Economics, Vol. I, 3rd ed. (Macmillan, 1895), bk. V ch. III §7, p. 427"
          citeKey={1}
          href="https://archive.org/details/principlesofecon01marsrich"
        >
          값을 정하는 것이 효용인지 생산비인지를 두고 오래 다투던 자리에 대해
          &ldquo;we might as reasonably dispute whether it is the upper or the
          lower blade of a pair of scissors that cuts a piece of
          paper&rdquo;라고 적습니다. 한쪽 날을 고정하고 다른 쪽을 움직이면 그
          움직인 쪽이 자른 것처럼 보이지만 정확한 설명은 아니라는 단서까지
          함께 답니다. 1895년 Macmillan 3판 본문을 Internet Archive 스캔으로
          직접 대조했습니다. 널리 인용되는 &ldquo;under blade&rdquo; 표현은
          뒤의 판본에서 바뀐 것이며 3판은 위와 같이 &ldquo;lower
          blade&rdquo;입니다.
        </CitationBlock>
      </section>

      <section id="adjustment" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 두 줄의 길이가 어긋나면 남는 쪽이 값을 밉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            두 줄이 정해졌으면 값이 정해지는 과정은 뺄셈 하나입니다. 사려는
            사람 수에서 팔려는 사람 수를 뺍니다.
          </p>

          <p className="leading-7">
            값이 5면 여섯 명이 사려는데 두 개만 나와 네 명이 못 삽니다. 못 산
            사람 중에는 더 낼 뜻이 있는 사람이 있으므로 그 사람이 조금 더
            부릅니다. 값이 올라갑니다.
          </p>

          <p className="leading-7">
            값이 9면 반대입니다. 여섯 개가 나오는데 두 명만 사려 해서 네 개가
            남습니다. 못 판 사람 중에는 조금 깎아도 남는 사람이 있으므로 깎습니다.
            값이 내려갑니다.
          </p>

          <p className="leading-7">
            값이 7이면 양쪽이 네 명으로 같습니다. 못 사서 더 부를 사람도, 못
            팔아서 깎을 사람도 없습니다. 움직일 이유가 사라졌다는 것이 정해졌다는
            말의 전부입니다.
          </p>

          <p className="leading-7">
            그래서 이 숫자는 누가 고른 것이 아니라 어긋남이 0이 되는 자리입니다.
            그리고 그 자리로 돌아오는 힘이 있다는 것이 이 이야기의 핵심입니다.
          </p>
        </div>

        <ExplainedFormula
          question="값은 어디서 멈추고, 왜 그 자리로 돌아옵니까?"
          idea="값이 정해졌다는 것은 더 움직일 이유가 없다는 뜻입니다. 사려는 양과 팔려는 양의 차이가 값을 미는 힘이므로, 그 차이가 0인 값에서 힘이 사라집니다. 값이 올라가면 사려는 양이 줄고 팔려는 양이 늘어 차이가 작아지므로, 어긋난 자리에서 시작해도 그 힘이 스스로를 없애는 방향으로 값을 밀어 한 자리로 모입니다."
          formula={String.raw`P^{*} : Q_d(P^{*}) = Q_s(P^{*}), \qquad \Delta P \;\propto\; Q_d(P) - Q_s(P)`}
          annotatedFormula={String.raw`\underbrace{Q_d(P^{*}) = Q_s(P^{*})}_{\text{멈추는 자리}}, \qquad \underbrace{\Delta P \;\propto\; Q_d(P) - Q_s(P)}_{\text{그 자리로 미는 힘}}`}
          operations={[
            {
              expression: String.raw`Q_d(P) - Q_s(P)`,
              annotation: [
                "그 값에서 사려는 양에서 팔려는 양을 뺀 것이며, 양수면 못 산 사람이 남고 음수면 못 판 사람이 남습니다.",
                "남은 쪽이 값을 움직일 이유를 가진 쪽입니다. 못 산 사람은 더 부를 수 있고 못 판 사람은 깎을 수 있습니다.",
              ],
            },
            {
              expression: String.raw`\Delta P \;\propto\; Q_d(P) - Q_s(P)`,
              annotation: [
                "값의 변화가 어긋남의 부호와 같은 방향이라는 뜻입니다.",
                "비례 상수는 얼마나 빨리 움직이는지일 뿐 어디로 가는지를 바꾸지 않습니다. 시장마다 이 속도가 달라 같은 균형에 닿는 시간이 다릅니다.",
              ],
            },
            {
              expression: String.raw`Q_d(P^{*}) = Q_s(P^{*})`,
              annotation: [
                "어긋남이 0이 되어 값을 밀 이유가 사라진 지점입니다.",
                "Q_d가 줄고 Q_s가 느는 동안에는 이런 P가 많아야 하나이고, 어긋남이 그 자리를 향하는 방향으로만 작용하므로 값이 그리로 모입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`Q_d(P)`,
              name: "그 값에서 사려는 양",
              description:
                "낼 수 있는 최대 금액이 P 이상인 사람의 수이며, P가 오를수록 줄어듭니다.",
            },
            {
              symbol: String.raw`Q_s(P)`,
              name: "그 값에서 팔려는 양",
              description:
                "한 개를 더 만드는 데 드는 값이 P 이하인 경우의 수이며, P가 오를수록 늘어납니다.",
            },
            {
              symbol: String.raw`P^{*}`,
              name: "멈추는 값",
              description:
                "두 양이 같아져 아무도 값을 움직일 이유가 없는 값입니다.",
            },
          ]}
          assumptions={[
            "사려는 양이 값에 대해 줄고 팔려는 양이 는다고 둡니다. 이 방향이 깨지면 교차가 여럿이 되거나 어긋남이 값을 균형에서 멀어지게 밀 수 있습니다.",
            "못 산 사람이 더 부를 수 있고 못 판 사람이 깎을 수 있다고 둡니다. 값을 규제로 묶어 두면 어긋남이 있어도 이 힘이 작동하지 않습니다.",
            "모두가 같은 물건을 사고팔고 거래가 즉시 이뤄진다고 둡니다. 물건이 서로 다르거나 찾는 데 시간이 걸리면 하나의 값 대신 값의 분포가 남습니다.",
          ]}
          interpretation="사는 쪽 여섯의 최대 금액이 10, 9, 8, 7, 6, 5이고 파는 쪽 여섯의 드는 값이 4, 5, 6, 7, 8, 9라고 하겠습니다. 값이 5면 사려는 쪽이 여섯, 팔려는 쪽이 둘이라 어긋남이 4이고 값이 올라갑니다. 값이 6이면 다섯 대 셋이라 어긋남이 2로 줄고, 값이 7이면 넷 대 넷이라 0이 됩니다. 반대로 9에서 시작하면 둘 대 여섯이라 어긋남이 −4라서 값이 내려오고 역시 7에 닿습니다. 여기서 읽어야 할 것은 어느 쪽에서 출발해도 같은 자리로 온다는 점입니다. 어긋남의 크기가 값을 미는 거리이고, 값이 움직이면 어긋남이 줄어듭니다. 읽으면 안 되는 것은 이 수렴이 언제나 일어난다는 결론입니다. 값이 오를수록 팔려는 양이 도리어 줄어드는 경우가 있고, 그때는 같은 힘이 값을 균형에서 밀어냅니다."
        />

        <AlgorithmBlock
          title="값이 한 자리로 모이는 절차"
          input={[
            "사려는 쪽의 최대 금액 목록",
            "파는 쪽의 한 개당 드는 값 목록",
            "아무 값이나 하나 (출발점)",
          ]}
          steps={[
            {
              code: "Qd ← #{최대 금액 ≥ P};  Qs ← #{드는 값 ≤ P}",
              note: "두 줄의 길이를 셉니다. 누구의 사정도 알 필요가 없고 값 하나만 있으면 됩니다.",
            },
            {
              code: "if Qd > Qs: P ← P + 1",
              note: "못 산 사람이 남았으므로 그중 더 낼 뜻이 있는 사람이 값을 올립니다.",
            },
            {
              code: "if Qd < Qs: P ← P - 1",
              note: "못 판 사람이 남았으므로 그중 깎아도 남는 사람이 값을 내립니다.",
            },
            {
              code: "if Qd = Qs: return P",
              note: "값을 움직일 이유를 가진 사람이 없습니다.",
            },
            {
              code: "Qd가 줄고 Qs가 느는지 확인한다",
              note: "이 방향이 아니면 위의 갱신이 균형에서 멀어지는 쪽으로 갈 수 있습니다. 그때는 모든 P에 대해 어긋남을 재야 합니다.",
            },
          ]}
          output="어긋남이 0인 값과 그때 거래되는 수량"
          repeatUntil="사려는 양과 팔려는 양이 같아질 때까지"
        />

        <ProgressiveDetail
          title="값이 움직이는 것으로 볼지 양이 움직이는 것으로 볼지"
          preview="마셜은 같은 수렴을 값이 아니라 생산량이 움직이는 이야기로 적었습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              위 절차는 값이 어긋남에 반응해 움직인다고 썼습니다. 못 산 사람이
              값을 올리고 못 판 사람이 내립니다.
            </p>

            <p className="leading-7">
              마셜은 반대로 적습니다. 어떤 수량에서 사는 쪽이 낼 값이 파는 쪽이
              받아야 할 값보다 크면 만드는 양이 늘어나는 힘이 작용하고, 작으면
              줄어드는 힘이 작용하며, 두 값이 같아지면 &ldquo;더 늘어나려는
              경향도 줄어들려는 경향도 없다&rdquo;고 씁니다.
            </p>

            <p className="leading-7">
              둘은 무엇이 먼저 움직이느냐가 다를 뿐 같은 자리로 갑니다. 이 글처럼 사려는 양이 값에 대해 줄고 팔려는 양이 늘면 값에서 어긋남이 0인 지점과 수량에서 두 값이 같아지는
              지점이 같은 점이기 때문입니다.
            </p>

            <p className="leading-7">
              구분이 필요해지는 것은 이 조건이 깨질 때입니다. 만드는 데 시간이
              오래 걸려 값이 먼저 튀고 양이 나중에 따라오는 시장에서는 두
              이야기가 다른 경로를 그립니다. 이 글은 그 경우를 다루지 않습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="shift-vs-move" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 값이 바뀌었다고 사정이 바뀐 것은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기서 가장 자주 어긋나는 것이 하나 있습니다. 값이 오르면 사는 양이
            줄고, 사려는 마음이 커지면 값이 오릅니다. 둘 다 맞는 말인데 뒤섞으면
            순환 논증이 됩니다.
          </p>

          <p className="leading-7">
            갈라야 하는 것은 줄 자체가 옮겨 갔는지입니다. 값만 바뀌면 같은 줄
            위에서 사람 몇이 들고 납니다. 사정이 바뀌면 줄이 통째로 옮겨 갑니다.
          </p>

          <p className="leading-7">
            숫자로 보겠습니다. 기준에서 값은 7이고 네 개가 거래됩니다. 값만 8로
            올려 보면 사려는 쪽이 셋, 팔려는 쪽이 다섯이 되어 둘이 못 팝니다.
            그래서 8은 유지되지 않고 도로 7로 내려옵니다.
          </p>

          <p className="leading-7">
            이번에는 모두가 2씩 더 낼 뜻이 생겼다고 하겠습니다. 사려는 줄이
            통째로 올라가 새 균형이 값 8에 다섯 개가 됩니다. 이 8은 유지됩니다.
          </p>

          <p className="leading-7">
            반대로 만드는 값이 2씩 싸지면 팔려는 줄이 내려가 값 6에 다섯 개가
            됩니다. <strong>두 경우 모두 다섯 개인데 값은 8과 6으로 반대입니다.</strong>{" "}
            그래서 거래량만 보고는 무엇이 움직였는지 알 수 없고, 값과 양을 함께
            봐야 합니다.
          </p>
        </div>

        <ShiftVsMoveViz />

        <TermBreakdown
          title="값과 양이 함께 어떻게 움직였는지로 읽으면"
          description="값과 양의 방향 조합이 어느 줄이 움직였는지를 말해 줍니다."
          items={[
            {
              term: "값이 오르고 양도 늘었다",
              description: "사려는 줄이 올라간 경우입니다.",
              example:
                "모두가 2씩 더 낼 뜻이 생겨 값 7에 네 개이던 것이 값 8에 다섯 개가 됩니다.",
              boundary:
                "두 줄이 동시에 움직였을 수도 있습니다. 이 읽기는 한쪽만 움직였다고 둘 때의 이야기입니다.",
            },
            {
              term: "값이 내리고 양은 늘었다",
              description: "팔려는 줄이 내려간 경우입니다.",
              example:
                "드는 값이 2씩 싸져 값 7에 네 개이던 것이 값 6에 다섯 개가 됩니다.",
              boundary:
                "양만 보면 앞의 경우와 구별되지 않습니다. 둘 다 다섯 개입니다.",
            },
            {
              term: "값만 바뀌었다",
              description:
                "누군가 값을 그렇게 부른 것일 뿐 줄은 그대로인 경우입니다.",
              example:
                "값을 8로 부르면 사려는 쪽 셋과 팔려는 쪽 다섯이 되어 둘이 남습니다.",
              boundary:
                "남은 쪽이 값을 밀어 되돌아오므로 유지되지 않습니다. 값을 묶어 두면 되돌아오지 못하고 남은 쪽이 그대로 남습니다.",
            },
          ]}
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          정해진다는 것과 좋다는 것은 아직 다른 말입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 사려는 줄은 기회비용의 내림차순이고
            팔려는 줄은 오름차순이며, 두 줄의 길이 차이가 값을 밀어 차이가 0인
            자리에서 멈추고, 값이 바뀐 것과 줄이 옮겨 간 것은 다릅니다.
          </p>

          <p className="leading-7">
            2편이 남긴 빈칸은 이제 메워졌습니다. 구간 안 어디로 정해지는지는 두 줄의 모양이 정합니다. 마주 앉아 다투지 않아도 서로의 사정을 몰라도 정해집니다.
          </p>

          <p className="leading-7">
            그런데 새 빈칸이 생겼습니다. 값 7에 네 개가 거래되는 이 결과가 좋은
            것입니까. 무엇을 기준으로 좋다고 말합니까. 값이 7이어서 못 산 두
            사람은 어떻게 됩니까.
          </p>

          <p className="leading-7">
            다음 글은 이 결과를 채점하는 자를 만듭니다. 거래가 만들어 낸 값이
            얼마이고 그것이 누구에게 갔는지를 재고, 값을 묶어 두면 그 값이
            어떻게 되는지를 봅니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 여기서는 모두가 같은 물건을 사고팔고 서로가 값을 안다고 두었습니다. 물건이 서로 다르거나 한쪽만 아는 것이 있으면 이 그림이 달라지며 그
            경우는 이 시리즈의 뒤쪽에서 따로 다룹니다. 그리고 파는 쪽이 하나뿐이면 값을 부르는 쪽이 생겨 이 절차 자체가 성립하지 않습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
