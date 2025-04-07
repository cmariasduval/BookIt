package com.example.bookit.Entities;

import jakarta.persistence.*;

@Entity
public class Infraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "block_status", nullable = false)
    private Boolean blockStatus;

    @ManyToOne
    @JoinColumn(name = "user_ID", nullable = false)
    private User user;

    @Column(name = "count", nullable = false)
    private int count;

    public Infraction() {}
    public Infraction(User user, int count, Boolean blockStatus) {
        this.user = user;
        this.count = count;
        this.blockStatus = blockStatus;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Boolean getBlockStatus() {
        return blockStatus;
    }

    public void setBlockStatus(Boolean blockStatus) {
        this.blockStatus = blockStatus;
    }

    public User getUser() {
        return user;
    }

    public int getCount() {
        return count;
    }
}
