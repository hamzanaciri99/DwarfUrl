package com.dwarfurl.controller;

import com.dwarfurl.dto.UserDto;
import com.dwarfurl.model.ShortUrl;
import com.dwarfurl.model.User;
import com.dwarfurl.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(path = "/user")
public class UserController {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @Autowired
    public UserController(ModelMapper modelMapper, UserRepository userRepository) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<UserDto> add(@RequestBody User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
        ;
        try {
            user = userRepository.save(user);
            userDto = modelMapper.map(user, UserDto.class);
            return new ResponseEntity<>(userDto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity(userDto, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("urls")
    public ResponseEntity<List<ShortUrl>> getShortUrls(@RequestBody User user) {
        Optional<User> userOptional = userRepository.findById(user.getId());
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userOptional.get().getShortUrls(), HttpStatus.OK);
    }
}
