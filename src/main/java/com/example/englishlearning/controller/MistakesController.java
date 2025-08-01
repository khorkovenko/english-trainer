package com.example.englishlearning.controller;

import com.example.englishlearning.model.Mistakes;
import com.example.englishlearning.service.MistakesService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mistakes")
@RequiredArgsConstructor
@CrossOrigin
public class MistakesController {

    private final MistakesService mistakesService;

    @GetMapping
    public Mistakes getUserMistakes(Authentication authentication) {
        String email = authentication.getName();
        return mistakesService.getMistakesByEmail(email);
    }

    @PostMapping
    public Mistakes updateUserMistakes(@RequestBody Mistakes mistakes, Authentication authentication) {
        String email = authentication.getName();
        return mistakesService.updateMistakesByEmail(email, mistakes);
    }

    @DeleteMapping
    public void deleteUserMistakes(Authentication authentication) {
        String email = authentication.getName();
        mistakesService.clearMistakesByEmail(email);
    }
}
