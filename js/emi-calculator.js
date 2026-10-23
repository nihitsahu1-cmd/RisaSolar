(() => {
  "use strict";

  const form = document.querySelector("#emiForm");
  if (!form) return;

  const fields = {
    cost: form.elements.systemCost,
    subsidy: form.elements.governmentSubsidy,
    downPayment: form.elements.downPayment,
    rate: form.elements.interestRate,
    tenure: form.elements.loanTenure,
    savings: form.elements.monthlySavings
  };
  const error = document.querySelector("#emiError");
  const announcement = document.querySelector("#emiAnnouncement");
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });
  const formatMoney = amount => currency.format(Math.round(amount));

  function setText(id, value) {
    document.querySelector(`#${id}`).textContent = value;
  }

  function readInputs() {
    return {
      cost: fields.cost.value.trim() === "" ? NaN : Number(fields.cost.value),
      subsidy: fields.subsidy.value.trim() === "" ? NaN : Number(fields.subsidy.value),
      downPayment: fields.downPayment.value.trim() === "" ? NaN : Number(fields.downPayment.value),
      rate: fields.rate.value.trim() === "" ? NaN : Number(fields.rate.value),
      months: Number(fields.tenure.value),
      savings: fields.savings.value.trim() === "" ? 0 : Number(fields.savings.value)
    };
  }

  function validate(values) {
    [fields.cost, fields.subsidy, fields.downPayment, fields.rate, fields.savings]
      .forEach(field => field.setCustomValidity(""));

    if (!form.checkValidity()) {
      const invalidField = form.querySelector(":invalid");
      return invalidField.validationMessage || "Please check the highlighted fields.";
    }
    if (values.cost <= 0) {
      fields.cost.setCustomValidity("Enter a system cost greater than zero.");
      return fields.cost.validationMessage;
    }
    if (values.subsidy + values.downPayment > values.cost) {
      fields.downPayment.setCustomValidity("Subsidy and down payment cannot exceed the system cost.");
      return fields.downPayment.validationMessage;
    }
    if (!Number.isInteger(values.months) || values.months < 1 || values.months > 360) {
      fields.tenure.setCustomValidity("Choose a loan tenure between 1 and 360 months.");
      return fields.tenure.validationMessage;
    }
    return "";
  }

  function calculate({ reportValidity = false } = {}) {
    const values = readInputs();
    const validationMessage = validate(values);
    if (validationMessage) {
      error.textContent = validationMessage;
      announcement.textContent = "Correct the loan details to update this estimate.";
      if (reportValidity) {
        const invalidField = form.querySelector(":invalid");
        if (invalidField) invalidField.reportValidity();
      }
      return;
    }

    error.textContent = "";
    const principal = values.cost - values.subsidy - values.downPayment;
    const monthlyRate = values.rate / 1200;
    const growthFactor = Math.pow(1 + monthlyRate, values.months);
    const emi = principal === 0
      ? 0
      : monthlyRate === 0
        ? principal / values.months
        : principal * monthlyRate * growthFactor / (growthFactor - 1);
    const calculatedRepayment = emi * values.months;
    const interest = Math.max(0, calculatedRepayment - principal);
    const repayment = principal + interest;
    const netBenefit = values.savings - emi;
    const totalPaid = principal + interest;
    const principalShare = totalPaid > 0 ? principal / totalPaid * 100 : 0;
    const interestShare = totalPaid > 0 ? 100 - principalShare : 0;

    setText("emiMonthly", formatMoney(emi));
    setText("emiCost", formatMoney(values.cost));
    setText("emiSubsidy", formatMoney(values.subsidy));
    setText("emiDownPayment", formatMoney(values.downPayment));
    setText("emiLoan", formatMoney(principal));
    setText("emiInterest", formatMoney(interest));
    setText("emiRepayment", formatMoney(repayment));
    setText("emiSavings", formatMoney(values.savings));
    setText("emiNetBenefit", formatMoney(netBenefit));
    setText("emiPrincipalLegend", formatMoney(principal));
    setText("emiInterestLegend", formatMoney(interest));

    document.querySelector("#emiPrincipalSegment").style.width = `${principalShare}%`;
    document.querySelector("#emiInterestSegment").style.width = `${interestShare}%`;
    document.querySelector("#emiBreakdownBar").setAttribute(
      "aria-label",
      `Loan repayment breakdown: ${Math.round(principalShare)}% principal and ${Math.round(interestShare)}% interest`
    );
    announcement.textContent = `${values.months} monthly instalments at ${values.rate}% annual interest. Estimates update when you change an input.`;
  }

  form.addEventListener("input", () => calculate());
  form.addEventListener("change", () => calculate());
  form.addEventListener("submit", event => {
    event.preventDefault();
    calculate({ reportValidity: true });
  });
  form.addEventListener("reset", () => {
    window.requestAnimationFrame(() => {
      error.textContent = "";
      calculate();
    });
  });

  calculate();
})();
