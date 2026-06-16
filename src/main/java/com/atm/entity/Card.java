package com.atm.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "cards")

public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String accountNumber;

    private String cardNumber;

    private String cardType;

    private String expiryDate;

    private String cardStatus;

    private LocalDate issueDate;

    private String cvv;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(
            String accountNumber) {

        this.accountNumber =
                accountNumber;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(
            String cardNumber) {

        this.cardNumber =
                cardNumber;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(
            String cardType) {

        this.cardType =
                cardType;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(
            String expiryDate) {

        this.expiryDate =
                expiryDate;
    }

    public String getCardStatus() {
        return cardStatus;
    }

    public void setCardStatus(
            String cardStatus) {

        this.cardStatus =
                cardStatus;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(
            LocalDate issueDate) {

        this.issueDate =
                issueDate;
    }
}