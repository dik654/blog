let certified = match certified {
    Ok(certified) => certified,
    Err(err) => {
        debug!(?err, ?round, "failed to certify proposal");
        return (self, true, None);
    }
};
if !certified {
    warn!(?round, "proposal failed certification");
}
let notarization;
(self, notarization) = self.handle_certification(round.view(), certified).await;
let Some(notarization) = notarization else {
    return (self, false, None);
};
(self, true, Some((certified, notarization)))
