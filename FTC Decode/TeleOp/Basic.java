package org.firstinspires.ftc.teamcode;

import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DcMotorSimple;

@TeleOp(name = "Mecanum Drive Only", group = "TeleOp")
public class Basic extends LinearOpMode {

    // ===== Drive motors =====
    private DcMotor frontLeft, frontRight, backLeft, backRight;

    // ===== Drive Constants =====
    private final double DRIVE_SPEED_MULTIPLIER = 1.0; 

    @Override
    public void runOpMode() {
        // --- Hardware Mapping ---
        frontLeft = hardwareMap.get(DcMotor.class, "frontLeft");
        frontRight = hardwareMap.get(DcMotor.class, "frontRight");
        backLeft = hardwareMap.get(DcMotor.class, "backLeft");
        backRight = hardwareMap.get(DcMotor.class, "backRight");

        // Set directions matching your robot's configuration
        frontLeft.setDirection(DcMotorSimple.Direction.REVERSE);
        backLeft.setDirection(DcMotorSimple.Direction.REVERSE);
        frontRight.setDirection(DcMotorSimple.Direction.FORWARD);
        backRight.setDirection(DcMotorSimple.Direction.FORWARD);

        // Enable braking behavior to make stopping more precise
        frontLeft.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        frontRight.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        backLeft.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        backRight.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);

        telemetry.addData("Status", "Drive Only Ready!");
        telemetry.update();

        waitForStart();

        while (opModeIsActive()) {
            // 1. Read Joysticks (Applying cubic scaling for smoother control)
            double forward = Math.pow(gamepad1.left_stick_y, 3);
            double strafe = Math.pow(gamepad1.left_stick_x * 1.1, 3);
            double rotate = Math.pow(-gamepad1.right_stick_x, 3);

            // 2. Drive Power Calculation
            // Denominator ensures no individual motor power ever exceeds 1.0 (100%)
            double denominator = Math.max(Math.abs(forward) + Math.abs(strafe) + Math.abs(rotate), 1);
            
            double flPower = (forward + strafe + rotate) / denominator * DRIVE_SPEED_MULTIPLIER;
            double blPower = (-forward - strafe + rotate) / denominator * DRIVE_SPEED_MULTIPLIER;
            double frPower = (forward - strafe - rotate) / denominator * DRIVE_SPEED_MULTIPLIER;
            double brPower = (-forward + strafe - rotate) / denominator * DRIVE_SPEED_MULTIPLIER;

            // 3. Apply Power to Motors
            frontLeft.setPower(flPower);
            backLeft.setPower(blPower);
            frontRight.setPower(frPower);
            backRight.setPower(brPower);

            // 4. Simple Telemetry for Debugging
            telemetry.addData("Forward Input", forward);
            telemetry.addData("Strafe Input", strafe);
            telemetry.addData("Rotation Input", rotate);
            telemetry.update();
        }
    }
}
