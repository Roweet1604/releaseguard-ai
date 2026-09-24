function analyzeFailure(failure) {
  const output = {
    severity: "HIGH",
    category: "Business Logic",
    title: "Coupon discount calculation failure",

    summary:
      "The coupon was accepted successfully, but the expected 20% discount was not applied to the checkout.",

    expected:
      failure.expected || "₹200",

    actual:
      failure.actual || "₹0",

    likelyCause:
      "Coupon validation succeeds, but the discount calculation or checkout total update is not being executed.",

    businessImpact:
      "Customers may be charged the incorrect amount at checkout, creating a financial and customer-experience risk.",

    recommendation:
      "Inspect the coupon discount calculation and the logic responsible for updating the checkout total.",

    evidence: {
      screenshot: failure.screenshot || null,
      trace: failure.trace || null,
      video: failure.video || null,
    },
  };

  return output;
}

module.exports = {
  analyzeFailure,
};