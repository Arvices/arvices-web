import React from "react";
import { AnimatePresence, motion, Transition } from "framer-motion";

interface SlideInPropType {
  children: React.ReactNode;
  from: "right" | "bottom";
  isOpen: boolean;
  toggle: () => void;
}

export const SlideIn = ({
  children,
  from,
  isOpen,
  toggle,
}: SlideInPropType): React.ReactNode => {
  const panelVariants = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
    },
  };

  const transition: Transition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4,
  };

  const panelClasses =
    from === "right"
      ? "fixed top-0 right-0 h-full w-[90vw] sm:w-[500px] bg-white rounded-tl-2xl rounded-bl-2xl overflow-y-auto z-50"
      : "fixed bottom-0 left-0 w-full h-[60vh] bg-white rounded-tl-2xl rounded-tr-2xl overflow-y-auto z-50";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
           className="fixed inset-0 bg-black/40  z-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            onClick={toggle}
          />
          <motion.div
            className={`${panelClasses} backdrop-blur-sm z-[101]`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={panelVariants[from]}
            transition={transition}
          >
            <div className="relative p-6 z-101">
              <button
                onClick={toggle}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
