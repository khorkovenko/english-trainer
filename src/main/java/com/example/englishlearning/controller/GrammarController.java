package com.example.englishlearning.controller;

import com.example.englishlearning.model.Grammar;
import com.example.englishlearning.service.GrammarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grammar")
@RequiredArgsConstructor
public class GrammarController {

    private final GrammarService grammarService;

    @GetMapping
    public ResponseEntity<List<Grammar>> getAllGrammarRules() {
        return ResponseEntity.ok(grammarService.getAllGrammarRules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grammar> getRule(@PathVariable String id) {
        return ResponseEntity.ok(grammarService.getGrammarById(id));
    }

    @PostMapping
    public ResponseEntity<Void> addGrammar(@RequestBody Grammar grammar) {
        grammarService.addGrammarRule(grammar);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrammar(@PathVariable String id) {
        grammarService.deleteGrammarById(id);
        return ResponseEntity.ok().build();
    }

    // Placeholder for GPT quiz generation (to be implemented)
    @PostMapping("/{id}/train")
    public ResponseEntity<String> generateTrainingQuiz(@PathVariable String id) {
        // In production: call OpenAI or local LLM here
        Grammar grammar = grammarService.getGrammarById(id);
        String quizPrompt = "Create a quiz with 10 questions for the grammar rule: \"" + grammar.getRuleName() +
                "\".\nExplanation:\n" + grammar.getRuleExplanation();

        // Stubbed response
        return ResponseEntity.ok("Mock quiz for rule: " + grammar.getRuleName());
    }
}
