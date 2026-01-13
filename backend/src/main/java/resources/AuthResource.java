package resources;

import services.UserService;
import entity.User;
import jakarta.ejb.EJB;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Optional;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @EJB
    private UserService userService;

    @GET
    @Path("/me")
    public Response getMe(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = userService.findById(userId);
        return userOpt.map(user -> Response.ok(toDto(user)).build())
                .orElse(Response.status(Response.Status.UNAUTHORIZED).build());
    }

    @POST
    @Path("/login")
    public Response login(LoginDto dto, @Context HttpServletRequest request,
                          @Context HttpServletResponse response) {
        return userService.authenticate(dto.login, dto.password)
                .map(user -> {
                    request.getSession().setAttribute("userId", user.getId());

                    Cookie cookie = new Cookie("JSESSIONID", request.getSession().getId());
                    cookie.setHttpOnly(true);
                    cookie.setPath("/");
                    cookie.setMaxAge(24 * 60 * 60);
                    response.addCookie(cookie);

                    return Response.ok(toDto(user)).build();
                })
                .orElse(Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new ErrorDto("Неверный логин/пароль")).build());
    }

    @POST
    @Path("/register")
    public Response register(RegisterDto dto) {
        try {
            User user = userService.create(dto.login, dto.password,
                    dto.fullName, dto.group, dto.variant);
            return Response.status(Response.Status.CREATED).entity(toDto(user)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(new ErrorDto(e.getMessage())).build();
        }
    }

    @POST
    @Path("/logout")
    public Response logout(@Context HttpServletRequest request,
                           @Context HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Cookie cookie = new Cookie("JSESSIONID", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return Response.ok().build();
    }

    public static class LoginDto {
        public String login;
        public String password;
    }

    public static class RegisterDto {
        public String login, password, fullName, group;
        public int variant;
    }

    public static class UserDto {
        public long id;
        public String login, fullName, group;
        public int variant;

        public UserDto(User user) {
            this.id = user.getId();
            this.login = user.getLogin();
            this.fullName = user.getFullName();
            this.group = user.getGroup();
            this.variant = user.getVariant();
        }
    }

    public static class ErrorDto {
        public String message;
        public ErrorDto(String message) { this.message = message; }
    }

    private UserDto toDto(User user) {
        return new UserDto(user);
    }
}
