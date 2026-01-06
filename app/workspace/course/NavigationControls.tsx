type NavigationControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  disableNext: boolean;
  isLast: boolean;
};

export function NavigationControls({
  onPrev,
  onNext,
  disableNext,
  isLast,
}: NavigationControlsProps) {
  return (
    <div className="flex justify-between mt-6">
      <button onClick={onPrev} className="px-4 py-2 bg-gray-300 rounded">
        Previous
      </button>

      <button
        onClick={onNext}
        disabled={disableNext}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLast ? "Finish" : "Next"}
      </button>
    </div>
  );
}
