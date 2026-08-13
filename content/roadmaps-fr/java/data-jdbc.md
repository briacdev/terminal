---
title: Données - JDBC
description: "Maîtriser JDBC pour le backend Java : DataSource, PreparedStatement, transactions, mapping ResultSet et fermeture sûre des ressources."
date: 2025-01-12
tags: [java, data, jdbc, sql]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

JDBC est la fondation bas niveau derrière beaucoup de bibliothèques data.
La comprendre aide à diagnostiquer connexions, SQL et frontières transactionnelles.

Même avec JPA au quotidien, JDBC clarifie les incidents production.

## Composants cœur

- `DataSource` : fabrique / entrée du pool de connexions
- `Connection` : session base de données
- `PreparedStatement` : SQL paramétré
- `ResultSet` : lignes de résultat

Préférez un `DataSource` poolé en application réelle.

## Exemple de requête

```java
String sql = "SELECT id, email FROM users WHERE id = ?";

try (Connection con = dataSource.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {

    ps.setLong(1, 42L);

    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            long id = rs.getLong("id");
            String email = rs.getString("email");
            System.out.println(id + " " + email);
        }
    }
}
```

Le try-with-resources ferme `Connection`, `PreparedStatement` et `ResultSet` de façon fiable.

## Pourquoi les prepared statements comptent

Les prepared statements :

- empêchent l’injection SQL en séparant requête et valeurs
- améliorent la réutilisation des plans d’exécution

Ne construisez jamais du SQL avec des valeurs utilisateur par concaténation.

```java
// Dangereux - à ne pas faire
String bad = "SELECT * FROM users WHERE email = '" + email + "'";
```

## Transactions JDBC

```java
try (Connection con = dataSource.getConnection()) {
    con.setAutoCommit(false);
    try {
        // plusieurs statements
        con.commit();
    } catch (Exception e) {
        con.rollback();
        throw e;
    }
}
```

Gardez les transactions courtes.
Ne retenez pas une connexion ouverte pendant un appel HTTP distant.

## Mapping des résultats

Mappez chaque ligne vers un objet métier ou un DTO.
Gardez le mapping explicite et testable.

```java
record UserRow(long id, String email) {}

UserRow map(ResultSet rs) throws SQLException {
    return new UserRow(rs.getLong("id"), rs.getString("email"));
}
```

## Updates et clés générées

```java
String insert = "INSERT INTO users(email) VALUES (?)";
try (Connection con = dataSource.getConnection();
     PreparedStatement ps = con.prepareStatement(insert, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "dev@briacd.com");
    ps.executeUpdate();
    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            long id = keys.getLong(1);
        }
    }
}
```

## Erreurs fréquentes

- ne pas fermer `Connection` / `Statement` / `ResultSet`
- concaténer du SQL dynamique non sûr
- transactions faibles ou rollback oublié
- avaler silencieusement `SQLException`
- fuite de connexions en cas d’exception

## Checklist pratique

- exécuter un select paramétré avec `PreparedStatement`
- encapsuler deux écritures dans commit/rollback
- mapper un `ResultSet` vers un record
- vérifier le retour des connexions au pool après erreur

## À retenir

1. JDBC donne un contrôle précis et une clarté de debug
2. Utiliser `PreparedStatement` par défaut
3. Gérer soigneusement transactions et fermeture des ressources
4. Garder le mapping de résultats explicite et maintenable
