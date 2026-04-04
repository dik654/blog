use rand::seq::SliceRandom;
use rand::thread_rng;

/// ORAM 프록시 — 더미 쿼리를 섞어 실제 쿼리를 은닉
pub struct ORAMProxy {
    k: usize,  // 더미 쿼리 수 (기본 7)
}

impl ORAMProxy {
    pub fn new() -> Self { Self { k: 7 } }

    /// 실제 쿼리 1개 + 더미 K개를 배치로 전송
    pub async fn batch_query(&self, real: Query) -> Result<Response> {
        let dummies = (0..self.k)
            .map(|_| Query::random())
            .collect::<Vec<_>>();
        let mut batch = vec![real.clone()];
        batch.extend(dummies);
        batch.shuffle(&mut thread_rng());  // 무작위 순서

        let responses = self.rpc.batch_send(&batch).await?;
        // 서버 시점: K+1개 중 진짜가 어떤 것인지 구별 불가
        // Pr(식별) = 1/(K+1) = 1/8
        let real_resp = responses.iter()
            .find(|r| r.id == real.id)
            .ok_or(anyhow!("response not found"))?;
        Ok(real_resp.clone())
    }
}
