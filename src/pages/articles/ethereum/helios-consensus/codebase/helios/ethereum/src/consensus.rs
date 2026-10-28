// a16z/helios commit 43a8c9f3
// ethereum/src/consensus.rs:390-474에서 발췌했습니다.

pub async fn sync(&mut self, checkpoint: B256) -> Result<()> {
    self.store = LightClientStore::default();
    self.last_checkpoint = None;

    self.bootstrap(checkpoint).await?;

    let updates: Vec<Update<S>> = self.get_updates().await?;

    for update in updates {
        self.verify_update(&update)?;
        self.apply_update(&update);
    }
    let finality_update = self.rpc.get_finality_update().await?;
    self.verify_finality_update(&finality_update)?;
    self.apply_finality_update(&finality_update);

    if self.last_checkpoint.is_none() {
        self.last_checkpoint = Some(checkpoint);
        let _ = self.checkpoint_send.send(self.last_checkpoint);
    }

    debug!(
        target: "helios::consensus",
        "consensus client in sync with checkpoint: 0x{}",
        hex::encode(checkpoint)
    );

    Ok(())
}

pub async fn advance(&mut self) -> Result<()> {
    let finality_update = self.rpc.get_finality_update().await?;
    self.verify_finality_update(&finality_update)?;
    self.apply_finality_update(&finality_update);

    if self.store.next_sync_committee.is_none() {
        debug!(target: "helios::consensus", "checking for sync committee update");
        let current_period = calc_sync_period::<S>(self.store.finalized_header.beacon().slot);
        let mut updates = self.rpc.get_updates(current_period, 1).await?;

        if updates.len() == 1 {
            let update = updates.get_mut(0).unwrap();
            let res = self.verify_update(update);

            if res.is_ok() {
                debug!(target: "helios::consensus", "updating sync committee");
                self.apply_update(update);
            }
        }
    }

    Ok(())
}
