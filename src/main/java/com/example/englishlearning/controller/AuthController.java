package com.example.englishlearning.controller;

import com.example.englishlearning.service.UserDetailsService;
import com.example.englishlearning.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("pageTitle", "Log In to LingoPilot");

        return "login";
    }

    @GetMapping("/default")
    public String defaultRedirect() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ADMIN"));

        boolean isUser = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("USER"));

        if (isAdmin) {
            return "redirect:/admin";
        } else if (isUser) {
            return "redirect:/user";
        } else {
            return "redirect:/login?error=unauthorized";
        }
    }

    @GetMapping("/user")
    public String userPage(
            Model model,
            Authentication authentication
    ) {
        model.addAttribute("pageTitle", "User Dashboard - LingoPilot");
        model.addAttribute("email", authentication.getName());

        return "user";
    }

    @GetMapping("/admin")
    public String adminPage(
            Model model,
            Authentication authentication
    ) {
        model.addAttribute("pageTitle", "Admin Dashboard - LingoPilot");
        model.addAttribute("email", authentication.getName());

        return "admin";
    }

    @GetMapping("/signup")
    public String signUpForm(@RequestParam(required = false) String email, Model model) {
        model.addAttribute("email", email);
        model.addAttribute("pageTitle", "Sign Up for LingoPilot");

        return "signup";
    }

    @PostMapping("/signup")
    public String processSignUp(@RequestParam String email,
                                 @RequestParam String password,
                                 @RequestParam String confirmPassword,
                                 Model model) {
        if (!password.equals(confirmPassword)) {
            model.addAttribute("errorMessage", "Passwords do not match.");
            model.addAttribute("email", email);
            return "signup";
        }

        try {
            userService.registerUser(email, password);
            return "redirect:/login?signupSuccess";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", "An error occurred during registration.");
            model.addAttribute("email", email);
            return "signup";
        }
    }
}