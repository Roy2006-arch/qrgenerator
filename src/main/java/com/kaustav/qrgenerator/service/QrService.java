package com.kaustav.qrgenerator.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class QrService {

    public byte[] generateUpiQr(double amount, String upiId, String name, String note) throws Exception {

        String cleanedUpiId = upiId != null ? upiId.trim() : "";
        
        StringBuilder upiUrlBuilder = new StringBuilder("upi://pay?pa=").append(cleanedUpiId);

        if (name != null && !name.trim().isEmpty()) {
            String encodedName = URLEncoder.encode(name.trim(), StandardCharsets.UTF_8).replace("+", "%20");
            upiUrlBuilder.append("&pn=").append(encodedName);
        }

        upiUrlBuilder.append("&cu=INR");

        if (amount > 0) {
            String formattedAmount = String.format("%.2f", amount);
            upiUrlBuilder.append("&am=").append(formattedAmount);
        }

        if (note != null && !note.trim().isEmpty()) {
            String encodedNote = URLEncoder.encode(note.trim(), StandardCharsets.UTF_8).replace("+", "%20");
            upiUrlBuilder.append("&tn=").append(encodedNote);
        }

        String upiUrl = upiUrlBuilder.toString();

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(upiUrl, BarcodeFormat.QR_CODE, 400, 400);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);

        return out.toByteArray();
    }
}
