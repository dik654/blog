import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { RETH_STORAGE_LAYOUTS } from "@/content/reth-storage";
import ContextViz from "./viz/ContextViz";
import PipelineViz from "./viz/PipelineViz";
import { PIPELINE_STAGES } from "./OverviewData";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [selected, setSelected] = useState(PIPELINE_STAGES[0].id);
  const current =
    PIPELINE_STAGES.find((stage) => stage.id === selected) ??
    PIPELINE_STAGES[0];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Pipeline: 동기화를 재개 가능한 작업으로 나누기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          과거 블록을 따라잡으려면 헤더와 바디를 확보하고, 서명에서 발신자를
          복구하고, 트랜잭션을 실행한 뒤 상태 루트를 검증해야 한다. 이 작업들은
          입력과 병목이 서로 다르며, 어느 한 단계가 실패하면 그 지점부터
          안전하게 다시 시작할 수 있어야 한다.
        </p>
        <h3>문제</h3>
        <p>
          모든 일을 하나의 긴 함수로 묶으면 네트워크·CPU·상태 I/O의 진행 지점을
          구분하기 어렵다. 재조직이나 검증 실패가 생겼을 때 무엇을 얼마나
          되돌려야 하는지도 모호해진다.
        </p>
        <h3>아이디어</h3>
        <p>
          Reth의 staged sync는 작업을 의존 순서로 나누고 각 Stage에 독립
          체크포인트를 둔다. 한 호출은 설정과 가용 입력이 허용하는 범위만
          처리하며, <code>done</code>과 새 checkpoint를 반환한다. 따라서 앞
          단계가 더 멀리 진행해도 뒤 단계는 자신이 검증한 위치에서 계속 따라갈
          수 있다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <h3 className="mb-3 text-lg font-semibold">Stage별 책임</h3>
      <div className="not-prose mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PIPELINE_STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => setSelected(stage.id)}
            className="cursor-pointer rounded-xl border p-3 text-left transition-colors"
            style={{
              borderColor:
                selected === stage.id ? stage.color : "var(--color-border)",
              background:
                selected === stage.id ? `${stage.color}10` : undefined,
            }}
          >
            <p
              className="font-mono text-sm font-bold"
              style={{ color: stage.color }}
            >
              {stage.label}
            </p>
            <p className="mt-1 text-xs text-foreground/60">{stage.role}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="not-prose mb-8 rounded-xl border border-border/60 bg-muted/20 p-4"
        >
          <p className="text-sm font-semibold" style={{ color: current.color }}>
            {current.detail}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/70">
            {current.why}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="not-prose mb-8">
        <PipelineViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>구현: 범위, checkpoint, unwind</h3>
        <p>
          Pipeline은 목표 블록과 Stage checkpoint로 다음 처리 범위를 만든다.
          Stage는 유효한 일부 범위를 처리하고 진행 위치를 영속화한다. 프로세스가
          중단되면 마지막 영속 checkpoint 이후를 다시 처리한다. 재조직이나 검증
          오류가 발생하면 쓰기 의존성의 역순으로 unwind한 뒤 새 canonical 범위를
          실행한다.
        </p>
        <div className="not-prose my-4 grid gap-3 md:grid-cols-3">
          {[
            [
              "범위 제한",
              "한 번의 execute가 전체 tip을 끝낸다고 가정하지 않는다. batch와 threshold는 설정·버전에 따라 달라질 수 있다.",
            ],
            [
              "독립 진행",
              "각 Stage checkpoint는 서로 다를 수 있지만, 소비 단계는 선행 단계가 확정한 범위를 넘지 않는다.",
            ],
            [
              "역순 되감기",
              "Merkle·Execution처럼 downstream 산출물을 먼저 되돌려 upstream 입력과 정합성을 유지한다.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border/60 p-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                {body}
              </p>
            </div>
          ))}
        </div>

        <h3>저장소와 Stage 계약은 분리한다</h3>
        <p>
          Stage가 의존하는 것은 provider의 읽기·쓰기 계약이지 특정 DB 이름이
          아니다. Storage V1은 MDBX 중심이고, Storage V2는 데이터 종류에 따라
          RocksDB와 static files를 함께 사용한다. 새 backend route가 추가되어도
          Stage 설명을 복제하지 않도록 아래 mode 이름과 상태는 공용 manifest에서
          가져온다.
        </p>
        <div className="not-prose my-4 grid gap-3 sm:grid-cols-2">
          {RETH_STORAGE_LAYOUTS.map((layout) => (
            <div
              key={layout.id}
              className="rounded-xl border border-border/60 bg-muted/20 p-4"
            >
              <p className="text-sm font-semibold">
                {layout.title}{" "}
                <span className="font-normal text-foreground/50">
                  · {layout.status}
                </span>
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                {layout.summary}
              </p>
            </div>
          ))}
        </div>
        <div className="my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-amber-950/30">
          <p className="font-semibold">핵심</p>
          <p className="mt-2">
            Pipeline의 장점은 특정 속도 배율이 아니라 책임과 복구 경계를
            명시한다는 데 있다. 실제 처리량은 chain range, pruning, storage
            mode, 하드웨어와 설정에 따라 달라진다.
          </p>
        </div>
      </div>
    </section>
  );
}
