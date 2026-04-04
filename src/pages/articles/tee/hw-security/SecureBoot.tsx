import SecureBootViz from './viz/SecureBootViz';
import SecureBootStepViz from './viz/SecureBootStepViz';

export default function SecureBoot() {
  return (
    <section id="secure-boot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">측정 부팅 & 신뢰 체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>측정 부팅(Measured Boot)</strong> — 시스템 시작 시 각 소프트웨어 계층의 해시를 TPM(Trusted Platform Module)에 기록<br />
          부팅 후 원격 증명으로 "정상적인 소프트웨어로 부팅되었는가"를 검증 가능<br />
          → <a href="/tee/tee-tcb" className="text-indigo-400 hover:underline">TCB & 측정 부팅 심층 분석 (TPM · PCR · 신뢰 체인 코드)</a>
        </p>

        <h3>PCR Extend 연산</h3>
        <p>
          TPM의 PCR(Platform Configuration Register, 플랫폼 구성 레지스터)은 <strong>extend만 가능</strong><br />
          PCR_new = SHA-256(PCR_old || measurement) → 이전 값 복원 불가<br />
          이 단방향성이 부트 로그의 변조를 불가능하게 만듦
        </p>

        <h3>Secure Boot vs Measured Boot</h3>
        <p>
          Secure Boot — 서명 검증 실패 시 부팅 자체를 차단 (예방적)<br />
          Measured Boot — 부팅은 허용하되 측정값을 기록 (사후 검증)<br />
          실무에서는 두 방식을 함께 사용
        </p>
      </div>
      <div className="not-prose mt-6">
        <SecureBootStepViz />
      </div>
      <div className="not-prose mt-8">
        <SecureBootViz />
      </div>
    </section>
  );
}
