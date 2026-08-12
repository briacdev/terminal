---
title: Testing - JUnit 5 and Mockito
description: "Write reliable Java unit tests with JUnit 5 and Mockito: Arrange/Act/Assert, stubs, verify, and clean test design for backend services."
date: 2025-01-16
tags: [java, testing, junit5, mockito]
draft: false
readingTime: 18 min
---

## Why this step matters

Reliable software needs tests that are fast, deterministic, and meaningful.
Unit tests are your first safety net for refactoring and for documenting business rules.

A useful unit test protects behavior during change, shortens debugging time, and makes CI trustworthy.

## Unit test scope

A unit test validates one class behavior in isolation.
External dependencies (database, HTTP, filesystem, repositories) are replaced by test doubles.

Aim for:

- one clear behavior per test
- fast execution (milliseconds)
- no shared mutable state between tests

## JUnit 5 foundations

Useful annotations:

- `@Test`: test method
- `@BeforeEach` / `@AfterEach`: setup and cleanup
- `@DisplayName`: readable label
- `@Nested`: group related cases
- `@ParameterizedTest`: same logic with multiple inputs

Minimal example:

```java
class PriceServiceTest {

    private PriceService service;

    @BeforeEach
    void setUp() {
        service = new PriceService();
    }

    @Test
    @DisplayName("applyDiscount should reduce price for premium users")
    void should_apply_discount_for_premium_user() {
        int result = service.applyDiscount(100, true);
        assertEquals(80, result);
    }
}
```

Common assertions:

- `assertEquals`, `assertTrue`, `assertFalse`, `assertNotNull`
- `assertThrows` for expected failures

```java
assertThrows(IllegalArgumentException.class, () -> service.applyDiscount(-1, true));
```

## Mockito: mocks, stubs, verify

- **mock**: fake dependency
- **stub**: configured return behavior
- **verify**: interaction check
- **spy**: wrap a real object (use sparingly)

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserService userService;

    @Test
    void should_return_user_when_found() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User(1L, "briac")));

        UserDto dto = userService.findById(1L);

        assertEquals("briac", dto.username());
        verify(userRepository).findById(1L);
    }
}
```

BDD-style alternative:

```java
given(userRepository.findById(1L)).willReturn(Optional.of(new User(1L, "briac")));
```

## Test structure: Arrange / Act / Assert

1. prepare inputs and stubs
2. execute the target method
3. assert result and relevant interactions

Keep each section short so the intent stays obvious.

## Naming that helps

Prefer behavior-oriented names:

- `should_reject_blank_email`
- `should_apply_discount_for_premium_user`

Avoid vague names like `test1` or `works`.

## Common mistakes

- over-mocking everything, including value objects
- asserting implementation details instead of outcomes
- brittle tests tightly coupled to private internals
- shared mutable fixtures that cause order-dependent failures
- testing the mock framework instead of your code

## Practice checklist

- write one happy-path test and one failure-path test for a service method
- replace a repository with `@Mock` and stub a return value
- verify only the interactions that matter
- rename one vague test to a behavior sentence

## Takeaway

1. Keep unit tests fast, isolated, and behavior-focused
2. Use Mockito only for real external dependencies
3. Prefer clear Arrange/Act/Assert structure
4. Name tests by expected behavior, not by implementation
