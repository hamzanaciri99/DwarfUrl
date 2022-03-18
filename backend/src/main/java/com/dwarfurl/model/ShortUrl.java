package com.dwarfurl.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "short_url")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShortUrl {

    @Id
    private String hash;
    private String longUrl;
    private Long clicks;

    public void addClick() {
        this.clicks++;
    }

    @Override
    public String toString() {
        return "ShortUrl{" +
                "shortUrl='" + hash + '\'' +
                ", longUrl='" + longUrl + '\'' +
                ", clicks=" + clicks +
                '}';
    }
}
