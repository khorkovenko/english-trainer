package com.example.englishlearning.service;

import com.example.englishlearning.model.Mistakes;
import com.example.englishlearning.model.User;
import com.example.englishlearning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MistakesService {
    private final UserRepository userRepository;

    public Mistakes getMistakesByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getMistakes)
                .orElse(new Mistakes());
    }

    public Mistakes updateMistakesByEmail(String email, Mistakes mistakes) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        User user = optionalUser.get();
        user.setMistakes(mistakes);
        userRepository.save(user);
        return mistakes;
    }

    public void clearMistakesByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        optionalUser.ifPresent(user -> {
            user.setMistakes(new Mistakes());
            userRepository.save(user);
        });
    }
}
