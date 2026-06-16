package com.atm.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.atm.entity.Admin;
import com.atm.entity.Card;
import com.atm.entity.User;
import com.atm.repository.UserRepository;
import com.atm.service.AdminService;
import com.atm.service.UserService;

@RestController
@RequestMapping("/api/admin")

@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // =========================
    // ADMIN LOGIN
    // =========================

    @PostMapping("/login")

    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String username =
                request.get("username");

        String password =
                request.get("password");

        Admin admin =
                adminService.login(
                        username,
                        password
                );

        Map<String, Object> response =
                new HashMap<>();

        // Invalid Login
        if (admin == null) {

            response.put(
                    "message",
                    "Invalid Credentials"
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        // Success
        response.put(
                "message",
                "Login Success"
        );

        response.put(
                "username",
                admin.getUsername()
        );

        return ResponseEntity.ok(response);
    }

    // =========================
    // CREATE NEW USER
    // =========================
// =========================
// CREATE NEW USER
// =========================

@PostMapping("/create-user")

public ResponseEntity<?> createUser(

        @RequestParam String name,
        @RequestParam String accountNumber,
        @RequestParam String pin,
        @RequestParam double balance,
        @RequestParam String status,
        @RequestParam String email,
        @RequestParam String mobileNumber,

        @RequestParam(required = false)
        MultipartFile profilePhoto
) {

    Map<String, Object> response =
            new HashMap<>();

    try {

        // Duplicate Check

        if (userRepository
                .findByAccountNumber(
                        accountNumber
                ).isPresent()) {

            response.put(
                    "message",
                    "Account Already Exists"
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }

        // Create User

        User user =
                new User();

        user.setName(name);

        user.setAccountNumber(
                accountNumber
        );

        user.setPin(pin);

        user.setBalance(balance);

        user.setStatus(status);

        user.setEmail(email);

        user.setMobileNumber(
                mobileNumber
        );

        user.setCreatedDate(
                LocalDateTime.now()
        );

        // =========================
        // PROFILE PHOTO
        // =========================

        if (profilePhoto != null
                &&
                !profilePhoto.isEmpty()) {

            String fileName =
                    System.currentTimeMillis()
                    + "_"
                    + profilePhoto.getOriginalFilename();

            java.io.File uploadDir =
                    new java.io.File(
                            "uploads"
                    );

            if (!uploadDir.exists()) {

                uploadDir.mkdirs();
            }

            java.nio.file.Path path =
                    java.nio.file.Paths.get(
                            "uploads",
                            fileName
                    );

            java.nio.file.Files.write(
                    path,
                    profilePhoto.getBytes()
            );

            user.setProfilePhoto(
                    fileName
            );
        }

        // SAVE USER

        userService.createUser(user);

        response.put(
                "message",
                "ATM Account Created Successfully"
        );

        response.put(
                "accountNumber",
                accountNumber
        );

        return ResponseEntity.ok(
                response
        );

    } catch (Exception e) {

        response.put(
                "message",
                "Failed To Create User"
        );

        return ResponseEntity
                .badRequest()
                .body(response);
    }
}

    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping("/users")

    public ResponseEntity<?> getUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    // =========================
    // BLOCK / UNBLOCK USER
    // =========================

    @PutMapping("/users/block/{id}")

    public ResponseEntity<?> blockUser(
            @PathVariable Long id) {

        User updatedUser =
                userService.toggleUserStatus(id);

        return ResponseEntity.ok(updatedUser);
    }

    // =========================
    // DELETE USER
    // =========================

    @DeleteMapping("/users/delete/{id}")

    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "User Deleted Successfully"
        );

        return ResponseEntity.ok(response);
    }

    // =========================
    // UPDATE USER
    // =========================

    @PutMapping("/users/{id}")

    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User user =
                userRepository.findById(id)
                        .orElseThrow();

        user.setName(
                updatedUser.getName()
        );

        user.setAccountNumber(
                updatedUser.getAccountNumber()
        );

        user.setBalance(
                updatedUser.getBalance()
        );

        user.setStatus(
                updatedUser.getStatus()
        );

        userRepository.save(user);

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "User Updated Successfully"
        );

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET ALL CARDS
    // =========================

    @GetMapping("/cards")

    public ResponseEntity<?> getAllCards() {

        List<Card> cards =
                adminService.getAllCards();

        return ResponseEntity.ok(cards);
    }

    // =========================
    // ISSUE ATM CARD
    // =========================

    @PostMapping("/issue-card")

    public ResponseEntity<?> issueCard(
            @RequestBody Map<String, String> request) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            String message =
                    adminService.issueCard(
                            request.get("accountNumber"),
                            request.get("cardType")
                    );

            response.put(
                    "message",
                    message
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }

    // =========================
    // BLOCK CARD
    // =========================

    @PutMapping("/block-card/{accountNumber}")

    public ResponseEntity<?> blockCard(
            @PathVariable
            String accountNumber) {

        adminService.blockCard(
                accountNumber
        );

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "Card Blocked Successfully"
        );

        return ResponseEntity.ok(response);
    }

    // =========================
    // ACTIVATE CARD
    // =========================

    @PutMapping("/activate-card/{accountNumber}")

    public ResponseEntity<?> activateCard(
            @PathVariable
            String accountNumber) {

        adminService.activateCard(
                accountNumber
        );

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "Card Activated Successfully"
        );

        return ResponseEntity.ok(response);
    }

    // =========================
    // FREEZE CARD
    // =========================

    @PutMapping("/freeze-card/{accountNumber}")

    public ResponseEntity<?> freezeCard(
            @PathVariable
            String accountNumber) {

        adminService.freezeCard(
                accountNumber
        );

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "Card Frozen Successfully"
        );

        return ResponseEntity.ok(response);
    }

    // =========================
    // ACCOUNTS WITHOUT CARDS
    // =========================

    @GetMapping("/accounts-without-cards")

    public ResponseEntity<?> accountsWithoutCards() {

        return ResponseEntity.ok(
                adminService.getAccountsWithoutCards()
        );
    }

    // =========================
    // ALL TRANSACTIONS
    // =========================

    @GetMapping("/transactions")

    public ResponseEntity<?> getAllTransactions() {

        return ResponseEntity.ok(
                adminService
                        .getAllTransactions()
        );
    }

    // =========================
    // RECENT TRANSACTIONS
    // =========================

    @GetMapping("/recent-transactions")

    public ResponseEntity<?> getRecentTransactions() {

        return ResponseEntity.ok(
                adminService
                        .getRecentTransactions()
        );
    }

    // =========================
    // FILTER TRANSACTIONS
    // =========================

    @GetMapping("/transactions/filter")

    public ResponseEntity<?> filterTransactions(

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            String type,

            @RequestParam(required = false)
            String status) {

        return ResponseEntity.ok(

                adminService.filterTransactions(
                        search,
                        type,
                        status
                )
        );
    }

    // =========================
    // TRANSACTION DETAILS
    // =========================

    @GetMapping("/transaction/{id}")

    public ResponseEntity<?> getTransactionDetails(

            @PathVariable Long id) {

        return ResponseEntity.ok(

                adminService
                        .getTransactionDetails(id)
        );
    }

    // =========================
    // ANALYTICS SUMMARY
    // =========================

    @GetMapping("/analytics-summary")

    public ResponseEntity<?> getAnalyticsSummary(
            @RequestParam(defaultValue = "today")
            String filter) {

        return ResponseEntity.ok(
                adminService.getAnalyticsSummary(
                        filter
                )
        );
    }

    // =========================
    // TRANSACTION STATS
    // =========================

    @GetMapping("/transaction-stats")

    public ResponseEntity<?> getTransactionStats() {

        return ResponseEntity.ok(
                adminService.getTransactionStatistics()
        );
    }

    // =========================
    // TOP USERS
    // =========================

    @GetMapping("/top-users")

    public ResponseEntity<?> getTopUsers() {

        return ResponseEntity.ok(
                adminService.getTopUsers()
        );
    }

    // =========================
    // DOWNLOAD REPORT
    // =========================

    @GetMapping("/download-report")

    public ResponseEntity<byte[]> downloadReport()
            throws Exception {

        byte[] pdf =
                adminService.generatePdfReport();

        return ResponseEntity.ok()

                .header(
                        "Content-Disposition",
                        "attachment; filename=analytics-report.pdf"
                )

                .header(
                        "Content-Type",
                        "application/pdf"
                )

                .body(pdf);
    }

// =========================
// SEND OTP
// =========================

@PostMapping("/send-otp")

public ResponseEntity<?> sendOtp(
        @RequestBody
        Map<String, String> request) {

    Map<String, Object> response =
            new HashMap<>();

    try {

        String email =
                request.get("email");

        adminService.sendOtp(
                email
        );

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "OTP Sent Successfully"
        );

        return ResponseEntity.ok(
                response
        );

    } catch (Exception e) {

        response.put(
                "success",
                false
        );

        response.put(
                "message",
                "Failed To Send OTP"
        );

        return ResponseEntity
                .badRequest()
                .body(response);
    }
}

// =========================
// VERIFY OTP
// =========================

@PostMapping("/verify-otp")

public ResponseEntity<?> verifyOtp(
        @RequestBody
        Map<String, String> request) {

    String email =
            request.get("email");

    String otp =
            request.get("otp");

    Map<String, Object> response =
            adminService.verifyOtp(
                    email,
                    otp
            );

    return ResponseEntity.ok(
            response
    );
}
    
}