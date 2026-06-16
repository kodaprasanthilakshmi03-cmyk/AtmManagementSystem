package com.atm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.atm.entity.Transaction;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction>
    findTop10ByAccountNumberOrderByTransactionDateDesc(
            String accountNumber
    );
    List<Transaction>
    findTop5ByAccountNumberOrderByTransactionDateDesc(
        String accountNumber
   );

    List<Transaction>
    findTop5ByOrderByTransactionDateDesc();

    List<Transaction>
    findAllByOrderByTransactionDateDesc();
}