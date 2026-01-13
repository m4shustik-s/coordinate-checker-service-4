package services;

import entity.User;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import java.util.Optional;

@Stateless
public class UserService {

    @PersistenceContext(unitName = "eternalPU")
    private EntityManager em;

    public Optional<User> authenticate(String login, String password) {
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE u.login = :login AND u.password = :password", User.class);
            query.setParameter("login", login);
            query.setParameter("password", password);
            return Optional.ofNullable(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    public User create(String login, String password, String fullName, String group, int variant) {
        if (loginExists(login)) {
            throw new IllegalArgumentException("Логин занят");
        }
        User user = new User(login, password, fullName, group, variant);
        em.persist(user);
        return user;
    }

    public Optional<User> findById(Long id) {
        User user = em.find(User.class, id);
        return Optional.ofNullable(user);
    }

    private boolean loginExists(String login) {
        TypedQuery<Long> query = em.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.login = :login", Long.class);
        query.setParameter("login", login);
        return query.getSingleResult() > 0;
    }
}
