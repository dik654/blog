// consensus/src/simplex/actors/voter — add_finalization + certified

// --- state.rs ---
/// Inserts a finalization certificate, updates finalized height, advances view.
pub fn add_finalization(
    &mut self,
    finalization: Finalization<S, D>,
) -> (bool, Option<S::PublicKey>) {
    let view = finalization.view();
    if view > self.last_finalized {
        self.last_finalized = view;

        // 확정된 뷰 이하의 인증 후보 정리
        self.certification_candidates.retain(|v| *v > view);

        // 미완료 인증 요청도 정리 (abort)
        let keep = self.outstanding_certifications.split_off(&view.next());
        for v in replace(&mut self.outstanding_certifications, keep) {
            if let Some(round) = self.views.get_mut(&v) {
                round.abort_certify();
            }
        }
    }

    self.enter_view(view.next());    // 즉시 다음 뷰로 진입!
    self.set_leader(view.next(), Some(&finalization.certificate));
    self.create_round(view).add_finalization(finalization)
}

/// Marks certification as complete and returns the notarization.
pub fn certified(&mut self, view: View, is_success: bool) -> Option<Notarization<S, D>> {
    let round = self.views.get_mut(&view)?;
    round.certified(is_success);
    if is_success {
        round.clear_deadlines();   // 인증 성공 → 타이머 해제
    }
    self.outstanding_certifications.remove(&view);

    let notarization = round.notarization().cloned()
        .expect("notarization must exist for certified view");

    if is_success {
        self.enter_view(view.next()); // 성공 → 다음 뷰
    } else {
        self.trigger_timeout(view, TimeoutReason::FailedCertification); // 실패 → nullify
    }
    Some(notarization)
}
