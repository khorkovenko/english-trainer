package com.example.englishlearning.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rule")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grammar {

    @Id
    private String id;
    private Language language;
    private String ruleName;
    private String ruleExplanation;

}
