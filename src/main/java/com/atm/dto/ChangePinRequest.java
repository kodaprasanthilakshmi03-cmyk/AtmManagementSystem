package com.atm.dto;

public class ChangePinRequest {

    private String accountNumber;

    private String currentPin;

    private String newPin;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(
            String accountNumber) {

        this.accountNumber =
                accountNumber;
    }

    public String getCurrentPin() {
        return currentPin;
    }

    public void setCurrentPin(
            String currentPin) {

        this.currentPin =
                currentPin;
    }

    public String getNewPin() {
        return newPin;
    }

    public void setNewPin(
            String newPin) {

        this.newPin = newPin;
    }
}