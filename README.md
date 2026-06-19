# 🏦 ATM Management System

## 📌 Overview

ATM Management System is a full-stack banking application developed to simulate real-world ATM and banking operations. The system provides secure account management, transaction processing, card management, profile management, reporting, analytics, and administrative controls through separate User and Admin modules.

The project is designed with a modern banking-style interface using Glassmorphism UI, Dark/Light Theme support, responsive layouts, and secure backend APIs built with Spring Boot and MySQL.

---

## 🚀 Project Highlights

✅ User & Admin Modules

✅ Secure Banking Operations

✅ Email OTP Verification

✅ Profile Photo Upload

✅ Card Management System

✅ Security Center

✅ Reports & Analytics Dashboard

✅ Dark / Light Theme Support

✅ Glassmorphism Banking UI

✅ Fully Responsive Design

---

# ✨ Features

## 👤 User Module

### Authentication

* Secure User Login
* Session Management
* Logout Functionality

### Banking Operations

* Deposit Money
* Withdraw Money
* Transfer Funds
* Balance Inquiry
* Mini Statement

### Card Management

* View Card Details
* Card Status Monitoring
* Freeze Card
* Activate Card
* PIN Verification

### Profile Management

* View Profile Information
* Update Email Address
* Update Mobile Number
* Upload Profile Photo
* View Banking Information
* View Recent Activities

### Security Features

* Change ATM PIN
* Account Status Monitoring
* Failed Login Tracking
* Security Alerts

### Settings Module

* Theme Preferences
* Notification Settings
* Session Information
* Statement Preferences
* Security Controls

---

## 👨‍💼 Admin Module

### Dashboard

* Banking Overview
* User Statistics
* Transaction Statistics
* Activity Monitoring

### User Management

* Create ATM Accounts
* Update User Information
* View User Details
* Block/Unblock Accounts
* Delete Users

### Account Creation Security

* Email OTP Verification
* Profile Photo Upload
* Email Validation
* Mobile Number Validation

### Security Center

* Failed Login Monitoring
* Locked Account Monitoring
* Suspicious Transaction Detection
* Account Security Controls
* Unlock Accounts
* Reset Failed Attempts

### Transaction Monitoring

* Real-Time Transaction Tracking
* Transaction Search
* Transaction Filters
* Risk Monitoring

### Reports & Analytics

* User Reports
* Transaction Reports
* Banking Statistics
* Analytics Dashboard

---

# 🛠 Technologies Used

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Bootstrap 5
* Bootstrap Icons

## Backend

* Spring Boot
* Spring MVC
* Spring Data JPA
* JavaMailSender
* REST APIs

## Database

* MySQL

## Build Tool

* Maven

## Server

* Embedded Tomcat

---

# 📂 Project Structure

```text
atm-management-system
│
├── src/main/java
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
├── src/main/resources
│   ├── static
│   ├── application.properties
│   └── templates
│
├── uploads
│
├── database
│   └── atm_system.sql
│
└── pom.xml
```

---

# 📸 Screenshots

Add screenshots of:

* Login Page
* User Dashboard
* Admin Dashboard
* Manage Users
* Security Center
* Reports & Analytics
* Profile Page

---

# ⚙️ Spring Initializr Configuration

### Project

* Maven

### Language

* Java

### Spring Boot

* Latest Stable Version

### Group

```text
com.atm
```

### Artifact

```text
atm-management-system
```

### Name

```text
atm-management-system
```

### Packaging

```text
Jar
```

### Java Version

```text
17
```

---

# 📦 Required Dependencies

### Spring Boot Starter Web

```xml
spring-boot-starter-web
```

### Spring Boot Starter Data JPA

```xml
spring-boot-starter-data-jpa
```

### MySQL Driver

```xml
mysql-connector-j
```

### Spring Boot Starter Validation

```xml
spring-boot-starter-validation
```

### Spring Boot Starter Mail

```xml
spring-boot-starter-mail
```

### Lombok (Optional)

```xml
lombok
```

### Spring Boot DevTools

```xml
spring-boot-devtools
```

---

# 🗄 Database Setup

Create MySQL Database:

```sql
CREATE DATABASE atm_system;
```

Import:

```text
database/atm_system.sql
```

into MySQL Workbench.

---

# 🔧 Application Configuration

Update application.properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/atm_system
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

For Email OTP:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

# ▶️ Running the Project

## Clone Repository

```bash
git clone https://github.com/your-username/atm-management-system.git
```

## Navigate to Project

```bash
cd atm-management-system
```

## Build Project

```bash
mvn clean install
```

## Run Application

```bash
mvn spring-boot:run
```

or

```bash
mvn clean spring-boot:run
```

Application will start on:

```text
http://localhost:8080
```

---

# 🔒 Security Features

* Email OTP Verification
* Profile Photo Validation
* Account Status Management
* Failed Login Tracking
* Locked Account Detection
* Session Validation
* Role-Based Access
* Secure REST APIs
* Input Validation
* Exception Handling

---

# 🌐 API Features

### User APIs

* Login
* Deposit
* Withdraw
* Transfer
* Change PIN
* Card Status
* Profile Management

### Admin APIs

* Create User
* Manage Users
* Transaction Monitoring
* Security Center
* Reports & Analytics
* OTP Verification

---

# 🔮 Future Enhancements

* JWT Authentication
* Two-Factor Authentication (2FA)
* SMS OTP Integration
* PDF Statement Generation
* Loan Management Module
* Beneficiary Management
* Real-Time Notifications
* Audit Logging
* Advanced Fraud Detection

---

# 👨‍💻 Developed By

**Prasanthi Koda**

Full Stack Java Developer

Built using Spring Boot, MySQL, Bootstrap, HTML, CSS, and JavaScript.

---

# 📚 Developed For

Academic and learning purposes to demonstrate full-stack banking application development using Spring Boot, MySQL, Bootstrap, and JavaScript while following modern banking portal design principles and security practices.
