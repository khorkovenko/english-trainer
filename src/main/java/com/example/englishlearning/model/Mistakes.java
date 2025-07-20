package com.example.englishlearning.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document(collection = "mistakes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mistakes {

    private Set<Vocabulary> vocabularies;
    private Set<Grammar> grammars;

}
