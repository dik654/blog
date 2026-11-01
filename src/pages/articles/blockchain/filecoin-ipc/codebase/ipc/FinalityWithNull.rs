// IPC main bcd7c0d · fendermint/vm/topdown/src/finality/null.rs
// 실제 proposal 검사 두 함수를 유지하고 읽는 순서를 알려 주는 한글 주석만 더했습니다.

impl FinalityWithNull {
    fn check_height(
        &self,
        proposal: &IPCParentFinality,
    ) -> Stm<bool> {
        let binding = self.last_committed_finality.read()?;

        // 아직 기준 finality가 없으면 무엇과 비교해야 할지 모르므로 거절합니다.
        let last_committed_finality = if let Some(f) = binding.as_ref() {
            f
        } else {
            return Ok(false);
        };

        // 이미 commit한 height와 그보다 과거인 proposal은 다시 받지 않습니다.
        if last_committed_finality.height >= proposal.height {
            return Ok(false);
        }

        // Configured parent source를 통해 local cache가 실제로 본 범위만 받습니다.
        if let Some(latest_height) = self.latest_height_in_cache()? {
            Ok(latest_height >= proposal.height)
        } else {
            return Ok(false);
        }
    }

    fn check_block_hash(
        &self,
        proposal: &IPCParentFinality,
    ) -> Stm<bool> {
        // 같은 height에서 cache가 본 hash와 proposal hash를 직접 비교합니다.
        Ok(if let Some(block_hash) = self.block_hash_at_height(proposal.height)? {
            block_hash == proposal.block_hash
        } else {
            false
        })
    }

    pub fn check_proposal(
        &self,
        proposal: &IPCParentFinality,
    ) -> Stm<bool> {
        if !self.check_height(proposal)? {
            return Ok(false);
        }
        self.check_block_hash(proposal)
    }
}
