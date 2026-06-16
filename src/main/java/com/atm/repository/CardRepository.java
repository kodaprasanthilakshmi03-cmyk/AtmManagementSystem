package com.atm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.atm.entity.Card;

public interface CardRepository
        extends JpaRepository<Card, Long> {

    Optional<Card> findByAccountNumber(
            String accountNumber
    );
    boolean existsByAccountNumber(
            String accountNumber
    );
}