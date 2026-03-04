import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function BrandMark({ to = "/", compact = false }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <Logo className={compact ? "size-7" : "size-8"} />
      <span className="font-bold tracking-tight text-[color:var(--text)]">
        Seva<span className="gradient-text">Connect</span>
      </span>
    </Link>
  );
}
