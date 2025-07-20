package com.example.englishlearning.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "progress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Progress {

    private Map<Grammar, Statistics> ruleKnowledge;
    private Map<Vocabulary, Statistics> wordKnowledge;

}
