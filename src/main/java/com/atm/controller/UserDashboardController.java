package com.atm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.atm.entity.Transaction;
import com.atm.repository.TransactionRepository;

@RestController
@RequestMapping("/api/user")

@CrossOrigin("*")
public class UserDashboardController {

    @Autowired
    private TransactionRepository
            transactionRepository;

    // =========================
    // Recent Transactions
    // =========================

    @GetMapping(
            "/recent-transactions/{accountNumber}"
    )

    public List<Transaction>
    getRecentTransactions(
            @PathVariable String accountNumber) {

        return transactionRepository
                .findTop5ByAccountNumberOrderByTransactionDateDesc(
                        accountNumber
                );
    }
}