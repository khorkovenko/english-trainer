package com.example.englishlearning.service;

import com.example.englishlearning.model.User;
import com.example.englishlearning.model.Vocabulary;
import com.example.englishlearning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Vocabulary> getAllWords() {
        User user = getCurrentUser();
        if (user.getVocabulary() == null) {
            return Collections.emptyList();
        }
        return user.getVocabulary().stream()
                .filter(vocab -> vocab.getLanguage() == user.getLanguage())
                .toList();
    }

    public Vocabulary getWordById(String wordId) {
        User user = getCurrentUser();
        return user.getVocabulary().stream()
                .filter(vocab -> vocab.getLanguage() == user.getLanguage())
                .filter(vocab -> vocab.getId().equals(wordId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Word not found"));
    }

    public void addWord(Vocabulary newWord) {
        User user = getCurrentUser();

        if (user.getVocabulary() == null) {
            user.setVocabulary(new ArrayList<>());
        }

        long countForLanguage = user.getVocabulary().stream()
                .filter(v -> v.getLanguage() == user.getLanguage())
                .count();

        if (countForLanguage >= 100) {
            throw new RuntimeException("Cannot add more than 100 words for current language");
        }

        if (newWord.getLanguage() != user.getLanguage()) {
            throw new RuntimeException("Vocabulary language does not match user language");
        }

        boolean exists = user.getVocabulary().stream()
                .anyMatch(v -> v.getLanguage() == user.getLanguage() &&
                                v.getWord().equalsIgnoreCase(newWord.getWord()));

        if (exists) {
            throw new RuntimeException("Word already exists in your vocabulary");
        }

        user.getVocabulary().add(newWord);
        userRepository.save(user);
    }

    public void removeWordById(String wordId) {
        User user = getCurrentUser();

        if (user.getVocabulary() != null) {
            user.getVocabulary().removeIf(vocab ->
                    vocab.getLanguage() == user.getLanguage() &&
                    vocab.getId().equals(wordId)
            );
            userRepository.save(user);
        }
    }

    public void removeAllWords() {
        User user = getCurrentUser();

        if (user.getVocabulary() != null) {
            user.getVocabulary().removeIf(vocab -> vocab.getLanguage() == user.getLanguage());
            userRepository.save(user);
        }
    }
}
