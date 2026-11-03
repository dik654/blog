import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CacheThrashViz from "./agent-serving-slo-and-capacity/viz/CacheThrashViz";
import ConcurrencySweepViz from "./agent-serving-slo-and-capacity/viz/ConcurrencySweepViz";

/**
 * 에이전트 서빙 용량은 SLO를 지키는 동시 에이전트 수로 잽니다
 *
 * 근거: docs/moe-serving-research-2026-11-03/ 의 01(처리량 원문 대조), 02(AA-AgentPerf·MLPerf·AgentX·시장 기준선),
 * 03·slo_scenarios.py(손익분기 역산), agent-trace-bench-ref/README.md(측정 도구와 자체 시험).
 * 공유 숫자: 8장 서버 K2.6 32K 표(86.7/278.7/399.5/499.8/742.0), KV 풀 3,621,504토큰, 200K 세션.
 */
export default function AgentServingSloAndCapacityArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 초당 900토큰 서버에서 에이전트 하나는 9토큰을 받습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            GPU 8장짜리 서버 한 대가 Kimi K2.5를 돌리며 초당 900토큰을 냈다는 커뮤니티 기록이 있습니다. 숫자만 보면 넉넉한 서버입니다. 그런데 그 기록은 요청 100개를 동시에 돌린 결과라서 요청 하나가 받은 속도는 초당 약 9토큰입니다.
          </p>
          <p className="leading-7">
            사람이 채팅 답을 읽는다면 초당 9토큰은 조금 느린 정도입니다. 코딩 에이전트는 사정이 다릅니다. 답 하나를 받아야 도구를 실행하고, 그 결과를 붙여 다음 질문을 보냅니다. 한 작업에 이런 왕복이 수십 번 이어지므로 느린 답 하나하나가 작업 전체를 늦춥니다.
          </p>
          <p className="leading-7">
            그래서 에이전트 서빙의 용량은 서버가 내는 합계로 재지 않습니다. 정해 둔 속도 약속을 지키면서 동시에 돌릴 수 있는 에이전트 수로 잽니다. 이 글은 그 수를 막는 두 한계를 같은 서버의 숫자로 따라갑니다. 하나는 요청 하나에 돌아가는 속도이고, 다른 하나는 세션마다 쌓인 기록을 담아 둘 메모리입니다.
          </p>
          <p className="leading-7">
            지금 가져갈 사실은 서버 합계와 요청 하나의 몫이 다르다는 것 하나입니다. 다음 절에서는 이 측정을 바깥에서 본 입력과 출력으로 정리합니다.
          </p>
        </div>
        <ContentBoundary article="agent-serving-slo-and-capacity" />
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 호출 기록과 속도 약속을 넣으면 동시 에이전트 수가 나옵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            바깥에서 보면 측정은 상자 하나입니다. 넣는 것은 두 가지입니다. 첫째는 실제 에이전트가 남긴 호출 기록으로, 호출마다 문맥 길이와 출력 길이, 다음 호출까지 기다린 시간을 담습니다.
          </p>
          <p className="leading-7">
            둘째는 속도 약속입니다. 요청 하나가 출력을 내는 속도에 하한을 두고, 요청을 보낸 뒤 첫 토큰이 오기까지의 기다림에 상한을 둡니다. 둘 다 평균이 아니라 요청 전체 분포의 한 지점으로 정합니다.
          </p>
          <p className="leading-7">
            나오는 것도 두 가지입니다. 약속을 지키며 동시에 돌릴 수 있는 에이전트의 최대 수, 그리고 그때 서버가 낸 총 출력 속도입니다. 앞의 수는 몇 명에게 서비스를 팔 수 있는지를 정하고, 뒤의 수는 장비가 한 해 동안 만드는 출력량을 정합니다.
          </p>
          <p className="leading-7">
            상자 안에서는 세 가지 일이 겹칩니다. 동시 세션이 늘면 요청 하나의 몫이 줄어듭니다. 세션 기록이 메모리를 넘으면 이미 계산한 앞부분을 다시 계산하게 됩니다. 둘 중 먼저 약속을 깨는 쪽이 용량을 정합니다. 3절이 첫째를, 6절이 둘째를 숫자로 보여 줍니다.
          </p>
          <p className="leading-7">
            입력과 출력의 모양은 여기서 정해졌습니다. 이제 상자 안을 열기 전에 같은 서버를 여러 크기로 나눠 써 봅니다.
          </p>
        </div>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 같은 서버를 요청 1개에서 64개까지 나눠 씁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            8장 서버가 Kimi K2.6을 32K 문맥으로 돌린 측정표의 한 행을 씁니다. 동시 요청이 1개면 서버 합계가 초당 86.7토큰이고, 8개면 278.7, 16개면 399.5, 32개면 499.8, 64개면 742.0입니다.
          </p>
          <p className="leading-7">
            이 표는 rtx6kpro 위키에 모인 현장 경험 기록입니다. 출력 길이를 강제한 합성 요청이고 추측 디코딩을 켠 설정이라, 실제 에이전트 트래픽의 숫자로 읽으면 안 됩니다. 여기서는 합계와 몫의 관계를 보는 데만 씁니다.
          </p>
          <p className="leading-7">
            합계를 동시 요청 수로 나누면 요청 하나의 평균 몫이 나옵니다. 86.7이던 몫이 8개에서 34.8, 16개에서 25.0, 32개에서 15.6, 64개에서 11.6으로 내려갑니다. 합계가 8.6배 커지는 동안 요청 하나의 몫은 7분의 1 남짓으로 줄었습니다.
          </p>
          <p className="leading-7">
            이유는 답을 한 토큰씩 만드는 단계에 있습니다. 서버는 걸음마다 모델 가중치를 메모리에서 읽는데, 요청이 여럿이면 한 번 읽은 가중치로 여러 요청의 다음 토큰을 함께 계산합니다. 그래서 합계는 늘지만 한 걸음이 길어져 각 요청은 더 천천히 받습니다. 이 단계가 왜 메모리 읽기에 묶이는지는{" "}
            <Link to="/cs/ai/prefill-decode-phase-dynamics#arithmetic-intensity">prefill과 decode의 차이</Link>에서 다룹니다.
          </p>
        </div>

        <ConcurrencySweepViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            그림의 아래 막대가 평균이라는 점이 중요합니다. 속도 약속은 평균이 아니라 느린 쪽 요청으로 판정하므로, 평균이 20을 넘는 16개에서도 약속을 지킨다고 장담할 수 없습니다. 이 차이는 4절에서 다시 봅니다.
          </p>
        </div>

        <ExplainedFormula
          question="서버 합계에서 요청 하나가 받는 출력 속도는 어떻게 나옵니까?"
          idea="한 걸음에 서버가 만드는 토큰은 동시에 답을 만드는 요청들이 나눠 가집니다. 그래서 같은 측정 구간의 합계를 그 구간에 실제로 디코딩하던 요청 수로 나누면 요청 하나의 평균 몫이 됩니다. 큐에서 기다리는 요청은 토큰을 받지 않으므로 분모에 넣지 않습니다."
          formula={String.raw`\bar{r}(C) = \frac{X_{\text{out}}(C)}{C}`}
          annotatedFormula={String.raw`\underbrace{\bar{r}(C)}_{\text{요청 하나의 평균 몫}} = \frac{\overbrace{X_{\text{out}}(C)}^{\text{같은 구간의 출력 합계}}}{\underbrace{C}_{\text{동시에 디코딩 중인 요청}}}`}
          operations={[
            {
              expression: String.raw`X_{\text{out}}(C)`,
              annotation: [
                "측정 구간에 서버 전체가 만든 출력 토큰을 구간 길이로 나눈 값입니다.",
                "입력 토큰을 더한 합계를 넣으면 몫이 부풀어 보입니다. 985와 5,816이 그런 합계였습니다.",
              ],
            },
            {
              expression: String.raw`\frac{X_{\text{out}}(C)}{C}`,
              annotation: [
                "합계를 실제로 토큰을 받는 요청 수로 나눠 한 요청의 평균 몫으로 바꿉니다.",
                "동시 1,000개를 걸었어도 메모리에 12개만 들어갔다면 분모는 1,000이 아니라 12입니다.",
              ],
            },
            {
              expression: String.raw`\bar{r}(C)`,
              annotation: [
                "평균이므로 느린 요청과 빠른 요청이 섞여 있습니다.",
                "속도 약속은 이 평균이 아니라 하위 25퍼센트 같은 분포의 한 점으로 판정합니다.",
              ],
            },
          ]}
          terms={[
            { symbol: String.raw`C`, name: "동시 요청 수", description: "측정 구간 동안 답을 만들고 있던 요청의 수입니다. 대기열의 요청은 빼고 셉니다." },
            { symbol: String.raw`X_{\text{out}}`, name: "출력 합계", description: "서버 전체가 초당 만든 출력 토큰입니다. 입력 처리량은 따로 셉니다." },
            { symbol: String.raw`\bar{r}`, name: "평균 몫", description: "요청 하나가 첫 토큰 뒤에 받는 평균 출력 속도입니다." },
          ]}
          assumptions={[
            "측정 구간 동안 동시 요청 수가 거의 일정하다고 둡니다. 요청이 들어오고 나가며 C가 크게 출렁이면 구간 평균을 써야 합니다.",
            "첫 토큰까지의 기다림은 이 몫에 넣지 않습니다. 요청별 출력 속도는 첫 토큰 이후 구간만 봅니다.",
          ]}
          interpretation="16개에서 399.5를 16으로 나누면 25.0입니다. 읽어야 할 것은 합계가 늘어도 몫은 줄 수 있다는 방향입니다. 읽으면 안 되는 것은 평균 25가 20 기준을 통과했으니 16개가 안전하다는 결론입니다. 하위 25퍼센트는 평균보다 낮을 수 있고, 실제로 짧은 출력이 많은 에이전트 부하에서는 대개 그렇습니다."
        />

        <CalculationWalkthrough
          title="유명한 처리량 숫자를 요청 하나의 몫으로 바꾸기"
          question="커뮤니티와 벤더가 내건 합계는 요청 하나에게 얼마씩 돌아간 숫자였을까요?"
          scope="출력 토큰만 셉니다. 입력과 출력을 합친 값은 출력만 다시 뽑아 씁니다. 모든 값은 01 보고서가 원문을 다시 열어 확인한 조건입니다."
          steps={[
            { label: "32K 표, 동시 16개", expression: "399.5 ÷ 16", result: "25.0 tok/s", reason: "그림의 세 번째 장면입니다. 평균 기준으로만 20을 넘습니다." },
            { label: "40K 문맥 100개, GPU 직접 통신 끔", expression: "900 ÷ 100", result: "9 tok/s", reason: "위키 본문은 이 조건을 빠뜨렸습니다. 원 스크린샷에서 통신 설정을 확인한 값입니다." },
            { label: "같은 조건, GPU 직접 통신 켬", expression: "600 ÷ 100", result: "6 tok/s", reason: "한 요청을 빠르게 하는 설정과 동시 처리를 늘리는 설정이 서로 반대라는 현장 관찰입니다." },
            { label: "985 tok/s의 출력만", expression: "985 − 704(입력)", result: "281 tok/s", reason: "985는 입력과 출력의 합계입니다. KV 공간이 4,578토큰뿐이라 동시 1,000개 중 실제로 돈 것은 약 12개였습니다." },
            { label: "5,816 tok/s의 출력만", expression: "1 ÷ 0.576 s", result: "약 1.7 tok/s", reason: "출력 합계는 1,650이고 토큰 간격이 576 ms였습니다. 짧은 256토큰 입력에 CUDA graph를 끈 측정입니다." },
            { label: "H200 wide-EP, GPU당 2,200", expression: "2,200 ÷ 256", result: "약 8.6 tok/s", reason: "랭크마다 동시 256개를 건 처리량 최대점이라 대화형 운영점이 아닙니다." },
          ]}
          conclusion="헤드라인 처리량은 대부분 요청 하나가 한 자릿수 속도를 받는 운영점에서 나왔습니다. 용량 계획에는 합계가 아니라 몫이 약속을 넘는 지점의 합계를 써야 합니다."
          caveats={["모두 현장 경험 또는 벤더 블로그 수치입니다. 같은 장비라도 엔진 버전과 설정에 따라 크게 달라집니다."]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            여기까지가 첫째 한계의 숫자입니다. 다음 절은 왜 에이전트에게 평균이 아니라 느린 쪽을 약속해야 하는지 묻습니다.
          </p>
        </div>
      </section>

      <section id="why-tail" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 에이전트는 짧은 답을 연달아 받아 느린 쪽이 체감을 정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            채팅 서비스의 속도 기준을 에이전트에 그대로 가져오면 맞지 않습니다. 요청의 모양이 거의 반대이고, 한 세션이 같은 서버를 수십 번 연달아 두드리기 때문입니다.
          </p>
          <p className="leading-7">
            먼저 모양입니다. 공개된 코딩 에이전트 기록에서 입력 대 출력 비는 Codex가 약 131 대 1, Manus가 약 100 대 1입니다. 매 호출이 지금까지의 대화와 도구 결과를 통째로 다시 보내고, 모델은 짧은 도구 호출이나 수정만 돌려주기 때문입니다.
          </p>
          <p className="leading-7">
            한 사람의 Claude Code 기록도 같은 방향입니다. 887개 세션, 18,353번 호출에서 토큰 수만 뽑아 보니 입력 대 출력이 448 대 1, 호출당 문맥의 중앙값이 205K였습니다. 문맥 1M 모델을 쓴 한 사용자의 표본이라 일반화할 수는 없고, 입력이 압도적이라는 방향만 확인해 줍니다.
          </p>
          <p className="leading-7">
            서버 벤치마크로 널리 쓰이는 MLPerf의 DeepSeek-R1 Server 시나리오는 반대 모양입니다. 평균 입력 800토큰에 평균 출력 3,880토큰인 긴 추론 답입니다. 그 속도 기준인 토큰 간격 p99 80 ms를 초당 토큰으로 바꾸면 12.5인데, 이는 시장에서 가장 싼 공급자들보다도 느린 값입니다.
          </p>
          <p className="leading-7">
            다음은 반복입니다. 에이전트 작업 시간의 71~98퍼센트가 모델 추론에 쓰인다는 측정이 있습니다. 도구 실행은 짧고 세션은 매번 모델 답을 기다리므로, 호출마다 느린 답을 한 번씩만 만나도 그 지연이 수십 턴에 걸쳐 쌓입니다.
          </p>
          <p className="leading-7">
            그래서 평균보다 느린 쪽을 약속해야 합니다. 출력은 중앙값이 150토큰 남짓으로 짧아서 요청마다 속도가 크게 흔들리고, 전체 요청 가운데 느린 4분의 1이 어디에 있는지가 세션의 체감을 정합니다. 독립 평가 기관이 기본 지표로 하위 25퍼센트를 고른 이유도 짧은 출력이 많다는 점이었습니다.
          </p>
          <p className="leading-7">
            첫 토큰까지의 기다림도 채팅과 다르게 잡습니다. 앞부분 기록이 메모리에 남아 있으면 새로 붙은 도구 결과만 계산하면 되지만, 지워졌다면 문맥 전체를 다시 읽어야 합니다. 같은 8장 서버에서 128K 입력을 처음부터 읽는 속도가 초당 약 4,700토큰이었으니 그런 턴은 약 27초가 걸립니다(계산).
          </p>
          <p className="leading-7">
            이 때문에 첫 토큰 기준은 1~2초가 아니라 5~10초 수준의 상위 95퍼센트 값으로 잡고, 기록이 남은 턴과 지워진 턴을 따로 관리합니다. 이제 이 두 지표와 그것으로 만든 용량 단위에 이름을 붙입니다.
          </p>
        </div>
      </section>

      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 느린 쪽 속도와 동시 에이전트 수에 이름을 붙입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절에서 본 역할에 업계가 쓰는 이름을 대응시킵니다. 이름은 Artificial Analysis가 2026년 6월에 공개한 에이전트 서빙 벤치마크 AA-AgentPerf의 정의를 따릅니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 본 뒤에 붙이는 이름"
          description="모두 요청 단위로 재고, 한 측정 단계의 모든 요청에서 백분위를 냅니다."
          items={[
            {
              term: "요청별 출력 속도 (output speed)",
              description: "요청 하나가 첫 토큰을 받은 뒤 초당 받은 토큰 수입니다. 출력 토큰 수에서 1을 빼고 첫 토큰부터 마지막 토큰까지의 시간으로 나눕니다.",
              example: "150토큰을 첫 토큰 뒤 5초에 받았다면 149 ÷ 5 = 29.8 tok/s입니다. (가정)",
              boundary: "첫 토큰까지의 기다림은 들어가지 않습니다. 그것은 아래의 TTFT가 따로 잽니다.",
            },
            {
              term: "P25 출력 속도",
              description: "요청별 출력 속도를 정렬했을 때 하위 25퍼센트 지점의 값입니다. 요청 넷 중 셋은 이보다 빠릅니다.",
              example: "P25가 20이면 느린 4분의 1을 빼고는 모두 초당 20토큰 이상을 받았다는 뜻입니다.",
              boundary: "3절의 평균 몫과 다릅니다. 평균이 25여도 P25는 20 아래일 수 있습니다.",
            },
            {
              term: "P95 TTFT",
              description: "요청을 보낸 뒤 첫 토큰이 오기까지의 시간(TTFT)을 정렬한 상위 95퍼센트 지점입니다.",
              example: "P95가 10초면 스무 번 중 한 번만 10초를 넘깁니다.",
              boundary: "기록이 남은 턴과 지워진 턴이 섞인 값입니다. 둘의 비율이 바뀌면 같은 서버에서도 크게 움직입니다.",
            },
            {
              term: "최대 동시 에이전트 (max concurrent agents)",
              description: "P25 출력 속도와 P95 TTFT를 동시에 지키면서 살아 있을 수 있는 에이전트 세션의 최대 수입니다. 에이전트 서빙 용량의 단위입니다.",
              example: "H200 8장이 DeepSeek V4 Pro를 첫 등급 기준으로 돌릴 때 11개였습니다.",
              boundary: "모델, 호출 기록의 분포, 약속 수준이 함께 붙어야 의미가 있습니다. 숫자 하나만 떼어 장비를 비교하지 않습니다.",
            },
            {
              term: "SLO 등급 (tier)",
              description: "P25 출력 속도의 하한과 P95 TTFT의 상한을 묶은 약속 수준입니다. 1등급은 20 tok/s와 10초, 2등급은 60 tok/s와 5초, 3등급은 180 tok/s와 3초입니다.",
              example: "같은 B300 8장이 1등급에서 144개, 2등급에서 36개를 받았습니다.",
              boundary: "3등급 결과는 공개 데이터에 아직 없습니다. 이후 방법론은 등급 대신 속도와 처리량의 경계선으로 결과를 내도록 바뀌었습니다.",
            },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            등급 숫자는 실제 API 시장에서 나왔습니다. AA는 등급을 자사가 재는 공급자 속도 분포에서 정했다고 밝힙니다. 2026년 11월 3일 기준으로 1T급 오픈 MoE를 파는 저가 공급자의 P25는 초당 17~43토큰, 고속 공급자는 110~290토큰이었습니다.
          </p>
          <p className="leading-7">
            그러니 1등급은 시장 하단, 2등급은 모델 제작사 직영이나 중간 공급자 수준에 가깝습니다. 폐쇄형 프런티어 모델 API의 P25는 75~95토큰이었습니다. 사용자가 실제로 견주는 체감은 이 근처일 가능성이 큽니다.
          </p>
          <p className="leading-7">
            같은 날 공개된 NVIDIA 기술 블로그는 표에 등급을 30, 100, 300으로 적었습니다. 그러나 같은 글의 그림 설명은 20과 60이라 쓰고, AA 페이지에 박힌 실제 결과 데이터의 속도 하한도 20과 60뿐입니다. 30, 100, 300은 AA 페이지의 예시 위젯 값과 같아서 표가 옮겨 적다 생긴 오기로 봅니다.
          </p>
        </div>
        <ProgressiveDetail
          title="vLLM의 AgentX 결과는 왜 이 등급과 바로 견줄 수 없나요?"
          preview="AgentX의 P90 50 tok/s 기준은 백분위의 방향이 공개되지 않아 P25와 같은 자에 올릴 수 없습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              2026년 9월 vLLM 팀은 SemiAnalysis의 AgentX 벤치마크로 결과를 냈습니다. Claude Code 실사용 세션을 재생하며 요청 중앙값이 입력 142K, 출력 444토큰이고 접두 적중률이 96퍼센트를 넘는 부하입니다. 선택 기준은 사용자당 P90 상호작용 속도 50 tok/s 이상이었습니다.
            </p>
            <p className="leading-7">
              문제는 P90의 뜻입니다. 높을수록 좋은 지표에서 P90이 요청의 90퍼센트가 이 이상이라는 뜻인지, 상위 10퍼센트 지점인지가 방법론 페이지에 없습니다. 앞의 뜻이면 AA 2등급보다 엄격하고 뒤의 뜻이면 훨씬 느슨합니다. 그래서 이 글은 정의가 공개된 AA 방식을 기준으로 씁니다.
            </p>
          </div>
        </ProgressiveDetail>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 첫째 한계를 부를 말이 생겼습니다. 다음 절은 같은 서버로 돌아가 둘째 한계인 메모리를 따라갑니다.
          </p>
        </div>
      </section>

      <section id="kv-residency" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 같은 서버의 KV 풀은 200K 세션 18개에서 가득 찹니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            에이전트 세션은 턴 사이에도 메모리를 차지합니다. 다음 턴이 앞부분을 다시 계산하지 않으려면 지금까지 계산한 key와 value 기록, 곧 KV cache를 GPU에 남겨 둬야 하기 때문입니다.
          </p>
          <p className="leading-7">
            3절과 같은 8장 서버에서 Kimi K2.5를 돌릴 때 가중치를 올리고 남은 KV 풀은 설정에 따라 크게 다릅니다. KV를 FP8로 저장하고 문맥을 8장에 나눠 담는 설정에서는 3,621,504토큰이 들어갔습니다. BF16으로 저장하고 나누지 않으면 약 19만 토큰이었습니다.
          </p>
          <p className="leading-7">
            나누지 않으면 왜 이렇게 작을까요. K2.5가 쓰는 압축 attention은 KV를 head 하나 모양으로 저장해서, 텐서 병렬 8장이 같은 KV를 한 벌씩 복제해 들고 있습니다. 8장을 써도 KV 용량은 한 장 몫입니다. 이 복제와 그것을 푸는 방법은{" "}
            <Link to="/cs/ai/mla-kv-replication-and-decode-context-parallel">MLA KV 복제와 decode context parallel</Link>에서 자세히 다룹니다.
          </p>
          <p className="leading-7">
            세션 하나가 200K 문맥을 쓴다면 큰 풀에는 18개가 상주하고, 작은 풀에는 하나도 온전히 들어가지 않습니다. 3절에서 32K 문맥 평균 몫이 20을 넘던 상한이 16개 근처였으니 두 한계가 비슷한 자리에서 만납니다.
          </p>
        </div>

        <ExplainedFormula
          question="속도와 메모리 가운데 무엇이 동시 에이전트 수를 정합니까?"
          idea="동시 에이전트 수에는 두 상한이 따로 있습니다. 속도 상한은 느린 쪽 요청의 출력 속도가 약속 아래로 내려가기 직전의 동시 수이고, 메모리 상한은 KV 풀에 세션 기록이 모두 상주할 수 있는 개수입니다. 실제 용량은 둘 가운데 먼저 닿는 작은 쪽입니다."
          formula={String.raw`C^{*} = \min\left(C_{\text{speed}},\ \left\lfloor \frac{K_{\text{pool}}}{L} \right\rfloor\right)`}
          annotatedFormula={String.raw`\underbrace{C^{*}}_{\text{실제 용량}} = \min\left(\underbrace{C_{\text{speed}}}_{\text{P25가 약속을 지키는 최대 동시 수}},\ \underbrace{\left\lfloor \frac{K_{\text{pool}}}{L} \right\rfloor}_{\text{기록이 모두 상주하는 세션 수}}\right)`}
          operations={[
            {
              expression: String.raw`C_{\text{speed}}`,
              annotation: [
                "동시 수를 늘려 가며 P25 출력 속도와 P95 TTFT를 쟀을 때 둘 다 통과하는 마지막 값입니다.",
                "3절의 평균 몫으로는 위로 어림한 값만 얻습니다. 평균 기준으로는 16과 32 사이였습니다.",
              ],
            },
            {
              expression: String.raw`\left\lfloor \frac{K_{\text{pool}}}{L} \right\rfloor`,
              annotation: [
                "KV 풀의 토큰 수를 세션 하나의 문맥 길이로 나누고 소수점은 버립니다.",
                "세션 일부만 들어간다고 반쯤 적중하지 않습니다. 밀려난 세션은 다음 턴에 앞부분을 다시 계산합니다.",
              ],
            },
            {
              expression: String.raw`\min(\cdot,\cdot)`,
              annotation: [
                "두 상한 중 먼저 닿는 쪽이 약속을 깹니다.",
                "메모리 상한을 넘으면 적중률이 무너져 속도까지 떨어지므로, 실제로는 메모리 쪽이 속도 상한을 끌어내리기도 합니다.",
              ],
            },
          ]}
          terms={[
            { symbol: String.raw`K_{\text{pool}}`, name: "KV 풀 크기", description: "가중치와 작업 공간을 빼고 남은 메모리에 담을 수 있는 토큰 수입니다. KV 저장 형식과 문맥을 장치에 나누는 설정에 따라 수십 배 달라집니다." },
            { symbol: String.raw`L`, name: "세션 문맥 길이", description: "살아 있는 세션 하나가 다음 턴을 위해 남겨 둬야 하는 토큰 수입니다. 세션이 진행될수록 커집니다." },
            { symbol: String.raw`C_{\text{speed}}`, name: "속도 상한", description: "속도 약속만으로 정해지는 최대 동시 수입니다." },
          ]}
          assumptions={[
            "모든 세션이 같은 길이 L을 쓴다고 둡니다. 실제로는 길이가 다른 세션이 섞이므로 분포의 상위 값으로 계획합니다.",
            "같은 접두를 공유하는 세션이 없다고 둡니다. 시스템 프롬프트가 같으면 그만큼은 한 번만 저장됩니다.",
          ]}
          interpretation="큰 풀에서는 3,621,504를 200,000으로 나눠 18이 나오고, 32K 표의 속도 상한은 평균으로도 16~31 사이라 두 한계가 비슷합니다. 작은 풀이면 메모리 쪽이 1개 아래로 먼저 막힙니다. 읽으면 안 되는 것은 18이 곧 판매 가능한 수라는 결론입니다. 문맥이 128K 근처로 길어지면 속도 상한이 먼저 8~15 근처로 내려옵니다."
        />

        <CalculationWalkthrough
          title="같은 서버에서 두 상한을 나란히 세기"
          question="200K 세션을 받는 8장 서버는 몇 개에서 먼저 막힙니까?"
          scope="KV 풀과 속도 표는 rtx6kpro 위키의 현장 경험 값입니다. 속도 상한은 평균 몫으로 어림한 위쪽 한계입니다."
          steps={[
            { label: "큰 풀의 세션 수", expression: "3,621,504 ÷ 200,000", result: "18개", reason: "FP8 KV와 문맥 8분할을 켠 풀입니다. 소수점 아래 세션은 상주하지 못합니다." },
            { label: "한 사용자 기록의 중앙 문맥", expression: "3,621,504 ÷ 205,000", result: "17개", reason: "4절의 448 대 1 기록에서 호출당 문맥 중앙값을 넣으면 하나가 줄어듭니다." },
            { label: "작은 풀의 세션 수", expression: "190,000 ÷ 200,000", result: "0개", reason: "BF16 KV에 분할을 끄면 200K 세션 하나도 온전히 못 담습니다. 위키는 약 1개로 적었습니다." },
            { label: "32K 문맥의 속도 쪽", expression: "399.5 ÷ 16, 499.8 ÷ 32", result: "25.0과 15.6", reason: "평균 몫이 20을 넘는 마지막 칸은 16개입니다. P25로 판정하면 이보다 작아집니다." },
            { label: "128K 문맥의 속도 쪽", expression: "173.2 ÷ 8, 224.1 ÷ 16", result: "21.7과 14.0", reason: "같은 표의 128K 행입니다. 문맥이 길면 한 걸음에 읽을 KV가 늘어 속도 상한이 8개 근처로 내려옵니다." },
          ]}
          conclusion="200K 세션에서는 큰 풀이어도 메모리 18개와 속도 8~16개가 비슷한 자리에서 만납니다. 작은 풀이면 메모리가 먼저 막히므로 KV 형식과 분할 설정은 선택이 아니라 전제입니다."
          caveats={["속도 표는 출력 길이를 강제한 합성 요청이고 추측 디코딩 수락률이 내용에 따라 달라집니다.", "세션마다 L이 다르므로 실제 상주 수는 길이 분포로 다시 계산합니다."]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            메모리 상한을 넘으면 무슨 일이 생길까요. 들어가지 못한 세션의 기록이 다른 세션의 기록을 밀어내고, 밀려난 세션은 다음 턴에 앞부분을 다시 계산합니다. 그 계산이 또 다른 세션을 밀어내는 악순환을 context thrashing이라고 부릅니다.
          </p>
          <p className="leading-7">
            2026년 공개된 에이전트 부하 특성 논문이 이를 쟀습니다. Qwen3.6-27B를 H100 NVL 두 장으로 서빙하며 Terminal-Bench 세션을 15개에서 20개로 늘리자 접두 적중률이 98.85퍼센트에서 16.78퍼센트로 떨어지고, 요청당 생성 속도가 30.08에서 16.96 tok/s로 내려갔습니다.
          </p>
          <p className="leading-7">
            세션 수는 3분의 1 늘었을 뿐인데 적중률은 거의 사라졌습니다. 다른 세션의 기록이 쌓일 자리가 없어진 순간 무너지므로 완만한 곡선이 아니라 절벽에 가깝습니다. 25개에서도 적중률은 19.21퍼센트에 머물고 속도는 10.30까지 내려갑니다.
          </p>
        </div>

        <CacheThrashViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            대응은 두 갈래입니다. 하나는 밀려난 기록을 지우지 않고 호스트 메모리로 내려 두었다가 다음 턴에 가져오는 계층형 KV 저장입니다. vLLM에서는 LMCache 같은 확장이 이 일을 맡고, 원리는{" "}
            <Link to="/cs/ai/tensorrt-llm-kv-cache-and-kernels#retention">KV 보존 우선순위와 호스트 오프로드</Link>에서 볼 수 있습니다.
          </p>
          <p className="leading-7">
            다른 하나는 같은 세션의 다음 턴을 기록이 남아 있는 복제본으로 보내는 접두 인지 라우팅입니다. 서버가 여러 대일 때 의미가 있고, GitHub Copilot 실서비스 분석에서 턴 경계의 적중률이 55퍼센트에 그쳤다는 점이 그 필요를 보여 줍니다. 구현 위치는{" "}
            <Link to="/cs/ai/onprem-k8s-inference-platform#two-level-scheduling">두 단계 스케줄링</Link>을 보면 됩니다.
          </p>
          <p className="leading-7">
            두 방법이 적중률을 얼마나 되살리는지는 이 근거 묶음에서 측정되지 않았습니다. 그래서 다음 절의 측정은 문맥이 실제로 자라는 재생이어야 하고, 오프로드를 켠 경우와 끈 경우를 함께 재야 합니다.
          </p>
        </div>
      </section>

      <section id="measure" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 내 서버는 문맥이 자라는 닫힌 루프로 재생해 잽니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            공개 결과는 남의 모델과 남의 호출 기록에서 나왔습니다. 내 서버의 용량은 내 기록을 재생해서 같은 정의로 재야 합니다. AA-AgentPerf가 먼저 그 방법을 공개했습니다.
          </p>
          <p className="leading-7">
            AA는 오픈 모델 세 개를 OpenCode 하네스에 붙여 실제 공개 저장소의 이슈를 풀게 하고 그 궤적을 모았습니다. 세션은 최대 200턴이고 요청당 입력은 5K~131K, 평균 약 27K입니다. 출력 중앙값은 약 150, P95는 약 2K이며, 도구 지연은 0.1~5초에 중앙값 약 1초로 흉내 냅니다.
          </p>
          <p className="leading-7">
            측정은 동시 수를 단계로 나눠 진행합니다. 단계마다 궤적 30개 이상이 끝나고, 모든 가상 에이전트가 궤적을 세 개 이상 마치며, 정상 상태 측정이 10분 이상이어야 합니다. 모든 에이전트가 30초 이상 활동한 구간만 집계하고, 단계 사이에는 앞에 다른 접두를 붙여 앞 단계의 KV를 재사용하지 못하게 합니다.
          </p>
          <p className="leading-7">
            최대 동시 수는 지수적으로 늘리다가 처음 실패한 지점과 마지막 통과 지점 사이를 이분 탐색해 찾습니다. 동시 수가 몇 배 범위인지 모를 때 단계 수를 로그 수준으로 줄이는 방법입니다. 정상 구간의 뜻은{" "}
            <Link to="/cs/ai/serving-benchmark-methodology#protocol">준비 구간과 정상 구간</Link>에서 다뤘습니다.
          </p>
          <p className="leading-7">
            같은 정의로 내 서버를 재기 위해 표준 라이브러리만 쓰는 재생 도구를 만들었습니다. 핵심은 닫힌 루프입니다. 세션은 응답을 받고, 기록된 대기만큼 쉬고, 도구 결과 크기의 텍스트를 붙여 다음 요청을 보냅니다. 앞 턴의 실제 응답이 다음 요청에 들어가므로 문맥이 진짜로 자라고, 서버의 접두 캐시와 KV 한계가 결과에 그대로 드러납니다.
          </p>
        </div>

        <AlgorithmBlock
          title="SLO를 지키는 최대 동시 에이전트 수 찾기"
          input={[
            "호출 기록 세션들: 턴마다 붙는 입력 토큰, 출력 토큰, 앞 턴과의 대기",
            "속도 약속: P25 출력 속도 하한 S, P95 TTFT 상한 T",
            "준비 시간 W, 측정 시간 M, 최소 완료 수 n, 측정창 최대 배율 k, 동시 수 상한 Cmax",
          ]}
          steps={[
            {
              code: "function measure(c): 세션 c개를 고유 salt로 시작하고 각 세션을 닫힌 루프로 재생한다",
              note: "단계마다 접두에 다른 salt를 붙여 앞 단계의 KV를 재사용하지 못하게 합니다. 출력 길이는 기록대로 강제합니다.",
            },
            {
              code: "W초를 기다린 뒤 서버 지표를 저장하고 M초를 측정한다; 완료 요청 < n 이고 경과 < k·M 이면 측정창을 늘린다",
              note: "자체 시험에서 찾은 첫 버그를 고친 줄입니다. 표본이 모자란 것을 약속 위반으로 판정하던 것을 측정창 연장으로 바꿨습니다.",
            },
            {
              code: "speed_i ← (out_i − 1) / (t_last_i − t_first_i); ttft_i ← t_first_i − t_send_i  (준비 이후 시작해 창 안에서 끝난 요청만)",
              note: "요청별 출력 속도와 TTFT를 AA와 같은 정의로 계산합니다.",
            },
            {
              code: "agg_out ← Σ 요청별 출력 × (창과 겹친 생성 시간 ÷ 전체 생성 시간) ÷ 창 길이",
              note: "두 번째 버그를 고친 줄입니다. 완료 요청만 세면 출력이 긴 고동시성 단계의 합계가 작게 잡혔습니다.",
            },
            {
              code: "pass(c) ← 오류 = 0 ∧ P25(speed) ≥ S ∧ P95(ttft) ≤ T",
              note: "세 조건을 모두 통과해야 그 동시 수에서 약속을 지킨 것입니다.",
            },
            {
              code: "lo ← 0; c ← 1; while c ≤ Cmax and pass(c): lo ← c; c ← 2c; hi ← (c ≤ Cmax ? c : Cmax + 1)",
              note: "지수 증가 단계입니다. 판정 순서의 예(가정): 1, 2, 4, 8, 16 통과, 32 실패면 lo = 16, hi = 32입니다.",
            },
            {
              code: "while hi − lo > 1: mid ← ⌊(lo + hi) / 2⌋; if pass(mid): lo ← mid else hi ← mid",
              note: "이분 탐색 단계입니다. 같은 예에서 24 실패, 20 실패, 18 통과, 19 통과로 lo = 19에서 멈춥니다.",
            },
          ]}
          output="lo(SLO를 지키는 최대 동시 에이전트 수)와 그 단계의 agg_out(그때 서버의 총 출력 속도)"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 도구는 실서버에 쓰기 전에 가짜 서버로 먼저 시험했습니다. 단일 요청 속도를 80 tok/s로 둔 가짜 서버에서 20 tok/s 기준으로 탐색하니 이론 상한과 같은 19를 찾았습니다. 위 절차의 둘째 줄과 넷째 줄이 이 시험에서 고친 두 버그입니다.
          </p>
          <p className="leading-7">
            첫째 버그는 고동시성 단계에서 측정창 안에 끝난 요청이 너무 적을 때 생겼습니다. 표본이 몇 개뿐이면 P25가 우연히 낮게 나와 실패로 판정됐습니다. 이제는 최소 완료 수를 채울 때까지 측정창을 늘리고, 그래도 모자라면 표본 부족으로 따로 표시합니다.
          </p>
          <p className="leading-7">
            둘째 버그는 총 처리량을 완료된 요청의 출력으로만 센 것입니다. 동시 수가 클수록 창 경계에 걸친 긴 요청이 많아 합계가 낮게 잡혔고, 그 합계는 다음 절의 비용 계산에 분모로 들어갑니다. 이제는 창 안에서 실제로 생성된 몫만 비율로 셉니다.
          </p>
          <p className="leading-7">
            실서버 스모크 시험도 거쳤습니다. vLLM 0.27.1에 27B 모델을 올린 RTX 4090 48GB 서버에서 동시 1·2로 돌려, 출력 길이가 60/60과 78/78로 정확히 강제되고 프롬프트가 턴마다 1,571에서 1,808토큰으로 자라며 서버 접두 적중률 0.65가 집계되는 것을 확인했습니다.
          </p>
        </div>

        <ProgressiveDetail
          title="이 재생 측정은 무엇을 실제와 다르게 잴까요?"
          preview="도구 결과가 무의미한 단어열이라 추측 디코딩 수락률이 낮게 나오고, 문맥 상한을 넘는 세션은 잘립니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              기록에는 토큰 수만 있고 내용은 없으므로 도구 결과 자리에는 의미 없는 단어열을 넣습니다. 다음 토큰을 미리 추측하는 디코딩은 내용이 자연스러울수록 잘 맞으므로, 이 측정의 수락률은 실제보다 낮을 수 있습니다.
            </p>
            <p className="leading-7">
              출력 길이는 모델이 일찍 끝내지 못하게 강제합니다. 세션 문맥이 서버의 최대 길이를 넘으면 그 턴에서 세션을 끊습니다. 한 사용자 기록은 문맥 중앙값이 205K라서 131K 상한으로 재면 상당수 세션이 중간에 잘립니다.
            </p>
            <p className="leading-7">
              임대 실측의 기준 구성은 FP8 KV와 문맥 8분할로 잡고, 분할을 끈 경우는 별도 실험으로 둡니다. 서버가 Server Edition인지, PCIe 토폴로지가 어떤지, vLLM 버전이 무엇인지도 결과와 함께 저장합니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="evidence" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 공개 기준과 결과는 원문에서 이렇게 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞에서 쓴 등급과 결과를 원문에서 다시 확인합니다. 숫자는 2026년 11월 3일에 원 페이지의 텍스트와 임베디드 데이터를 직접 열어 대조한 값입니다.
          </p>
        </div>

        <CitationBlock
          source="Artificial Analysis · First results from AA-AgentPerf: the hardware benchmark for the agent era (2026-06-12)"
          citeKey={1}
          href="https://artificialanalysis.ai/articles/aa-agentperf"
        >
          독립 평가 기관의 첫 결과 발표입니다. 실제 코딩 에이전트 궤적을 재생해 &ldquo;how many concurrent agents a system can serve while meeting production service-level targets&rdquo;를 잰다고 밝히고, 지표를 &ldquo;P25 output speed and P95 time to first token, computed across all requests in a test phase&rdquo;로 정의합니다. 최대 동시 수는 &ldquo;an exponential ramp followed by a binary search&rdquo;로 찾습니다. DeepSeek V4 Pro 기준 등급 표는 20 tok/s와 10초, 60 tok/s와 5초, 180 tok/s와 3초입니다. 이 글은 정의와 방법, 런칭 시점 결과만 인용합니다.
        </CitationBlock>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            런칭 데이터에서 1등급 결과를 꺼내면 H200 8장이 11개, MI355X 8장이 17개, B300 8장이 144개, GB300 NVL72가 GPU 32장으로 1,840개입니다. GPU 한 장으로 나누면 각각 1.375, 2.125, 18, 57.5개입니다. 2등급에서는 7, 1, 36, 그리고 GPU 40장으로 768개였습니다.
          </p>
          <p className="leading-7">
            H200과 MI355X는 AA가 직접 설정한 결과라 여유가 더 있을 수 있다고 AA가 적었습니다. B300과 GB300은 NVIDIA가 prefill과 decode를 나누고 추측 디코딩을 켠 설정입니다. 같은 B300 8장에서 속도 하한을 20에서 60으로 올리자 동시 수가 4분의 1로 줄었다는 점이 3절의 곡선을 실제 장비로 보여 줍니다.
          </p>
        </div>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-3 font-bold">시스템 (런칭 데이터)</th>
                <th className="py-2 pr-3 text-right font-bold">1등급</th>
                <th className="py-2 pr-3 text-right font-bold">2등급</th>
                <th className="py-2 text-right font-bold">1등급 GPU당</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <tr className="border-b border-border/60"><td className="py-2 pr-3">H200 ×8, AA 설정</td><td className="py-2 pr-3 text-right">11</td><td className="py-2 pr-3 text-right">7</td><td className="py-2 text-right">1.375</td></tr>
              <tr className="border-b border-border/60"><td className="py-2 pr-3">MI355X ×8, AA 설정</td><td className="py-2 pr-3 text-right">17</td><td className="py-2 pr-3 text-right">1</td><td className="py-2 text-right">2.125</td></tr>
              <tr className="border-b border-border/60"><td className="py-2 pr-3">B300 ×8, NVIDIA 설정</td><td className="py-2 pr-3 text-right">144</td><td className="py-2 pr-3 text-right">36</td><td className="py-2 text-right">18</td></tr>
              <tr><td className="py-2 pr-3">GB300 NVL72, NVIDIA 설정</td><td className="py-2 pr-3 text-right">1,840 (32장)</td><td className="py-2 pr-3 text-right">768 (40장)</td><td className="py-2 text-right">57.5</td></tr>
            </tbody>
          </table>
        </div>

        <CitationBlock
          source="NVIDIA Technical Blog · NVIDIA Achieves Leading Agentic Coding Performance on First Agentic AI Benchmark (2026-06-12)"
          citeKey={2}
          href="https://developer.nvidia.com/blog/nvidia-achieves-leading-agentic-coding-performance-on-first-agentic-ai-benchmark/"
        >
          벤더 자기보고입니다. Table 1은 등급을 &ldquo;SLO #1 30 10 / SLO #2 100 5 / SLO #3 300 3&rdquo;으로 적지만, 같은 글 Figure 4 설명은 &ldquo;at both 20 and 60 tokens per second service level objectives&rdquo;라고 씁니다. AA 결과 데이터의 속도 하한은 20과 60뿐이므로 이 글은 AA 원문의 20, 60, 180을 따릅니다. GPU당 57.5 에이전트라는 수치는 AA 데이터의 20 tok/s 레코드와 일치합니다.
        </CitationBlock>

        <CitationBlock
          source="MLCommons · DeepSeek Reasoning for MLPerf Inference v5.1 (2025-09-09)"
          citeKey={3}
          href="https://mlcommons.org/2025/09/deepseek-inference-5-1/"
        >
          공식 규격입니다. DeepSeek-R1 Server 시나리오에 &ldquo;the 99th percentile TTFT threshold to two seconds&rdquo;와 &ldquo;the 99th percentile TPOT threshold to 80 ms&rdquo;를 둡니다. 데이터셋은 평균 입력 800, 평균 출력 3,880토큰입니다. 80 ms를 초당 12.5토큰으로 바꾼 것은 이 글의 계산이고, 에이전트 기준으로 부적합하다는 판단도 이 글의 해석입니다.
        </CitationBlock>

        <CitationBlock
          source="Yuan et al. · Agentic AI Workload Characteristics, arXiv 2605.26297 (IISWC 2026)"
          citeKey={4}
          href="https://arxiv.org/html/2605.26297"
        >
          논문 자기보고입니다. Table II는 Qwen3.6-27B를 H100 NVL 두 장으로 서빙하며 동시 에이전트를 늘릴 때의 context thrashing을 보여 줍니다. Terminal-Bench 2.0에서 동시 15, 20, 25의 접두 적중률은 98.85, 16.78, 19.21퍼센트이고 요청당 생성 속도는 30.08, 16.96, 10.30 tok/s입니다. 같은 논문은 LLM 추론이 에이전트 실행 시간의 71~98퍼센트를 차지한다고 보고합니다. 이 수치는 해당 모델과 장비의 결과이며, 다른 장비의 붕괴 지점을 그대로 알려 주지 않습니다.
        </CitationBlock>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            원문을 종합하면 자체 서비스의 기본 약속은 P25 출력 속도 30 tok/s 이상과 P95 TTFT 10초 이하로 두고, P25가 20 아래로 내려가면 경보를 냅니다. 30은 저가 공급자 P25 범위 17~43의 가운데이고 AA 위젯이 비용 최적화 예시로 든 값이기도 합니다.
          </p>
          <p className="leading-7">
            프리미엄 약속은 P25 60 tok/s 이상과 P95 TTFT 5초 이하로, AA 2등급과 같습니다. 내부 진단용으로는 기록이 남은 턴의 TTFT P95를 3초 이하로, 접두 적중률을 90퍼센트 이상으로 따로 봅니다. 이 권장값은 근거 보고서의 해석이고, 표준 기관이 정한 값은 아닙니다.
          </p>
        </div>
      </section>

      <section id="economics" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 용량의 분모가 바뀌면 살 수 있는 장비 가격도 바뀝니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            용량을 동시 에이전트 수로 재면 비용 계산의 분모도 바뀝니다. 장비가 한 해에 만드는 출력은 최대 처리량이 아니라 약속을 지키는 동시 수에서의 총 출력 속도로 계산해야 합니다.
          </p>
          <p className="leading-7">
            하드웨어 가격은 매일 움직이므로 여기서는 가격을 넣지 않습니다. 대신 같은 출력을 API로 샀을 때의 금액을 계산하고, 장비가 그보다 싸려면 얼마 이하여야 하는지를 거꾸로 구합니다. 토큰 단가를 정하는 틀은{" "}
            <Link to="/cs/ai/inference-cost-and-capacity-planning#capacity">추론 비용과 용량 계획</Link>을, 소유와 임대의 손익분기와 같은 역산의 그림은{" "}
            <Link to="/cs/ai/own-vs-rent-inference-capacity#unit-mismatch">토큰 원가와 API 가격의 단위 차이</Link>를 전제로 합니다.
          </p>
        </div>

        <ExplainedFormula
          question="약속을 지키는 처리량이 주어지면 장비에 최대 얼마까지 쓸 수 있습니까?"
          idea="수명 동안 장비가 만드는 출력을 100만 토큰 묶음으로 세고, 같은 묶음을 API로 샀을 때의 돈을 구합니다. 거기서 전기료를 빼고 유지보수 비율로 나누면 장비 구입비가 넘으면 안 되는 상한이 됩니다. 묶음 하나를 만드는 데 걸리는 시간의 분모에 약속을 지키는 처리량이 들어갑니다."
          formula={String.raw`\begin{aligned} C_{\max} &= \frac{p_{\text{api}} \cdot N - E}{1 + mY}, \qquad N = \frac{Y S u}{t} \\ t &= \frac{10^{6}}{X_{\text{SLO}}} + \frac{10^{6}\,\rho\,(1-h)}{X_{\text{pre}}} \\ p_{\text{api}} &= p_{\text{out}} + \rho\,\bigl(h\,p_{\text{hit}} + (1-h)\,p_{\text{in}}\bigr) \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned} \underbrace{C_{\max}}_{\text{장비 구입비 상한}} &= \frac{\overbrace{p_{\text{api}} \cdot N}^{\text{같은 출력을 API로 산 돈}} - \overbrace{E}^{\text{수명 전기료}}}{\underbrace{1 + mY}_{\text{구입비에 붙는 유지보수}}} \\ \underbrace{t}_{\text{묶음 하나의 초}} &= \underbrace{\frac{10^{6}}{X_{\text{SLO}}}}_{\text{출력 생성}} + \underbrace{\frac{10^{6}\,\rho\,(1-h)}{X_{\text{pre}}}}_{\text{미적중 입력 계산}} \end{aligned}`}
          operations={[
            {
              expression: String.raw`\frac{10^{6}}{X_{\text{SLO}}}`,
              annotation: [
                "100만 출력 토큰을 약속을 지키는 총 출력 속도로 만드는 데 걸리는 초입니다.",
                "여기에 최대 처리량 900을 넣으면 시간이 짧게 잡혀 장비가 실제보다 많이 만드는 것으로 계산됩니다.",
              ],
            },
            {
              expression: String.raw`\frac{10^{6}\,\rho\,(1-h)}{X_{\text{pre}}}`,
              annotation: [
                "출력 100만 개에 딸린 입력 가운데 캐시에 없어 새로 계산해야 하는 몫의 시간입니다.",
                "적중한 입력은 비용 0으로 둡니다. 6절처럼 적중률이 무너지면 이 항이 커집니다.",
              ],
            },
            {
              expression: String.raw`N = \frac{Y S u}{t}`,
              annotation: [
                "수명 Y년의 초 S에 가동률 u를 곱하고 묶음 하나의 시간으로 나눠 묶음 수를 셉니다.",
              ],
            },
            {
              expression: String.raw`p_{\text{api}} \cdot N - E`,
              annotation: [
                "같은 출력을 API로 샀다면 냈을 돈에서 자체 운영의 전기료를 뺍니다.",
                "API 단가는 출력 단가에 출력당 입력 수 ρ와 적중 여부별 입력 단가를 섞어 만듭니다.",
              ],
            },
          ]}
          terms={[
            { symbol: String.raw`X_{\text{SLO}}`, name: "약속을 지키는 총 출력 속도", description: "7절 절차의 출력인 agg_out입니다. 이 글의 핵심 분모입니다." },
            { symbol: String.raw`\rho`, name: "출력당 입력 토큰", description: "에이전트 부하는 100~131이고 한 사용자 기록은 448이었습니다." },
            { symbol: String.raw`h`, name: "접두 적중률", description: "입력 가운데 캐시에서 재사용한 비율입니다." },
            { symbol: String.raw`p_{\text{out}},\ p_{\text{hit}},\ p_{\text{in}}`, name: "API 단가", description: "100만 토큰당 출력, 적중 입력, 미적중 입력 가격입니다. 조회일을 붙인 매개변수로 넣습니다." },
            { symbol: String.raw`m,\ Y,\ u`, name: "유지보수율, 수명, 가동률", description: "연간 유지보수 비율, 상각 연수, 결제 시간 대비 실제로 일한 시간입니다." },
          ]}
          assumptions={[
            "적중한 입력의 자체 비용을 0으로 둡니다. 긴 문맥 세션이 많아 KV가 넘치면 이 가정은 자체 운영에 낙관적입니다.",
            "인건비와 상면 비용은 넣지 않습니다. 넣으면 상한이 그만큼 내려갑니다.",
            "미적중 입력의 계산 속도는 추정값 8,000 tok/s로 둡니다. 3,000~15,000 사이에서 바꿔 봐야 하는 값입니다.",
          ]}
          interpretation="같은 식에 X_SLO만 900에서 400으로 바꾸면 상한이 432k달러에서 229k달러로 47퍼센트 줄어듭니다. 읽어야 할 것은 결론을 가르는 것이 전기료보다 약속을 지키는 처리량과 가동률이라는 점입니다. 읽으면 안 되는 것은 229k달러를 지금 사도 되는 가격으로 쓰는 것입니다. 400은 측정이 아니라 3절 표에서 어림한 가정입니다."
        />

        <CalculationWalkthrough
          title="8장 서버 한 대, 3년, 가동률 50퍼센트의 상한"
          question="약속을 지키는 총 출력이 400 tok/s라면 장비에 최대 얼마까지 쓸 수 있을까요?"
          scope="부하는 입력 대 출력 100 대 1, 적중률 95퍼센트입니다. API 단가는 K2.5 공급자 가격(2026-11-02 조회: 입력 0.50, 적중 입력 0.15, 출력 2.50달러)을 매개변수로 넣습니다. 전기 200원/kWh, PUE 1.4, 환율 1,400원, 유지보수 연 5퍼센트는 추정입니다."
          steps={[
            { label: "출력 100만 개당 API 단가", expression: "2.50 + 100 × 0.1675", result: "19.25달러", reason: "입력 한 개의 평균 단가는 적중 95퍼센트의 0.15와 미적중 5퍼센트의 0.50을 섞은 0.1675달러입니다." },
            { label: "묶음 하나를 만드는 시간", expression: "1,000,000 ÷ 400 + 625", result: "3,125초", reason: "출력 생성 2,500초에, 미적중 입력 500만 개를 8,000 tok/s로 계산하는 625초를 더합니다." },
            { label: "3년 동안 만드는 묶음", expression: "47,304,000초 ÷ 3,125초", result: "15,137.28묶음", reason: "3년의 초 94,608,000에 가동률 50퍼센트를 적용한 시간입니다." },
            { label: "같은 출력을 API로 샀을 때", expression: "15,137.28 × 19.25", result: "약 291,393달러", reason: "장비가 이길지 질지를 가르는 기준 금액입니다." },
            { label: "3년 전기료", expression: "9,250.6달러 × 3", result: "약 27,752달러", reason: "IT 부하 5.28 kW에 PUE를 곱한 7.39 kW로 1년 64,754 kWh를 쓴다고 계산했습니다." },
            { label: "장비 구입비 상한", expression: "(291,393 − 27,752) ÷ 1.15", result: "약 229k달러", reason: "유지보수가 3년간 구입비의 15퍼센트만큼 더 붙으므로 1.15로 나눕니다." },
            { label: "GPU 한 장의 상한", expression: "(229k − 45k) ÷ 8", result: "약 23k달러", reason: "섀시와 네트워크를 약 45k달러로 둔 추정입니다. 장당 가격이 이보다 높으면 API가 쌉니다." },
          ]}
          conclusion="같은 조건에서 X_SLO가 250, 400, 650, 900이면 상한은 147k, 229k, 342k, 432k달러입니다. 커뮤니티의 900을 그대로 쓰면 상한이 1.9배 부풀어 같은 장비가 훨씬 싸 보입니다."
          caveats={[
            "부하가 448 대 1이면 같은 공급자 기준 API 비용이 출력 100만 개당 약 77.5달러, DeepSeek V4-Pro 할인 시간대 가격이면 약 26.1달러로 올라갑니다(계산, 적중률 95퍼센트).",
            "가장 싼 API인 V4-Pro 할인 시간대와 견주면 거의 모든 시나리오에서 자체 운영이 집니다.",
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 계산의 한계도 같은 자리에 둡니다. 400이라는 분모는 32K 문맥 표에서 평균 몫으로 어림한 값이고, 8장 PCIe 서버로 1T MoE를 에이전트 약속 아래 잰 공개 측정은 아직 없습니다. 그래서 구매 전에 임대 서버에서 7절 절차로 X_SLO를 먼저 재는 편이 가격 협상보다 결과를 더 크게 바꿉니다.
          </p>
          <p className="leading-7">
            AA의 재생은 도구 지연 중앙값을 1초로 두지만, Codex 실기록의 턴 간 대기는 중앙값 5.2초였습니다. 실서비스 세션은 기다리는 동안 GPU를 덜 쓰므로 같은 서버가 더 많은 세션을 받을 수도 있습니다. 반대로 AA는 단계 사이에 캐시를 일부러 끊어 보수적으로 잽니다.
          </p>
          <p className="leading-7">
            결국 이 글이 남기는 판단은 단순합니다. 용량은 약속을 지키는 동시 에이전트 수로 세고, 그 수는 속도와 KV 상주 가운데 작은 쪽이 정하며, 비용의 분모에는 그 수에서 잰 총 출력만 들어갑니다.
          </p>
        </div>
      </section>

      <section id="prediction-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 조건을 바꾸면 답이 어떻게 달라질까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            32K 표에서 평균 몫이 25.0인 동시 16개를 1등급 통과라고 보고해도 될까요? 무엇을 더 재야 할까요? (답: 3절, 5절)
          </p>
          <p className="leading-7">
            같은 서버에서 KV를 BF16으로 저장하고 문맥 분할을 끄면 200K 세션을 몇 개 받을 수 있고, 그때 무엇이 먼저 막힐까요? (답: 6절)
          </p>
          <p className="leading-7">
            측정 도구가 완료된 요청의 출력만 세어 총 처리량을 냈다면 장비 구입비 상한은 실제보다 높게 나올까요, 낮게 나올까요? (답: 7절, 9절)
          </p>
        </div>
      </section>
    </div>
  );
}
