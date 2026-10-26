use crate::{FixedBytes, Signed, Uint};

macro_rules! int_aliases {
    ($($unsigned:ident, $signed:ident<$BITS:literal, $LIMBS:literal>),* $(,)?) => {$(
        pub type $unsigned = Uint<$BITS, $LIMBS>;
        pub type $signed = Signed<$BITS, $LIMBS>;
    )*};
}

int_aliases! {
    U256, I256<256, 4>,
}

macro_rules! fixed_bytes_aliases {
    ($($(#[$attr:meta])* $name:ident<$N:literal>),* $(,)?) => {$(
        $(#[$attr])*
        pub type $name = FixedBytes<$N>;
    )*};
}

fixed_bytes_aliases! {
    B256<32>,
}
