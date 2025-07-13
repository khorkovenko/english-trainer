package com.example.englishlearning.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "test")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Test {

    private Rule ruleName;
    private String example;

}
