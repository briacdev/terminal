---
title: Caching Strategy
description: "Speed up reads with Spring Cache: @Cacheable, TTL and eviction, and invalidation that stays correct after writes."
date: 2026-03-26
tags: [spring-boot, cache, performance]
draft: false
readingTime: 10 min
---

## Where this lesson sits

Reads are correct but may be expensive. Caching is an optional speed layer on top of a correct service. It is not a second database.

## What you will learn

- How `@Cacheable` / `@CacheEvict` work
- Why TTL and eviction must be explicit
- How writes invalidate the right keys

## Mental model

Spring Cache is an abstraction. Caffeine is a common in-process implementation. Redis is for multiple app instances. This lesson uses the abstraction. The Caffeine blog post is the implementation deep dive.

Cache **by sku**, not the whole catalog page, until you know the access pattern. After a stock change, evict that sku. Stale stock is a business bug, not a performance win.

If the method has side effects, do not cache it.

## Practical example

```java
package com.briac.catalog.product;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ProductQueryService {
    private final ProductRepository productRepository;

    public ProductQueryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Cacheable(cacheNames = "products", key = "#sku")
    public ProductView bySku(String sku) {
        return productRepository.findBySku(sku)
            .map(ProductMapper::toView)
            .orElseThrow();
    }

    @CacheEvict(cacheNames = "products", key = "#sku")
    public void onStockChanged(String sku) {
        // called from the write service after a successful update
    }
}
```

Enable caching with `@EnableCaching` and configure a TTL in your cache manager. Infinite caches grow until they lie.

## Go further on the blog

Caffeine setup, sizes, and expiry are in [How to implement caching in Spring Boot with Caffeine](/blog/how-to-implement-caching-in-spring-boot-with-caffeine).

## Common mistakes

- Caching methods that write data
- Forgetting eviction after updates
- Using one global cache name for unrelated types

## Next lesson

Next: [Async Processing](/spring-boot/async-processing).

## Official docs

- [Spring Cache abstraction](https://docs.spring.io/spring-framework/reference/integration/cache.html)
- [Caching with Spring Boot](https://docs.spring.io/spring-boot/reference/io/caching.html)

## Takeaway

- Cache reads, evict on writes
- Keys must match the lookup you actually do
- TTL is a correctness tool, not only a memory tool
