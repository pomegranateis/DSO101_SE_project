import React, { useState } from "react";
import axios from "axios";

const BmiForm: React.FC = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmiResult, setBmiResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setBmiResult(null);

    try {
      const res = await axios.post("http://localhost:3000/api/bmi", {
        height: Number(height),
          weight: Number(weight),
          age: Number(age),
        });
      setBmiResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>🧮 BMI Calculator</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Submit"}
        </button>
      </form>

      {bmiResult && (
        <div>
          <p>
            <strong>BMI:</strong> {bmiResult.bmi}
          </p>
          <p>Recorded at: {new Date(bmiResult.created_at).toLocaleString()}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
    </div>
  );
};

export default BmiForm;
