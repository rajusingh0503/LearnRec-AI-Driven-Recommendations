package com.learnrec.entity;

import com.learnrec.entity.converter.JsonListConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Convert(converter = JsonListConverter.class)
    @Column(name = "preferred_categories", columnDefinition = "json")
    @Builder.Default
    private List<String> preferredCategories = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "preferred_content_types", columnDefinition = "json")
    @Builder.Default
    private List<String> preferredContentTypes = new ArrayList<>();

    @Column(name = "preferred_difficulty", length = 50, nullable = false)
    @Builder.Default
    private String preferredDifficulty = "BEGINNER";

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
