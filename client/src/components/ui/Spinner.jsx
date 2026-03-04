export default function Spinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light gap-4">
        <div className="w-12 h-12 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Loading...</p>
    </div>
  );
}
