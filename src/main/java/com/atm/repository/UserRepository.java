package com.atm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.atm.entity.User;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User>
    findByAccountNumber(String accountNumber);

    Optional<User>
    findByAccountNumberAndPin(
            String accountNumber,
            String pin
    );
     long countByStatus(String status);
}