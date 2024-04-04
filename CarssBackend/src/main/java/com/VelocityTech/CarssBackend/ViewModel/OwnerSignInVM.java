package com.VelocityTech.CarssBackend.ViewModel;

import com.VelocityTech.CarssBackend.Model.Owner;

public class OwnerSignInVM {
    private String email;
    private String address;

    public OwnerSignInVM(String email, String address) {
        this.email = email;
        this.address = address;
    }

    public Owner toOwner() {
        return new Owner(email, address);
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }
}
