package com.atm.dto;

public class IssueCardRequest {

    private String accountNumber;

    private String cardType;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(
            String accountNumber) {

        this.accountNumber =
                accountNumber;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(
            String cardType) {

        this.cardType =
                cardType;
    }
}