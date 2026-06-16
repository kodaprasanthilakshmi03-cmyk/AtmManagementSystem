package com.atm.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atm.entity.Admin;
import com.atm.entity.Card;
import com.atm.entity.User;
import com.atm.entity.Transaction;
import com.atm.repository.AdminRepository;
import com.atm.repository.CardRepository;
import com.atm.repository.UserRepository;
import com.atm.repository.TransactionRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private JavaMailSender mailSender;

// OTP STORAGE

private final Map<String, String> otpStorage =
        new HashMap<>();

private final Map<String, LocalDateTime> otpExpiry =
        new HashMap<>();


    // =========================
    // ADMIN LOGIN
    // =========================

    public Admin login(
            String username,
            String password) {

        Optional<Admin> admin =
                adminRepository
                        .findByUsernameAndPassword(
                                username,
                                password
                        );

        return admin.orElse(null);
    }

    // =========================
    // GET ALL CARDS
    // =========================

    public List<Card> getAllCards() {

        List<Card> cards =
                cardRepository.findAll();

        return cards.stream().map(card -> {

            String number =
                    card.getCardNumber();

            if (number != null &&
                    number.length() >= 16) {

                String masked =
                        "**** **** **** "
                                + number.substring(12);

                card.setCardNumber(masked);
            }

            return card;

        }).collect(Collectors.toList());
    }

    // =========================
    // ISSUE CARD
    // =========================

    public String issueCard(
            String accountNumber,
            String cardType) {

        // Check User Exists
        User user =
                userRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Account Not Found"
                                )
                        );

        // Check Existing Card
        if (cardRepository
                .existsByAccountNumber(
                        accountNumber
                )) {

            throw new RuntimeException(
                    "Card already issued for this account"
            );
        }

        // Create Card
        Card card =
                new Card();

        card.setAccountNumber(
                accountNumber
        );

        card.setCardType(
                cardType
        );

        card.setCardStatus(
                "ACTIVE"
        );

        // =========================
        // GENERATE CARD NUMBER
        // =========================

        Random random =
                new Random();

        StringBuilder cardNumber =
                new StringBuilder();

        for (int i = 0; i < 16; i++) {

            cardNumber.append(
                    random.nextInt(10)
            );
        }

        card.setCardNumber(
                cardNumber.toString()
        );

        // =========================
        // GENERATE CVV
        // =========================

        int cvv =
                100 + random.nextInt(900);

        card.setCvv(
                String.valueOf(cvv)
        );

        // =========================
        // EXPIRY DATE
        // =========================

        LocalDate expiryDate =
                LocalDate.now()
                        .plusYears(5);

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "MM/yy"
                );

        card.setExpiryDate(
                expiryDate.format(
                        formatter
                )
        );

        // =========================
        // ISSUE DATE
        // =========================

        card.setIssueDate(
                LocalDate.now()
        );


        // Save Card
        cardRepository.save(card);

        return "ATM Card Issued Successfully";
    }

    // =========================
    // BLOCK CARD
    // =========================

    public void blockCard(
            String accountNumber) {

        Card card =
                cardRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Card Not Found"
                                )
                        );

        card.setCardStatus(
                "BLOCKED"
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
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Card Not Found"
                                )
                        );

        card.setCardStatus(
                "ACTIVE"
        );

        cardRepository.save(card);
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
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Card Not Found"
                                )
                        );

        card.setCardStatus(
                "FROZEN"
        );

        cardRepository.save(card);
    }

    // =========================
    // ACCOUNTS WITHOUT CARDS
    // =========================

    public List<User> getAccountsWithoutCards() {

        List<User> users =
                userRepository.findAll();

        return users.stream()
                .filter(user ->
                        !cardRepository
                                .existsByAccountNumber(
                                        user.getAccountNumber()
                                )
                )
                .collect(Collectors.toList());
    }
    // =========================
// GET ALL TRANSACTIONS
// =========================

public List<Transaction> getAllTransactions() {

    return transactionRepository
            .findAllByOrderByTransactionDateDesc();
}

// =========================
// RECENT TRANSACTIONS
// =========================

public List<Transaction> getRecentTransactions() {

    return transactionRepository
            .findTop5ByOrderByTransactionDateDesc();
}

// =========================
// GET TRANSACTION DETAILS
// =========================

public Transaction getTransactionDetails(
        Long id) {

    return transactionRepository
            .findById(id)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Transaction Not Found"
                    )
            );
}

// =========================
// FILTER TRANSACTIONS
// =========================

public List<Transaction> filterTransactions(
        String search,
        String type,
        String status) {

    List<Transaction> transactions =
            transactionRepository.findAll();

    return transactions.stream()

            .filter(txn ->

                    (search == null ||
                            search.isEmpty() ||

                            txn.getAccountNumber()
                                    .contains(search))
            )

            .filter(txn ->

                    (type == null ||
                            type.isEmpty() ||

                            txn.getTransactionType()
                                    .equals(type))
            )

            .filter(txn ->

                    (status == null ||
                            status.isEmpty() ||

                            txn.getStatus()
                                    .equals(status))
            )

            .collect(Collectors.toList());
}
// =========================
// ANALYTICS SUMMARY
// =========================

public Map<String, Object> getAnalyticsSummary(
        String filter) {

    Map<String, Object> data =
            new HashMap<>();

    List<User> users =
            userRepository.findAll();

    List<Transaction> transactions =
            transactionRepository.findAll();

    double totalDeposits =
            transactions.stream()

                    .filter(t ->
                            t.getTransactionType()
                                    .equals("DEPOSIT")
                    )

                    .mapToDouble(
                            Transaction::getAmount
                    )

                    .sum();

    double totalWithdrawals =
            transactions.stream()

                    .filter(t ->
                            t.getTransactionType()
                                    .equals("WITHDRAW")
                    )

                    .mapToDouble(
                            Transaction::getAmount
                    )

                    .sum();

    double totalBalance =
            users.stream()

                    .mapToDouble(
                            User::getBalance
                    )

                    .sum();

    long activeAccounts =
            users.stream()

                    .filter(user ->
                            user.getStatus()
                                    .equals("ACTIVE")
                    )

                    .count();

    long blockedAccounts =
            users.stream()

                    .filter(user ->
                            user.getStatus()
                                    .equals("BLOCKED")
                    )

                    .count();

    data.put(
            "totalUsers",
            users.size()
    );

    data.put(
            "totalTransactions",
            transactions.size()
    );

    data.put(
            "totalDeposits",
            totalDeposits
    );

    data.put(
            "totalWithdrawals",
            totalWithdrawals
    );

    data.put(
            "totalBankBalance",
            totalBalance
    );

    data.put(
            "activeAccounts",
            activeAccounts
    );

    data.put(
            "blockedAccounts",
            blockedAccounts
    );

    data.put(
            "todayDeposits",
            totalDeposits
    );

    data.put(
            "todayWithdrawals",
            totalWithdrawals
    );

    data.put(
            "todayTransfers",
            transactions.stream()

                    .filter(t ->
                            t.getTransactionType()
                                    .equals("TRANSFER")
                    )

                    .mapToDouble(
                            Transaction::getAmount
                    )

                    .sum()
    );

    return data;
}

// =========================
// TRANSACTION STATS
// =========================

public Map<String, Object>
getTransactionStatistics() {

    Map<String, Object> data =
            new HashMap<>();

    List<Transaction> transactions =
            transactionRepository.findAll();

    long withdrawCount =
            transactions.stream()

                    .filter(t ->
                            t.getTransactionType()
                                    .equals("WITHDRAW")
                    )

                    .count();

    long depositCount =
            transactions.stream()

                    .filter(t ->
                            t.getTransactionType()
                                    .equals("DEPOSIT")
                    )

                    .count();

    long transferCount =
            transactions.stream()

                    .filter(t ->
                            t.getTransactionType()
                                    .equals("TRANSFER")
                    )

                    .count();

    data.put(
            "withdrawCount",
            withdrawCount
    );

    data.put(
            "depositCount",
            depositCount
    );

    data.put(
            "transferCount",
            transferCount
    );

    return data;
}

// =========================
// TOP USERS
// =========================

public List<User> getTopUsers() {

    return userRepository.findAll()

            .stream()

            .sorted(
                    (a, b) ->
                            Double.compare(
                                    b.getBalance(),
                                    a.getBalance()
                            )
            )

            .limit(5)

            .toList();
}

// =========================
// PDF REPORT
// =========================

public byte[] generatePdfReport()
        throws Exception {

    ByteArrayOutputStream out =
            new ByteArrayOutputStream();

    Document document =
            new Document();

    PdfWriter.getInstance(
            document,
            out
    );

    document.open();

    document.add(
            new Paragraph(
                    "ATM Management System"
            )
    );

    document.add(
            new Paragraph(
                    "Banking Analytics Report"
            )
    );

    document.add(
            new Paragraph(
                    "Generated Date: "
                            + LocalDate.now()
            )
    );

    document.add(
            new Paragraph(" ")
    );

    Map<String, Object> summary =
            getAnalyticsSummary(
                    "today"
            );

    document.add(
            new Paragraph(
                    "Total Users: "
                            + summary.get(
                            "totalUsers"
                    )
            )
    );

    document.add(
            new Paragraph(
                    "Total Transactions: "
                            + summary.get(
                            "totalTransactions"
                    )
            )
    );

    document.add(
            new Paragraph(
                    "Total Deposits: ₹ "
                            + summary.get(
                            "totalDeposits"
                    )
            )
    );

    document.add(
            new Paragraph(
                    "Total Withdrawals: ₹ "
                            + summary.get(
                            "totalWithdrawals"
                    )
            )
    );

    document.close();

    return out.toByteArray();
}
// ========================================
// VERIFY OTP
// ========================================

public Map<String, Object> verifyOtp(
        String email,
        String otp) {

    Map<String, Object> response =
            new HashMap<>();

    // Check OTP Exists

    if (!otpStorage.containsKey(email)) {

        response.put(
                "verified",
                false
        );

        response.put(
                "message",
                "OTP Not Found"
        );

        return response;
    }

    // Check Expiry

    if (LocalDateTime.now().isAfter(
            otpExpiry.get(email)
    )) {

        response.put(
                "verified",
                false
        );

        response.put(
                "message",
                "OTP Expired"
        );

        return response;
    }

    // Verify OTP

    if (otpStorage.get(email)
            .equals(otp)) {

        response.put(
                "verified",
                true
        );

        response.put(
                "message",
                "OTP Verified Successfully"
        );

        // Remove OTP After Verification

        otpStorage.remove(email);

        otpExpiry.remove(email);

    } else {

        response.put(
                "verified",
                false
        );

        response.put(
                "message",
                "Invalid OTP"
        );
    }

    return response;
}
// ========================================
// SEND OTP
// ========================================

public Map<String, Object> sendOtp(
        String email) {

    Map<String, Object> response =
            new HashMap<>();

    try {

        // Generate 6 Digit OTP

        String otp =
                String.valueOf(
                        100000 +
                        new Random().nextInt(900000)
                );

        // Store OTP

        otpStorage.put(
                email,
                otp
        );

        // OTP Expiry (2 Minutes)

        otpExpiry.put(
                email,
                LocalDateTime.now().plusMinutes(2)
        );

        // Send Email

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "ATM Management System OTP Verification"
        );

        message.setText(
                "Your OTP is: "
                + otp
                + "\nValid for 2 minutes."
        );

        mailSender.send(message);

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "OTP Sent Successfully"
        );

    } catch (Exception e) {

        e.printStackTrace();

        response.put(
                "success",
                false
        );

        response.put(
                "message",
                "Failed To Send OTP"
        );
    }

    return response;
}
}