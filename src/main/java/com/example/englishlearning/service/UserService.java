package com.example.englishlearning.service;

import com.example.englishlearning.model.Language;
import com.example.englishlearning.model.Role;
import com.example.englishlearning.model.User;
import com.example.englishlearning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(String email, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            if (existingUser.getPassword() == null) {
                String encodedPassword = passwordEncoder.encode(rawPassword);
                existingUser.setPassword(encodedPassword);

                if (existingUser.getLanguage() == null) {
                    existingUser.setLanguage(Language.ENGLISH);
                }
                userRepository.save(existingUser);
            } else {
                throw new IllegalStateException("Registration failed.");
            }
        } else {
            String encodedPassword = passwordEncoder.encode(rawPassword);
            User newUser = User.builder()
                    .email(email)
                    .password(encodedPassword)
                    .roles(Set.of(Role.USER))
                    .language(Language.ENGLISH)
                    .build();

            userRepository.save(newUser);
        }
    }

    public boolean passwordMatches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public List<Language> getAllLanguages() {
        return Arrays.asList(Language.values());
    }

    public Optional<User> updateUserLanguage(String email, Language newLanguage) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(user -> {
            user.setLanguage(newLanguage);
            userRepository.save(user);
        });
        return userOpt;
    }

}
