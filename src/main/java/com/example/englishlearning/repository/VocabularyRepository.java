package com.example.englishlearning.repository;

import com.example.englishlearning.model.Language;
import com.example.englishlearning.model.Vocabulary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyRepository extends MongoRepository<Vocabulary, String> {
    List<Vocabulary> findAllByIdInAndLanguage(List<String> ids, Language language);
}
