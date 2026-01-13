package entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "results")
public class Result implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x_value", nullable = false)
    private double x;

    @Column(name = "y_value", nullable = false)
    private double y;

    @Column(name = "radius", nullable = false)
    private double r;

    @Column(name = "hit", nullable = false)
    private boolean hit;

    @Column(name = "check_time", nullable = false)
    private LocalDateTime checkTime;

    @Column(name = "execution_time_ns", nullable = false)
    private long executionTime;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    public Result() {
        this.checkTime = LocalDateTime.now();
        this.executionTime = 0;
    }

    public Result(double x, double y, double r, boolean hit, long executionTime, String sessionId) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.checkTime = LocalDateTime.now();
        this.executionTime = executionTime;
        this.sessionId = sessionId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getR() { return r; }
    public void setR(double r) { this.r = r; }

    public boolean isHit() { return hit; }
    public void setHit(boolean hit) { this.hit = hit; }

    public LocalDateTime getCheckTime() { return checkTime; }
    public void setCheckTime(LocalDateTime checkTime) { this.checkTime = checkTime; }

    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getFormattedExecutionTime() {
        double ms = executionTime / 1_000_000.0;
        return String.format("%.3f мс", ms);
    }

    public String getFormattedCheckTime() {
        if (checkTime != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            return checkTime.format(formatter);
        }
        return "";
    }

    public String getHitText() {
        return hit ? "Попадание" : "Промах";
    }

    @Override
    public String toString() {
        return String.format("Result{id=%d, x=%.2f, y=%.2f, r=%.2f, hit=%s, time=%s}",
                id, x, y, r, hit, checkTime != null ? checkTime.toString() : "null");
    }
}