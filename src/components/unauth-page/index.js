"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {FREQUENTLY_ASKED} from "@/utils/constants"


function UnauthBanner({ router }) {
  return (
    <div className="h-[65vh] sm:h-[90vh] xl:h-[95vh] bg-cover bg-no-repeat border-b-8 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/a09bb938-2d90-42ae-986e-5a3e4abf9e77/8eb1e781-3494-4aa4-9405-268ca6473e4c/IN-en-20231113-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] border-gray-800">
      <div className="bg-black bg-opacity-70 h-[100vh]">
        <div className="flex items-center justify-between">
          <img
            src="https://rb.gy/ulxxee"
            alt="netflix"
            width={120}
            height={120}
            className="w-28 sm:w-36 lg:w-52 ml-4 sm:ml-8 pt-4"
            onClick={() => router.push("/")}
          />
          <div className="flex mr-4 sm:mr-10">
            <button
              onClick={() => signIn("github")}
              className="h-8 px-1 sm:px-4 m-2 text-white bg-[#e50914] rounded"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="h-[55vh] sm:h-[80vh] w-[90%] md:w-[80%] mx-[5%] md:mx-[10%] flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl sm:px-[15%] md:px-[15%] lg:mx-14 lg:px-[7%] xl:px-[15%] font-medium">
            Unlimited movies, TV shows, and more..
          </h1>
          <h2 className="text-lg sm:text-1xl lg:text-2xl font-medium m-2 sm:m-4">
            Watch anywhere. Cancel anytime.
          </h2>
          <div className="flex  justify-center">
            <button
              onClick={() => signIn("github")}
              className="bg-red-600 hover:bg-[#e50914] p-4 rounded"
            >
              Sign In to Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnauthPage() {
  const router = useRouter();
  const [showCurrentAns, setShowCurrentAns] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <main>
        <div className="bg-[#000000]">
          <UnauthBanner router={router} />
          <div className="border-b-8 border-gray-800 pb-8">
            <div className="flex flex-col h-[85vh] lg:h-[95vh] text-white px-8 sm:px-14 md:px-28 lg:px-48 xl:px-80 mt-3 sm:mt-14">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-bold text-center px-14 md:px-0 ">
                Frequently asked questions
              </h1>
              {FREQUENTLY_ASKED.map((item, index) => (
                <div className="flex flex-col gap-3" key={index}>
                  <div
                    onClick={() =>
                      setShowCurrentAns(showCurrentAns === index ? null : index)
                    }
                    className="flex justify-between p-3 lg:p-5 mt-2 bg-[#303030] cursor-pointer"
                  >
                    <h2>{item.ques}</h2>
                    <PlusIcon className="h-7 w-7 " color="white" />
                  </div>
                  {showCurrentAns === index && (
                    <div className=" p-3 lg:p-5 mt-2 bg-[#303030] cursor-pointer">
                      {item.ans}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
