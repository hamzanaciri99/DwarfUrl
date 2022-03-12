package com.dwarfurl.controller;

import com.dwarfurl.model.ShortUrl;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "url")
public class ShortUrlController {

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ShortUrl add(@RequestBody ShortUrl shortUrl) {
        System.out.println(shortUrl.getLongUrl());
        return shortUrl;
    }
}
