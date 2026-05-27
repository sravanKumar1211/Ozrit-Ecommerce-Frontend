import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { verifyOtp, resendOtp } from "@/features/auth/authThunks";
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";

const VerifyEmailPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // 6 separate values for the OTP grid
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle resend countdown timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle digit input change
  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keydown for backspace back-navigation
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current is empty, focus previous and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else if (otp[index]) {
        // If current is filled, just clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste event (perfect UX)
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").trim();
    if (pastedData.length === 6 && !isNaN(pastedData)) {
      const chars = pastedData.split("");
      setOtp(chars);
      inputRefs.current[5].focus();
    }
  };

  // Handle OTP verification submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    const result = await dispatch(verifyOtp({ email, otp: fullOtp }));
    if (verifyOtp.fulfilled.match(result)) {
      toast.success("Email verified successfully! Welcome to Ozrit Shop.");
      navigate("/", { replace: true });
    } else {
      toast.error(result.payload || "Verification failed");
    }
  };

  // Handle OTP Resend trigger
  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60); // Reset timer

    const result = await dispatch(resendOtp({ email }));
    if (resendOtp.fulfilled.match(result)) {
      toast.success("A new verification code has been sent to your email.");
    } else {
      toast.error(result.payload || "Failed to resend code");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  return (
    <div className="mx-auto flex max-w-md px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-2xl">
            🔑
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Verify Email</h1>
          <p className="mt-2 text-sm text-slate-500">
            We have sent a 6-digit verification code to
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 break-all">
            {email}
          </p>
        </div>

        {error && <Alert severity="error" className="mt-5">{error}</Alert>}

        {/* 6-Digit input grid */}
        <div className="mt-8 flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              required
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-bold outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <div className="mt-6 text-center text-sm text-slate-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`font-semibold text-slate-950 underline focus:outline-none ${
              !canResend ? "cursor-not-allowed opacity-50" : "hover:text-slate-800"
            }`}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmailPage;
