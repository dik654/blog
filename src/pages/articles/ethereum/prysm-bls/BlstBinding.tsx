import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function BlstBinding({ onCodeRef }: Props) {
  return (
    <section id="blst-binding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLST 바인딩 경계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Prysm의 합의 코드는 Go에서 입력과 오류를 다루고, 실제 BLS12-381 연산은
          BLST binding을 통해 최적화된 native 구현에 위임한다. 중요한 것은 “몇
          배 빠르다”는 고정 벤치마크보다 경계 양쪽이 무엇을 검증하는지다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">세 계층의 책임</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border border-blue-500/30 p-4">
            <h4 className="font-semibold text-sm mb-2">Prysm Go</h4>
            <p className="text-xs text-muted-foreground">
              프로토콜 객체, signing root, 입력 길이, 오류 전파와 호출 문맥을
              관리한다.
            </p>
          </div>
          <div className="rounded-lg border border-violet-500/30 p-4">
            <h4 className="font-semibold text-sm mb-2">Language binding</h4>
            <p className="text-xs text-muted-foreground">
              Go byte slice와 BLST point·scalar 표현 사이를 변환하고 native 호출
              수명을 관리한다.
            </p>
          </div>
          <div className="rounded-lg border border-green-500/30 p-4">
            <h4 className="font-semibold text-sm mb-2">BLST backend</h4>
            <p className="text-xs text-muted-foreground">
              hash-to-curve, point 연산, pairing과 canonical 압축·검사를
              수행한다.
            </p>
          </div>
        </div>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("bls-sign", codeRefs["bls-sign"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            Sign() binding 경계
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">도메인 분리 두 층</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Consensus domain</h4>
            <p className="text-xs text-muted-foreground">
              <code>domain_type</code>, fork version, genesis validators root를
              signing root에 묶어 포크·네트워크·서명 목적을 분리한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Ciphersuite DST</h4>
            <p className="text-xs text-muted-foreground">
              BLS hash-to-curve가 다른 프로토콜·suite의 메시지 공간과 섞이지
              않게 한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          성능을 검증하는 방법
        </h3>
        <ul>
          <li>
            실제 배포 CPU와 컴파일 옵션에서 단일·동일 메시지 집계·서로 다른
            메시지 batch를 따로 측정한다.
          </li>
          <li>
            역직렬화와 subgroup 검사 포함 여부, 입력 크기와 병렬도를 벤치마크
            조건에 기록한다.
          </li>
          <li>
            native library와 wrapper 버전을 함께 고정하고 업그레이드 때 회귀
            테스트를 반복한다.
          </li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          SIMD 경로와 binding 방식은 아키텍처·빌드에 따라 달라진다. 특정 구현
          대비 배수나 고정 밀리초를 일반적인 Prysm 성능으로 사용하지 않는다.
        </p>
      </div>
    </section>
  );
}
