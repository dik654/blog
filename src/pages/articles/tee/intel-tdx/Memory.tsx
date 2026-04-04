export default function Memory() {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 암호화 (MKTME)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MKTME(Multi-Key Total Memory Encryption)는 TD별 다른 암호화 키를 사용합니다.<br />
          메모리 컨트롤러가 물리 주소의 키 ID 비트를 보고 적절한 키로 암/복호화합니다.
        </p>

        <h3>키 관리</h3>
        <ul>
          <li><strong>KeyID</strong> — 물리 주소 상위 비트에 키 식별자 인코딩</li>
          <li><strong>키 생성</strong> — TD Module이 TD 생성 시 랜덤 키를 할당</li>
          <li><strong>키 파괴</strong> — TD 종료 시 키 폐기. 메모리에 남은 암호문은 복호화 불가</li>
        </ul>

        <h3>무결성 보호</h3>
        <p>
          TDX는 메모리 무결성도 보호합니다.<br />
          TD 메모리 페이지에 대한 MAC을 별도로 저장하여 변조를 탐지합니다.<br />
          하이퍼바이저가 암호문을 교체하는 리플레이 공격도 방어합니다.
        </p>
      </div>
    </section>
  );
}
