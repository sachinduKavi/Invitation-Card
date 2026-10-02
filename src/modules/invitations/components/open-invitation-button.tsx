"use client";

import { useScroll } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function OpenInvitationButton({ label = "Open Invitation" }: { label?: string }) {
  const scroll = useScroll();

  function handleOpen() {
    const el = scroll.el;
    el.scrollTo({ top: el.scrollHeight / scroll.pages, behavior: "smooth" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <Button size="lg" onClick={handleOpen} className="rounded-full px-8">
        {label}
      </Button>
    </motion.div>
  );
}
