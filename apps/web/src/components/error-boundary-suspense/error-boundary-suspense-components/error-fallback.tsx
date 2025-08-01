import type { FallbackProps } from "react-error-boundary";

export const ErrorFallback: React.FC<FallbackProps> = (props) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="alert alert-error max-w-md mx-auto">
          <div>
            <h3 className="font-bold">Something went wrong!</h3>
            <div className="text-xs">{props.error.message}</div>

            <button
              className="btn btn-sm btn-outline mt-2"
              onClick={props.resetErrorBoundary}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
