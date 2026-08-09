import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { bagActions } from "../store/Bag";
import { formatMoney } from "../utils/product";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(Boolean(sessionId));
  const [sessionDetails, setSessionDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Clear Redux cart once payment is successful
    dispatch(bagActions.clearBag());

    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/checkout-session/${sessionId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch session details.");
        }
        const data = await response.json();
        setSessionDetails(data);
      } catch (err) {
        console.error("Error fetching session details:", err);
        setError(err.message || "Failed to load order confirmation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, dispatch]);

  if (loading) {
    return (
      <Box className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <CircularProgress size={48} thickness={3} color="primary" />
        <Typography className="mt-4 text-base font-medium text-(--color-foreground-muted)">
          Confirming your purchase with Stripe…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      id="main-content"
      className="mx-auto w-full max-w-shell px-4 py-12 sm:px-6 sm:py-16"
    >
      <Box className="mx-auto max-w-2xl rounded-2xl border border-(--color-border) bg-surface p-6 shadow-soft sm:p-10">
        <Box className="mb-6 flex flex-col items-center text-center">
          <Box className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary-soft) text-(--color-primary)">
            <CheckCircleOutlinedIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography
            variant="h4"
            className="mb-1 font-semibold text-(--color-foreground)"
            sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
          >
            Thank you for your order!
          </Typography>
          <Typography className="text-sm text-(--color-foreground-muted)">
            Your purchase has been completed successfully via Stripe.
          </Typography>
        </Box>

        {sessionId ? (
          <Box className="mb-6 rounded-xl border border-(--color-border) bg-(--color-background) p-4 text-xs">
            <Typography className="font-semibold text-(--color-foreground)">
              Order ID: <span className="font-normal">{sessionId}</span>
            </Typography>
            {sessionDetails?.customerEmail ? (
              <Typography className="mt-1 font-semibold text-(--color-foreground)">
                Receipt sent to:{" "}
                <span className="font-normal">
                  {sessionDetails.customerEmail}
                </span>
              </Typography>
            ) : null}
          </Box>
        ) : null}

        {error ? (
          <Typography className="mb-4 text-sm text-(--color-accent)">
            {error}
          </Typography>
        ) : null}

        {sessionDetails?.lineItems?.length ? (
          <Box className="mb-6">
            <Typography className="mb-3 text-xs font-bold tracking-[0.12em] text-(--color-foreground) uppercase">
              Order Summary
            </Typography>
            <Divider className="mb-3! border-(--color-border)!" />
            <Box className="flex flex-col gap-3">
              {sessionDetails.lineItems.map((item, idx) => (
                <Box
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <Box className="min-w-0 flex-1">
                    <Typography className="font-medium text-(--color-foreground)">
                      {item.description}
                    </Typography>
                    <Typography className="text-xs text-(--color-foreground-muted)">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography className="font-semibold text-(--color-foreground)">
                    {formatMoney((item.amount_total ?? 0) / 100)}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider className="my-4! border-(--color-border)!" />
            <Box className="flex items-center justify-between text-base font-bold text-(--color-foreground)">
              <span>Total Paid</span>
              <span>{formatMoney(sessionDetails.amountTotal)}</span>
            </Box>
          </Box>
        ) : null}

        <Box className="flex justify-center">
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            className="min-h-11! px-8! font-semibold!"
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Success;
