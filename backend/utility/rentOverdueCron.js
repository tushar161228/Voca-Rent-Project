const cron = require("node-cron");
const Rent = require("../models/Rent");
const Notification = require("../models/Notification");

cron.schedule("0 9 * * *", async () => {

    try {

        const today = new Date();
        const localDate = today.toLocaleDateString('en-GB');
        console.log(localDate);

        const overdueRents = await Rent.find({
            dueDate: {
                $lt: today
            },
            status: {
                $in: [
                    "Pending",
                    "PartiallyPaid"
                ]
            }
        });

        for (const rent of overdueRents) {

            rent.status = "Overdue";

            await rent.save();

            const exists =
                await Notification.findOne({
                    rentId: rent._id,
                    title: "Rent Overdue"
                });

            if (!exists && rent.ownerId) {

                await Notification.create({
                    user: rent.ownerId,
                    rentId: rent._id,
                    title: "Rent Overdue",
                    message:
                        `Rent payment is overdue. Due date was ${rent.dueDate.toDateString()}`,
                    type: "In-App",
                    status: "Sent"
                });

            }
        }

        console.log(
            "Overdue Rent Cron Completed"
        );

    } catch (error) {

        console.error(
            "Overdue Rent Cron Error:",
            error
        );

    }

});