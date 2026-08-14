import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        유한체 구현은 숫자를 저장하는 법보다 표현 경계를 지키는 일이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          수학에서 <code>a+b mod p</code>는 한 줄이지만 CPU는 254-bit 값을 한
          레지스터에 담지 못합니다. 구현은 값을 여러 64-bit limb로 나누고,
          반복 곱셈 동안에는 Montgomery 표현을 유지하며, 외부 bytes로 나갈 때만
          canonical residue로 되돌립니다. 어느 단계에서든 표현을 섞으면 타입은
          맞아도 결과는 조용히 틀립니다.
        </p>
        <p>
          나눗셈 가능한 field의 정의와 inverse 증명은
          <Link to="/crypto/finite-field-theory"> 유한체 이론 정본</Link>이
          소유합니다. 곡선 좌표 Fp와 scalar Fr의 수학적 역할은
          <Link to="/crypto/elliptic-curves"> 타원곡선군 정본</Link>을
          재사용합니다. 이 글은 그 수학을 다시 정의하지 않고
          <strong> bytes → canonical residue → limbs → Montgomery domain → API → bytes</strong>
          로 이어지는 구현 불변식과 release gate를 설명합니다.
        </p>
        <p>
          코드는 교육용 Rust 의사코드입니다. 실제 source claim은
          <code>ark-ff 0.5.0</code>, tag commit
          <code>7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c</code>에 고정합니다.
          새 버전이나 다른 limb 폭에는 상수·trait·side-channel 특성을 일반화하지
          않습니다.
        </p>
      </div>
      <ContentBoundary article="field-arithmetic" />
      <div id="paper-ark-ff-050" className="scroll-mt-24">
        <CitationBlock
          source="arkworks algebra v0.5.0 · finite-field source snapshot"
          href="https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src"
          citeKey={1}
          type="code"
        >
          문제: 여러 prime field를 같은 trait와 Montgomery backend로 안전하게
          구현해야 합니다. 기여: versioned field traits, bigint representation,
          Montgomery configuration과 arithmetic source를 제공합니다. 전제:
          ark-ff 0.5.0과 위 commit, target/compiler configuration을 고정합니다.
          근거 범위: 이 snapshot의 API와 구현 seam입니다. 비주장: 이 글의
          의사코드가 source와 줄 단위로 같거나 모든 target에서 constant-time임을
          보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
