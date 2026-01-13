package services;

import entity.Result;
import util.AreaChecker;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;

@Stateless
public class PointService {

    @PersistenceContext(unitName = "eternalPU")
    private EntityManager entityManager;

    public Result checkAndSavePoint(double x, double y, double r, String sessionId) {
        if (!AreaChecker.validateInput(x, y, r)) {
            throw new IllegalArgumentException("Некорректные входные данные");
        }

        long startTime = System.nanoTime();
        boolean hit = AreaChecker.checkHit(x, y, r);
        long endTime = System.nanoTime();
        long executionTime = endTime - startTime;

        Result result = new Result(x, y, r, hit, executionTime, sessionId);
        entityManager.persist(result);

        return result;
    }

    public List<Result> getAllResults() {
        TypedQuery<Result> query = entityManager.createQuery(
                "SELECT r FROM Result r ORDER BY r.checkTime DESC",
                Result.class
        );
        return query.getResultList();
    }

    public List<Result> getResultsBySession(String sessionId) {
        TypedQuery<Result> query = entityManager.createQuery(
                "SELECT r FROM Result r WHERE r.sessionId = :sessionId ORDER BY r.checkTime DESC",
                Result.class
        );
        query.setParameter("sessionId", sessionId);
        return query.getResultList();
    }

    public void clearAllResults() {
        TypedQuery<Result> query = entityManager.createQuery(
                "SELECT r FROM Result r",
                Result.class
        );
        List<Result> results = query.getResultList();
        for (Result result : results) {
            entityManager.remove(result);
        }
    }

}