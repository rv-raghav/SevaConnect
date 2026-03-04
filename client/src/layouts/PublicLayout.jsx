import PageTransitionOutlet from "../components/ui/PageTransitionOutlet";

export default function PublicLayout() {
  return (
    <div className="min-h-screen app-bg antialiased">
      <PageTransitionOutlet />
    </div>
  );
}
