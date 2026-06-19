import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "../services/api";

const ActivatePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // "loading" | "success" | "error"
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      console.warn("[ACTIVATE] No token found in URL");
      setStatus("error");
      setMessage("No activation token found in the link.");
      return;
    }

    const activate = async () => {
      try {
        console.info("[ACTIVATE] Attempting activation");
        const response = await authService.activate(token);

        if (response.data.success) {
          console.info("[ACTIVATE] Success");
          setStatus("success");
          setMessage(
            response.data.message || "Your account has been activated!",
          );
        } else {
          console.warn("[ACTIVATE] Failed -", response.data.message);
          setStatus("error");
          setMessage(response.data.message || "Activation failed");
        }
      } catch (err) {
        console.error(
          "[ACTIVATE] Error:",
          err.response?.status,
          err.response?.data?.message || err.message,
        );
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            err.message ||
            "Activation failed. The link may be invalid or expired.",
        );
      }
    };

    activate();
    // Only run once on mount — token comes from the URL and shouldn't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Activating your account
            </h1>
            <p className="text-gray-600">Please wait a moment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Account activated
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="btn-primary inline-block w-full font-semibold py-3"
            >
              Go to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{message}</p>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Activation failed
            </h1>
            <Link
              to="/resend-activation"
              className="text-blue-600 font-semibold hover:underline"
            >
              Request a new activation link
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivatePage;
