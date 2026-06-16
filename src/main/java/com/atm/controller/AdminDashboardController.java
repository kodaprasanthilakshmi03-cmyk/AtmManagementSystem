package com.atm.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.atm.entity.Transaction;
import com.atm.repository.TransactionRepository;
import com.atm.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")

@CrossOrigin("*")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository
            transactionRepository;

    // Dashboard Stats
    @GetMapping("/dashboard-stats")

    public Map<String, Object>
    getDashboardStats() {

        Map<String, Object> response =
                new HashMap<>();

        long totalUsers =
                userRepository.count();

        long totalTransactions =
                transactionRepository.count();

        long activeAccounts =
                userRepository.countByStatus(
                        "ACTIVE"
                );

        double totalBalance =
                userRepository.findAll()
                        .stream()
                        .mapToDouble(
                                user ->
                                        user.getBalance()
                        )
                        .sum();

        response.put(
                "totalUsers",
                totalUsers
        );

        response.put(
                "totalTransactions",
                totalTransactions
        );

        response.put(
                "totalBalance",
                totalBalance
        );

        response.put(
                "activeAccounts",
                activeAccounts
        );

        return response;
    }

    // Recent Activities
    @GetMapping("/recent-activities")

    public List<Transaction>
    getRecentActivities() {

        return transactionRepository
                .findTop5ByOrderByTransactionDateDesc();
    }
}