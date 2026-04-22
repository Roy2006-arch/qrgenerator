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
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String note) throws Exception {
        return ResponseEntity.ok(qrService.generateUpiQr(amount, upiId, name, note));
    }

    @GetMapping(value = "/debug-uri", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> debugUri(
            @RequestParam double amount,
            @RequestParam String upiId,
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String note) throws Exception {
        
        String cleanedUpiId = upiId != null ? upiId.trim() : "";
        StringBuilder upiUrlBuilder = new StringBuilder("upi://pay?pa=").append(cleanedUpiId);
        if (name != null && !name.trim().isEmpty()) {
            String encodedName = java.net.URLEncoder.encode(name.trim(), java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
            upiUrlBuilder.append("&pn=").append(encodedName);
        }
        upiUrlBuilder.append("&cu=INR");
        if (amount > 0) {
            String formattedAmount = String.format("%.2f", amount);
            upiUrlBuilder.append("&am=").append(formattedAmount);
        }
        if (note != null && !note.trim().isEmpty()) {
            String encodedNote = java.net.URLEncoder.encode(note.trim(), java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
            upiUrlBuilder.append("&tn=").append(encodedNote);
        }
        
        return ResponseEntity.ok(upiUrlBuilder.toString());
    }
}