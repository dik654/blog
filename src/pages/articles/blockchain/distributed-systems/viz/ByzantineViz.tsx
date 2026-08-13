import { DistributedFrame, Ledger } from "./DistributedVizPrimitives";

export default function ByzantineViz() {
  return (
    <DistributedFrame
      eyebrow="FAULT SCOPE"
      title="Crash와 Byzantine은 같은 ‘고장’이 아니다"
      description="Byzantine process는 멈추는 데 그치지 않고 수신자마다 다른 값을 보내는 equivocation까지 할 수 있으므로 quorum과 인증 가정이 달라집니다."
      note="3f+1은 모든 네트워크·인증 모델의 보편 상수가 아닙니다. 이 글은 경계만 소개하고 정확한 bound는 BFT 정본에서 timing·authentication 전제와 함께 다룹니다."
    >
      <Ledger
        items={[
          { label: "CRASH", title: "더 이상 step을 수행하지 않음", body: "정직했던 process가 중단되며 서로 모순된 값을 만들지는 않습니다." },
          { label: "OMISSION", title: "일부 send·receive를 빠뜨림", body: "메시지 누락 범위에 따라 crash보다 세밀한 failure model이 됩니다." },
          { label: "BYZANTINE", title: "임의 행동과 equivocation", body: "서명된 모순 메시지·잘못된 상태·선택적 침묵까지 허용합니다." },
        ]}
      />
    </DistributedFrame>
  );
}
