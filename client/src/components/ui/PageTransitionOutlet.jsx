import { AnimatePresence, motion as Motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

const transition = {
  duration: 0.22,
  ease: [0.2, 0.8, 0.2, 1],
};

export default function PageTransitionOutlet() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={transition}
      >
        <Outlet />
      </Motion.div>
    </AnimatePresence>
  );
}
