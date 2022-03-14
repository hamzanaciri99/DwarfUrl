package com.dwarfurl.service;

import com.dwarfurl.repository.ShortUrlRepository;
import com.dwarfurl.model.ShortUrl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Service
@Scope("singleton")
public class ShortUrlService {

    private static Character[] CHARS;

    private ShortUrlRepository shortUrlRepository;

    static {
        initializeCharacters();
    }

    @Autowired
    public ShortUrlService(ShortUrlRepository shortUrlRepository) {
        System.out.println("Constructor called");
        this.shortUrlRepository = shortUrlRepository;
    }

    private static void initializeCharacters() {
        CHARS = new Character[58];
        ArrayList<Character> charsList = new ArrayList<>();
        for (int i = 0; i < 26; ++i) {
            charsList.add((char) ('A' + i));
            charsList.add((char) ('a' + i));
            if (i < 10) {
                charsList.add((char) ('0' + i));
            }
        }
        charsList.removeIf(character -> character == 'I' || character == 'l' || character == '0' || character == 'O');
        Collections.shuffle(charsList);
        CHARS = charsList.toArray(CHARS);
    }

    private String generateHash() {
        char[] hash = new char[6];
        for (int i = 0; i < 6; ++i) {
            hash[i] = CHARS[(int) (Math.random() * CHARS.length)];
        }
        return new String(hash);
    }

    public String getHash() {
        String hash;
        while (true) {
            hash = generateHash();
            Optional<ShortUrl> shortUrl = shortUrlRepository.findById(hash);
            if (shortUrl.isEmpty()) break;
        }
        return hash;
    }
}
