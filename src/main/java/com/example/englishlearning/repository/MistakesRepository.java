package com.example.englishlearning.repository;

import com.example.englishlearning.model.Mistakes;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MistakesRepository extends MongoRepository<Mistakes, String> {
}
