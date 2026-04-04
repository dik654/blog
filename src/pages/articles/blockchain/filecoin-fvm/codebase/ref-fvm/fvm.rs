// ref-fvm — fvm.rs (Filecoin Virtual Machine)
// WASM 기반 VM 런타임: Actor 실행, syscall, IPLD 상태 접근

/// FVM 머신 — WASM 런타임 + 상태 트리 + syscall 인터페이스
pub struct Machine<B: Blockstore> {
    engine: Engine,              // wasmtime 엔진
    context: MachineContext,     // 네트워크 버전, 에폭, 가스 제한 등
    state_tree: StateTree<B>,   // HAMT 기반 Actor 상태 트리
    builtin_actors: Manifest,   // 내장 Actor 코드 CID 매핑
}

/// Actor 실행 — WASM 모듈을 wasmtime으로 인스턴스화하고 invoke()
impl<B: Blockstore> Machine<B> {
    pub fn execute_message(
        &mut self,
        msg: &Message,         // from, to, method, params, value, gas_limit
    ) -> Result<ApplyReturn> {
        // 1. 가스 차지 — 기본 실행 비용 + 메시지 크기 비용
        let gas_tracker = GasTracker::new(msg.gas_limit);

        // 2. Actor 코드 로드 — state_tree에서 to 주소의 Actor 상태 조회
        //    Actor 상태에 code_cid가 포함 → Blockstore에서 WASM 바이트 로드
        let actor_state = self.state_tree.get_actor(msg.to)?;
        let code = self.engine.get_module(&actor_state.code)?;

        // 3. WASM 인스턴스 생성 — syscall 함수들을 host function으로 바인딩
        //    ipld_open, ipld_get, ipld_put 등으로 IPLD 상태 접근
        let store = Store::new(&self.engine);
        let instance = self.engine.instantiate(&store, &code)?;

        // 4. invoke() 호출 — method_num에 해당하는 Actor 메서드 실행
        //    반환값 = IPLD 직렬화된 결과 + 가스 사용량
        let result = instance.invoke(msg.method_num, &msg.params)?;

        // 5. 상태 업데이트 — Actor의 새 상태 루트를 state_tree에 기록
        self.state_tree.set_actor(msg.to, &new_actor_state)?;

        Ok(ApplyReturn { exit_code: 0, return_data: result, gas_used: gas_tracker.used() })
    }
}

/// Built-in Actor 목록 — 프로토콜 핵심 로직
pub enum BuiltinActor {
    Init,           // Actor 주소 할당 + 배포
    Cron,           // 에폭마다 자동 실행 (deadline 체크 등)
    StorageMiner,   // 섹터 관리, PoSt 제출, 보상 청구
    StorageMarket,  // 스토리지 딜 생성, 검증, 정산
    StoragePower,   // SP 파워 추적, 블록 보상 분배
    Reward,         // 블록 보상 계산 + 분배
    VerifiedReg,    // Fil+ 데이터 검증, DataCap 관리
    EAM,            // EVM Actor Manager — FEVM 호환
    EthAccount,     // 이더리움 호환 계정 (EIP-155)
}
