void encoded_aurora_protocol<FieldT>::register_witness_oracles()
{
    /** We register all the oracles that the RS-encoded IOP should be sending in the first round,
     *  and virtual oracles that only depend on oracles sent thus far.
     *  In particular, this is f_w, f_Az, f_Bz, f_Cz, rowcheck, and oracles due to lincheck.
     */
    const std::size_t m = libff::round_to_next_power_of_2(this->constraint_system_->num_constraints());
    const std::size_t n = libff::round_to_next_power_of_2(this->constraint_system_->num_variables());
    const std::size_t k = this->constraint_system_->num_inputs();
    const std::size_t b = this->params_.query_bound();

    const std::size_t fw_degree = n - (k + 1) + b;
    this->fw_mask_degree_ = b;
    this->fw_handle_ = this->IOP_.register_oracle("fw", this->codeword_domain_handle_, fw_degree, this->params_.make_zk());

    const std::size_t fABCz_degree = (m + b);
    this->fAz_handle_ = this->IOP_.register_oracle("fAz", this->codeword_domain_handle_, fABCz_degree, this->params_.make_zk());
    this->fBz_handle_ = this->IOP_.register_oracle("fBz", this->codeword_domain_handle_, fABCz_degree, this->params_.make_zk());
    this->fCz_handle_ = this->IOP_.register_oracle("fCz", this->codeword_domain_handle_, fABCz_degree, this->params_.make_zk());

    this->fz_oracle_ = std::make_shared<fz_virtual_oracle<FieldT> >(
        k,
        this->input_variable_domain_,
        this->codeword_domain_);

    const std::size_t fz_degree = fw_degree + k + 1;
    this->fz_oracle_handle_ = this->IOP_.register_virtual_oracle(
        this->codeword_domain_handle_,
        fz_degree,
        { std::make_shared<oracle_handle>(this->fw_handle_) },
        this->fz_oracle_);
