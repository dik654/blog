// alloy-rlp — RLP 디코딩 상세

/// RLP 디코딩 에러 타입
pub enum Error {
    UnexpectedLength,   // 선언된 길이 ≠ 실제 데이터
    LeadingZero,        // 정수 앞의 불필요한 0x00
    Overflow,           // 대상 타입 크기 초과
    InputTooShort,      // 버퍼 부족
    Custom(&'static str),
}

/// Header 파싱: 첫 바이트로 타입/길이 판별
pub fn decode_header(buf: &mut &[u8]) -> Result<Header, Error> {
    if buf.is_empty() { return Err(Error::InputTooShort); }
    let byte = buf[0];
    *buf = &buf[1..];
    match byte {
        0..=0x7f => Ok(Header { list: false, payload_length: 1 }),
        0x80..=0xb7 => {
            let len = (byte - 0x80) as usize;
            if buf.len() < len { return Err(Error::InputTooShort); }
            Ok(Header { list: false, payload_length: len })
        }
        0xc0..=0xf7 => {
            let len = (byte - 0xc0) as usize;
            Ok(Header { list: true, payload_length: len })
        }
        _ => decode_long_header(buf, byte),
    }
}

/// decode_exact — 입력이 정확히 소진되지 않으면 에러
pub fn decode_exact<T: Decodable>(buf: &[u8]) -> Result<T, Error> {
    let mut remaining = buf;
    let result = T::decode(&mut remaining)?;
    if !remaining.is_empty() {
        return Err(Error::UnexpectedLength);
    }
    Ok(result)
}
