package com.example.englishlearning.service;

import com.example.englishlearning.model.User;
import com.example.englishlearning.model.Vocabulary;
import com.example.englishlearning.repository.UserRepository;
import com.example.englishlearning.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final UserRepository userRepository;
    private final VocabularyRepository vocabularyRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Vocabulary> getAllWords() {
        User user = getCurrentUser();
        List<String> vocabIds = user.getVocabulary();
        if (vocabIds == null || vocabIds.isEmpty()) {
            return Collections.emptyList();
        }
        return vocabularyRepository.findAllByIdInAndLanguage(vocabIds, user.getLanguage());
    }

    public Vocabulary getWordById(String wordId) {
        User user = getCurrentUser();
        if (user.getVocabulary() == null || !user.getVocabulary().contains(wordId)) {
            throw new RuntimeException("Word not found in user's vocabulary list");
        }
        return vocabularyRepository.findById(wordId)
                .filter(v -> v.getLanguage() == user.getLanguage())
                .orElseThrow(() -> new RuntimeException("Word not found"));
    }

    public void addWord(Vocabulary newWord) {
        User user = getCurrentUser();

        List<String> vocabIds = user.getVocabulary() != null ? user.getVocabulary() : new ArrayList<>();
        List<Vocabulary> userVocab = vocabularyRepository.findAllByIdInAndLanguage(vocabIds, user.getLanguage());

        if (userVocab.size() >= 100) {
            throw new RuntimeException("Cannot add more than 100 words for current language");
        }

        boolean exists = userVocab.stream()
                .anyMatch(v -> v.getWord().equalsIgnoreCase(newWord.getWord()));
        if (exists) {
            throw new RuntimeException("Word already exists in your vocabulary");
        }

        newWord.setLanguage(user.getLanguage());
        Vocabulary saved = vocabularyRepository.save(newWord);

        vocabIds.add(saved.getId());
        user.setVocabulary(vocabIds);
        userRepository.save(user);
    }

    public void removeWordById(String wordId) {
        User user = getCurrentUser();
        List<String> vocabIds = user.getVocabulary();
        if (vocabIds != null && vocabIds.remove(wordId)) {
            userRepository.save(user);
            vocabularyRepository.deleteById(wordId);
        }
    }

    public void removeAllWords() {
        User user = getCurrentUser();
        List<String> vocabIds = user.getVocabulary();
        if (vocabIds != null && !vocabIds.isEmpty()) {
            List<Vocabulary> toDelete = vocabularyRepository.findAllByIdInAndLanguage(vocabIds, user.getLanguage());
            List<String> idsToDelete = toDelete.stream().map(Vocabulary::getId).toList();
            vocabularyRepository.deleteAllById(idsToDelete);
            user.setVocabulary(new ArrayList<>());
            userRepository.save(user);
        }
    }
}
