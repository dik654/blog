import CodePanel from "@/components/ui/code-panel";
import TimeoutStrategyViz from "./viz/TimeoutStrategyViz";
import {
  TIMEOUT_CODE,
  TIMEOUT_ANNOTATIONS,
  PERF_TABLE,
  PARALLEL_CODE,
  PARALLEL_ANNOTATIONS,
} from "./ConsensusPerformanceData";
import type { CodeRef } from "@/components/code/types";

const CELL = "border border-border px-4 py-2";

export default function ConsensusPerformance({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="consensus-performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 성능 최적화</h2>
      <div className="not-prose mb-8">
        <TimeoutStrategyViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 합의 성능은 크게 세 가지 요소,
          <strong>타임아웃 설정</strong>, <strong>블록 크기</strong>,{" "}
          <strong>validator 간 네트워크와 application 실행 시간</strong>에
          좌우됩니다. Round가 반복되면 설정된 delta에 따라 timeout을 늘려
          일시적인 지연에서 회복할 여지를 만들지만, 그만큼 최종화 지연도
          길어집니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">타임아웃 전략</h3>
        <CodePanel
          title="라운드별 타임아웃 동적 증가"
          code={TIMEOUT_CODE}
          annotations={TIMEOUT_ANNOTATIONS}
        />
        <h3 className="text-xl font-semibold mt-6 mb-3">성능 파라미터 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>파라미터</th>
                <th className={`${CELL} text-left`}>확인 위치</th>
                <th className={`${CELL} text-left`}>효과</th>
              </tr>
            </thead>
            <tbody>
              {PERF_TABLE.map((r) => (
                <tr key={r.param}>
                  <td className={`${CELL} font-mono text-xs`}>{r.param}</td>
                  <td className={CELL}>{r.default_val}</td>
                  <td className={CELL}>{r.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">병렬 처리 최적화</h3>
        <CodePanel
          title="PartSet 분할 + ABCI 동시 연결"
          code={PARALLEL_CODE}
          annotations={PARALLEL_ANNOTATIONS}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">
          실전 성능은 네 숫자를 함께 측정한다
        </h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-4">
          {[
            {
              title: "Proposal 전파",
              metric: "part 수신 완료 시각",
              detail: "block byte와 peer별 RTT·loss를 함께 기록",
            },
            {
              title: "Vote 수렴",
              metric: "2/3 prevote·precommit 도달 시각",
              detail: "validator 수보다 voting-power 분포와 느린 peer를 확인",
            },
            {
              title: "Application 실행",
              metric: "ProcessProposal·FinalizeBlock latency",
              detail: "transaction 구성과 state I/O를 분리해 측정",
            },
            {
              title: "Round 안정성",
              metric: "round 0 commit 비율·timeout 횟수",
              detail: "평균뿐 아니라 p95·p99와 장애 구간을 비교",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="mt-2 text-xs font-semibold text-primary">{item.metric}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
        <p>
          서로 다른 mainnet의 TPS나 block time만 나란히 놓으면 transaction 종류, validator set, application 실행과 측정 구간이 섞여 원인을
          알 수 없습니다. 같은 block fixture와 network profile에서 한 변수씩 바꿔 가며 round 0 성공률과 end-to-end commit latency를 함께
          놓고 볼 때 비로소 설정 변경의 효과를 설명할 수 있습니다.
        </p>
        <p className="leading-7">
          성능은 validator 수 하나로 결정되지 않는다. block 크기와 생성 주기, vote 전파 지연, application 처리량이 만나는 지점에서 정해진다. Timeout을
          낮추거나 validator set을 줄이면 특정 환경의 latency는 개선될 수 있다. 다만 네트워크 변동성과 운영 분산성을 함께 측정하지 않은 채 보편적인 최적값으로
          일반화해서는 안 된다.
        </p>
      </div>
    </section>
  );
}
