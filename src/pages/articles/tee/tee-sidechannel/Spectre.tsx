export default function Spectre() {
  return (
    <section id="spectre" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Spectre & Meltdown</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CPU의 투기적 실행(Speculative Execution) 최적화가 보안 취약점이 됩니다.<br />
          비밀 데이터에 의존하는 메모리 접근이 캐시에 흔적을 남깁니다.
        </p>

        <h3>Spectre v1 (Bounds Check Bypass)</h3>
        <p>
          배열 범위 검사를 우회하여 경계 밖 데이터를 투기적으로 읽습니다.<br />
          읽은 값이 캐시 라인 인덱스로 사용되면 타이밍으로 유추 가능합니다.
        </p>

        <h3>Meltdown (Rogue Data Cache Load)</h3>
        <p>
          커널 메모리를 사용자 공간에서 투기적으로 읽습니다.<br />
          권한 검사 전에 캐시에 로드되는 CPU 버그를 악용합니다.
        </p>

        <h3>TEE에 미치는 영향</h3>
        <p>
          SGX Enclave도 같은 CPU 코어에서 실행됩니다.<br />
          Foreshadow(L1TF) — SGX EPC 데이터를 L1 캐시에서 유출시키는 공격입니다.
        </p>
      </div>
    </section>
  );
}
