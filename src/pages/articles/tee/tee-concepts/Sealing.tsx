export default function Sealing() {
  return (
    <section id="sealing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 봉인 (Sealing)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TEE 내부 데이터를 외부(디스크)에 저장해야 할 때 봉인(Sealing)을 사용합니다.<br />
          CPU 고유 키로 암호화하여 해당 CPU/플랫폼에서만 복호화 가능합니다.
        </p>

        <h3>봉인 정책</h3>
        <ul>
          <li><strong>MRENCLAVE</strong> — 동일 코드(측정값)에서만 복호화. 코드 업데이트 시 접근 불가</li>
          <li><strong>MRSIGNER</strong> — 동일 서명자의 코드라면 복호화 가능. 업데이트 호환</li>
        </ul>

        <h3>동작 흐름</h3>
        <p>
          1. TEE 내부에서 평문 데이터 + 봉인 정책을 CPU에 전달합니다.<br />
          2. CPU가 내부 키(Seal Key)로 AES-GCM 암호화합니다.<br />
          3. 암호문을 디스크에 저장합니다. 재부팅 후에도 같은 TEE에서 복호화 가능합니다.
        </p>
      </div>
    </section>
  );
}
