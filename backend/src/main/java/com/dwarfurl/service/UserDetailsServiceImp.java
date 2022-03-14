package com.dwarfurl.service;

import com.dwarfurl.model.User;
import com.dwarfurl.model.UserDetailsImp;
import com.dwarfurl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImp implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImp(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetailsImp userDetails = new UserDetailsImp();

        Optional<User> user = userRepository.findByUsername(username);
        user.ifPresent(u -> userDetails.setUser(u));

        return userDetails;
    }
}
