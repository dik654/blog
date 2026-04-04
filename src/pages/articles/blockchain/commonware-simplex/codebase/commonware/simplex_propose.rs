// consensus/src/simplex/actors/voter — try_propose + construct_notarize

// --- state.rs ---
/// Attempt to propose a new block.
pub fn try_propose(&mut self) -> Option<Context<D, S::PublicKey>> {
    let view = self.view;
    if view == GENESIS_VIEW {
        return None;              // genesis view는 proposal 불가
    }
    if !self.views.get_mut(&view)
        .expect("view must exist")
        .should_propose()          // leader가 아니거나 이미 building 중이면 false
    {
        return None;
    }

    // Look for parent — 이전 view에서 certified된 proposal을 찾음
    let parent = self.find_parent(view);
    let (parent_view, parent_payload) = match parent {
        Ok(parent) => parent,
        Err(missing) => {
            debug!(%view, %missing, "missing parent during proposal");
            return None;           // parent certificate 미확보 → 제안 불가
        }
    };
    let leader = self.views.get_mut(&view)
        .expect("view must exist")
        .try_propose()?;           // building 상태로 전환 + leader 반환
    Some(Context {
        round: Rnd::new(self.epoch, view),
        leader: leader.key,
        parent: (parent_view, parent_payload),
    })
}

// --- actor.rs ---
/// Actor에서 호출: state.try_propose() → automaton.propose()
async fn try_propose(&mut self) -> Option<Request<Context<D, S::PublicKey>, D>> {
    let context = self.state.try_propose()?;
    // 앱에 블록 생성 요청 → oneshot receiver로 결과 대기
    let receiver = self.automaton.propose(context.clone()).await;
    Some(Request(context, receiver))
}
