package com.example.englishlearning.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "statistics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Statistics {

        private int percent;
        private Date whenToRepeat;

}
