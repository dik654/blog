import ReleaseGateViz from "./viz/ReleaseGateViz";

export default function ReleaseGate() {
  return (
    <section id="release-gate" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">용량, 경로, SLO 순서로 출시 여부를 결정한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          첫 질문은 “24GB에 안 들어가는가?”다. 그렇다면 48GB 한 장에 합쳐지는지 먼저 본다. 여러 24GB GPU에 나눠야
          하던 모델이 48GB 한 장에 들어오면 GPU 간 통신 자체를 제거할 수 있다. 반대로 이미 한 장의 24GB GPU에 들어가는
          모델이라면 용량만 늘리는 이득은 없다.
        </p>
        <p className="leading-7">
          여전히 여러 장이 필요하면 두 번째 질문은 “실제 데이터 경로가 무엇인가?”다. RTX 4090은 CUDA P2P가 지원되지
          않으므로 <code>nvidia-smi topo -p2p p</code>로 상태를 확인하고 <code>nvbandwidth -p device_to_device</code>로
          GPU 쌍별 경로를 잰다. 31.5GB/s 편도 raw rate나 63GB/s 양방향 합을 application goodput으로 대신 쓰지 않는다.
        </p>
        <p className="leading-7">
          마지막 질문은 “목표 SLO를 통과하는가?”다. 대표 request profile별 TTFT·TPOT·tokens/s·p50·p95·p99를
          측정한다. 메모리 오류, Xid, 온도, 전력과 복구 시간도 장시간 기록한다.
        </p>
        <p className="leading-7">
          A100 600GB/s와 H100 900GB/s를 4090의 63GB/s로 나눈 9.5·14.3배는 명목 양방향 인터페이스 비율이다.
          애플리케이션 지연 배수가 아니다. Multi-tenant 여부나 “비공식 카드”라는 이름만으로 자동 탈락시키지 않는다.
          목표 SLO와 지원 위험을 함께 통과시킨다.
        </p>
        <div className="not-prose my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50/60 p-4 dark:bg-amber-950/20">
          <p className="mb-1 font-semibold">💡 출시 판정 한 문장</p>
          <p className="text-sm leading-6">
            48GB가 GPU 수를 줄여 통신을 없애는지 먼저 보고, 통신이 남으면 실제 호스트 경유 경로를 측정한 뒤,
            최종적으로 목표 request profile의 p95·p99와 장시간 안정성이 통과할 때만 채택한다.
          </p>
        </div>
      </div>
      <div className="not-prose"><ReleaseGateViz /></div>
    </section>
  );
}
