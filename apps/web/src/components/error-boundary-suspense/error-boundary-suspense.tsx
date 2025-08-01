import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type ComponentProps, type PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ErrorFallback,
  LoadingFallback,
} from "./error-boundary-suspense-components";

type ErrorBoundarySuspenseProps = PropsWithChildren & {
  fallback?: React.ReactNode;
};

export const ErrorBoundarySuspense: React.FC<ErrorBoundarySuspenseProps> = ({
  children,
  fallback = <LoadingFallback />,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(fallbackProps) => (
            <ErrorFallback {...fallbackProps} />
          )}
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const withErrorBoundarySuspense = (
  Component: React.FC,
  props?: ComponentProps<typeof ErrorBoundarySuspense>,
) => {
  return (componentProps: ComponentProps<typeof Component>) => (
    <ErrorBoundarySuspense {...props}>
      <Component {...componentProps} />
    </ErrorBoundarySuspense>
  );
};
