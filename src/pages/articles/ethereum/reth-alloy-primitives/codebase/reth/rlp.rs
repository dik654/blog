// alloy-rlp — Encodable/Decodable trait + derive 매크로

/// RLP 인코딩 trait
pub trait Encodable {
    fn encode(&self, out: &mut dyn BufMut);
    fn length(&self) -> usize;
}

/// RLP 디코딩 trait
pub trait Decodable: Sized {
    fn decode(buf: &mut &[u8]) -> alloy_rlp::Result<Self>;
}

/// derive 매크로로 자동 구현
#[derive(RlpEncodable, RlpDecodable)]
pub struct TransactionSigned {
    pub nonce: u64,
    pub gas_price: u128,
    pub to: Option<Address>,
    pub value: U256,
    pub input: Bytes,
}

/// 고정 크기 타입 최적화 — 힙 할당 없이 스택에서 인코딩
pub fn encode_fixed_size<T: Encodable>(t: &T) -> ArrayVec<u8, MAX_LEN> {
    let mut buf = ArrayVec::new();
    t.encode(&mut buf);
    buf
}

/// RLP Header 디코딩 — 리스트/문자열 구분
pub fn decode_header(buf: &mut &[u8]) -> Result<Header> {
    let byte = buf[0];
    match byte {
        0..=0x7f => Ok(Header { list: false, payload_length: 1 }),
        0x80..=0xb7 => Ok(Header { list: false, payload_length: (byte - 0x80) as usize }),
        0xc0..=0xf7 => Ok(Header { list: true, payload_length: (byte - 0xc0) as usize }),
        _ => decode_long_header(buf, byte),
    }
}
