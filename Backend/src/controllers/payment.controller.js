import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import {  STRIPE_SECRET_KEY, FRONTEND_URL } from "../config/env.js";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createCheckoutSection = async (req, res) => {
  try {
    const { credits, price } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${credits} Credits`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        credits,
        userId: req.user.id,
        price,
      },

      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pricing`,
    });

    await Payment.create({
      userId: req.user.id,
      stripeSessionId: session.id,
      price,
      credits,
      status: "pending",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId)
      return res.status(400).json({ error: "Session ID missing" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const payment = await Payment.findOne({ stripeSessionId: sessionId });
    if (!payment)
      return res.status(404).json({ error: "Payment record not found" });

    if (session.payment_status !== "paid") {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({ error: "Payment not completed" });
    }

    if (payment.status === "paid") {
      return res.status(200).json({ message: "Payment already processed" });
    }

    const { credits, userId } = session.metadata;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.credits += Number(credits);
    await user.save();

    payment.status = "paid";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Credits added and payment updated",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPayments = await Payment.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total: totalPayments,
        page,
        limit,
        totalPages: Math.ceil(totalPayments / limit),
      },
    });
  } catch (error) {
    console.error("Get payment records error:", error);
    res.status(500).json({ error: error.message });
  }
};
