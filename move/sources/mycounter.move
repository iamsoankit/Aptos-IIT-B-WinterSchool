module counter_addr::mycounter {
    use std::signer;

    const E_NOT_INITIALIZED: u64 = 1;

    struct CountHolder has key {
        count: u64
    }

    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
    
        if (!exists<CountHolder>(addr)) {
            move_to(account, CountHolder { count: 0 });
        }
    }

    public entry fun increment(account: &signer) acquires CountHolder {
        let signer_address = signer::address_of(account);
        assert!(exists<CountHolder>(signer_address), E_NOT_INITIALIZED);
        let countvar = borrow_global_mut<CountHolder>(signer_address);
        let counter = countvar.count + 1;
        countvar.count = counter;
    }

    #[test(admin = @0x123)]
    public entry fun test_flow(admin: signer) acquires CountHolder {
        account::create_account_for_test(signer::address_of(&admin));
        initialize(&admin);
        increment(&admin);
      
    }
}