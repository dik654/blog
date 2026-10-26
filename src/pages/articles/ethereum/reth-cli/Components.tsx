import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ComponentsViz from "./viz/ComponentsViz";
import { codeRefs } from "./codeRefs";
import { RethCliMapReturn } from "./RethCliLocator";

export default function Components({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        교체 가능한 부품도 의존 관계 안에서만 안전합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          “트레이트이므로 하나만 바꿔도 된다”는 설명은 절반만 맞습니다. 실행기가 소비하는 블록 형식, 거래 풀이 보관하는 거래 형식,
          네트워크가 전파하는 거래, 페이로드 빌더가 고르는 거래는 연관 형식과 트레이트 조건으로 이어집니다. 거래 풀 구현을 바꾸면
          네트워크와 페이로드 빌더가 그 출력을 이해하는지도 다시 확인해야 합니다. 서로 독립적인 카드 네 장을 아무 조합으로나 끼우는
          구조가 아닙니다.{" "}
          <CodeViewButton onClick={() => open("node-components")} />
        </p>
      </div>

      <ComponentsViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>핵심 부품과 부가 기능의 장애 범위를 분리합니다</h3>
        <p>
          실행기·거래 풀·네트워크·페이로드 빌더는 블록 수명주기의 핵심 의존성이며, RPC 모듈·ExEx·관측 훅은 이미 만들어진 부품을
          소비하는 부가 기능입니다.
        </p>
        <p>
          사용자 정의 체인이 EVM 설정을 바꾸면 체인 전용 거래와 실행 영수증 규칙도 함께 바꿔야 할 수 있습니다. 호환되는 네트워크
          전송 계층은 재사용할 수 있습니다.
        </p>
        <p>
          반대로 RPC 확장 하나가 실패했다고 합의 규칙 실행까지 손상됐다고 단정해서도
          안 됩니다. 소유자와 실패 상태를 나눠야 필요한 부분만 재시도하거나 되돌릴 수 있습니다.
        </p>

        <h3>사용자 정의 조합은 컴파일 검사와 실행 중 실패 검사를 함께 통과해야 합니다</h3>
        <p>
          컴파일 예제는 잘못된 조립 순서, 호환되지 않는 연관 형식, 빠진 부가 기능 조건이 실제로 실패하는지 확인합니다.
        </p>
        <p>
          실행 중 검사에서는 같은 ChainSpec·저장소 복사본·설정으로 기준 버전과 후보 버전에 같은 실패를 주입합니다. JWT 누락, 포트 점유,
          저장 형식 불일치, 부품 초기화 실패, 훅 제한 시간 초과, 비정상 종료와 정상 종료를 포함합니다.
        </p>
        <p>
          설정 결과·서비스 상태·정본 해시·상태 루트가 같은지 먼저
          확인한 뒤 시작 시간과 자원 사용량을 비교합니다.
        </p>
        <p>
          되돌리기에는 이전 바이너리, 설정 요약값, 호환되는 저장소 복사본, 저장 형식 변경 기록이 필요합니다. 새 바이너리가 저장소를
          되돌릴 수 없게 바꾼 뒤 실행 파일만 예전 것으로 바꾸는 방식은 복구가 아닙니다.{" "}
          <CodeViewButton onClick={() => open("components-struct")} />
        </p>
      </div>

      <div className="not-prose my-8 border-y border-border py-4" aria-label="현재 측정 상태">
        <p className="text-[10px] font-bold text-primary">[M] 미측정</p>
        <p className="mt-2 max-w-3xl break-keep text-sm leading-6 text-muted-foreground">
          이 저장소에서는 아직 v2.8.1 기준 시작 시간, 실패 후 자원 정리, 상태 일치 여부를 직접 측정하지 않았습니다. 위 내용은 공식 동작과 실험 설계이며 성능 결과가 아닙니다.
        </p>
      </div>

      <div
        id="paper-reth-v281-release"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">[O] 공식 릴리스 · 2026-10-23</p>
        <p className="mt-2 text-sm font-semibold">Reth v2.8.1</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          v2.8.1은 Hoodi의 Amsterdam 활성화 일정을 제거하며 운영자에게 특정 시점 전 업그레이드를 요구했습니다. 데이터베이스 변경은 없고
          v2.8.0으로 내릴 수 있다고 명시하지만, Hoodi에서는 v2.8.0 자체가 잘못된 일정을 포함합니다. 이 사례는 버전만 되돌릴 수 있다는
          사실과 체인 규칙까지 안전하게 되돌릴 수 있다는 판단이 다름을 보여줍니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"
          target="_blank"
          rel="noreferrer"
        >
          v2.8.1 릴리스 노트
        </a>
      </div>

      <RethCliMapReturn />
    </section>
  );
}
