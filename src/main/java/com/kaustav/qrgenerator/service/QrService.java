package com.kaustav.qrgenerator.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class QrService {

    public byte[] generateUpiQr(double amount, String upiId, String name, String note) throws Exception {

        String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8).replace("+", "%20");
        String encodedNote = URLEncoder.encode(note, StandardCharsets.UTF_8).replace("+", "%20");
        String formattedAmount = String.format("%.2f", amount);

        String upiUrl =
                "upi://pay?pa=" + upiId +
                "&pn=" + encodedName +
                "&am=" + formattedAmount +
                "&tn=" + encodedNote +
                "&cu=INR";

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(upiUrl, BarcodeFormat.QR_CODE, 400, 400);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);

        return out.toByteArray();
    }
}
