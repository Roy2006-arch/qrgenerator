# Project Report: NexPay - Premium UPI QR Generator

## 1. Introduction
**NexPay** is a specialized web application designed to bridge the gap between static payment information and dynamic digital transactions. In the rapidly evolving Indian digital economy, UPI (Unified Payments Interface) has become the standard for payments. NexPay provides a premium, user-centric platform to generate customized, secure, and scanable UPI QR codes.

### 1.1 Problem Statement
While UPI apps allow peer-to-peer transfers, businesses and individuals often need to generate specific payment requests (with fixed amounts and notes) to avoid manual entry errors by the payer. Existing solutions are often cluttered with ads or have poor user experiences.

### 1.2 Solution
NexPay offers a "clean-room" implementation of a QR generator with a high-end UI/UX, focusing on speed, reliability, and visual appeal. It leverages the robust Spring Boot framework for the backend and modern CSS3/JavaScript for a fluid frontend experience.

---

## 2. Project Scope
The scope of this project includes:
- Development of a Java-based backend to generate QR codes following NPCI standards.
- A responsive web frontend with premium glassmorphism design.
- Local persistence of transaction history.
- Dynamic sharing and downloading capabilities.
- Support for all major UPI service providers (GPay, PhonePe, Paytm, Amazon Pay, BHIM).

---

## 3. System Requirements Specification (SRS)

### 3.1 User Requirements
- **Input Flexibility**: Users should be able to enter any valid UPI ID.
- **Precision**: Support for decimal amounts (paise).
- **Context**: Ability to add transaction notes (e.g., "Dinner bill").
- **Accessibility**: The UI must be responsive and work on mobile browsers.

### 3.2 Technical Requirements
- **Backend**: Spring Boot 3.2.x, Java 17+.
- **QR Engine**: ZXing (Zebra Crossing) Library.
- **Frontend**: HTML5, CSS3 (Advanced), Vanilla JavaScript.
- **Animations**: GSAP (GreenSock Animation Platform).
- **Icons**: Lucide-dev.

### 3.3 Hardware Requirements
- **Processor**: Intel Core i3 or equivalent (Minimum).
- **RAM**: 4 GB (Minimum).
- **Storage**: 100 MB for application files.
- **Network**: Active internet connection for loading external CDN libraries (GSAP, Lucide).

---

## 4. System Architecture

### 4.1 Block Diagram
1. **User Interface (View)**: HTML/CSS/JS layer where users input data.
2. **Controller (API)**: Spring Boot `@RestController` that receives HTTP requests.
3. **Service Layer**: Logic to construct UPI URIs and interface with ZXing.
4. **Data Layer**: Browser `localStorage` for client-side persistence.

### 4.2 UPI URI Protocol
The application generates URIs following the format:
`upi://pay?pa=<address>&pn=<name>&am=<amount>&cu=INR&tn=<note>`
- `pa`: Payee VPA (Virtual Payment Address).
- `pn`: Payee Name.
- `am`: Transaction Amount.
- `cu`: Currency Code (Defaulted to INR).
- `tn`: Transaction Note.

---

## 5. Detailed Module Description

### 5.1 Backend Modules (Spring Boot)
- **`QrController.java`**: 
    - **Endpoint Design**: Implements RESTful principles with appropriate MIME types (`IMAGE_PNG_VALUE`).
    - **CORS Configuration**: `@CrossOrigin(origins = "*")` allows integration with various frontend deployments.
    - **Debug Logic**: Provides a `debug-uri` endpoint for developers to verify the raw string before QR encoding.
- **`QrService.java`**:
    - **Parameter Handling**: Uses `URLEncoder` to ensure that Names and Notes containing special characters (like `&` or `#`) don't break the UPI URI structure.
    - **ZXing Integration**: Configures `QRCodeWriter` with specific dimensions (400x400) and exports to a `ByteArrayOutputStream` for efficient memory management.

### 5.2 Frontend Modules (Modern Web)
- **State Management**:
    - Uses a custom `history` array synced with `localStorage`.
    - Implements "Regenerate" functionality that re-populates form fields from historical data.
- **UI/UX Layer**:
    - **GSAP Tweens**: Manages complex sequencing of tab transitions and "3D flips" of the QR card.
    - **Lucide Icon Engine**: Dynamically renders SVGs for a lightweight but sharp iconography.
    - **Confetti Engine**: Provides high-quality feedback for the simulation module.
- **Network Layer**:
    - Uses the `fetch` API to retrieve images as Blobs, enabling client-side downloads without refreshing the page.

---

## 6. Technical Implementation Details

### 6.1 Code Organization
The project follows a clean Separation of Concerns (SoC):
- **Styles**: Defined entirely in `style.css` using CSS custom properties for easy theming.
- **Scripts**: Logic is centralized in `script.js`, utilizing an event-driven architecture.
- **Templates**: `index.html` uses semantic HTML5 tags (`<nav>`, `<main>`, `<section>`) for better SEO and accessibility.

### 6.2 Performance Optimizations
- **Image Handling**: QR codes are generated on-the-fly and served as byte arrays, avoiding the need for disk storage on the server.
- **Asset Loading**: External libraries (GSAP, Lucide, Confetti) are loaded via CDN to leverage browser caching.
- **Animation Performance**: GSAP uses CSS transforms (GPU accelerated) for smooth 60fps transitions even on lower-end devices.
- **Memory Management**: Uses `window.URL.revokeObjectURL` after downloads to prevent memory leaks in the browser.

---

## 7. Security and Standards
- **NPCI Compliance**: Follows the official UPI Linking Specifications (Version 1.6+).
- **Sanitization**: All user inputs are sanitized on the backend to prevent injection attacks during URI construction.
- **Zero-Storage Policy**: The server does not maintain a database of transactions, ensuring user privacy and reducing data liability.

---

## 7. Testing and Quality Assurance

### 7.1 Unit Testing
- Verified that the `debug-uri` endpoint returns correctly formatted strings for various inputs (with and without names/notes).
- Tested amount formatting to ensure exactly two decimal places.

### 7.2 Integration Testing
- Verified that the frontend successfully fetches images from the backend.
- Verified that the "Clear History" modal correctly triggers data deletion.

### 7.3 Manual scan Testing
- Generated QR codes were scanned using:
    - Google Pay (Android) - **Passed**
    - PhonePe (iOS) - **Passed**
    - Paytm (Android) - **Passed**

---

## 8. Future Enhancements
- **Multi-Currency Support**: Expand beyond INR for international payment standards.
- **User Accounts**: Cloud-based history sync across devices.
- **Analytics**: Track how many times a QR code was viewed/downloaded.
- **Custom Themes**: Allow users to change the color palette of the QR code.

---

## 9. Conclusion
NexPay demonstrates a successful integration of enterprise-grade backend stability with modern, interactive frontend design. It serves as a practical tool for the UPI ecosystem, providing users with a fast, secure, and beautiful way to handle digital payments.

---
**Author**: Kaustav Roy  
**Project**: NexPay (Mini Project)  
**Date**: April 2026
