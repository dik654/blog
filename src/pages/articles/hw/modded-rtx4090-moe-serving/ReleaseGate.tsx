import { Link } from "react-router-dom";
import ReleaseGateViz from "./viz/ReleaseGateViz";

export default function ReleaseGate() {
  return (
    <section id="release-gate" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">라이선스, 용량, 경로, SLO 순서로 출시 여부를 결정한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          성능을 재기 전에 먼저 “이 카드를 이 용도로 써도 되는가?”를 묻는다. GeForce 드라이버 라이선스(2025년 2월 25일판) 2.8조는 이 드라이버가 데이터센터 배포용으로 허락되지 않았다고 적고 2.7조는 이 소프트웨어로 상업 호스팅 서비스를 제공하는 것을 막는다. 외부 고객에게 유료로 LLM을 서빙하는 일은 여기에 바로 걸린다. 48GB 개조 카드도 GeForce 드라이버로 돌기 때문에 이 조항을 피할 근거가 없다고 본다(해석).
        </p>
        <p className="leading-7">
          그래서 상용 서빙이라면 아래 측정을 시작하기 전에 법무 검토를 먼저 통과해야 하고 통과하지 못하면 4090은 후보에서 빠진다. 조항 원문과 상용 노드를 RTX PRO 6000으로 짠 계산은{" "} <Link to="/cs/gpu/pcie-blackwell-moe-node-build#source-geforce-license">PCIe Blackwell MoE 노드 구성</Link>에 정리했다. 개인 연구나 사내 실험처럼 이 조항 밖의 용도일 때만 다음 질문으로 넘어간다.
        </p>
        <p className="leading-7">
          그다음 질문은 “24GB에 안 들어가는가?”다. 그렇다면 48GB 한 장에 합쳐지는지 먼저 본다. 여러 24GB GPU에 나눠야
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
          A100 600GB/s와 H100 900GB/s를 4090의 63GB/s로 나눈 9.5·14.3배는 명목 양방향 인터페이스 비율이며 애플리케이션 지연 배수가 아니다. 라이선스 단계를 통과한 용도라면 multi-tenant 여부나 “비공식 카드”라는 이름만으로 자동 탈락시키지 않고 목표 SLO와 지원 위험을 함께 통과시킨다.
        </p>
        <div className="not-prose my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50/60 p-4 dark:bg-amber-950/20">
          <p className="mb-1 font-semibold">💡 출시 판정 한 문장</p>
          <p className="text-sm leading-6">
            라이선스가 그 용도를 허락하는지 먼저 확인하고 48GB가 GPU 수를 줄여 통신을 없애는지 본 다음 통신이 남으면 실제 호스트 경유 경로를 측정한다. 최종적으로 목표 request profile의 p95·p99와 장시간 안정성이 통과할 때만 채택한다.
          </p>
        </div>
      </div>
      <div className="not-prose"><ReleaseGateViz /></div>
    </section>
  );
}
