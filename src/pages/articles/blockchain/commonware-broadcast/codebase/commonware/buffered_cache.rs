// broadcast/src/buffered/engine.rs · v2026.9.0
/// Inserts a message into the cache.
///
/// Waiters are notified even when a sender is not eligible to keep a
/// buffered cache entry resident.
fn insert_message(&mut self, peer: P, digest: M::Digest, msg: M) -> InsertMessageResult {
    // 한국어 설명: 기존 subscriber는 cache eligibility 검사보다 먼저 응답받습니다.
    if let Some(waiters) = self.waiters.remove(&digest) {
        let msg = Arc::new(msg);
        self.respond_waiters(waiters, &msg);
        return self.insert_cache_entry(peer, digest, || Arc::clone(&msg));
    }

    self.insert_cache_entry(peer, digest, || Arc::new(msg))
}

fn insert_cache_entry(
    &mut self,
    peer: P,
    digest: M::Digest,
    make_shared: impl FnOnce() -> Arc<M>,
) -> InsertMessageResult {
    // 한국어 설명: latest.primary 밖의 sender는 resident cache entry를 만들 수 없습니다.
    if self.latest_primary_peers.position(&peer).is_none() {
        return InsertMessageResult::Ineligible;
    }

    let deque = self
        .deques
        .entry(peer)
        .or_insert_with(|| VecDeque::with_capacity(self.deque_size + 1));

    // 한국어 설명: 같은 peer의 duplicate는 앞쪽으로 옮기되 count를 늘리지 않습니다.
    if let Some(i) = deque.iter().position(|d| *d == digest) {
        if i != 0 {
            let v = deque.remove(i).unwrap(); // Must exist
            deque.push_front(v);
        }
        return InsertMessageResult::Duplicate;
    };

    // 한국어 설명: Peer reference는 늘리되 payload는 첫 reference에서만 저장합니다.
    deque.push_front(digest);
    let count = self
        .counts
        .entry(digest)
        .and_modify(|c| *c = c.checked_add(1).unwrap())
        .or_insert(1);
    if *count == 1 {
        let existing = self.items.insert(digest, make_shared());
        assert!(existing.is_none());
    }

    // 한국어 설명: Peer별 한도를 넘으면 가장 오래된 reference를 제거합니다.
    if deque.len() > self.deque_size {
        let stale = deque.pop_back().unwrap();
        decrement_digest_refcount(&mut self.counts, &mut self.items, &stale);
    }

    InsertMessageResult::Inserted
}
