package com.school.demo.Services;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String username;
    private String password;
    private String Role;
    private String name;
    private String address;
    private String phone_no;
}
