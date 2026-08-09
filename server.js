import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || stripeSecretKey === "sk_test_placeholder") {
  console.error(
    "FATAL: STRIPE_SECRET_KEY is required and missing from environment.",
  );
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-07-29.dahlia",
  maxNetworkRetries: 2,
  timeout: 10000,
});

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: "100kb" }));

const FREE_DELIVERY_THRESHOLD = 50;
const CONVENIENCE_FEE = 5;

const getDiscountedPrice = (product) => Number(product?.price ?? 0);

// Endpoint to create a Stripe Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    if (items.length > 50) {
      return res
        .status(400)
        .json({ error: "Cart exceeds maximum allowed items (50)." });
    }

    // Validate quantities and identifiers
    for (const item of items) {
      const qty = item?.quantity;
      if (
        !item?.id ||
        typeof qty !== "number" ||
        !Number.isInteger(qty) ||
        qty <= 0
      ) {
        return res
          .status(400)
          .json({ error: "Invalid product item or quantity." });
      }
    }

    // Fetch authoritative product data from DummyJSON
    const fetchedProducts = await Promise.all(
      items.map(async (item) => {
        const response = await fetch(
          `https://dummyjson.com/products/${item.id}`,
        );
        if (!response.ok) {
          throw new Error(`Product ${item.id} not found.`);
        }
        const product = await response.json();
        return { product, quantity: item.quantity };
      }),
    );

    let totalDiscountedPrice = 0;
    const lineItems = fetchedProducts.map(({ product, quantity }) => {
      const discountedPrice = getDiscountedPrice(product);
      totalDiscountedPrice += discountedPrice * quantity;
      const image = product.thumbnail || product.images?.[0];

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            description: product.brand || product.category || "Fashion item",
            images: image ? [image] : [],
          },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity,
      };
    });

    const convenienceFee =
      totalDiscountedPrice > FREE_DELIVERY_THRESHOLD ? 0 : CONVENIENCE_FEE;

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
      error: "Failed to create payment session. Please try again.",
    });
  }
});

// Endpoint to fetch Checkout Session status and details
app.get("/api/checkout-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "Invalid session ID." });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    res.json({
      id: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email || null,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      lineItems: session.line_items?.data || [],
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    if (error.statusCode === 404 || error.code === "resource_missing") {
      return res.status(404).json({ error: "Session not found." });
    }
    res.status(500).json({
      error: "Failed to retrieve session details.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
