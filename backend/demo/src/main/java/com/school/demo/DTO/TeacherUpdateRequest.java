package com.school.demo.DTO;



public class TeacherUpdateRequest {
    private String name;
    private String address;
    private String phoneno;
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

    public void setphoneno(String phoneno) {
        this.phoneno = phoneno;
    }

    public String getphoneno() {
        return phoneno;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    //Setters for other fields.
}
