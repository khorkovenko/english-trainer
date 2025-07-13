package com.example.englishlearning.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "mistakes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mistakes {

    private List<Word> words;
    private List<Rule> rules;

}
