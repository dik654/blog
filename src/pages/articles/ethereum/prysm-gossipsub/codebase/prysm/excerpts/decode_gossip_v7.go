func (_ SszNetworkEncoder) DecodeGossip(b []byte, to ssz.Unmarshaler) error {
	if uint64(len(b)) > MaxCompressedLen(MaxPayloadSize) {
		return fmt.Errorf("gossip message exceeds maximum compressed limit: %d", MaxCompressedLen(MaxPayloadSize))
	}
	b, err := DecodeSnappy(b, MaxPayloadSize)
	if err != nil {
		return err
	}
	return doDecode(b, to)
}

// DecodeSnappy decodes a snappy compressed message.
func DecodeSnappy(msg []byte, maxSize uint64) ([]byte, error) {
	size, err := snappy.DecodedLen(msg)
	if err != nil {
		return nil, err
	}
	if uint64(size) > maxSize {
		return nil, errors.Errorf("snappy message exceeds max size: %d bytes > %d bytes", size, maxSize)
	}
	msg, err = snappy.Decode(nil /*dst*/, msg)
	if err != nil {
		return nil, err
	}
	return msg, nil
}

// MaxCompressedLen returns the maximum compressed size for a given payload size.
//
// Spec pseudocode definition:
// def max_compressed_len(n: uint64) -> uint64:
//
//	# Worst-case compressed length for a given payload of size n when using snappy:
//	# https://github.com/google/snappy/blob/32ded457c0b1fe78ceb8397632c416568d6714a0/snappy.cc#L218C1-L218C47
//	return uint64(32 + n + n / 6)
func MaxCompressedLen(n uint64) uint64 {
	return 32 + n + n/6
}
