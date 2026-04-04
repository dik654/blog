import ContextViz from './viz/ContextViz';
import TrustChainViz from './viz/TrustChainViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'AMD SEV 개요'}</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>AMD SEV (Secure Encrypted Virtualization)</strong>는 EPYC 프로��서의
          하드웨어 기반 보안 가상화 기술입니다.<br />
          VM(가상 머신) 메모리를 하드웨어 수준에서 암호화합니다.<br />
          <strong>호스트 OS나 하이퍼바이저조차</strong> 게스트 VM 데이터를 읽을 수 없습니다.
        </p>

        <h3>보안 목표</h3>
        <ul>
          <li><strong>기밀성 (Confidentiality)</strong> — 게스트 메모리 내용을 외부에서 읽을 수 없음</li>
          <li><strong>무결성 (Integrity)</strong> — 게스트 코드/데이터의 무단 변경 탐지 (SNP)</li>
          <li><strong>��리 (Isolation)</strong> — 각 게스트 VM이 서로 독립적으로 실행</li>
          <li><strong>원격 증명 (Attestation)</strong> — 신뢰할 수 없는 환경에서 실행 환경 검증</li>
        </ul>

        <h3>위협 모델</h3>
        <p>
          SEV는 악의적 하이퍼바이저, 호스트 OS,<br />
          동일 서버의 다른 게스트 VM을 공격자로 가정합니다.
        </p>
      </div>
      <div className="not-prose mt-8">
        <TrustChainViz />
      </div>
    </section>
  );
}
