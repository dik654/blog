// consensus/src/simplex/actors/voter/actor.rs — select_loop! main event loop

/// Core event loop — Voter actor에서 Proposal, Verify, Certify, Messages를 처리
select_loop! {
    self.context,
    on_start => {
        // 뷰가 바뀌었으면 pending 제안/검증 폐기
        if pending_propose.view() != self.state.current_view() {
            pending_propose = None;
        }
        if pending_verify.view() != self.state.current_view() {
            pending_verify = None;
        }

        // 리더면 제안 시도
        if pending_propose.is_none() {
            pending_propose = self.try_propose().await;
        }
        // 현재 뷰 제안 검증 시도
        if pending_verify.is_none() {
            pending_verify = self.try_verify().await;
        }
        // notarization이 있는 뷰들의 인증 시도
        for proposal in self.state.certify_candidates() {
            let receiver = self.automaton.certify(round, proposal.payload).await;
            let handle = certify_pool.push(async move { (round, receiver.await) });
            self.state.set_certify_handle(view, handle);
        }
    },
    _ = self.context.sleep_until(timeout) => {
        // 타이머 만료 → nullify 브로드캐스트
        self.timeout(&mut batcher, &mut vote_sender, &mut certificate_sender).await;
    },
    (context, proposed) = propose_wait => {
        // 앱이 블록 생성 완료 → Proposal 구성 + relay.broadcast
        let proposal = Proposal::new(context.round, context.parent.0, proposed);
        self.state.proposed(proposal);
        self.relay.broadcast(proposed, Plan::Propose).await;
    },
    (context, verified) = verify_wait => {
        // 앱이 검증 완료 → verified(view) 또는 trigger_timeout
        match verified {
            Ok(true) => self.state.verified(view),
            Ok(false) => self.state.trigger_timeout(view, TimeoutReason::InvalidProposal),
            Err(_) => self.state.trigger_timeout(view, TimeoutReason::IgnoredProposal),
        };
    },
    Ok((round, certified)) = certify_wait => {
        // 앱이 인증 완료 → certified(view, success)
        self.handle_certification(view, certified).await;
        resolver.certified(view, certified).await;
    },
    Some(msg) = self.mailbox_receiver.recv() => {
        // batcher/resolver에서 수신: Proposal, Verified(Certificate), Timeout
        match msg {
            Message::Proposal(p)    => self.state.set_proposal(view, p),
            Message::Verified(cert) => self.handle_*ation(cert).await,
            Message::Timeout(v, r)  => self.state.trigger_timeout(v, r),
        }
    },
    on_end => {
        // 새 투표/인증서 브로드캐스트 + 뷰 정리
        self.notify(&mut batcher, &mut resolver, &mut vote_sender,
            &mut certificate_sender, view, resolved).await;
        self.prune_views().await;
        // 뷰가 전진했으면 batcher에 새 리더 알림
        if current_view > start {
            batcher.update(current_view, leader, last_finalized, ...).await;
        }
    },
}
