async function analyzeRequirement(requirement) {
  return {
    feature: "Coupon Discount",
    summary:
      "The requirement describes a coupon system that should apply a 20% discount to eligible orders.",
    expectedBehavior:
      "When a valid coupon is applied, the checkout total should be reduced by 20%.",

    scenarios: [
      "Apply a valid coupon and verify that 20% discount is applied.",
      "Apply an invalid coupon and verify that no discount is applied.",
      "Apply an expired coupon and verify that it is rejected.",
      "Remove the coupon and verify that the original total is restored.",
    ],

    risks: [
      {
        level: "HIGH",
        title: "Discount calculation failure",
        description:
          "The coupon may be accepted while the checkout total remains unchanged.",
      },
      {
        level: "MEDIUM",
        title: "Invalid coupon handling",
        description:
          "Invalid or expired coupons may incorrectly receive a discount.",
      },
    ],
  };
}

module.exports = {
  analyzeRequirement,
};