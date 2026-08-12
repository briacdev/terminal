---
title: Tests - JUnit 5 et Mockito
description: "Écrire des tests unitaires Java robustes avec JUnit 5 et Mockito : Arrange/Act/Assert, stubs, verify et conception de tests lisibles."
date: 2025-01-16
tags: [java, testing, junit5, mockito]
draft: false
readingTime: 20 min
---

## Pourquoi cette étape est importante

Un test utile ne sert pas seulement a "faire vert" dans la CI.
Il sert a:

- proteger les comportements metier pendant les refactorings
- documenter les regles du systeme
- reduire le temps de debug quand une regression apparait

Un bon test unitaire est rapide, lisible, deterministe et cible une seule responsabilite.

## Test unitaire: ce que tu testes vraiment

Un test unitaire valide le comportement d'une unite (souvent une classe de service) en isolation.
Les dependances externes (DB, HTTP, filesystem, repository) sont remplacees par des doubles de test.

## JUnit 5: fondations utiles

Annotations de base:

- `@Test`: methode de test
- `@BeforeEach`: setup avant chaque test
- `@AfterEach`: nettoyage
- `@DisplayName`: nom lisible
- `@Nested`: regrouper des cas
- `@ParameterizedTest`: rejouer un meme test avec plusieurs entrees

Exemple minimal:

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

Assertions courantes:

- `assertEquals`, `assertNotNull`, `assertTrue`, `assertFalse`
- `assertThrows` pour verifier les exceptions

```java
assertThrows(IllegalArgumentException.class, () -> service.applyDiscount(-1, true));
```

## Mockito: vocabulaire essentiel

- **mock**: objet factice qui simule une dependance
- **stub**: comportement configure sur un mock
- **verify**: verification des interactions
- **spy**: enveloppe un objet reel (a utiliser avec prudence)

Exemple de setup:

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;
}
```

## AAA et Given/When/Then: meme idee, deux syntaxes

Tu peux structurer un test avec:

- **AAA**: Arrange / Act / Assert
- **BDD**: Given / When / Then

Les deux racontent la meme histoire:

- **Given / Arrange**: contexte + stubs
- **When / Act**: appel de la methode testee
- **Then / Assert**: resultat + interactions

## `when(...).thenReturn(...)` vs `given(...).willReturn(...)`

Ces deux formes font du stubbing Mockito.

Style classique:

```java
when(userRepository.findById(1L))
    .thenReturn(Optional.of(new User(1L, "briac")));
```

Style BDD (BDDMockito):

```java
given(userRepository.findById(1L))
    .willReturn(Optional.of(new User(1L, "briac")));
```

Difference principale:

- comportement identique
- style d'ecriture different
- `given/willReturn` s'aligne mieux avec la narration Given/When/Then

## Exemple complet en style Given/When/Then

```java
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void should_return_user_dto_when_user_exists() {
        // Given
        User user = new User(1L, "briac");
        given(userRepository.findById(1L)).willReturn(Optional.of(user));

        // When
        UserDto result = userService.findById(1L);

        // Then
        assertEquals("briac", result.username());
        then(userRepository).should().findById(1L);
        then(userRepository).shouldHaveNoMoreInteractions();
    }
}
```

## Le role de `verify` / `then(...).should(...)`

Verifier les interactions est utile quand le comportement attendu inclut un appel collaborateur.

Style classique:

```java
verify(userRepository).save(any(User.class));
verifyNoMoreInteractions(userRepository);
```

Style BDD:

```java
then(userRepository).should().save(any(User.class));
then(userRepository).shouldHaveNoMoreInteractions();
```

Regle pratique: verifie les interactions seulement quand elles portent une valeur metier. Ne verifie pas tout systematiquement.

## Matchers Mockito (`any`, `eq`, etc.)

Exemple:

```java
when(userRepository.findByEmail(anyString()))
    .thenReturn(Optional.empty());
```

Attention: si tu utilises un matcher sur un argument, utilise des matchers pour tous les arguments de cet appel.

```java
when(client.call(eq("/users"), anyMap())).thenReturn("ok");
```

## Tester les erreurs avec Mockito

Tu peux stubber une exception:

```java
given(userRepository.findById(99L))
    .willThrow(new RuntimeException("db unavailable"));
```

Puis verifier la reaction du service:

```java
assertThrows(ServiceUnavailableException.class, () -> userService.findById(99L));
```

## Cas ou Mockito n'est pas necessaire

N'utilise pas de mock pour les objets simples et purs (sans I/O), ex:

- utilitaires de calcul
- formatters
- mappers deterministes

Ces classes se testent mieux avec des objets reels.

## Erreurs frequentes (et comment les eviter)

- **Over-mocking**: mocking de classes sans dependances externes
- **Tests fragiles**: verification de details internes non metier
- **Stub inutile**: configurer des retours jamais utilises
- **Noms flous**: tests qui ne disent pas le comportement attendu
- **Given trop gros**: setup trop long qui cache l'intention

## Convention de nommage recommandee

Pattern simple:

`should_<expected_behavior>_when_<context>`

Exemples:

- `should_return_404_when_user_not_found`
- `should_apply_discount_when_customer_is_premium`

## Checklist qualite pour chaque test

1. Le test raconte une regle metier claire
2. Le setup Given est minimal
3. Une seule action dans When
4. Then verifie le resultat utile (et interactions seulement si necessaire)
5. Le test est deterministic (pas d'horloge reseau aleatoire)

## A retenir

1. JUnit 5 structure les tests, Mockito isole les dependances
2. `when/thenReturn` et `given/willReturn` sont equivalents, choisis un style coherent
3. `Given/When/Then` ameliore fortement la lisibilite
4. Verifie le comportement metier avant les details d'implementation
5. Un bon test est court, precis et explique une regle du systeme
