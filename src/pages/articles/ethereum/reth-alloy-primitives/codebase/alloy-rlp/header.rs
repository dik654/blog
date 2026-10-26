/// The header of an RLP item.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct Header {
    /// True if list, false otherwise.
    pub list: bool,
    /// Length of the payload in bytes.
    pub payload_length: usize,
}

impl Header {
    /// Decodes an RLP header from the given buffer.
    #[inline]
    pub fn decode(buf: &mut &[u8]) -> Result<Self> {
        let payload_length;
        let mut list = false;
        match get_next_byte(buf)? {
            0..=0x7F => payload_length = 1,

            b @ EMPTY_STRING_CODE..=0xB7 => {
                buf.advance(1);
                payload_length = (b - EMPTY_STRING_CODE) as usize;
                if payload_length == 1 && get_next_byte(buf)? < EMPTY_STRING_CODE {
                    return Err(Error::NonCanonicalSingleByte);
                }
            }

            b @ (0xB8..=0xBF | 0xF8..=0xFF) => {
                buf.advance(1);
                list = b >= 0xF8;
                let code = if list { 0xF7 } else { 0xB7 };
                let len_of_len = unsafe { b.checked_sub(code).unwrap_unchecked() } as usize;
                if buf.len() < len_of_len {
                    return Err(Error::InputTooShort);
                }
                let len = unsafe { buf.get_unchecked(..len_of_len) };
                buf.advance(len_of_len);
                let len = u64::from_be_bytes(static_left_pad(len)?);
                payload_length =
                    usize::try_from(len).map_err(|_| Error::Custom("Input too big"))?;
                if payload_length < 56 {
                    return Err(Error::NonCanonicalSize);
                }
            }

            b @ EMPTY_LIST_CODE..=0xF7 => {
                buf.advance(1);
                list = true;
                payload_length = (b - EMPTY_LIST_CODE) as usize;
            }
        }

        if buf.remaining() < payload_length {
            return Err(Error::InputTooShort);
        }

        Ok(Self { list, payload_length })
    }
}
