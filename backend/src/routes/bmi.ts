import { Router, Request, Response } from "express";
import db from "../db";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  console.log("Received POST /api/bmi");

  const { height, weight, age } = req.body;

  if (!height || !weight || !age) {
    res.status(400).json({ error: "Missing height, weight, or age" });
    return;
  }

  const bmi = (weight / (height / 100) ** 2).toFixed(2);

  try {
    const result = await db("bmi_records")
      .insert({
        height_cm: height,
        weight_kg: weight,
        age,
        bmi,
      })
      .returning("*");

    console.log("BMI saved:", result);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("BMI insertion error:", error);
    res.status(500).json({ error: "Failed to save BMI data." });
  }
});
    

export default router;
