package com.atm.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(unique = true)
    private String accountNumber;

    private String name;

    private String pin;

    private String profilePhoto;

    private double balance;

    private String status;
    // =========================
// PROFILE FIELDS
// =========================

private String email;

private String mobileNumber;

private java.time.LocalDateTime createdDate;


    // Default Constructor
    public User() {
    }

    // Parameterized Constructor
    public User(Long id,
                String accountNumber,
                String name,
                String pin,
                double balance,
                String status) {

        this.id = id;
        this.accountNumber = accountNumber;
        this.name = name;
        this.pin = pin;
        this.balance = balance;
        this.status = status;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(
            String accountNumber) {

        this.accountNumber = accountNumber;
    }

    public String getProfilePhoto() {
    return profilePhoto;
}

public void setProfilePhoto(String profilePhoto) {
    this.profilePhoto = profilePhoto;
}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    // =========================
// GETTERS & SETTERS
// =========================

public String getEmail() {
    return email;
}

public void setEmail(String email) {
    this.email = email;
}

public String getMobileNumber() {
    return mobileNumber;
}

public void setMobileNumber(String mobileNumber) {
    this.mobileNumber = mobileNumber;
}
public java.time.LocalDateTime getCreatedDate() {
    return createdDate;
}

public void setCreatedDate(
        java.time.LocalDateTime createdDate) {

    this.createdDate = createdDate;
}
    
}