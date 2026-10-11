const openRazorpayPayment = ({ razorpay, onSuccess, onFailure }) => {
    return new Promise((resolve, reject) => {
        if (!window.Razorpay) {
            return reject(new Error("Razorpay SDK not loaded"));
        }
        const options = {
            key: "rzp_test_RQAtAiouXCBXaX",
            amount: razorpay.amount,
            currency: razorpay.currency,
            name: "VocaRent",
            description: `Order ${razorpay.id}`,
            order_id: razorpay.id,

            handler: async function (response) {
                try {
                    await onSuccess({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        razorpay_order_id: razorpay.id,
                    });
                    resolve(true);
                } catch (err) {
                    onFailure?.(err);
                    reject(err);
                }
            },

            theme: { color: "#0078d4" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    });
};

export default openRazorpayPayment;