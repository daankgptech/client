export default function LoaderOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center">
      <div className="h-10 w-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}