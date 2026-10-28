    /// Fetch the latest checkpoint from the checkpoint fallback service.
    pub async fn fetch_latest_checkpoint(
        &self,
        network: &crate::config::networks::Network,
    ) -> eyre::Result<B256> {
        let services = &self.get_healthy_fallback_services(network);
        Self::fetch_latest_checkpoint_from_services(&services[..]).await
    }

    async fn query_service(endpoint: &Url) -> Option<RawSlotResponse> {
        let constructed_url = Self::construct_url(endpoint);
        let res = get(&constructed_url).await.ok()?;
        let raw: RawSlotResponse = res.json().await.ok()?;
        Some(raw)
    }

    /// Fetch the latest checkpoint from a list of checkpoint fallback services.
    pub async fn fetch_latest_checkpoint_from_services(
        services: &[CheckpointFallbackService],
    ) -> eyre::Result<B256> {
        // Iterate over all mainnet checkpoint sync services and get the latest checkpoint slot for each.
        let tasks: Vec<_> = services
            .iter()
            .map(|service| async move {
                let service = service.clone();
                match Self::query_service(&service.endpoint).await {
                    Some(raw) => {
                        if raw.data.slots.is_empty() {
                            return Err(eyre::eyre!("no slots"));
                        }

                        let slot = raw
                            .data
                            .slots
                            .iter()
                            .find(|s| s.block_root.is_some())
                            .ok_or(eyre::eyre!("no valid slots"))?;

                        Ok(slot.clone())
                    }
                    None => Err(eyre::eyre!("failed to query service")),
                }
            })
            .collect();

        let slots = futures::future::join_all(tasks)
            .await
            .iter()
            .filter_map(|slot| match &slot {
                Ok(s) => Some(s.clone()),
                _ => None,
            })
            .filter(|s| s.block_root.is_some())
            .collect::<Vec<_>>();

        // Get the max epoch
        let max_epoch_slot = slots.iter().max_by_key(|x| x.epoch).ok_or(eyre::eyre!(
            "Failed to find max epoch from checkpoint slots"
        ))?;
        let max_epoch = max_epoch_slot.epoch;

        // Filter out all the slots that are not the max epoch.
        let slots = slots
            .into_iter()
            .filter(|x| x.epoch == max_epoch)
            .collect::<Vec<_>>();

        // Return the most commonly verified checkpoint.
        let checkpoints = slots
            .iter()
            .filter_map(|x| x.block_root)
            .collect::<Vec<_>>();
        let mut m: HashMap<B256, usize> = HashMap::new();
        for c in checkpoints {
            *m.entry(c).or_default() += 1;
        }
        let most_common = m.into_iter().max_by_key(|(_, v)| *v).map(|(k, _)| k);

        // Return the most commonly verified checkpoint for the latest epoch.
        most_common.ok_or_else(|| eyre::eyre!("No checkpoint found"))
    }

    /// Associated function to fetch the latest checkpoint from a specific checkpoint sync fallback
    /// service api url.
    pub async fn fetch_checkpoint_from_api(url: &Url) -> eyre::Result<B256> {
        // Fetch the url
