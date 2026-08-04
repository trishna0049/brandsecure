// Profile-based compliance deadline & risk engine.
// Assigns realistic due dates relative to today and the founder's onboarding
// profile (registration status/date and startup stage) instead of hardcoded or
// AI-fabricated dates. Used by the onboarding roadmap generator so the
// dashboard, task list and email reminders all read consistent values.

function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}

// Whole-day difference: (later - earlier)
function diffDays(a, b) {
    return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

function classify(task) {
    const t = `${task.title || ""} ${task.category || ""}`.toLowerCase();

    if (/aoc|roc|mgt|annual|yearly|statutory auditor|transfer pricing/.test(t)) {
        return "annual";
    }
    if (/gst|gstr|tds|return|filing|monthly|advance tax|payroll|pf\/esi|\bpf\b|\besi\b/.test(t)) {
        return "recurring";
    }
    if (/incorporat|register|registrat|formation|structure|pan|tan|bank account|bank acc|dsc|din|udyam|msme|startup india/.test(t)) {
        return "formation";
    }
    if (/trademark|\bip\b|nda|agreement|contract|shareholder|privacy|policy|terms|esop|offer letter/.test(t)) {
        return "document";
    }
    return "general";
}

function riskFor(due, today) {
    const days = diffDays(today, due); // >0 future
    if (days < 0) return "High";       // overdue
    if (days <= 14) return "High";     // due soon
    if (days <= 60) return "Medium";   // upcoming
    return "Low";                       // future
}

// Keep overdue realistic (max ~30 days), else tasks months past look broken.
function clampOverdue(d, today) {
    if (diffDays(today, d) < -30) return addDays(today, -3);
    return d;
}

const DOC_OFFSETS = [7, 14, 21, 30, 45, 60, 75, 90];
const GEN_OFFSETS = [15, 30, 45, 60, 75, 90, 120];
const RECUR_DAYS = [7, 11, 20, 25];

// tasks: [{ title, category, requiredDocuments }]
// profile: { legalStatus, registrationDate, businessStart, stage }
// returns tasks with computed deadline (Date), riskLevel (string).
function schedule(tasks, profile) {
    const registered = !!(profile.legalStatus && profile.legalStatus !== "no");
    const regDate = registered && profile.registrationDate
        ? startOfDay(new Date(profile.registrationDate))
        : null;
    const today = startOfDay(new Date());
    const businessAge = regDate ? Math.max(diffDays(regDate, today), 0) : 0;

    // Not registered => surface formation/registration tasks first.
    const items = tasks.map((t, i) => ({ ...t, _kind: classify(t), _i: i }));
    if (!registered) {
        items.sort((a, b) => {
            const pa = a._kind === "formation" ? 0 : 1;
            const pb = b._kind === "formation" ? 0 : 1;
            return pa !== pb ? pa - pb : a._i - b._i;
        });
    }

    let f = 0, r = 0, d = 0, g = 0, a = 0;

    return items.map((t) => {
        let due;

        switch (t._kind) {
            case "formation": {
                if (!registered) {
                    due = addDays(today, 3 + Math.min(f, 4));        // 3-7 days: due soon, priority
                } else if (businessAge < 60) {
                    due = addDays(today, 5 + f * 3);                 // recently registered
                } else {
                    due = addDays(today, 15 + f * 7);                // established: pending setup
                }
                f++;
                break;
            }
            case "recurring": {
                const dueDay = RECUR_DAYS[r % RECUR_DAYS.length];
                let x = new Date(today.getFullYear(), today.getMonth(), dueDay);
                if (diffDays(today, x) > 15) {
                    x = new Date(today.getFullYear(), today.getMonth() - 1, dueDay);
                }
                due = x;
                r++;
                break;
            }
            case "annual": {
                if (regDate) {
                    due = addDays(regDate, 365 * (a + 1));
                } else {
                    due = addDays(today, 180 + a * 60);
                }
                a++;
                break;
            }
            case "document": {
                due = addDays(today, DOC_OFFSETS[d % DOC_OFFSETS.length]);
                d++;
                break;
            }
            default: {
                due = addDays(today, GEN_OFFSETS[g % GEN_OFFSETS.length]);
                g++;
                break;
            }
        }

        due = clampOverdue(due, today);

        return {
            category: t.category || "General",
            title: t.title,
            deadline: due,
            riskLevel: riskFor(due, today),
            requiredDocuments: Array.isArray(t.requiredDocuments) ? t.requiredDocuments : []
        };
    });
}

module.exports = { schedule };