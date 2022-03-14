package com.dwarfurl.repository;

import com.dwarfurl.model.ShortUrl;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ShortUrlRepository extends CrudRepository<ShortUrl, String> {

    Optional<ShortUrl> findShortUrlByLongUrl(String longUrl);
}
