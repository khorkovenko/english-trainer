package com.example.englishlearning.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "word")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Word {

    private String word;
    private String explanation;
    private Rule rule;

}
