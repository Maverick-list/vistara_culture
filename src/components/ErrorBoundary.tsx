"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 p-6 text-center">
          <AlertOctagon className="mb-4 h-16 w-16 text-rose-600" />
          <h2 className="font-display text-2xl font-bold text-amber-950">
            Aduh, Terjadi Kesalahan!
          </h2>
          <p className="mt-2 max-w-md text-amber-700">
            Aplikasi mengalami gangguan yang tidak terduga. Ini biasanya dapat diselesaikan dengan memuat ulang halaman.
          </p>
          <div className="mt-4 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-mono text-left w-full max-w-md overflow-x-auto">
            {this.state.errorMsg}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-amber-800 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-amber-900"
          >
            <RefreshCcw className="h-4 w-4" />
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
