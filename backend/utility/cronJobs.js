const cron = require("node-cron");
const Rent = require("../models/Rent");
const Notification = require("../models/Notification");
const sendSMS = require("../services/sendSMS");

cron.schedule("0 9 * * *", async () => {
  console.log("Cron Started");
  try {
  const today = new Date();

const localDate = today.toLocaleDateString('en-GB'); // 20/06/2026
console.log(localDate);

    const startOfTomorrow = new Date(today);
    startOfTomorrow.setDate(today.getDate() + 1);

    
    const endOf3Days = new Date(today);
    endOf3Days.setDate(today.getDate() + 3);
    endOf3Days.setHours(23, 59, 59, 999);

    const dueRents = await Rent.find({
      dueDate: {
        $gte: startOfTomorrow,
        $lte: endOf3Days,
      },
      status: {
        $in: ["Pending", "PartiallyPaid"],
      },
    })
      .populate("roomId")
      .populate("tenantId");

    console.log("Due Rents Found:", dueRents.length);

    for (const rent of dueRents) {
      console.log("Rent ID:", rent._id);
      console.log("Due Date:", rent.dueDate);
      console.log("Status:", rent.status);
      console.log("Tenant:", rent.tenantId);
    }

    const notificationsToInsert = [];
    const rentBulkOps = [];

    for (const rent of dueRents) {
      const alreadySentToday = rent.reminderDates.some((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });

      if (alreadySentToday) continue;

      const dueDateStart = new Date(rent.dueDate);
      dueDateStart.setHours(0, 0, 0, 0);
      const diffTime = dueDateStart.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Reminder number: 3 days left -> 1st, 2 days left -> 2nd, 1 day left -> 3rd
      const reminderNumber = 4 - diffDays;

      if (reminderNumber >= 1 && reminderNumber <= 3) {
        const roomNumber = rent.roomId?.roomNumber || "N/A";
        const tenantName = rent.tenantId?.name || "Tenant";

        const message = `Reminder ${reminderNumber}: Rent for room ${roomNumber} from tenant ${tenantName} is due on ${rent.dueDate.toDateString()}.`;

        if (rent.ownerId) {
          notificationsToInsert.push({
            user: rent.ownerId,
            rentId: rent._id,
            title: "Rent Due Reminder",
            message,
            type: "In-App",
            status: "Sent",
          });
        }

        if (rent.tenantId?.mobile) {
          const tenantMessage = `Hello ${tenantName}, this is Reminder ${reminderNumber}. Your rent for room ${roomNumber} is due on ${rent.dueDate.toDateString()}. Please ensure it is paid on time.`;

          console.log(
            `[SMS Reminder Sent] To: ${rent.tenantId.mobile} | Message: ${tenantMessage}`,
          );
          await sendSMS(rent.tenantId.mobile, rent.dueDate.toDateString());
        }

        rentBulkOps.push({
          updateOne: {
            filter: { _id: rent._id },
            update: { $push: { reminderDates: new Date() } },
          },
        });
      }
    }

    if (notificationsToInsert.length > 0) {
      await Notification.insertMany(notificationsToInsert);
    }

    if (rentBulkOps.length > 0) {
      await Rent.bulkWrite(rentBulkOps);
    }

    console.log(
      `Rent Reminder Cron Completed. Processed ${rentBulkOps.length} reminders.`,
    );
  } catch (error) {
    console.error("Rent Reminder Cron Error:", error);
  }
});
