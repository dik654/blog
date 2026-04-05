import MigrationLiveViz from './viz/MigrationLiveViz';
import MigrationProtocolViz from './viz/MigrationProtocolViz';

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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Source ASP ↔ Target ASP 인증 흐름

// 1) Target ASP가 PDH (Platform Diffie-Hellman) cert 발급
//    - PEK(Platform Endorsement Key)로 서명
//    - OCA → PEK → PDH 체인
target_pdh_cert = asp.get_pdh_cert();

// 2) Source ASP가 Target PDH 검증
//    - AMD root key까지 체인 검증
//    - Target이 genuine AMD platform인지 확인
//    - Migration policy 허용 여부 체크
if !verify_cert_chain(target_pdh_cert, amd_root_ca) {
    return ERR_INVALID_PLATFORM;
}

// 3) Source ASP가 자신의 PDH cert 생성
source_pdh_cert = asp.get_pdh_cert();

// 4) ECDH로 공통 세션 키 (TEK) 도출
//    - Source private + Target public
//    - Target private + Source public
//    - 양쪽에서 동일한 TEK 계산
source_tek = ecdh(source_privkey, target_pdh_cert.pubkey);
target_tek = ecdh(target_privkey, source_pdh_cert.pubkey);
assert(source_tek == target_tek);

// 5) 이후 모든 VM 상태를 TEK로 암호화 전송`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 페이지 전송 — Send/Receive</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Source Host (송신) 측

int sev_send_page(struct kvm *kvm, int asid, u64 gpa, size_t size) {
    struct sev_data_send_update_data send = {
        .handle = kvm->sev_info.handle,
        .guest_address = gpa,
        .guest_length = size,
        .trans_address = trans_buf_pa,  // TEK로 암호화된 버퍼
        .trans_length = size,
        .hdr_address = hdr_buf_pa,       // IV, nonce
        .hdr_length = 16,
    };

    // ASP가 수행:
    // 1) VEK로 src 페이지 복호화 (내부)
    // 2) TEK로 재암호화 → trans_buf에 저장
    // 3) hdr_buf에 nonce·sequence 기록
    sev_do_cmd(SEV_CMD_SEND_UPDATE_DATA, &send);

    // 네트워크로 trans_buf + hdr_buf 전송
    network_send(remote_host, trans_buf, hdr_buf);

    return 0;
}

// Target Host (수신) 측

int sev_receive_page(struct kvm *kvm, int asid, u64 gpa, size_t size) {
    struct sev_data_receive_update_data recv = {
        .handle = kvm->sev_info.handle,
        .guest_address = gpa,
        .guest_length = size,
        .trans_address = trans_buf_pa,  // 수신한 암호문
        .trans_length = size,
        .hdr_address = hdr_buf_pa,
        .hdr_length = 16,
    };

    // ASP가 수행:
    // 1) TEK로 trans_buf 복호화
    // 2) 새 VEK(target 쪽)로 재암호화
    // 3) 대상 gpa에 저장
    sev_do_cmd(SEV_CMD_RECEIVE_UPDATE_DATA, &recv);

    return 0;
}

// Dirty page tracking
// - KVM이 dirty bitmap 유지
// - pre-copy: 반복적으로 dirty 페이지 전송
// - post-copy: 수신 측에서 on-demand pull
// - VM이 짧게 정지 (stop-the-world) 후 최종 전송`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Migration Policy</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// VM 생성 시 migration policy 설정
struct sev_policy {
    u32 no_debug    : 1;   // 디버거 접근 금지
    u32 no_ks       : 1;   // 키 공유 금지
    u32 es          : 1;   // SEV-ES 필수
    u32 no_send     : 1;   // migration 금지
    u32 domain      : 1;   // 같은 도메인 내 migration만
    u32 sev         : 1;   // SEV 필수
    u32 api_major   : 8;
    u32 api_minor   : 8;
    u32 build       : 8;
    u32 reserved    : 2;
};

// 예: no_send = 1이면 VM은 이 host에 영구 고정
// 예: domain = 1이면 guest owner가 승인한 타겟만

// 실전 정책
// - 민감한 워크로드: no_send 또는 domain-only
// - 일반 워크로드: open migration
// - 클라우드 설정으로 강제 가능`}</pre>

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
