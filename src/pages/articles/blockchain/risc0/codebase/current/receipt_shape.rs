#[derive(Clone, Debug, Deserialize, Serialize, BorshSerialize, BorshDeserialize)]
#[cfg_attr(test, derive(PartialEq))]
pub struct Receipt {
    /// The polymorphic [InnerReceipt].
    pub inner: InnerReceipt,

    /// The public commitment written by the guest.
    ///
    /// This data is cryptographically authenticated in [Receipt::verify].
    pub journal: Journal,

    /// Metadata providing context on the receipt, about the proving system, SDK versions, and other
    /// information to help with interoperability. It is not cryptographically bound to the receipt,
    /// and should not be used for security-relevant decisions, such as choosing whether or not to
    /// accept a receipt based on its stated version.
    pub metadata: ReceiptMetadata,
}
