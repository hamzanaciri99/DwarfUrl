package com.dwarfurl.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "short_url")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ShortUrl {

    @Id
    private String shortUrl;
    @Column(unique = true)
    private String longUrl;

    private Long clicks;
}
