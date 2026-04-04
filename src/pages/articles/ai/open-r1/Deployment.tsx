import DeployArchViz from './viz/DeployArchViz';
import { servingComponents } from './deployData';

export default function Deployment() {
  return (
    <section id="deployment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">배포 & 서빙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Open R1의 배포 시스템 — <strong>SGLang + vLLM</strong> 기반 고성능 추론 서버 + <strong>Slurm</strong> 클러스터 관리<br />
          멀티노드 텐서 병렬(TP=16)로 대형 모델 서빙<br />
          라우터로 부하 분산 및 헬스 모니터링 수행
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">배포 아키텍처</h3>
      </div>

      <DeployArchViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">구성 요소</h3>
        <div className="not-prose grid grid-cols-2 gap-3 mb-6">
          {servingComponents.map(c => (
            <div key={c.name} className="rounded-lg border p-3" style={{ borderColor: c.color + '40' }}>
              <p className="text-sm font-semibold" style={{ color: c.color }}>{c.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
            </div>
          ))}
        </div>

        <p>
          <strong>SGLang 멀티노드 서빙</strong> — 2노드 × 8GPU = 16GPU 텐서 병렬(TP=16)<br />
          srun으로 모든 노드에서 동기 서버 시작, 첫 번째 노드 IP로 분산 통신 초기화<br />
          32K 컨텍스트 윈도우, DeepSeek-R1 전체 모델 서빙 가능
        </p>

        <p className="mt-4">
          <strong>라우터 시스템</strong>: CPU 전용 파티션에서 실행되는 라우터가 여러 서빙 노드 간 부하 분산<br />
          워커 자동 등록, 5분 주기 헬스 체크, 자동 재시작(SIGUSR1 트랩) 지원<br />
          30일간 안정적 운영 가능
        </p>
        <p>
          <strong>훈련 클러스터</strong>: <code>train.slurm</code>으로 SFT/GRPO 작업 제출<br />
          <code>--model</code>, <code>--task</code>, <code>--config</code>, <code>--dp</code>, <code>--tp</code> 옵션으로 유연하게 설정<br />
          Weka 파일시스템 캐시 새로고침으로 공유 스토리지 일관성 보장
        </p>
      </div>
    </section>
  );
}
