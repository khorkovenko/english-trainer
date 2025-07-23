package com.example.englishlearning.controller;

import com.example.englishlearning.model.Vocabulary;
import com.example.englishlearning.service.VocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vocabulary")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping
    public List<Vocabulary> getAllWords() {
        return vocabularyService.getAllWords();
    }

    @GetMapping("/{id}")
    public Vocabulary getWordById(@PathVariable String id) {
        return vocabularyService.getWordById(id);
    }

    @PostMapping
    public void addWord(@RequestBody Vocabulary newWord) {
        vocabularyService.addWord(newWord);
    }

    @DeleteMapping("/{id}")
    public void removeWordById(@PathVariable String id) {
        vocabularyService.removeWordById(id);
    }

    @DeleteMapping
    public void removeAllWords() {
        vocabularyService.removeAllWords();
    }
}
