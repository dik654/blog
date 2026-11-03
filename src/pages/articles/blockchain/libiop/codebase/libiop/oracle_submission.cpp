    /**  2) Calculate f_{Az}, f_{Bz}, f_{Cz} over the constraint domain
     *   i)   Construct z, and compute Az, Bz, Cz
     *   ii)  LDE extend A/B/Cz to f_{A/B/Cz}
     *   iii) Adds Z_{constraint domain} * R_{A/B/Cz} to each of the corresponding codewords
     *   iv)  FFT this into the codeword domain
    */
    libff::enter_block("Compute A/B/Cz");

    std::vector<FieldT> variable_assignment({ FieldT::one() });
    variable_assignment.insert(variable_assignment.end(),
                            primary_input.begin(), primary_input.end());
    variable_assignment.insert(variable_assignment.end(),
                            auxiliary_input.begin(), auxiliary_input.end());

    std::vector<FieldT> Az;
    std::vector<FieldT> Bz;
    std::vector<FieldT> Cz;
    Az.reserve(this->constraint_domain_.num_elements());
    Bz.reserve(this->constraint_domain_.num_elements());
    Cz.reserve(this->constraint_domain_.num_elements());
    this->constraint_system_->create_Az_Bz_Cz_from_variable_assignment(
        variable_assignment, Az, Bz, Cz);

    libff::leave_block("Compute A/B/Cz");

    libff::enter_block("Compute f_{A/B/Cz} over codeword domain");
    this->compute_fprime_ABCz_over_codeword_domain(Az, Bz, Cz);
    libff::leave_block("Compute f_{A/B/Cz} over codeword domain");

    /** 3) Submit all the oracles */
    libff::enter_block("Call IOP oracle submission routines");
    this->IOP_.submit_oracle(this->fw_handle_, std::move(this->fw_over_codeword_domain_));
    this->IOP_.submit_oracle(this->fAz_handle_, std::move(this->fprime_Az_over_codeword_domain_));
    this->IOP_.submit_oracle(this->fBz_handle_, std::move(this->fprime_Bz_over_codeword_domain_));
    this->IOP_.submit_oracle(this->fCz_handle_, std::move(this->fprime_Cz_over_codeword_domain_));
