const axios = require("axios");

const sendSMS = async (mobile, dueDate) => {
  try {

    console.log("Sending SMS To:", mobile);

    const payload = {
      data: {
        sendTo: [
          {
            to: [
              {
                mobiles: `91${mobile}`,
                variables: {
                  var: {
                    value: dueDate
                  }
                }
              }
            ]
          }
        ]
      }
    };

    console.log("AUTH KEY =", process.env.MSG91_AUTH_KEY);
console.log("AUTH KEY LENGTH =", process.env.MSG91_AUTH_KEY?.length);
    const response = await axios.post(
      "https://control.msg91.com/api/v5/oneapi/api/flow/send-msg/run",
      payload,
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(
      "MSG91 Response:",
      JSON.stringify(response.data, null, 2)
    );

    return response.data;

  } catch (error) {

    console.error(
      "MSG91 Error:",
      JSON.stringify(error.response?.data || error.message, null, 2)
    );

    throw error;
  }
};

module.exports = sendSMS;