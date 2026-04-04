export default function Remote() {
  return (
    <section id="remote" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 (EPID/DCAP)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          원격 증명은 로컬 증명을 확장합니다.<br />
          Quoting Enclave(QE)가 EREPORT를 QUOTE로 변환하여 외부 전송 가능하게 만듭니다.
        </p>

        <h3>EPID 방식</h3>
        <p>
          EPID(Enhanced Privacy ID) 그룹 서명을 사용합니다.<br />
          개별 플랫폼을 식별하지 않으면서 "Intel SGX 플랫폼"임을 증명합니다.<br />
          Intel Attestation Service(IAS)에 QUOTE를 전송하여 검증받습니다.
        </p>

        <h3>DCAP 방식</h3>
        <p>
          ECDSA 서명 기반으로 Intel 서버 의존을 제거합니다.<br />
          PCK(Provisioning Certification Key) 인증서를 미리 캐시하면 오프라인 검증이 가능합니다.
        </p>
      </div>
    </section>
  );
}
