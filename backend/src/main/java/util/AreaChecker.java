package util;

public class AreaChecker {

    public static boolean checkHit(double x, double y, double r) {
        boolean inQuarterCircle = (x >= 0 && y <= 0) && (x * x + y * y <= r * r);
        boolean inRectangle = (x <= 0 && x >= -r/2) && (y <= 0 && y >= -r);
        boolean inTriangle = (x <= 0 && x >= -r) && (y <= x + r) && (y >= 0 && y <= r);
        return inQuarterCircle || inRectangle || inTriangle;
    }

    public static boolean validateInput(double x, double y, double r) {

        boolean validYValue = (y > -5) && (y < 5);

        double[] validR = {-3, -2, -1, 0, 1, 2, 3, 4, 5};
        boolean validRValue = false;
        for (double val : validR) {
            if (r == val) {
                validRValue = true;
                break;
            }
        }

        return validYValue && validRValue;
    }
}