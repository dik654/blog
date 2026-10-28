use serde::{de::DeserializeOwned, Deserialize};

#[derive(Deserialize, Debug)]
#[serde(untagged)]
enum HttpRpcMessage<T> {
    Success(T),
    Error(HttpRpcError),
}

impl HttpRpc {
    async fn get<R: DeserializeOwned>(&self, req: &str) -> Result<R> {
        let response = retry(
            || async { Ok::<_, eyre::Report>(self.client.get(req).send().await?) },
            BackoffSettings::default(),
        )
        .await?;

        let status = response.status();
        let bytes = response.bytes().await?;

        let message: HttpRpcMessage<R> = serde_json::from_slice(&bytes).map_err(|e| {
            if status.is_success() {
                eyre::eyre!("deserialization error: {}", e)
            } else {
                eyre::eyre!("status: {}, raw response: {:?}", status.as_u16(), bytes)
            }
        })?;

        match message {
            HttpRpcMessage::Success(data) => Ok(data),
            HttpRpcMessage::Error(error) => Err(eyre::eyre!(
                "status: {}, message: {}",
                error.code,
                error.message
            )),
        }
    }
}

async fn get_updates(&self, period: u64, count: u8) -> Result<Vec<Update<S>>> {
    let count = cmp::min(count, MAX_REQUEST_LIGHT_CLIENT_UPDATES);
    let req = format!(
        "{}/eth/v1/beacon/light_client/updates?start_period={}&count={}",
        self.rpc, period, count
    );

    let res: Vec<UpdateData<S>> = self
        .get(&req)
        .await
        .map_err(|e| RpcError::new("updates", e))?;

    Ok(res.into_iter().map(|d| d.data).collect())
}

#[derive(Deserialize, Debug)]
#[serde(bound = "S: ConsensusSpec")]
struct UpdateData<S: ConsensusSpec> {
    data: Update<S>,
}
