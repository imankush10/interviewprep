export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-white" />
    </div>
  );
}
