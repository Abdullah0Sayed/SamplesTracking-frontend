import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
    return (
        <motion.div
            className="fixed inset-0 flex justify-center items-center  z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-16 h-16 rounded-full border-8 
                   border-gray-50  border-t-primary-color"
                animate={{ rotate: 360, opacity: 40 }}
                transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "linear",
                }}
            />
        </motion.div>
    );
};

export default Loading;
