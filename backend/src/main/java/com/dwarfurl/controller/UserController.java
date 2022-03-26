package com.dwarfurl.controller;

import com.dwarfurl.dto.UserDto;
import com.dwarfurl.dto.UserUpdateDto;
import com.dwarfurl.model.ShortUrl;
import com.dwarfurl.model.User;
import com.dwarfurl.model.UserDetailsImp;
import com.dwarfurl.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(path = "/user")
public class UserController {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserController(ModelMapper modelMapper, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("{userId}/urls")
    public ResponseEntity<List<ShortUrl>> getShortUrls(@PathVariable("userId") Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(user.get().getShortUrls(), HttpStatus.OK);
    }

    @PostMapping("signup")
    public ResponseEntity<UserDto> signup(@RequestBody User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user = userRepository.save(user);
            userDto = modelMapper.map(user, UserDto.class);
            return new ResponseEntity<>(userDto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity(userDto, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("login")
    public ResponseEntity<UserDto> login(@RequestBody User user) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        Authentication auth = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(auth);
        user = ((UserDetailsImp) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser();
        UserDto userDto = modelMapper.map(user, UserDto.class);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PatchMapping("update")
    public ResponseEntity<UserDto> update(@RequestBody UserUpdateDto updatedUser) {
        User user = userRepository.findById(updatedUser.getId()).get();

        user.setUsername(updatedUser.getUsername());
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());

        if(updatedUser.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        userRepository.save(user);

        UserDto userDto = modelMapper.map(user, UserDto.class);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping("isLoggedIn")
    public ResponseEntity<Boolean> isLoggedIn() {
        boolean isLoggedIn = SecurityContextHolder.getContext().getAuthentication().isAuthenticated()
                && !(SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken) ;
        return new ResponseEntity<>(isLoggedIn, HttpStatus.OK);
    }
}
