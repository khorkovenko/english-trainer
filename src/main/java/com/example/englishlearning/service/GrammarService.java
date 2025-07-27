package com.example.englishlearning.service;

import com.example.englishlearning.model.Grammar;
import com.example.englishlearning.model.User;
import com.example.englishlearning.repository.GrammarRepository;
import com.example.englishlearning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GrammarService {

    private final UserRepository userRepository;
    private final GrammarRepository grammarRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Grammar> getAllGrammarRules() {
        User user = getCurrentUser();
        if (user.getGrammar() == null || user.getGrammar().isEmpty()) return List.of();
        return grammarRepository.findAllByIdInAndLanguage(user.getGrammar(), user.getLanguage());
    }

    public Grammar getGrammarById(String id) {
        User user = getCurrentUser();
        if (user.getGrammar() == null || !user.getGrammar().contains(id)) {
            throw new RuntimeException("Rule not found in user's grammar");
        }
        return grammarRepository.findById(id)
                .filter(r -> r.getLanguage() == user.getLanguage())
                .orElseThrow(() -> new RuntimeException("Rule not found"));
    }

    public void addGrammarRule(Grammar grammar) {
        User user = getCurrentUser();

        grammar.setLanguage(user.getLanguage());
        Grammar saved = grammarRepository.save(grammar);

        List<String> rules = user.getGrammar() != null ? user.getGrammar() : new ArrayList<>();
        rules.add(saved.getId());
        user.setGrammar(rules);
        userRepository.save(user);
    }

    public void deleteGrammarById(String id) {
        User user = getCurrentUser();
        if (user.getGrammar() != null && user.getGrammar().remove(id)) {
            userRepository.save(user);
            grammarRepository.deleteById(id);
        } else {
            throw new RuntimeException("Grammar rule not found or not owned by user");
        }
    }
}
