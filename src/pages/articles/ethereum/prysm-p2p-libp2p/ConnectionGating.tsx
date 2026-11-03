import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ConnectionGating({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="connection-gating" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        libp2p 연결 뒤 Status까지 통과해야 Prysm의 Connected 피어가 됩니다
      </h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("connect-peer", codeRefs["connect-peer"])}
        />
        <CodeViewButton
          onClick={() =>
            onCodeRef("connection-handler", codeRefs["connection-handler"])
          }
        />
        <CodeViewButton
          onClick={() =>
            onCodeRef("status-validation", codeRefs["status-validation"])
          }
        />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          후보 N42를 dial하면 Prysm은 먼저 자기 자신이거나 이미 bad인 PeerId인지
          확인하고, <code>maxDialTimeout</code> 안에서
          <code>host.Connect</code>를 호출합니다. libp2p host는 설정에 따라 TCP
          또는 QUIC transport를 사용하고 Noise로 상대 PeerId를 인증한 뒤 stream
          multiplexer를 준비합니다. 여기까지 성공해도 Prysm 상태는 합의 protocol
          관점에서 아직
          <strong> Connecting</strong>입니다.
        </p>

        <h3>Outbound와 inbound는 누가 먼저 Status를 보냅니까?</h3>
        <p>
          우리가 먼저 건 outbound 연결에서는 Prysm이 N42에게 Status request를
          보냅니다. 응답을 decode하고
          <strong>
            {" "}
            fork digest, 지나치게 미래인 head slot, finalized epoch와 finalized
            root
          </strong>
          를 local chain과 비교합니다. 이 검사가 성공한 뒤에야 connection
          state를 Connected로 올립니다.
        </p>
        <p>
          상대가 먼저 건 inbound 연결에서는 상대가 Status request를 시작해야
          합니다. 현재 Prysm source는 최대 10초 동안 기다린 뒤 chain state가
          기록되지 않았거나 갱신되지 않았으면 Goodbye와 함께 연결을 닫습니다.
          양쪽 모두 같은 질문을 확인하지만 먼저 질문하는 쪽이 다릅니다.
        </p>

        <h3>Status 검사가 필요한 이유</h3>
        <p>
          Noise가 확인하는 것은 PeerId 소유자와 암호화 통로입니다. 같은 PeerId가
          어느 Ethereum network와 fork를 따르는지는 알려주지 않습니다. Status가
          wrong fork나 local finalized chain과 모순되는 root를 보내면 protocol상
          대화할 수 없는 상대이므로 피어 점수 평균이 좋아질 때까지 기다리지 않고
          terminal 오류로 다룹니다.
        </p>
        <p>
          반대로 Status 통과는 N42가 앞으로 보내는 모든 block이 유효하다는
          보증이 아닙니다. Connected는 “합의 메시지를 교환할 수 있다”는
          권한입니다. 각 gossip message와 Req/Resp response는 별도의 검증기를
          다시 지나며, 그 결과가 다음 절의 peer score와 bad 판정에 들어갑니다.
        </p>

        <h3>연결 수와 들어오는 속도도 앞단에서 제한합니다</h3>
        <p>
          현재 Prysm connection gater는 시작 전 inbound를 거절하고, IP별
          leaky-bucket과 inbound·전체 peer limit, CIDR allow/deny filter를
          적용합니다. 이 gate는 Status의 chain 검사를 대신하지 않습니다. 앞단
          gate는 연결 자원을 보호하고, Status는 protocol 호환성을 확인합니다.
        </p>
      </div>
    </section>
  );
}
