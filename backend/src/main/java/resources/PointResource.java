package resources;

import services.PointService;
import entity.Result;

import jakarta.ejb.EJB;
import jakarta.json.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.StringReader;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointResource {

    @EJB
    private PointService pointService;

    @POST
    @Path("/check")
    public Response checkPoint(String requestBody) {
        try {
            JsonReader jsonReader = Json.createReader(new StringReader(requestBody));
            JsonObject json = jsonReader.readObject();
            jsonReader.close();

            Double x = getDoubleValue(json.get("x"));
            Double y = getDoubleValue(json.get("y"));
            Double r = getDoubleValue(json.get("r"));

            if (x == null || y == null || r == null) {
                return Response.status(400)
                        .entity("{\"error\": \"Необходимо указать x, y и r\"}")
                        .build();
            }

            String sessionId = "common-session";
            Result result = pointService.checkAndSavePoint(x, y, r, sessionId);

            JsonObject response = Json.createObjectBuilder()
                    .add("id", result.getId())
                    .add("x", result.getX())
                    .add("y", result.getY())
                    .add("r", result.getR())
                    .add("hit", result.isHit())
                    .add("time", result.getCheckTime().toString())
                    .add("executionTime", result.getExecutionTime())
                    .add("formattedTime", result.getFormattedCheckTime())
                    .add("formattedExecutionTime", result.getFormattedExecutionTime())
                    .add("hitText", result.getHitText())
                    .build();

            return Response.ok(response.toString()).build();

        } catch (IllegalArgumentException e) {
            return Response.status(400)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(500)
                    .entity("{\"error\": \"Внутренняя ошибка сервера\"}")
                    .build();
        }
    }

    @GET
    @Path("/")
    public Response getPoints() {
        try {
            java.util.List<Result> results = pointService.getAllResults();

            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
            for (Result result : results) {
                JsonObject item = Json.createObjectBuilder()
                        .add("id", result.getId())
                        .add("x", result.getX())
                        .add("y", result.getY())
                        .add("r", result.getR())
                        .add("hit", result.isHit())
                        .add("checkTime", result.getCheckTime().toString())
                        .add("executionTime", result.getExecutionTime())
                        .add("time", result.getCheckTime().toString())
                        .build();
                arrayBuilder.add(item);
            }

            JsonArray response = arrayBuilder.build();
            return Response.ok(response.toString()).build();

        } catch (Exception e) {
            return Response.status(500)
                    .entity("{\"error\": \"Внутренняя ошибка сервера\"}")
                    .build();
        }
    }

    @DELETE
    @Path("/")
    public Response clearPoints() {
        try {
            pointService.clearAllResults();

            JsonObject response = Json.createObjectBuilder()
                    .add("message", "Все результаты очищены")
                    .build();

            return Response.ok(response.toString()).build();

        } catch (Exception e) {
            return Response.status(500)
                    .entity("{\"error\": \"Внутренняя ошибка сервера\"}")
                    .build();
        }
    }

    private Double getDoubleValue(JsonValue value) {
        if (value == null || value.getValueType() == JsonValue.ValueType.NULL) {
            return null;
        }

        switch (value.getValueType()) {
            case NUMBER:
                return ((JsonNumber) value).doubleValue();
            case STRING:
                try {
                    return Double.parseDouble(((JsonString) value).getString());
                } catch (NumberFormatException e) {
                    return null;
                }
            default:
                return null;
        }
    }

    @GET
    @Path("/health")
    public Response healthCheck() {
        JsonObject response = Json.createObjectBuilder()
                .add("status", "OK")
                .add("service", "Area Checker API")
                .build();
        return Response.ok(response.toString()).build();
    }

}