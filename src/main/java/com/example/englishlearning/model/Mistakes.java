package com.example.englishlearning.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mistakes {

    private Set<String> vocabulary;
    private Set<String> grammar;
    private Set<String> reading;
    private Set<String> writing;
    private Set<String> speaking;

}
