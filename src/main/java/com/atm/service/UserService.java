package com.atm.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import com.atm.dto.LoginRequest;
import com.atm.entity.Card;
import com.atm.entity.Transaction;
import com.atm.entity.User;
import com.atm.repository.CardRepository;
import com.atm.repository.TransactionRepository;
import com.atm.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CardRepository cardRepository;

    // =========================
    // USER LOGIN
    // =========================

    public User login(LoginRequest request) {

        Optional<User> user =
                userRepository
                        .findByAccountNumberAndPin(
                                request.getAccountNumber(),
                                request.getPin()
                        );

        return user.orElse(null);
    }

    // =========================
    // CREATE USER
    // =========================

    public User createUser(User user) {

        return userRepository.save(user);
    }

    // =========================
    // GET ALL USERS
    // =========================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // =========================
    // GET USER BY ACCOUNT NUMBER
    // =========================

    public User getUserByAccountNumber(
            String accountNumber) {

        return userRepository
                .findByAccountNumber(
                        accountNumber
                )
                .orElse(null);
    }

    // =========================
    // TOGGLE USER STATUS
    // =========================

    public User toggleUserStatus(Long id) {

        User user =
                userRepository.findById(id)
                        .orElseThrow();

        if (user.getStatus()
                .equals("ACTIVE")) {

            user.setStatus("BLOCKED");

        } else {

            user.setStatus("ACTIVE");
        }

        return userRepository.save(user);
    }

    // =========================
    // DELETE USER
    // =========================

    public void deleteUser(Long id) {

        userRepository.deleteById(id);
    }

    // =========================
    // WITHDRAW MONEY
    // =========================

    public Map<String, Object> withdraw(
            String accountNumber,
            double amount) {

        User user =
                userRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow();

        // Validation
        if (amount <= 0) {

            throw new RuntimeException(
                    "Invalid Amount"
            );
        }

        if (user.getBalance() < amount) {

            throw new RuntimeException(
                    "Insufficient Balance"
            );
        }

        // Deduct Balance
        user.setBalance(
                user.getBalance() - amount
        );

        userRepository.save(user);

        // Generate Transaction ID
        String transactionId =
                "TXN" + System.currentTimeMillis();

        // Save Transaction
        Transaction transaction =
                new Transaction();

        transaction.setTransactionId(
                transactionId
        );

        transaction.setAccountNumber(
                accountNumber
        );

        transaction.setTransactionType(
                "WITHDRAW"
        );

        transaction.setStatus(
                "SUCCESS"
        );

        transaction.setAmount(
                amount
        );

        transaction.setTransactionDate(
                java.time.LocalDateTime.now()
        );

        transactionRepository.save(
                transaction
        );

        // Response
        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "balance",
                user.getBalance()
        );

        response.put(
                "transactionId",
                transactionId
        );

        return response;
    }

    // =========================
    // DEPOSIT MONEY
    // =========================

    public Map<String, Object> deposit(
            String accountNumber,
            double amount) {

        User user =
                userRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow();

        // Validation
        if (amount <= 0) {

            throw new RuntimeException(
                    "Invalid Amount"
            );
        }

        // Add Balance
        user.setBalance(
                user.getBalance() + amount
        );

        userRepository.save(user);

        // Generate Transaction ID
        String transactionId =
                "TXN" + System.currentTimeMillis();

        // Save Transaction
        Transaction transaction =
                new Transaction();

        transaction.setTransactionId(
                transactionId
        );

        transaction.setAccountNumber(
                accountNumber
        );

        transaction.setTransactionType(
                "DEPOSIT"
        );

        transaction.setStatus(
                "SUCCESS"
        );

        transaction.setAmount(
                amount
        );

        transaction.setTransactionDate(
                java.time.LocalDateTime.now()
        );

        transactionRepository.save(
                transaction
        );

        // Response
        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "balance",
                user.getBalance()
        );

        response.put(
                "transactionId",
                transactionId
        );

        return response;
    }

    // =========================
    // TRANSFER MONEY
    // =========================

    public Map<String, Object> transfer(
            String senderAccount,
            String receiverAccount,
            double amount) {

        // Sender
        User sender =
                userRepository
                        .findByAccountNumber(
                                senderAccount
                        )
                        .orElseThrow();

        // Receiver
        User receiver =
                userRepository
                        .findByAccountNumber(
                                receiverAccount
                        )
                        .orElseThrow();

        // Validation
        if (senderAccount.equals(
                receiverAccount)) {

            throw new RuntimeException(
                    "Cannot Transfer To Same Account"
            );
        }

        if (amount <= 0) {

            throw new RuntimeException(
                    "Invalid Amount"
            );
        }

        if (sender.getBalance() < amount) {

            throw new RuntimeException(
                    "Insufficient Balance"
            );
        }

        // Deduct Sender Balance
        sender.setBalance(
                sender.getBalance() - amount
        );

        // Add Receiver Balance
        receiver.setBalance(
                receiver.getBalance() + amount
        );

        userRepository.save(sender);

        userRepository.save(receiver);

        // Generate Transaction ID
        String transactionId =
                "TXN" + System.currentTimeMillis();

        // Save Transaction
        Transaction transaction =
                new Transaction();

        transaction.setTransactionId(
                transactionId
        );

        transaction.setAccountNumber(
                senderAccount
        );

       

        transaction.setReceiverAccount(
                receiverAccount
        );

        transaction.setTransactionType(
                "TRANSFER"
        );

        transaction.setStatus(
                "SUCCESS"
        );

        transaction.setAmount(
                amount
        );

        transaction.setTransactionDate(
                java.time.LocalDateTime.now()
        );

        transactionRepository.save(
                transaction
        );

        // Response
        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "balance",
                sender.getBalance()
        );

        response.put(
                "transactionId",
                transactionId
        );

        return response;
    }

    // =========================
    // GET CARD STATUS
    // =========================

    public Card getCardStatus(
            String accountNumber) {

        return cardRepository
                .findByAccountNumber(
                        accountNumber
                )
                .orElse(null);
    }

    // =========================
    // FREEZE CARD
    // =========================

    public void freezeCard(
            String accountNumber) {

        Card card =
                cardRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow();

        card.setCardStatus(
                "FROZEN"
        );

        cardRepository.save(card);
    }

    // =========================
    // ACTIVATE CARD
    // =========================

    public void activateCard(
            String accountNumber) {

        Card card =
                cardRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow();

        card.setCardStatus(
                "ACTIVE"
        );

        cardRepository.save(card);
    }

    // =========================
    // VERIFY CARD PIN
    // =========================

    public Card verifyCardPin(
            String accountNumber,
            String pin) {

        User user =
                userRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow();

        // Verify PIN
        if (!user.getPin()
                .equals(pin)) {

            throw new RuntimeException(
                    "Incorrect PIN"
            );
        }

        return cardRepository
                .findByAccountNumber(
                        accountNumber
                )
                .orElseThrow();
    }

    // =========================
    // CHANGE PIN
    // =========================

    public void changePin(
            String accountNumber,
            String currentPin,
            String newPin) {

        User user =
                userRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow();

        // Verify Current PIN
        if (!user.getPin()
                .equals(currentPin)) {

            throw new RuntimeException(
                    "Incorrect Current PIN"
            );
        }

        // Update PIN
        user.setPin(
                newPin
        );

        userRepository.save(user);
    }
   // =========================
// GET USER PROFILE
// =========================

public User getUserProfile(
        String accountNumber) {

    return userRepository
            .findByAccountNumber(
                    accountNumber
            )
            .orElseThrow(() ->
                    new RuntimeException(
                            "User Not Found"
                    )
            );
}

// =========================
// UPDATE PROFILE
// =========================

public User updateProfile(
        String accountNumber,
        String email,
        String mobileNumber) {

    User user =
            userRepository
                    .findByAccountNumber(
                            accountNumber
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User Not Found"
                            )
                    );

    // Email Validation
    if (!email.matches(
            "^[A-Za-z0-9+_.-]+@(.+)$")) {

        throw new RuntimeException(
                "Invalid Email Format"
        );
    }

    // Mobile Validation
    if (!mobileNumber.matches(
            "^[0-9]{10}$")) {

        throw new RuntimeException(
                "Invalid Mobile Number"
        );
    }

    user.setEmail(email);

    user.setMobileNumber(
            mobileNumber
    );

    return userRepository.save(user);
}
// =========================
// UPLOAD PROFILE PHOTO
// =========================

public String uploadProfilePhoto(

        String accountNumber,

        MultipartFile file) throws Exception {

    User user =
            userRepository
                    .findByAccountNumber(
                            accountNumber
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User Not Found"
                            )
                    );

    // Validate Image

    String fileName =
            file.getOriginalFilename();

    if (
            fileName == null ||

            !(fileName.endsWith(".jpg")
            || fileName.endsWith(".jpeg")
            || fileName.endsWith(".png"))
    ) {

        throw new RuntimeException(
                "Only JPG, JPEG, PNG Allowed"
        );
    }

    // Upload Folder

    String uploadDir =
            "uploads/";

    Files.createDirectories(
            Paths.get(uploadDir)
    );

    // Unique File Name

    String newFileName =
            System.currentTimeMillis()
                    + "_"
                    + fileName;

    Path path =
            Paths.get(
                    uploadDir
                            + newFileName
            );

    Files.copy(
            file.getInputStream(),
            path,
            StandardCopyOption.REPLACE_EXISTING
    );

    // Save Path

    String photoPath =
             newFileName;

    user.setProfilePhoto(
            photoPath
    );

    userRepository.save(user);

    return photoPath;
}

// =========================
// RECENT ACTIVITIES
// =========================

public List<Transaction>
getRecentActivities(
        String accountNumber) {

    return transactionRepository
            .findTop5ByAccountNumberOrderByTransactionDateDesc(
                    accountNumber
            );
}
}