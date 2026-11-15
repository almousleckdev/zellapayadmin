"use client";

import { ErrorState } from "@zellapay/app-kit";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState retry={reset} digest={error.digest} />;
}
