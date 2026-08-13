import { DistributedFrame, Ledger } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function ByzantineModelViz() {
  return (
    <DistributedFrame
      eyebrow="Failure × timing"
      title="장애 능력과 네트워크 시간을 서로 다른 축으로 둔다"
      description="Crash·omission·Byzantine은 process 행동을, synchronous·asynchronous·partial synchrony는 message와 step 시간의 bound를 설명합니다."
      note="Timeout은 slow·partitioned·crashed를 구분하는 증명이 아닙니다. Signature도 equivocation을 막기보다 발신자와 conflicting evidence를 식별합니다."
    >
      <Ledger columns={2} items={[
        { label: "crash", title: "침묵하거나 멈춤", body: "Protocol state를 더 진행하지 않지만 서로 다른 recipient에게 모순된 value를 보내지는 않습니다.", example: "no reply ≠ malicious proof" },
        { label: "Byzantine", title: "임의 행동·equivocation", body: "Recipient별 conflicting message, selective omission, invalid proposal과 protocol deviation을 허용합니다.", example: "A←vote(x), B←vote(y)" },
        { label: "authentication", title: "출처와 무결성", body: "Signature는 signer와 bytes를 묶지만 그 내용의 honesty·availability를 보장하지 않습니다.", example: "valid signature ∧ dishonest vote 가능" },
        { label: "partial synchrony", title: "GST 뒤 progress", body: "Safety rule은 지연 중에도 유지하고 liveness는 unknown GST 뒤 delay bound에서 얻습니다.", example: "before GST: halt 가능 · after GST: view advances" },
      ]} />
    </DistributedFrame>
  );
}
