package com.example.englishlearning.controller;

import com.example.englishlearning.model.Language;
import com.example.englishlearning.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/languages")
    public List<Language> getAllLanguages() {
        return userService.getAllLanguages();
    }

    @PutMapping("/{userId}/language")
    public boolean updateUserLanguage(
            @PathVariable String userId,
            @RequestParam Language language) {

        return userService.updateUserLanguage(userId, language).isPresent();
    }




}
