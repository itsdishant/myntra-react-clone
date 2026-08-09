import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Divider from "@mui/material/Divider";
import { formatMoney } from "../utils/product";

/**
 * Presentational order confirmation page.
 * Receives session details from route wrapper / loader.
 */
const Success = ({ sessionId, session }) => {
  if (!sessionId || !session) {
    return (
      <Box
        component="main"
        id="main-content"
        className="mx-auto w-full max-w-shell px-4 py-12 sm:px-6 sm:py-16"
      >
        <Box className="mx-auto max-w-md rounded-2xl border border-(--color-border) bg-surface p-6 text-center shadow-soft sm:p-8">
          <Box className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary-soft) text-(--color-primary) mx-auto">
            <InfoOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography
            variant="h5"
            className="mb-2 font-semibold text-(--color-foreground)"
            sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
          >
            No order session found
          </Typography>
          <Typography className="mb-6 text-sm text-(--color-foreground-muted)">
            We couldn’t find an active order session ID. If you just placed an
            order, please check your email for a receipt.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            className="min-h-11! px-6! font-semibold!"
          >
            Return to Store
          </Button>
        </Box>
      </Box>
    );
  }

  const isPaid = session?.paymentStatus === "paid";

  if (!isPaid) {
    return (
      <Box
        component="main"
        id="main-content"
        className="mx-auto w-full max-w-shell px-4 py-12 sm:px-6 sm:py-16"
      >
        <Box className="mx-auto max-w-md rounded-2xl border border-(--color-border) bg-surface p-6 text-center shadow-soft sm:p-8">
          <Box className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary-soft) text-(--color-primary) mx-auto">
            <InfoOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography
            variant="h5"
            className="mb-2 font-semibold text-(--color-foreground)"
            sx={{ fontFamily: '"Cormorant", Georgia, serif' }}
          >
            Payment pending or incomplete
          </Typography>
          <Typography className="mb-6 text-sm text-(--color-foreground-muted)">
            Your payment status is &ldquo;
            {session?.paymentStatus || "unpaid"}&rdquo;. Please return to your
            cart to retry checkout.
          </Typography>
          <Button
            component={Link}
            to="/bag"
            variant="contained"
            color="primary"
            className="min-h-11! px-6! font-semibold!"
          >
            Return to Cart
          </Button>
        </Box>
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

        <Box className="mb-6 rounded-xl border border-(--color-border) bg-(--color-background) p-4 text-xs">
          <Typography className="font-semibold text-(--color-foreground)">
            Order ID:{" "}
            <span className="font-normal">{session.id || sessionId}</span>
          </Typography>
        </Box>

        {session.lineItems?.length ? (
          <Box className="mb-6">
            <Typography className="mb-3 text-xs font-bold tracking-[0.12em] text-(--color-foreground) uppercase">
              Order Summary
            </Typography>
            <Divider className="mb-3! border-(--color-border)!" />
            <Box className="flex flex-col gap-3">
              {session.lineItems.map((item, idx) => (
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
              <span>{formatMoney(session.amountTotal)}</span>
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
