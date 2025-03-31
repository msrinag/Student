package com.school.demo.DTO;


public class StudentUpdateRequest {
    private String name;
    private String address;
    // Add other fields you want to update

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    //Setters for other fields.
}