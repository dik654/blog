/// This represents a set of blobs, and its corresponding commitments and proofs.
///
/// For a well-formed sidecar, all three vectors have equal lengths and describe the same blob at
/// each index. Public fields and [`Self::new`] do not enforce this invariant. With the `kzg`
/// feature, prefer `try_from_blobs_with_settings` or call `validate` before use. Consuming
/// iteration uses `zip`, so malformed unequal vectors are truncated to the shortest vector.
///
/// Its [`Encodable`] and [`Decodable`] implementations include an outer RLP list header. The
/// field-level [`Encodable7594`] and [`Decodable7594`] codecs omit that header.
#[derive(Clone, Default, PartialEq, Eq, Hash)]
#[repr(C)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(feature = "borsh", derive(borsh::BorshSerialize, borsh::BorshDeserialize))]
#[doc(alias = "BlobTxSidecar")]
pub struct BlobTransactionSidecar {
    /// The blob data.
    #[cfg_attr(feature = "serde", serde(deserialize_with = "crate::eip4844::deserialize_blobs"))]
    pub blobs: Vec<Blob>,
    /// The blob commitments.
    pub commitments: Vec<Bytes48>,
    /// The blob proofs.
    pub proofs: Vec<Bytes48>,
}
