package com.atm.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String transactionId;

    private String accountNumber;

    private String transactionType;

    private double amount;

    private LocalDateTime transactionDate;

    private String receiverAccount;

    private String status;

    

    // Getters & Setters

    public Long getId() {
        return id;
    }
    public String getTransactionId() {
    return transactionId;
}

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(
            String accountNumber) {

        this.accountNumber = accountNumber;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(
            String transactionType) {

        this.transactionType =
                transactionType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(
            LocalDateTime transactionDate) {

        this.transactionDate =
                transactionDate;
    }
    public String getReceiverAccount() {
    return receiverAccount;
}

public void setReceiverAccount(
        String receiverAccount) {

    this.receiverAccount =
            receiverAccount;
}
public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}
public void setTransactionId(
        String transactionId) {

    this.transactionId =
            transactionId;
}
}