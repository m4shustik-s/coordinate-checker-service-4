package entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String login;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "user_group", nullable = false)
    private String group;

    @Column(nullable = false)
    private Integer variant;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Конструкторы
    public User() {}

    public User(String login, String password, String fullName, String group, Integer variant) {
        this.login = login;
        this.password = password;
        this.fullName = fullName;
        this.group = group;
        this.variant = variant;
    }

    // Геттеры/сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getGroup() { return group; }
    public void setGroup(String group) { this.group = group; }
    public Integer getVariant() { return variant; }
    public void setVariant(Integer variant) { this.variant = variant; }
}
