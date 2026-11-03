import TermBreakdown from "@/components/articles/term-breakdown";
import EngineeringRecoveryViz from "./viz/EngineeringRecoveryViz";

export default function EngineeringRecovery() {
  return (
    <section id="engineering-recovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">링크를 넓힐 수 없다면 보내는 바이트와 대기 시간을 줄인다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          소프트웨어가 PCIe의 물리적 상한을 바꾸지는 못한다. 대신 경계를 넘는 토큰을 줄이고, 실제 activation payload를
          줄이고, 남은 통신을 연산과 겹친다. 어느 기법이 이기는지는 모델·batch·topology에 따라 달라지므로 다음 순서대로
          하나씩 A/B한다.
        </p>

        <h3 id="expert-placement" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">1) Expert 배치: 경계를 넘는 토큰부터 줄인다</h3>
        <p className="leading-7">
          자주 함께 선택되는 expert를 같은 GPU에 두고, 공유 expert가 있다면 용량이 허용하는 범위에서 복제한다. 그러면
          해당 토큰의 dispatch·combine은 로컬에 남는다. 효과는 라우팅 trace에서 “전체 토큰 중 원격 expert로 간 비율”이
          얼마나 줄었는지로 검증한다. 전문가 수와 조합이 한 장 용량을 넘으면 이 방법만으로 EP를 없앨 수 없다.
        </p>

        <h3 id="tp-vs-ep-choice" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">2) TP·PP·EP 조합: 통신 위치를 바꿔 비교한다</h3>
        <p className="leading-7">
          TP는 layer 내부 collective를 만들고, PP는 stage 경계에서 activation을 넘긴다. PP는 collective 빈도를 줄일 수
          있지만 stage 의존성과 pipeline bubble을 만든다. 첫 토큰이 나오는 시점도 늦어질 수 있다.
        </p>
        <p className="leading-7">
          MoE expert가 여러 장에 남아 있다면 PP로 바꿔도 EP dispatch는 사라지지 않는다. 따라서 “PCIe면 무조건 PP”라는
          기본값을 두지 않는다. 같은 입력·출력 길이와 동시 요청 수에서 TP/PP/EP 조합별 TTFT·TPOT·tokens/s·p99를
          비교한다. 기본 분할 방식은{" "}
          <a href="/cs/ai/tensor-and-pipeline-parallel-inference">tensor·pipeline parallel 글</a>을 참고한다.
        </p>

        <h3 id="quantization-shrinks-payload" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">3) 통신 정밀도: activation payload를 줄인다</h3>
        <p className="leading-7">
          BF16 activation을 FP8이나 INT8로 통신하면 같은 원소 수의 payload 바이트를 줄일 수 있다. 그러나 weight만 INT4로
          낮춘다고 EP activation all-to-all이 자동으로 4분의 1이 되지는 않는다. Weight 정밀도, activation 정밀도와
          communication-only quantization을 분리해 정확도와 실제 collective bytes를 확인한다.
        </p>

        <h3 id="batching-amortizes-overhead" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">4) Batching·overlap: 통신을 없애지 말고 가린다</h3>
        <p className="leading-7">
          Batch가 커지면 연산량뿐 아니라 라우팅 토큰과 all-to-all payload도 늘어난다. 다만 큰 메시지가 링크 효율을 높이고
          expert 연산과 dispatch/combine을 겹칠 여지를 만들 수 있다.
        </p>
        <p className="leading-7">
          Batch를 키운 뒤 통신 시간이 그대로일 것이라고 가정하면 안 된다. Collective duration, overlap ratio, TTFT와
          메모리 사용량을 다시 잰다. Prefill과 decode의 적정 batch가 다르면{" "}
          <a href="/cs/ai/disaggregated-prefill-decode-serving">P/D 분리 글</a>처럼 단계별 pool을 검토한다.
        </p>
      </div>

      <div className="not-prose"><EngineeringRecoveryViz /></div>

      <TermBreakdown
        title="네 레버가 실제로 줄이는 값"
        description="기법 이름보다 측정 대상이 먼저다."
        items={[
          { term: "Expert 배치", description: "원격 expert로 가는 토큰 비율을 줄인다.", example: "라우팅 trace 전후 remote-token ratio 비교.", boundary: "용량과 expert 조합이 허용하는 범위에서만 가능하다." },
          { term: "TP·PP·EP 조합", description: "Collective와 stage 전달이 생기는 위치를 바꾼다.", example: "같은 workload의 TTFT·TPOT·p99 비교.", boundary: "PP는 bubble을 만들고 EP를 자동 제거하지 않는다." },
          { term: "통신 정밀도", description: "실제로 전송하는 activation의 원소당 바이트를 줄인다.", example: "BF16→FP8이면 이론상 절반.", boundary: "Weight-only 양자화와 혼동하지 않는다." },
          { term: "Batching·overlap", description: "메시지 효율을 높이고 통신 대기를 연산과 겹친다.", example: "Collective duration과 overlap ratio를 함께 잰다.", boundary: "Payload와 메모리도 함께 증가할 수 있다." },
        ]}
      />
    </section>
  );
}
