// src/components/ui/ErrorBoundary.tsx — 全局错误边界，防止白屏
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <span className="text-3xl">⚠</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">页面加载异常</h2>
          <p className="text-center text-sm text-slate-500">
            {this.state.error?.message || '发生了未知错误'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition active:bg-blue-700"
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
