// Selected excerpt from SP1 v6.10.0 slop/crates/tensor/src/inner.rs.

pub struct Tensor<T, A: Backend = CpuBackend> {
    pub storage: Buffer<T, A>,
    pub dimensions: Dimensions,
}

impl<T, A: Backend> Tensor<T, A> {
    pub fn try_from_parts(
        storage: Buffer<T, A>,
        dimensions: Dimensions,
    ) -> Result<Self, DimensionsError> {
        let expected = dimensions.total_len();
        let actual = storage.len();
        if actual != expected {
            return Err(DimensionsError::NumElementsMismatch(expected, actual));
        }
        Ok(Self { storage, dimensions })
    }

    pub fn has_valid_shape(&self) -> bool {
        self.storage.len() == self.dimensions.total_len()
    }
}

#[test]
fn test_tensor_bincode_rejects_appended_storage() {
    let tensor = Tensor {
        storage: buffer![1, 2, 3, 4, 5],
        dimensions: Dimensions::try_from([2, 2]).unwrap(),
    };
    let serialized = bincode::serialize(&tensor).unwrap();
    assert!(bincode::deserialize::<Tensor<u32>>(&serialized).is_err());
}

#[test]
fn test_tensor_bincode_rejects_truncated_storage() {
    let tensor = Tensor {
        storage: buffer![1, 2, 3],
        dimensions: Dimensions::try_from([2, 2]).unwrap(),
    };
    let serialized = bincode::serialize(&tensor).unwrap();
    assert!(bincode::deserialize::<Tensor<u32>>(&serialized).is_err());
}
