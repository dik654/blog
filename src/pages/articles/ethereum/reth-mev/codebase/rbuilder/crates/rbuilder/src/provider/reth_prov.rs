// flashbots/rbuilder 저장소 · crates/rbuilder/src/provider/reth_prov.rs
// (commit 6037fa72, 2026년 8월 기준 이 글이 인용하는 SHA). 96줄 전체 중
// history_by_block_number 등 반복되는 위임 메서드 일부만 생략했습니다.
// 본문 대응: BuilderApi.tsx의 "rbuilder는 Reth의 crates와 provider를
// 재사용할 수 있는 별도 builder application" — rbuilder가 Reth node의
// 실행 코드를 공유하지 않고, Reth가 공개한 provider trait만 라이브러리로
// import해서 자기 자신의 StateProviderFactory를 구현한다는 근거.

use reth_errors::ProviderResult;
use reth_provider::{
    BlockNumReader, BlockReader, ChangeSetReader, DBProvider, DatabaseProviderFactory,
    HeaderProvider, PruneCheckpointReader, StageCheckpointReader, StateProviderBox,
    StorageChangeSetReader, StorageSettingsCache,
};

use super::{RootHasher, StateProviderFactory};

/// rbuilder 자신의 StateProviderFactory trait을 실제 reth provider 위에서
/// 구현하는 wrapper. Reth node core와 같은 실행 경로가 아니라, Reth가
/// crate로 공개한 read 전용 provider trait들만 가져다 쓴다.
#[derive(Clone)]
pub struct StateProviderFactoryFromRethProvider<P> {
    provider: P,
    root_hash_context: RootHashContext,
}

impl<P> StateProviderFactory for StateProviderFactoryFromRethProvider<P>
where
    // article의 "Reth provider를 재사용" — 이 where절 전체가 실제로
    // reth_provider crate의 trait들(DatabaseProviderFactory·BlockReader·
    // StateProviderFactory·HeaderProvider 등)로 구성된다. rbuilder는 이
    // trait 조합을 만족하는 어떤 provider든 받아 자기 것으로 감쌀 수 있다.
    P: DatabaseProviderFactory<
            Provider: BlockReader
                          + StageCheckpointReader
                          + PruneCheckpointReader
                          + ChangeSetReader
                          + StorageChangeSetReader
                          + DBProvider
                          + BlockNumReader
                          + StorageSettingsCache,
        > + reth_provider::StateProviderFactory
        + reth_provider::HashedPostStateProvider
        + HeaderProvider<Header = Header>
        + Clone
        + 'static,
{
    // article의 "reuse" — 각 메서드는 새 로직을 만들지 않고 실제
    // reth_provider 구현으로 그대로 위임(delegate)한다.
    fn latest(&self) -> ProviderResult<StateProviderBox> {
        self.provider.latest()
    }

    fn history_by_block_hash(&self, block: BlockHash) -> ProviderResult<StateProviderBox> {
        self.provider.history_by_block_hash(block)
    }

    fn header(&self, block_hash: &BlockHash) -> ProviderResult<Option<Header>> {
        self.provider.header(*block_hash)
    }

    fn best_block_number(&self) -> ProviderResult<BlockNumber> {
        self.provider.best_block_number()
    }

    // root_hasher만 rbuilder 자신의 로직(RootHasherImpl)을 추가한다 — 이
    // 지점이 "raw provider 재사용"과 "builder 자체 policy" 사이의 실제
    // 경계선이다. 나머지 read 메서드는 순수 위임이지만, state root 계산
    // 방식은 rbuilder가 자기 구현으로 감싼다.
    fn root_hasher(&self, parent_num_hash: BlockNumHash) -> ProviderResult<Box<dyn RootHasher>> {
        let parent_state_root = self
            .provider
            .header_by_hash_or_number(parent_num_hash.hash.into())?
            .map(|h| h.state_root);
        Ok(Box::new(RootHasherImpl::new(
            parent_num_hash,
            parent_state_root,
            self.root_hash_context.clone(),
            self.provider.clone(),
            self.provider.clone(),
        )))
    }
}
