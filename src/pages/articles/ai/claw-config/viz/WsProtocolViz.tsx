import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function WsProtocolViz() {
  return (
    <ConfigFrame
      label="HARDENING TARGET"
      title="sequence와 ack가 stream resume의 기준이 된다"
      description="message type 외에 protocol·session·request·sequence를 보내야 duplicate, 순서 역전과 재연결을 처리할 수 있습니다."
      note="이 contract는 pinned remote.rs에 구현됐다는 설명이 아니라 별도 transport가 증명해야 할 release criterion입니다."
    >
      <ConfigSteps
        items={[
          {
            label: "IDENTITY",
            title: "Version + session",
            body: "호환 protocol과 현재 runtime generation을 확인합니다.",
            tone: "blue",
          },
          {
            label: "ORDER",
            title: "Sequence",
            body: "request 안의 event 순서와 duplicate를 판별합니다.",
            tone: "violet",
          },
          {
            label: "DELIVERY",
            title: "Ack + resume",
            body: "마지막 처리 지점부터 replay하거나 snapshot을 보냅니다.",
            tone: "emerald",
          },
          {
            label: "CONTROL",
            title: "Bound permission",
            body: "approval을 action digest와 한 번의 attempt에 묶습니다.",
            tone: "amber",
          },
        ]}
      />
      <ConfigRule>
        bounded queue와 backpressure로 느린 client가 server memory를 고갈시키지
        않게 합니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
