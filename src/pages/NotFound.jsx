import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4">
      <div className="relative text-center">
        {/* Large 404 background text */}
        <h1
          className="select-none text-[10rem] font-black leading-none tracking-tighter text-foreground/3 sm:text-[14rem] md:text-[18rem]"
          aria-hidden="true"
        >
          404
        </h1>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Page not found
            </h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
