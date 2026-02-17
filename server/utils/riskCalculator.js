exports.calculateRisk = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);

    const diffTime = dueDate - today;
    const daysLeft = diffTime / (1000 * 60 * 60 * 24);

    if (daysLeft <= 3) return "High";
    if (daysLeft <= 10) return "Medium";
    return "Low";
};
