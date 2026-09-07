import ReleaseGateViz from "./viz/ReleaseGateViz";

export default function ReleaseGate() {
  return (
    <section id="release-gate" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        용량 병목인지 통신 병목인지부터 구분하고 결정한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          지금까지 다룬 개조·인터커넥트·MoE 통신·완화 기법을 하나의 판단 순서로 묶으면 이렇다. 먼저 지금 겪는 문제가
          용량 문제인지 확인한다. Weight가 GPU 한 장에 안 들어가서 아예 못 올리는 상황이라면, 48GB 개조는 그 문제를
          정확히 겨냥한 해법이다. 대역폭은 그대로지만 애초에 "느리게라도 돌아가는" 상태를 만들 수 있다.
        </p>
        <p className="leading-7">
          반대로 모델이 이미 한 장(또는 개조 없는 24GB 여러 장)에 들어가고 문제가 처리량이라면, 48GB 개조는 해당 사항이 없다. 이 경우 병목은 GPU 간 통신이고, 통신
          병목이면 그다음은 병렬화 전략 선택이다. Expert 수와 activation 크기가 감당된다면 pipeline parallel로 all-reduce 자체를 피하는 구성이 PCIe
          2-way에서 더 유리하다. Expert parallel이 불가피하다면 배치 최적화와 quantization으로 통신량을 줄이고 batching으로 그 나머지를 연산 뒤에 숨긴다.
        </p>
        <p className="leading-7">
          마지막으로, 이 네 기법을 다 적용해도 A100·H100의 NVSwitch 대역폭 격차(9~14배)는 메워지지 않는다는 걸 전제해야 한다. 이 구성이 답이 되는 지점은 "데이터센터
          카드를 살 여력이 없고, 약간의 처리량 손실을 감수할 수 있는 워크로드"로 한정된다. Multi-tenant SLA가 있는 프로덕션 서빙이나 낮은 tail latency가 필수인
          워크로드라면 이 글의 완화 기법으로도 격차를 메우지 못하고 이 지점부터는 워크스테이션·데이터센터 카드로 넘어가는 편이 맞다.
        </p>
        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 이 글이 답하지 않는 것</p>
          <p className="text-sm leading-6">
            개조 카드의 실제 안정성·수율·장기 신뢰성은 벤더별 개별 사례라 이 글의 공식·정량 비교로는 판단할 수 없다.
            <br />
            배포 전에는 자신이 손에 쥔 실제 카드·PCIe topology·NCCL 버전으로 직접 측정한 값을 이 글의 이론값 대신
            사용해야 한다.
          </p>
        </div>
      </div>
      <div className="not-prose">
        <ReleaseGateViz />
      </div>
    </section>
  );
}
