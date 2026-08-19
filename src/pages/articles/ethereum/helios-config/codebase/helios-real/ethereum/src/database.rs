// a16z/helios 저장소 · ethereum/src/database.rs (main branch, commit
// 43a8c9f, 2026년 8월 기준 이 글이 인용하는 SHA). 91줄 전체를 그대로
// 실었습니다(주석만 Korean 대응 추가).
// 본문 대응: persistence section의 FileDB — "32-byte root 하나를 저장",
// "정확히 32 bytes이면 사용하고, 그렇지 않으면 network default checkpoint로
// 돌아간다", "truncate한 뒤 바로 쓴다(fsync·atomic rename 없음)".

#[cfg(not(target_arch = "wasm32"))]
use std::{
    fs,
    io::{Read, Write},
    path::PathBuf,
};

use alloy::primitives::B256;
use eyre::Result;

use crate::config::Config;

pub trait Database: Clone + Sync + Send + 'static {
    fn new(config: &Config) -> Result<Self>
    where
        Self: Sized;

    fn save_checkpoint(&self, checkpoint: B256) -> Result<()>;
    fn load_checkpoint(&self) -> Result<B256>;
}

#[cfg(not(target_arch = "wasm32"))]
#[derive(Clone)]
pub struct FileDB {
    data_dir: PathBuf,
    default_checkpoint: B256,
}

#[cfg(not(target_arch = "wasm32"))]
impl Database for FileDB {
    fn new(config: &Config) -> Result<Self> {
        if let Some(data_dir) = &config.data_dir {
            return Ok(FileDB {
                data_dir: data_dir.to_path_buf(),
                default_checkpoint: config.default_checkpoint,
            });
        }

        eyre::bail!("data dir not in config")
    }

    // article의 "truncate한 뒤 바로 쓴다" — temp file·fsync·atomic
    // rename·directory sync가 전혀 없다. crash-safe atomicity를 구현
    // 사실로 주장할 수 없다는 article 주장의 실제 근거.
    fn save_checkpoint(&self, checkpoint: B256) -> Result<()> {
        fs::create_dir_all(&self.data_dir)?;

        let mut f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(self.data_dir.join("checkpoint"))?;

        f.write_all(checkpoint.as_slice())?;

        Ok(())
    }

    // article의 "정확히 32 bytes이면 사용하고, 그렇지 않거나 read가
    // 실패하면 network default checkpoint로 돌아간다"가 정확히 이
    // buf.len()==32 && res.is_ok() 조건이다.
    fn load_checkpoint(&self) -> Result<B256> {
        let mut buf = Vec::new();

        let res = fs::OpenOptions::new()
            .read(true)
            .open(self.data_dir.join("checkpoint"))
            .map(|mut f| f.read_to_end(&mut buf));

        if buf.len() == 32 && res.is_ok() {
            Ok(B256::from_slice(&buf))
        } else {
            Ok(self.default_checkpoint)
        }
    }
}

#[derive(Clone)]
pub struct ConfigDB {
    checkpoint: B256,
}

impl Database for ConfigDB {
    fn new(config: &Config) -> Result<Self> {
        Ok(Self { checkpoint: config.checkpoint.unwrap_or(config.default_checkpoint) })
    }

    fn load_checkpoint(&self) -> Result<B256> {
        Ok(self.checkpoint)
    }

    fn save_checkpoint(&self, _checkpoint: B256) -> Result<()> {
        Ok(())
    }
}
