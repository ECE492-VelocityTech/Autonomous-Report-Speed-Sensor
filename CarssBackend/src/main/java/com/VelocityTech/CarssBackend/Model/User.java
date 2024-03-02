package com.VelocityTech.CarssBackend.Model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;



@Entity
@Table
public class User {

    @Id
    @SequenceGenerator(
            name = "userSequence",
            sequenceName = "userSequence",
            allocationSize = 1
    )

    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "userSequence"
    )

    private Long id;

    @Email
    private String email;

    private String address;


    public User(){}

    public User(String email, String address) {
        this.email = email;
        this.address = address;
    }

    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getEmail() {return email;}

    public void setEmail(String email) {this.email = email;}

    public String getAddress() {return address;}

    public void setAddress(String address) {this.address = address;}

}