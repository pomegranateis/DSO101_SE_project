describe("BMI calculator", () => {
  it("calculates BMI correctly", () => {
    const height = 180; // cm
    const weight = 80; // kg
    const bmi = (weight / (height / 100) ** 2).toFixed(2);
    expect(bmi).toBe("24.69");
  });
});
