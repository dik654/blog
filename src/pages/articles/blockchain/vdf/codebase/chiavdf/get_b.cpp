integer GetB(const integer& D, form &x, form& y) {
    int d_bits = D.num_bits();
    std::vector<unsigned char> serialization = SerializeForm(x, d_bits);
    std::vector<unsigned char> serialization_y = SerializeForm(y, d_bits);
    serialization.insert(serialization.end(), serialization_y.begin(), serialization_y.end());
    return HashPrime(serialization, B_bits, {B_bits - 1});
}
