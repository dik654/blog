import ExplainedFormula from "@/components/ui/explained-formula";
import StreamMuxViz from "./viz/StreamMuxViz";

export default function Streams() {
  return (
    <section id="streams" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Stream은 순서를 보장하지만, packet과 같은 단위는 아닙니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          QUIC stream은 byte offset을 가진 ordered sequence입니다. 하나의
          packet에 여러 stream frame이 들어갈 수 있고, 한 stream frame도 여러
          packet으로 나뉠 수 있습니다. Receiver는 packet 도착 순서가 아니라
          stream ID와 offset으로 bytes를 재조립하며, 중간 offset이 비면 그
          stream만 해당 구간에서 기다립니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <StreamMuxViz />
      </div>
      <ExplainedFormula
        question="Sender가 receiver memory를 넘지 않도록 어느 범위까지 보낼 수 있을까요?"
        idea={
          <>
            Receiver는 stream별 최대 offset과 connection 전체 누적 byte limit을
            credit으로 알립니다. Sender는 두 제한을 동시에 만족하는 범위만 새로
            보낼 수 있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
o_s + \ell_s &\le M_s,\\
\sum_s \Delta_s &\le M_{conn},\\
\text{sendable}_s &= \min(M_s-o_s,\;M_{conn}-D_{conn}).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
o_s + \ell_s &\le \underbrace{M_s,}_{\text{stream offset 계산}}\\
\sum_s \Delta_s &\le \underbrace{M_{conn},}_{\text{변화량 계산}}\\
\text{sendable}_s &= \underbrace{\min(M_s-o_s,\;M_{conn}-D_{conn}).}_{\text{경계 후보 선택}}
\end{aligned}`}
        operations={[
          { expression: String.raw`M_s,`, annotation: ["stream offset이(가) 식의 결과에 기여하는 방식을","계산합니다.","Receiver는 stream별 최대 offset과","connection 전체 누적 byte limit을"] },
          { expression: String.raw`M_{conn},`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Receiver는 stream별 최대 offset과","connection 전체 누적 byte limit을","credit으로 알립니다."] },
          { expression: String.raw`\min(M_s-o_s,\;M_{conn}-D_{conn}).`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Receiver는 stream별 최대 offset과","connection 전체 누적 byte limit을","credit으로 알립니다."] },
        ]}
        terms={[
          {
            symbol: "o_s",
            name: "stream offset",
            description: "stream s에서 보내려는 frame의 시작 byte 위치입니다.",
          },
          {
            symbol: "ℓ_s",
            name: "frame data length",
            description: "이번 STREAM frame에 담는 새 byte 수입니다.",
          },
          {
            symbol: "M_s",
            name: "MAX_STREAM_DATA",
            description: "Receiver가 stream s에 허용한 최대 offset입니다.",
          },
          {
            symbol: "M_conn",
            name: "MAX_DATA",
            description:
              "Connection 전체에서 허용한 새 stream byte 총량입니다.",
          },
          {
            symbol: "D_conn",
            name: "connection data used",
            description:
              "이미 flow-control budget에 반영된 새 byte 총량입니다.",
          },
        ]}
        assumptions={[
          "이 식은 receive flow control을 단순화한 것이며 congestion window와 packet pacing은 별도 제한입니다.",
          "재전송된 같은 stream offset은 새 application byte로 다시 세지 않지만 구현은 overlap과 final size를 검증해야 합니다.",
          "MAX_STREAMS는 byte credit이 아니라 peer가 열 수 있는 stream 개수의 별도 한도입니다.",
        ]}
        interpretation="Stream에 1,000 byte credit, connection에 300 byte credit만 남았다면 이번에 보낼 새 data는 최대 300 byte입니다. Credit을 크게 잡으면 throughput에는 유리하지만 slow consumer가 많은 memory를 점유할 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Loss isolation과 자원 격리는 다릅니다</h3>
        <p>
          Stream A의 offset 100–199가 유실돼도 Stream B의 연속 bytes는
          application에 전달할 수 있습니다. 그러나 두 stream은 congestion
          controller, connection MAX_DATA, CPU와 socket buffer를 공유하므로 A가
          다른 자원까지 전혀 방해하지 않는 것은 아닙니다. Priority와 per-stream
          quota는 application protocol이나 implementation scheduler가 추가로
          설계해야 합니다.
        </p>
      </div>
    </section>
  );
}
