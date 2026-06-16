package com.atm.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import org.springframework.web.multipart.MultipartFile;

import com.atm.dto.ChangePinRequest;
import com.atm.dto.CardPinVerificationRequest;
import com.atm.dto.DepositRequest;
import com.atm.dto.LoginRequest;
import com.atm.dto.TransferRequest;
import com.atm.dto.WithdrawRequest;
import com.atm.entity.Card;
import com.atm.entity.User;
import com.atm.repository.TransactionRepository;
import com.atm.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")

public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionRepository transactionRepository;

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")

    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        User user =
                userService.login(request);

        Map<String, Object> response =
                new HashMap<>();

        if (user == null) {

            response.put(
                    "message",
                    "Invalid Account Number or PIN"
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        response.put(
                "message",
                "Login Success"
        );

        response.put(
                "name",
                user.getName()
        );

        response.put(
                "accountNumber",
                user.getAccountNumber()
        );

        response.put(
                "balance",
                user.getBalance()
        );

        response.put(
                "profilePhoto",
                user.getProfilePhoto()
        );

        return ResponseEntity.ok(
                response
        );
    }

    // =========================
    // CARD STATUS
    // =========================

    @GetMapping("/card-status/{accountNumber}")

    public ResponseEntity<?> getCardStatus(
            @PathVariable
            String accountNumber) {

        Card card =
                userService.getCardStatus(
                        accountNumber
                );

        if (card == null) {

            return ResponseEntity.ok(
                    new HashMap<>()
            );
        }

        return ResponseEntity.ok(
                card
        );
    }

    // =========================
    // FREEZE CARD
    // =========================

    @PutMapping("/freeze-card/{accountNumber}")

    public ResponseEntity<?> freezeCard(
            @PathVariable
            String accountNumber) {

        userService.freezeCard(
                accountNumber
        );

        return ResponseEntity.ok(
                "Card Frozen"
        );
    }

    // =========================
    // ACTIVATE CARD
    // =========================

    @PutMapping("/activate-card/{accountNumber}")

    public ResponseEntity<?> activateCard(
            @PathVariable
            String accountNumber) {

        userService.activateCard(
                accountNumber
        );

        return ResponseEntity.ok(
                "Card Activated"
        );
    }

    // =========================
    // VERIFY CARD PIN
    // =========================

    @PostMapping("/verify-card-pin")

    public ResponseEntity<?> verifyCardPin(
            @RequestBody
            CardPinVerificationRequest request) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            Card card =
                    userService.verifyCardPin(
                            request.getAccountNumber(),
                            request.getPin()
                    );

            response.put(
                    "success",
                    true
            );

            response.put(
                    "cardNumber",
                    card.getCardNumber()
            );

            response.put(
                    "cvv",
                    card.getCvv()
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
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }

    // =========================
    // VALIDATE RECEIVER
    // =========================

    @GetMapping(
            "/validate-receiver/{accountNumber}"
    )

    public ResponseEntity<?> validateReceiver(
            @PathVariable
            String accountNumber) {

        User receiver =
                userService
                        .getUserByAccountNumber(
                                accountNumber
                        );

        if (receiver == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Receiver Not Found"
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "name",
                        receiver.getName()
                )
        );
    }

    // =========================
    // TRANSFER MONEY
    // =========================

    @PostMapping("/transfer")

    public ResponseEntity<?> transfer(
            @RequestBody
            TransferRequest request) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            Map<String, Object> result =
                    userService.transfer(
                            request.getSenderAccount(),
                            request.getReceiverAccount(),
                            request.getAmount()
                    );

            User receiver =
                    userService.getUserByAccountNumber(
                            request.getReceiverAccount()
                    );

            response.put(
                    "message",
                    "Transfer Successful"
            );

            response.put(
                    "remainingBalance",
                    result.get("balance")
            );

            response.put(
                    "transactionId",
                    result.get("transactionId")
            );

            response.put(
                    "receiverName",
                    receiver.getName()
            );

            return ResponseEntity.ok(
                    response
            );

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
    // MINI STATEMENT
    // =========================

    @GetMapping(
            "/mini-statement/{accountNumber}"
    )

    public ResponseEntity<?> miniStatement(
            @PathVariable
            String accountNumber) {

        return ResponseEntity.ok(
                transactionRepository
                        .findTop10ByAccountNumberOrderByTransactionDateDesc(
                                accountNumber
                        )
        );
    }

    // =========================
    // WITHDRAW MONEY
    // =========================

    @PostMapping("/withdraw")

    public ResponseEntity<?> withdraw(
            @RequestBody
            WithdrawRequest request) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            Map<String, Object> result =
                    userService.withdraw(
                            request.getAccountNumber(),
                            request.getAmount()
                    );

            response.put(
                    "message",
                    "Withdrawal Successful"
            );

            response.put(
                    "remainingBalance",
                    result.get("balance")
            );

            response.put(
                    "transactionId",
                    result.get("transactionId")
            );

            return ResponseEntity.ok(
                    response
            );

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
    // DEPOSIT MONEY
    // =========================

    @PostMapping("/deposit")

    public ResponseEntity<?> deposit(
            @RequestBody
            DepositRequest request) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            Map<String, Object> result =
                    userService.deposit(
                            request.getAccountNumber(),
                            request.getAmount()
                    );

            response.put(
                    "message",
                    "Deposit Successful"
            );

            response.put(
                    "updatedBalance",
                    result.get("balance")
            );

            response.put(
                    "transactionId",
                    result.get("transactionId")
            );

            return ResponseEntity.ok(
                    response
            );

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
    // CHANGE PIN
    // =========================

    @PutMapping("/change-pin")

    public ResponseEntity<?> changePin(
            @RequestBody
            ChangePinRequest request) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            userService.changePin(
                    request.getAccountNumber(),
                    request.getCurrentPin(),
                    request.getNewPin()
            );

            response.put(
                    "message",
                    "PIN Updated Successfully"
            );

            return ResponseEntity.ok(
                    response
            );

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
// GET USER PROFILE
// =========================

@GetMapping("/profile/{accountNumber}")

public ResponseEntity<?> getProfile(

        @PathVariable
        String accountNumber) {

    try {

        User user =
                userService
                        .getUserProfile(
                                accountNumber
                        );

        return ResponseEntity.ok(
                user
        );

    } catch (Exception e) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage()
                        )
                );
    }
}

// =========================
// UPDATE PROFILE
// =========================

@PutMapping("/update-profile")

public ResponseEntity<?> updateProfile(

        @RequestBody
        Map<String, String> request) {

    try {

        User user =
                userService.updateProfile(

                        request.get(
                                "accountNumber"
                        ),

                        request.get(
                                "email"
                        ),

                        request.get(
                                "mobileNumber"
                        )
                );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Profile Updated Successfully",
                        "user",
                        user
                )
        );

    } catch (Exception e) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage()
                        )
                );
    }
}

// =========================
// UPLOAD PROFILE PHOTO
// =========================

@PostMapping(
        value = "/upload-profile-photo",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)

public ResponseEntity<?> uploadProfilePhoto(

        @RequestParam("file")
        MultipartFile file,

        @RequestParam("accountNumber")
        String accountNumber) {

    Map<String, Object> response =
            new HashMap<>();

    try {

        String photoPath =
                userService.uploadProfilePhoto(
                        accountNumber,
                        file
                );

        response.put(
                "message",
                "Profile Photo Uploaded Successfully"
        );

        response.put(
                "photoPath",
                photoPath
        );

        return ResponseEntity.ok(
                response
        );

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
// RECENT ACTIVITIES
// =========================

@GetMapping(
        "/recent-activities/{accountNumber}"
)

public ResponseEntity<?> recentActivities(

        @PathVariable
        String accountNumber) {

    return ResponseEntity.ok(

            userService
                    .getRecentActivities(
                            accountNumber
                    )
    );
}
}