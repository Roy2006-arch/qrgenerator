package com.kaustav.qrgenerator.controller;

import com.kaustav.qrgenerator.service.QrService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class QrController {

    private final QrService qrService;

    public QrController(QrService qrService) {
        this.qrService = qrService;
    }

    @GetMapping(value = "/generate-qr", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQr(
            @RequestParam double amount,
            @RequestParam String upiId,
            @RequestParam(required = false, defaultValue = "User") String name,
            @RequestParam(required = false, defaultValue = "Payment") String note) throws Exception {
        return ResponseEntity.ok(qrService.generateUpiQr(amount, upiId, name, note));
    }
}