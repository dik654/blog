import PolicyViz from './viz/PolicyViz';

export default function PolicySystem() {
  return (
    <section id="policy-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">정책 시스템</h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">Keylime 정책 2축</h3>
      <p className="leading-7 mb-4">
        <strong>TPM 정책</strong>: PCR 허용 값 정의 (부팅 체인 검증)<br />
        <strong>런타임 정책</strong>: IMA 측정 로그의 파일 해시 허용 목록 (JSON 스키마)<br />
        <strong>정책 위반</strong>: 자동 revocation 메커니즘 동작<br />
        <strong>캐싱</strong>: 성능을 위해 정책 객체 메모리 캐싱
      </p>

      <PolicyViz />

      <h3 className="text-xl font-semibold mt-8 mb-3">TPM Policy 예시</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// TPM policy (JSON)
{
  "mask": "0x401",  // PCR 0 + PCR 10 사용
  "pcrs": {
    "0": [
      "abc123...",   // SHA-256 of expected BIOS
      "def456..."    // 대체 BIOS 버전도 허용
    ],
    "10": [
      "789012..."    // IMA PCR 초기값
    ]
  }
}

// PCR mask 해석
// bit N set → PCR N 검증 대상
// 0x401 = binary 10000000001 → PCR 0 + PCR 10

// 표준 PCR 할당 (TCG PC Client Spec)
// PCR[0]: BIOS firmware code
// PCR[1]: BIOS data / platform config
// PCR[2]: Option ROM code
// PCR[3]: Option ROM config
// PCR[4]: MBR / Boot Manager
// PCR[5]: GPT + Boot Manager events
// PCR[7]: Secure Boot policy
// PCR[8]: GRUB / systemd-boot
// PCR[9]: Kernel + initrd hash
// PCR[10]: IMA runtime measurements
// PCR[11]: LUKS header (systemd)
// PCR[14]: shim + MOK
// PCR[15]: systemd-cryptenroll

// 정책 작성 방법
// 1) Known-good baseline 측정
//    - 정상 부팅 후 tpm2_pcrread로 값 수집
// 2) tenant CLI가 자동 추출
//    keylime_tenant --pcrs 0,10 add
// 3) 수동 편집 (특수 상황)`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">런타임 정책 구조</h3>
      <div className="rounded-xl border p-4 mb-4">
        <ul className="space-y-1.5 text-sm">
          <li><strong className="font-mono">meta</strong>: 정책 버전(version)과 생성기 타입(generator)</li>
          <li><strong className="font-mono">digests</strong>: 파일 경로별 허용 해시 목록</li>
          <li><strong className="font-mono">excludes</strong>: 검증에서 제외할 파일 정규식 패턴</li>
          <li><strong className="font-mono">keyrings</strong>: IMA 키링 정보 (서명 검증용)</li>
          <li><strong className="font-mono">ima</strong>: IMA 관련 세부 설정 (log_hash_alg, dm_policy 등)</li>
          <li><strong className="font-mono">verification-keys</strong>: 검증용 공개키 (PEM/DER)</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-3">런타임 정책 JSON 예시</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// runtime policy 전체 구조
{
  "meta": {
    "version": 1,
    "generator": "runtime_policy_tool v2.0"
  },
  "digests": {
    "/usr/bin/bash": [
      "abcdef0123456789..."  // SHA-256
    ],
    "/usr/lib/x86_64-linux-gnu/libc.so.6": [
      "1234567890abcdef...",
      "fedcba0987654321..."   // 다중 버전 허용
    ],
    "/etc/ssh/sshd_config": [
      "aabbccddeeff0011..."
    ]
  },
  "excludes": [
    "/tmp/.*",
    "/var/log/.*",
    "/proc/.*",
    ".*\\\\.pyc$"
  ],
  "keyrings": {
    "module-signing": {
      "trusted_keys": ["<PEM>"]
    }
  },
  "ima": {
    "log_hash_alg": "sha256",
    "dm_policy": null
  },
  "verification-keys": [
    {
      "key_type": "public_key",
      "key_data": "<PEM format>",
      "scope": "all"
    }
  ]
}`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">정책 검증 플로우</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// Verifier가 IMA log 검증 (keylime/ima.py)

def process_measurement_list(
    agent, runtime_policy, measurement_list: bytes
) -> bool:
    # 1) IMA log 파싱 (줄 단위)
    for line in measurement_list.decode().splitlines():
        fields = parse_ima_line(line)
        # fields = (pcr, template_hash, template, filedata_hash, path)

        # 2) Exclude pattern 매치 → skip
        if is_excluded(fields.path, runtime_policy.excludes):
            continue

        # 3) Digest 확인
        expected_hashes = runtime_policy.digests.get(fields.path)
        if not expected_hashes:
            # 정책에 없는 파일
            return False  # unknown file

        if fields.filedata_hash not in expected_hashes:
            # 허용된 해시 아님
            return False  # tampered file

        # 4) IMA signature 확인 (옵션)
        if runtime_policy.verification_keys:
            if not verify_ima_signature(line, verification_keys):
                return False

    return True  # 전부 통과

// Revocation 트리거
// - 정책 위반 시
// - Verifier가 revoke_agent() 호출
// - Registrar에 revocation notice 전송
// - 다른 서비스에 webhook으로 알림`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">성능 최적화</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// keylime/cloud_verifier_tornado.py

# GLOBAL_POLICY_CACHE — 에이전트별 정책 캐싱
GLOBAL_POLICY_CACHE = {}

def get_runtime_policy(agent_id):
    # 1) 캐시 히트 체크
    checksum = db.get_policy_checksum(agent_id)
    cached = GLOBAL_POLICY_CACHE.get(agent_id)

    if cached and cached["checksum"] == checksum:
        return cached["policy"]  # 재사용

    # 2) 캐시 미스: DB 조회 + 파싱
    policy_json = db.get_runtime_policy(agent_id)
    policy = RuntimePolicy.from_json(policy_json)

    # 3) 캐시 저장
    GLOBAL_POLICY_CACHE[agent_id] = {
        "policy": policy,
        "checksum": checksum
    }

    return policy

# 이점
# - 대형 정책 파일(수천 파일) 반복 파싱 회피
# - 대부분 agent는 같은 정책 재사용
# - Memory 사용량은 agent 수에 비례`}</div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">인사이트: 정책 관리의 실전 과제</p>
        <p className="text-sm">
          <strong>정책 baseline 생성</strong>:<br />
          - Clean 시스템에서 측정 (reference machine)<br />
          - 패키지 업데이트마다 정책 재생성 필요<br />
          - 도구: keylime의 create_runtime_policy.py
        </p>
        <p className="text-sm mt-2">
          <strong>업데이트 전략</strong>:<br />
          ✓ Rolling update: 한 번에 일부 agent만 새 정책<br />
          ✓ Canary deployment: 소수 agent 먼저 검증<br />
          ✓ Rollback: 이전 정책으로 빠른 복귀<br />
          ✗ 모든 agent 동시 update → outage 위험
        </p>
        <p className="text-sm mt-2">
          <strong>대안 도구</strong>:<br />
          - Aide (static integrity check)<br />
          - Samhain (runtime monitoring)<br />
          - OSSEC (holistic IDS)<br />
          → Keylime의 차별점: TPM-backed, attestation 통합
        </p>
      </div>
    </section>
  );
}
