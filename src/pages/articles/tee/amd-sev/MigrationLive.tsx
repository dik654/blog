import MigrationLiveViz from './viz/MigrationLiveViz';
import MigrationProtocolViz from './viz/MigrationProtocolViz';
import MigrationAuthViz from './viz/MigrationAuthViz';
import MigrationPageReencryptViz from './viz/MigrationPageReencryptViz';
import MigrationPolicyBitsViz from './viz/MigrationPolicyBitsViz';

export default function MigrationLive() {
  return (
    <section id="migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SEV 라이브 마이그레이션</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SEV Live Migration</strong>: VM을 평문 노출 없이 호스트 간 이동<br />
          양측 ASP가 <strong>TEK</strong>(Transport Encryption Key) 협상<br />
          메모리 페이지를 기존 VEK로 복호화 → TEK로 재암호화 → 네트워크 전송 → 반대편에서 역순<br />
          <strong>보안 속성</strong>: 네트워크·중개자·Host 모두 평문 못 봄
        </p>
      </div>

      <MigrationLiveViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">마이그레이션 전 상호 인증</h3>
      </div>
      <div className="not-prose mb-4"><MigrationAuthViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 페이지 전송 — Send/Receive</h3>
      </div>
      <div className="not-prose mb-4"><MigrationPageReencryptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Migration Policy</h3>
      </div>
      <div className="not-prose mb-4"><MigrationPolicyBitsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">마이그레이션 프로토콜</h3>
      </div>
      <MigrationProtocolViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: SEV 마이그레이션의 보안 한계</p>
          <p>
            <strong>방어 가능</strong>:<br />
            ✓ 네트워크 sniffing — TEK로 암호화<br />
            ✓ 중간자 공격 — PDH cert로 상호 인증<br />
            ✓ 잘못된 플랫폼으로 이주 — policy로 차단
          </p>
          <p className="mt-2">
            <strong>방어 불가</strong>:<br />
            ✗ 소스·타겟 둘 다 악성 호스트 공조<br />
            ✗ AMD firmware 버그 악용<br />
            ✗ 타이밍·사이드채널 분석
          </p>
          <p className="mt-2">
            <strong>SEV-SNP 추가 방어</strong>:<br />
            - Migration Agent(MA) Firmware (2022 이후)<br />
            - Guest owner가 migration 승인 직접 결정<br />
            - Policy가 SEV Report에 포함 → 런타임 검증
          </p>
        </div>

      </div>
    </section>
  );
}
