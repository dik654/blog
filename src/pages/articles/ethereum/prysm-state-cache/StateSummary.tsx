import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function StateSummary({ onCodeRef }: Props) {
  return (
    <section id="state-summary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State Summary & 재생</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          전체 상태를 직접 저장하지 않은 지점을 다시 찾으려면 “어느 체인의 어느
          위치인가”를 잃지 않아야 한다. StateSummary와 관련 인덱스는 목표
          slot·block root를 저장 상태와 블록 구간에 연결하는 메타데이터
          계층이다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("replay-blocks", codeRefs["replay-blocks"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ReplayBlocks()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("state-by-slot", codeRefs["state-by-slot"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            StateBySlot()
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          summary가 답해야 하는 질문
        </h3>
        <ul>
          <li>요청한 slot 또는 root가 어느 분기의 상태를 가리키는가?</li>
          <li>그 이전에 직접 읽을 수 있는 가장 가까운 저장 상태는 무엇인가?</li>
          <li>
            anchor 이후 어떤 블록과 빈 슬롯 전이를 순서대로 적용해야 하는가?
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">재생 파이프라인</h3>
        <div className="not-prose grid gap-2 my-4 text-xs">
          {[
            ["1", "목표 식별", "slot·root와 canonical 문맥을 확인"],
            ["2", "anchor 탐색", "목표보다 앞선 직접 저장 상태를 선택"],
            [
              "3",
              "입력 로드",
              "anchor 이후 블록을 순서대로 읽고 빈 슬롯 구간을 계산",
            ],
            [
              "4",
              "상태 전이",
              "slot processing과 block transition을 프로토콜 순서대로 적용",
            ],
            [
              "5",
              "결과 검증",
              "도달 slot·root를 확인하고 안전한 복사본 또는 cache entry로 반환",
            ],
          ].map(([n, title, body]) => (
            <div
              key={n}
              className="flex items-start gap-3 rounded-lg border bg-card p-3"
            >
              <span className="font-mono font-semibold">{n}</span>
              <div>
                <strong>{title}</strong>
                <p className="text-muted-foreground mt-1">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">빈 슬롯도 입력이다</h3>
        <p className="leading-7">
          블록이 없는 slot에서도 상태의 slot 필드와 epoch 경계 처리가 진행될 수
          있다. 따라서 재생은 저장된 블록만 차례로 실행하는 작업이 아니라, 블록
          사이의 slot processing까지 포함하는 결정적 상태 전이다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          재생 지연은 고정된 slot 수만으로 정해지지 않는다. 실제 블록 밀도, 상태
          전이 비용, DB 읽기와 캐시 상태를 함께 계측해야 한다.
        </p>
      </div>
    </section>
  );
}
