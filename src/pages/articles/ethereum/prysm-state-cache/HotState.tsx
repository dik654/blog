import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function HotState({ onCodeRef }: Props) {
  return (
    <section id="hot-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hot State 캐시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Hot cache의 목적은 최근 상태를 무조건 오래 보존하는 것이 아니라, 같은
          root를 반복 계산하거나 DB에서 다시 읽는 비용을 줄이는 것이다. 그래서
          key 안정성, 복사 의미, 퇴출 조건이 용량 숫자보다 중요하다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("state-by-root", codeRefs["state-by-root"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            StateByRoot() 조회 경계
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">조회 경로</h3>
        <div className="not-prose grid gap-2 my-4 text-xs">
          {[
            [
              "1",
              "요청 root 정규화",
              "zero root·누락 메타데이터 같은 입력 조건을 먼저 처리",
            ],
            [
              "2",
              "최근 상태 조회",
              "root에 대응하는 상태가 있으면 호출자가 안전하게 사용할 수 있는 값으로 반환",
            ],
            [
              "3",
              "영속 상태 조회",
              "직접 저장된 anchor나 finalized 관련 상태 확인",
            ],
            [
              "4",
              "재구성",
              "가까운 anchor에서 목표 지점까지 전이를 적용하고 결과를 재사용 가능하게 연결",
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

        <h3 className="text-xl font-semibold mt-6 mb-3">안전하게 캐시하려면</h3>
        <ul>
          <li>
            <strong>불변성 경계</strong> — 호출자가 캐시된 상태를 직접 변형해
            다른 요청에 영향을 주지 않게 한다.
          </li>
          <li>
            <strong>fork 인식 key</strong> — slot만으로 서로 다른 분기의 상태를
            같은 값으로 취급하지 않는다.
          </li>
          <li>
            <strong>finality와 퇴출 분리</strong> — finality는 안전성 문맥이고
            LRU·용량 제한은 메모리 정책이다.
          </li>
          <li>
            <strong>계측</strong> — hit 비율뿐 아니라 복사 비용, DB fallback,
            replay 거리와 지연을 함께 본다.
          </li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          캐시가 있더라도 historical 요청이나 miss에서는 DB 읽기와 재생이
          필요하다. 특정 메인넷 hit 비율과 응답 시간을 보편값으로 가정하지 말고
          배포 환경의 지표로 판단한다.
        </p>
      </div>
    </section>
  );
}
