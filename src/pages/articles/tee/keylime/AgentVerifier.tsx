import AgentVerifierViz from './viz/AgentVerifierViz';

export default function AgentVerifier() {
  return (
    <section id="agent-verifier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에이전트-검증자 아키텍처</h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">지속적 검증 루프</h3>
      <p className="leading-7 mb-4">
        <strong>Keylime 핵심</strong>: Agent ↔ Verifier 간 지속적 검증 루프<br />
        <strong>Verifier</strong>: Tornado 기반 비동기 서버 — 수백~수천 agent 동시 처리<br />
        <strong>SQLAlchemy</strong>: ORM으로 agent 상태 영속 관리<br />
        <strong>빈도</strong>: 기본 2초마다 quote 요청 (설정 가능)
      </p>

      <AgentVerifierViz />

      <h3 className="text-xl font-semibold mt-8 mb-3">검증 루프 내부 동작</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// keylime/cloud_verifier_tornado.py

class VerifierMain:
    async def invoke_notify_loop(self):
        while self.running:
            # 1) 등록된 모든 agent 순회
            agents = await self.db.get_active_agents()

            for agent in agents:
                # 2) Nonce 생성 (replay 방어)
                nonce = os.urandom(20)

                # 3) Agent에 quote 요청
                quote_resp = await self.request_quote(agent, nonce)

                # 4) Quote 검증
                result = self.process_quote_response(
                    agent, nonce, quote_resp
                )

                if result == VALID:
                    # 5) PCR 값 확인 (policy 매치)
                    if not self.pcr_policy_match(agent, quote_resp):
                        await self.revoke_agent(agent, "PCR mismatch")
                        continue

                    # 6) IMA log 검증 (runtime integrity)
                    ima_ok = self.verify_ima_log(agent, quote_resp)
                    if not ima_ok:
                        await self.revoke_agent(agent, "IMA violation")
                        continue

                    # 7) 상태 저장 (heartbeat)
                    await self.db.update_last_successful(agent, now())
                else:
                    await self.revoke_agent(agent, "Invalid quote")

            # 8) 다음 라운드까지 대기
            await asyncio.sleep(POLLING_INTERVAL)

// 비동기 특성
// - Tornado event loop
// - 1000+ agents 처리 가능
// - 각 agent 독립 timer`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">상세 데이터 구조</h3>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold text-sm mb-2">Agent 핵심 구조</h4>
          <ul className="space-y-1 text-sm">
            <li><strong>AgentAttestState</strong>: 증분 증명 상태 관리</li>
            <li><strong>TPMState</strong>: PCR 번호별 해시값 모델링</li>
            <li><strong>TPMClockInfo</strong>: 단조 클록으로 재생 공격 방지</li>
            <li><strong>ImaKeyrings</strong>: IMA 서명 검증용 키링</li>
          </ul>
        </div>
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold text-sm mb-2">Verifier 핵심 구조</h4>
          <ul className="space-y-1 text-sm">
            <li><strong>AgentsHandler</strong>: REST API (GET/POST/DELETE/PUT)</li>
            <li><strong>VerfierMain</strong>: 에이전트별 정책/상태 DB 테이블</li>
            <li><strong>process_quote_response()</strong>: Quote 응답 검증</li>
            <li><strong>prepare_get_quote()</strong>: nonce 생성 & 요청 준비</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-3">Agent Quote 생성 (TPM 2.0)</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// keylime/tpm/tpm_main.py

class Tpm:
    async def create_quote(self, nonce: bytes, pcrs: List[int], ima_pcrs: List[int]):
        # 1) AIK 로딩 (이전에 생성됨)
        aik_handle = self.aik_handle

        # 2) PCR 선택 마스크 구성
        pcr_sel = PcrSelection()
        for pcr in pcrs:
            pcr_sel.add(pcr)

        # 3) TPM2_Quote 호출
        quote_result = tss2.TPM2_Quote(
            signKeyHandle=aik_handle,
            qualifyingData=nonce,
            pcrSelect=pcr_sel,
        )

        # 4) 반환: (quote_data, signature, pcr_values)
        return {
            "quote": quote_result.quoted,
            "signature": quote_result.signature,
            "pcrs": quote_result.pcr_values,
        }

// TPM2_Quote output 구조
TPMS_ATTEST {
    magic: TPM_GENERATED_VALUE,
    type: TPM_ST_ATTEST_QUOTE,
    qualifiedSigner: AIK's name,
    extraData: nonce,              // Verifier's nonce
    clockInfo: TPMS_CLOCK_INFO,
    firmwareVersion: ...,
    attested: TPMS_QUOTE_INFO {
        pcrSelect: which PCRs,
        pcrDigest: SHA256(PCR values),
    },
}

// AIK(Attestation Identity Key)로 서명
// - EK(Endorsement Key)로 AIK 인증서 발급받음
// - AIK는 quoting용 전용 키`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">Verifier Quote 검증</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// keylime/cloud_verifier_tornado.py

def process_quote_response(agent, nonce, quote_resp) -> bool:
    # 1) Quote 서명 검증 (AIK 공개키로)
    aik_pubkey = registrar.get_aik(agent.uuid)
    if not verify_tpm_signature(quote_resp.quote, quote_resp.signature, aik_pubkey):
        return False

    # 2) Nonce 확인 (replay 방어)
    quote_struct = parse_quote(quote_resp.quote)
    if quote_struct.extra_data != nonce:
        return False

    # 3) Clock info 확인 (monotonic counter)
    if quote_struct.clock_info.clock < agent.last_clock:
        return False  # 시간 역전 = suspicious
    agent.last_clock = quote_struct.clock_info.clock

    # 4) PCR digest 재계산
    computed_digest = sha256(concat([quote_resp.pcrs[i] for i in pcr_list]))
    if computed_digest != quote_struct.attested.pcr_digest:
        return False

    # 5) PCR 값이 policy와 매치
    for pcr_num, expected in policy.items():
        if quote_resp.pcrs[pcr_num] not in expected:
            return False  # 알 수 없는 부트 체인

    return True`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">통신 보안 (mTLS)</h3>
      <p className="leading-7">
        모든 컴포넌트 간 통신: <strong>mTLS</strong>(상호 TLS 인증)로 보호<br />
        Agent: 자체 서명 인증서 생성 후 Registrar에 등록<br />
        Verifier: Registrar에서 Agent 공개키 조회 → 인증서 대조<br />
        API 버전 협상: 클라이언트-서버 간 호환성 보장 (backward-compatible rolling update)
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">인사이트: Continuous Attestation의 의미</p>
        <p className="text-sm">
          <strong>One-shot vs Continuous</strong>:<br />
          - One-shot (boot only): 부팅 시점만 검증 → 런타임 공격 탐지 못 함<br />
          - Continuous (Keylime): 주기적 polling → 런타임 변조 즉시 탐지
        </p>
        <p className="text-sm mt-2">
          <strong>Keylime의 가치</strong>:<br />
          ✓ Rootkit 감지 가능 (IMA로 파일 변조 추적)<br />
          ✓ CI/CD pipeline 통합 (실패 시 파이프라인 중단)<br />
          ✓ Compliance 증명 (주기적 증거 생성)<br />
          ✓ Incident response 빠른 대응
        </p>
        <p className="text-sm mt-2">
          <strong>비용</strong>:<br />
          - TPM quote 오버헤드 (~100ms per quote)<br />
          - Verifier 인프라 (DB, Tornado)<br />
          - 네트워크 트래픽 (small per quote)<br />
          - Scale: 수천 agent까지 실용적
        </p>
      </div>
    </section>
  );
}
