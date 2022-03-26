package com.dwarfurl.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserUpdateDto {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;

}
