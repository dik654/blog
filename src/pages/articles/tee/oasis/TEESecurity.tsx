import TEESecurityViz from './viz/TEESecurityViz';
import TEEConfigViz from './viz/TEEConfigViz';

export default function TEESecurity() {
  return (
    <section id="tee-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TEE 보안</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis Core는 <strong>Intel SGX</strong>를 활용해 런타임 실행의 기밀성과
          무결성을 보장합니다.<br />
          SGX Quote 기반 원격 증명, RA-TLS 보안 채널,
          dm-verity 파일시스템 무결성 검증으로 다층 보안을 구현합니다.
        </p>
      </div>

      <TEESecurityViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>TEE 설정 & 원격 증명</h3>
      </div>
      <TEEConfigViz />
    </section>
  );
}
