import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-bold text-white">Application Error</h1>
                <p className="text-xs text-slate-400">San Andreas Inmate Registry</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs text-rose-300 font-mono overflow-auto max-h-48">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </div>

            <p className="text-xs text-slate-400">
              Corrupted local storage data may cause display issues. You can reload or reset stored cache.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Clear Data & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
