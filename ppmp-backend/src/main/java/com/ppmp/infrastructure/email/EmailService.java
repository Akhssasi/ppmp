package com.ppmp.infrastructure.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendSimpleMessage(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            }
            mailSender.send(message);
            log.debug("Email sent to {} with subject '{}'", to, subject);
        } catch (Exception ex) {
            log.warn("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }

    public void sendVerificationEmail(String to, String token, String frontendUrl) {
        String link = frontendUrl + "/verify-email?token=" + token;
        sendSimpleMessage(to, "Verify your PPMP account",
                "Welcome to Project Portfolio Management Platform!\n\n"
                + "Please verify your email by clicking the link below:\n" + link
                + "\n\nIf you did not create an account, you can ignore this email.");
    }

    public void sendPasswordResetEmail(String to, String token, String frontendUrl) {
        String link = frontendUrl + "/reset-password?token=" + token;
        sendSimpleMessage(to, "Reset your PPMP password",
                "We received a request to reset your password.\n\n"
                + "Click the link below to choose a new password (valid for 24 hours):\n" + link
                + "\n\nIf you did not request this, you can safely ignore this email.");
    }

    public void sendInvitationEmail(String to, String token, String projectTitle, String inviterName, String frontendUrl) {
        String link = frontendUrl + "/invitations/" + token;
        sendSimpleMessage(to, "You're invited to collaborate on a project",
                inviterName + " invited you to collaborate on the project \"" + projectTitle + "\".\n\n"
                + "Accept the invitation here:\n" + link
                + "\n\nIf you don't have an account yet, you can register then accept the invitation.");
    }

    public void sendDeadlineReminder(String to, String projectTitle, String taskTitle, String dueDate) {
        sendSimpleMessage(to, "Upcoming deadline reminder",
                "Reminder for project \"" + projectTitle + "\":\n"
                + "Task \"" + taskTitle + "\" is due on " + dueDate + ".\n\n"
                + "Log in to PPMP to stay on top of your work.");
    }
}
