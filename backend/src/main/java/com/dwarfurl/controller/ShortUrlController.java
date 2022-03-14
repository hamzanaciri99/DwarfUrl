package com.dwarfurl.controller;

import com.dwarfurl.model.User;
import com.dwarfurl.repository.ShortUrlRepository;
import com.dwarfurl.repository.UserRepository;
import com.dwarfurl.service.ShortUrlService;
import com.dwarfurl.model.ShortUrl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping(path = "url")
public class ShortUrlController {

    private final ShortUrlService shortUrlService;
    private final ShortUrlRepository shortUrlRepository;
    private final UserRepository userRepository;

    @Autowired
    public ShortUrlController(ShortUrlService shortUrlService, ShortUrlRepository shortUrlRepository, UserRepository userRepository) {
        this.shortUrlService = shortUrlService;
        this.shortUrlRepository = shortUrlRepository;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "{userId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ShortUrl> add(@RequestBody ShortUrl shortUrl, @PathVariable("userId") Long userId) {

        Optional<ShortUrl> shortUrlOptional = shortUrlRepository.findShortUrlByLongUrl(shortUrl.getLongUrl());
        if (shortUrlOptional.isPresent()) {
            return new ResponseEntity<>(shortUrlOptional.get(), HttpStatus.OK);
        }

        String hash = shortUrlService.getHash();
        shortUrl.setHash(hash);
        shortUrl.setClicks(0L);
        final ShortUrl newShortUrl = shortUrlRepository.save(shortUrl);

        Optional<User> user = userRepository.findById(userId);
        user.ifPresent(u -> {
            u.getShortUrls().add(newShortUrl);
            userRepository.save(u);
        });

        return new ResponseEntity<>(newShortUrl, HttpStatus.CREATED);
    }

    @GetMapping("{hash}")
    public ResponseEntity<Void> redirect(@PathVariable("hash") String hash) {
        Optional<ShortUrl> shortUrlOptional = shortUrlRepository.findById(hash);

        if (shortUrlOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ShortUrl shortUrl = shortUrlOptional.get();
        shortUrl.addClick();
        shortUrlRepository.save(shortUrl);

        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(shortUrlOptional.get().getLongUrl())).build();
    }
}
