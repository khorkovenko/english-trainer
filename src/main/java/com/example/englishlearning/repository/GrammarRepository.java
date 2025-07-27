package com.example.englishlearning.repository;

import com.example.englishlearning.model.Grammar;
import com.example.englishlearning.model.Language;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrammarRepository extends MongoRepository<Grammar, String> {
    List<Grammar> findAllByIdInAndLanguage(List<String> ids, Language language);
}
