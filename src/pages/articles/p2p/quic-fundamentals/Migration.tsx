import MigrationViz from './viz/MigrationViz';

export default function Migration() {
  return (
    <section id="migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연결 마이그레이션</h2>
      <div className="not-prose mb-8"><MigrationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TCP 연결은 (소스 IP, 소스 포트, 대상 IP, 대상 포트) 4-tuple로 식별됩니다.<br />
          Wi-Fi에서 셀룰러로 전환하면 IP가 바뀌므로 TCP 연결이 끊어집니다.
        </p>
        <h3>Connection ID</h3>
        <p className="leading-7">
          QUIC는 <strong>Connection ID</strong>로 연결을 식별합니다.<br />
          IP 주소가 변경되어도 Connection ID가 같으면 기존 연결을 유지합니다.<br />
          이를 <strong>연결 마이그레이션(Connection Migration)</strong>이라 합니다.
        </p>
        <h3>Path Validation</h3>
        <p className="leading-7">
          새 경로로 전환 시 QUIC는 <strong>PATH_CHALLENGE</strong> 프레임을 전송합니다.<br />
          상대가 <strong>PATH_RESPONSE</strong>로 응답하면 새 경로가 유효함을 확인합니다.<br />
          이 과정은 경로 위조 공격을 방지합니다.
        </p>
        <p className="leading-7">
          iroh의 MagicSock은 QUIC 연결 마이그레이션을 활용해
          직접 연결과 릴레이 경로를 실시간으로 전환합니다.
        </p>
      </div>
    </section>
  );
}
