import { DistributedFrame, Flow } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoRFlowViz() {
  return (
    <DistributedFrame
      eyebrow="PoR audit"
      title="짧은 challenge를 full-file recovery 명제로 연결한다"
      description="Verifier는 file 전체를 매번 받지 않지만, encoded blocks·authenticator·random challenge와 extractor proof가 함께 있어야 retrievability를 주장할 수 있습니다."
      note="한 번의 PASS는 sample evidence입니다. Repeated success probability와 security theorem의 extractor 전제를 기록하지 않으면 ‘보유 확인’ 이상으로 말할 수 없습니다."
    >
      <Flow steps={[
        { label: "01 encode", title: "Recovery redundancy", body: "File을 error-correcting code 등 scheme의 encoding으로 바꾸고 authenticator를 만듭니다." },
        { label: "02 challenge", title: "Fresh sample", body: "Verifier가 예측하기 어려운 block indices·coefficients를 선택합니다." },
        { label: "03 respond", title: "Compact proof", body: "Prover가 challenged encoded data와 authenticator에서 response를 계산합니다." },
        { label: "04 extract", title: "반복 성공→복구", body: "Scheme의 acceptance threshold를 넘는 prover에서 extractor가 전체 file을 복구할 수 있음을 보입니다." },
      ]} />
    </DistributedFrame>
  );
}
