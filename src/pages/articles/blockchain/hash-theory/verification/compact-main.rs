// Explicit test harness for the byte-preserved RustCrypto compact compression.
// This does not build the complete sha2 crate, Digest wrapper, or CPU dispatch.
// rustc --edition=2024 compact-main.rs -o /tmp/teach-hash-compact
// Minimal adapters below let the unchanged sha3 utils file compile. Only its
// pad/read_state helpers are exercised; the real cursor and Keccak permutation
// implementations are not linked or tested by this executable.
extern crate self as keccak;
extern crate self as sponge_cursor;
pub type State1600 = [u64; 25];
pub struct SpongeCursor<const RATE: usize> { position: usize }
impl<const RATE: usize> SpongeCursor<RATE> {
    pub fn pos(&self) -> usize { self.position }
    pub fn raw_pos(&self) -> u8 { self.position as u8 }
    pub fn new(position: u8) -> Option<Self> {
        ((position as usize) < RATE).then_some(Self { position: position as usize })
    }
}
#[allow(dead_code)]
mod sha3_utils {
    include!("../codebase/sha3-utils.rs");
}
#[allow(dead_code)]
mod consts {
    include!("../codebase/sha2-consts.rs");
}

mod source_parent {
    // Same converter as the pinned sha256/soft.rs; only the module wrapper is ours.
    fn to_u32s(block: &[u8; 64]) -> [u32; 16] {
        core::array::from_fn(|i| {
            let chunk = block[4 * i..][..4].try_into().unwrap();
            u32::from_be_bytes(chunk)
        })
    }

    pub mod compact {
        include!("../codebase/sha256-compact.rs");
    }
}

fn padded(message: &[u8]) -> Vec<[u8; 64]> {
    let mut bytes = message.to_vec();
    let bit_len = (message.len() as u64) * 8;
    bytes.push(0x80);
    while bytes.len() % 64 != 56 {
        bytes.push(0);
    }
    bytes.extend_from_slice(&bit_len.to_be_bytes());
    bytes.chunks_exact(64).map(|b| b.try_into().unwrap()).collect()
}

fn hex(state: &[u32; 8]) -> String {
    state.iter().map(|x| format!("{x:08x}")).collect()
}

fn main() {
    let mut messages = vec![Vec::new(), b"abc".to_vec()];
    for n in [55, 56, 63, 64, 65, 128] {
        messages.push(vec![b'a'; n]);
    }
    for (index, message) in messages.iter().enumerate() {
        let blocks = padded(message);
        let mut together = consts::H256_256;
        source_parent::compact::compress(&mut together, &blocks);
        let mut separately = consts::H256_256;
        for block in &blocks {
            source_parent::compact::compress(&mut separately, &[*block]);
        }
        assert_eq!(together, separately);
        if index == 1 {
            assert_eq!(hex(&together), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
        }
        println!("{{\"case\":{index},\"messageBytes\":{},\"paddedBlocks\":{},\"digest\":\"{}\",\"blockByBlockEqual\":true}}", message.len(), blocks.len(), hex(&together));
    }
    let mut state = [0u64; 25];
    state[0] = 0x636261; // The harness has already absorbed ASCII abc.
    sha3_utils::pad::<0x06, 136>(&mut state, &SpongeCursor { position: 3 });
    assert_eq!(state[0], 0x0000000006636261);
    assert_eq!(state[16], 0x8000000000000000);
    let mut bytes = [0u8; 136];
    sha3_utils::read_state(&state, &mut bytes);
    assert_eq!(&bytes[..4], &[0x61, 0x62, 0x63, 0x06]);
    assert_eq!(bytes[135], 0x80);
    let mut boundary = [0u64; 25];
    sha3_utils::pad::<0x06, 136>(&mut boundary, &SpongeCursor { position: 135 });
    assert_eq!(boundary[16] >> 56, 0x86);
    println!("{{\"kind\":\"sha3-padding-only\",\"firstLane\":\"{:016x}\",\"lastRateLane\":\"{:016x}\",\"lastByteAt135\":\"86\",\"keccakExecuted\":false}}", state[0], state[16]);
}
