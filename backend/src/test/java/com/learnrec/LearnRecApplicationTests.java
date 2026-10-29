package com.learnrec;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=none"
})
class LearnRecApplicationTests {

    @Test
    void contextLoads() {
        // Smoke test verifying test framework integration
    }
}
