import Stripe from "stripe";


let stripe;
function getStripe(){
    if(!stripe){
           stripe= new Stripe(process.env.STRIPE_SECRET_KEY)
    }
     return stripe;

}



export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects the smallest currency unit (paise/cents)
      currency: "inr", // change to "usd" etc. if needed
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Payment intent creation failed" });
  }
};

// ---------------------------------------------
// GET /api/payment/verify/:paymentIntentId
// Called from the frontend after Stripe confirms payment client-side.
// This is the trustworthy server-side check before creating the Order —
// never trust the frontend's "success" callback alone.
// ---------------------------------------------
export const verifyPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );

    const isPaid = paymentIntent.status === "succeeded";

    res.status(200).json({
      success: true,
      paid: isPaid,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Verification error" });
  }
};