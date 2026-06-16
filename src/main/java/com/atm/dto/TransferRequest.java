package com.atm.dto;

public class TransferRequest {

    private String senderAccount;

    private String receiverAccount;

    private double amount;

    public String getSenderAccount() {
        return senderAccount;
    }

    public void setSenderAccount(
            String senderAccount) {

        this.senderAccount = senderAccount;
    }

    public String getReceiverAccount() {
        return receiverAccount;
    }

    public void setReceiverAccount(
            String receiverAccount) {

        this.receiverAccount =
                receiverAccount;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}