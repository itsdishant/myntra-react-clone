import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-07-29.dahlia",
});

app.use(cors());
app.use(express.json());

// Endpoint to create a Stripe Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items = [], convenienceFee = 0 } = req.body;

    if (!items.length) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const lineItems = items.map((item) => {
      const discountedPrice = item.price ?? 0;
      const image = item.thumbnail || item.images?.[0];

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.brand || item.category || "Fashion item",
            images: image ? [image] : [],
          },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    if (convenienceFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Convenience & Handling Fee",
            description: "Standard shipping & processing fee",
          },
          unit_amount: Math.round(convenienceFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/bag`,
      metadata: {
        itemCount: items.length.toString(),
      },
    });

    res.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({
      error: error.message || "Failed to create Stripe checkout session.",
    });
  }
});

// Endpoint to fetch Checkout Session status and details
app.get("/api/checkout-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    res.json({
      id: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      lineItems: session.line_items?.data || [],
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({
      error: error.message || "Failed to retrieve session details.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
