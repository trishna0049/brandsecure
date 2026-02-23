const cron = require("node-cron");
const Compliance = require("../models/Compliance");
const User = require("../models/User");
const { sendEmail } = require("./emailService");

const checkDeadlines = async () => {
    console.log("Running compliance reminder check...");

    const today = new Date();

    const tasks = await Compliance.find({
        status: { $ne: "Completed" }
    });

    for (let task of tasks) {
        const diffTime = new Date(task.deadline) - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysLeft === 3 || daysLeft === 1) {
            const user = await User.findById(task.userId);

            if (user) {
                await sendEmail(
                    user.email,
                    `⚠ Compliance Reminder: ${task.title}`,
                    `Hello,

Your compliance task "${task.title}" is due in ${daysLeft} day(s).

Please complete it to avoid penalties.

- Startup Compliance AI`
                );
            }
        }
    }
};

// FOR TESTING (runs every minute)
cron.schedule("* * * * *", async () => {
    await checkDeadlines();
});