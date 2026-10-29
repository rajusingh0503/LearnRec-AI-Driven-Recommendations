package com.learnrec.service;

import com.learnrec.dto.request.LoginRequest;
import com.learnrec.dto.request.RefreshTokenRequest;
import com.learnrec.dto.request.RegisterRequest;
import com.learnrec.dto.response.JwtResponse;
import com.learnrec.dto.response.UserProfileResponse;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    UserProfileResponse register(RegisterRequest request);
    JwtResponse refreshToken(RefreshTokenRequest request);
    UserProfileResponse getCurrentUser(String email);
}
