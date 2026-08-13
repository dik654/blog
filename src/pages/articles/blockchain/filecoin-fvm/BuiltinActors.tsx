import { CodeViewButton } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function BuiltinActors({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="builtin-actors" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Built-in Actor와 사용자 Actor</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("fvm-machine", codeRefs["fvm-machine"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            Actor bundle과 method export는 network version에 종속
          </span>
        </div>
        <p className="leading-7">
          Built-in Actor는 Filecoin 네트워크의 공통 규칙을 구현하고, user
          Actor는 개발자가 배포한 애플리케이션 로직을 구현한다. 둘 다 FVM의
          메시지·state 모델을 쓰지만, built-in bundle은 합의 규칙의 일부이므로
          임의 배포로 교체되지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          프로토콜 책임별로 보기
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">계정·Actor 생성</h4>
            <p className="text-xs text-muted-foreground">
              Account·Init·System 계열이 주소와 Actor 생성을 연결하고 네트워크
              기본 상태를 유지한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">스토리지 경제</h4>
            <p className="text-xs text-muted-foreground">
              Miner·Power·Market·Verified Registry·DataCap 계열이 섹터, 파워,
              deal과 검증된 데이터 상태를 분담한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">보상·스케줄</h4>
            <p className="text-xs text-muted-foreground">
              Reward와 Cron 계열이 epoch 전환에서 보상 계산과 주기적 protocol
              callback을 수행한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">FEVM bridge</h4>
            <p className="text-xs text-muted-foreground">
              EAM·EVM·Ethereum Account 계열이 delegated address, contract
              creation과 EVM 호출을 Actor 세계에 연결한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Actor upgrade는 네트워크 업그레이드다
        </h3>
        <p className="leading-7">
          새 built-in bundle은 code CID만 바꿔 개인이 활성화하는 기능이 아니다.
          네트워크 버전 전환에서 모든 구현체가 같은 bundle manifest와 state
          migration을 적용해야 하며, method 번호와 state schema의 호환성도 함께
          관리한다. 그러므로 글에 고정된 Actor 개수·주소·메서드 목록을 장기
          API처럼 박아 두지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          사용자 계약에서 접근하기
        </h3>
        <p className="leading-7">
          FEVM 계약은 Solidity library나 Filecoin actor-call precompile을 통해
          공개된 built-in method를 호출한다. 모든 내부 method가 외부 계약에 열려
          있는 것은 아니며, actor version과 Filecoin Solidity library의 지원
          범위를 함께 확인해야 한다.
        </p>

        <CitationBlock {...OFFICIAL_SOURCES.filecoin.actors} citeKey={3}>
          공식 Actor 문서는 built-in Actor가 네트워크 상태와 핵심 하위 시스템을
          관리하고, user Actor는 개발자가 정의한 스마트 계약이라고 구분한다.
        </CitationBlock>
      </div>
    </section>
  );
}
