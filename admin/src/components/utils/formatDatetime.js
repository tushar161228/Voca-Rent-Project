const formatDatetime = (
  value,
  variant = "dateTime", // date | time | dateTime | shortDate | slashDateTime
  timezone = "Asia/Kolkata"
) => {
  if (!value) return "";

  const date = new Date(value);

  const baseOptions = { timeZone: timezone };

  switch (variant) {
    //  07 Jan 2026
    case "shortDate":
      return date.toLocaleDateString("en-GB", {
        ...baseOptions,
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    //  10/1/2026 5:30:00 AM
    case "slashDateTime":
      return date
        .toLocaleString("en-US", {
          ...baseOptions,
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        .replace("am", "AM")
        .replace("pm", "PM");

    //  JAN
    case "month":
      return date
        .toLocaleDateString("en-US", {
          ...baseOptions,
          month: "long",
        })
        .toLowerCase();


    //  Date only
    case "date":
      return date.toLocaleDateString("en-IN", baseOptions);

    //  Week only
    case "weekday":
      return date.toLocaleDateString("en-US", {
        ...baseOptions,
        weekday: "long",
      });

    //   date Only this format  2026-01-01
    case "isoDate":
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);



    //  Time only
    case "time":
      return date
        .toLocaleTimeString("en-IN", {
          ...baseOptions,
          hour12: true,
        })
        .replace("am", "AM")
        .replace("pm", "PM");

    // Slash Date
    case "slashDate":
      return date.toLocaleDateString("en-GB", {
        ...baseOptions,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    // for billining cycle
    case "billing":
      const days = Number(value) || 0;
      if (days >= 365) return "Yearly";
      if (days >= 30) return "Monthly";
      return `${days} Days`;

    //  Date + Time (default)
    case "dateTime":
    default:
      const d = date.toLocaleDateString("en-IN", baseOptions);
      const t = date
        .toLocaleTimeString("en-IN", { ...baseOptions, hour12: true })
        .replace("am", "AM")
        .replace("pm", "PM");
      return `${d} ${t}`;
  }
};

export default formatDatetime;


// use case
// formatDatetime(date, "dateTime"); 10/1/2026 5:30:00
// formatDatetime(date, "time"); 10:12:00
// formatDatetime(date, "isoDate"); 2026-01-01
// formatDatetime(date, "month"); JAN
// formatDatetime(date, "shortDate");  07 Jan 2026
// formatDatetime(date, "slashDateTime");  10/1/2026 5:30:00 AM