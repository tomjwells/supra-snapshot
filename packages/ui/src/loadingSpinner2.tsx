export default function LoadingSpinner2({ color = "indigo", size = "6" }) {
  return (
    <div className="flex h-full w-full flex-auto flex-col items-center justify-center">
      <div
        className={`inline-block h-${size} w-${size} animate-spin rounded-full border-[3px] border-current border-t-transparent ${
          color ? `text-${color}-600` : "text-blue-600"
        }`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
