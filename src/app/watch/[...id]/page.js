"use client";

import CircleLoader from "@/components/circle-loader";
import { GlobalContext } from "@/context";
import { getTvorMoviesVideosByID } from "@/utils";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import {YOUTUBE_BASE_URL} from "../../../utils/constants"

export default function Watch() {
  const params = useParams();
  const { pageLoader, setPageLoader } = useContext(GlobalContext);

  const [mediaDetails, setMediaDetails] = useState(null);
  const [key, setKey] = useState(null);

  useEffect(() => {
    async function getMediaDetails() {
      const extractMediaDetails = await getTvorMoviesVideosByID(
        params.id[0],
        params.id[1]
      );

      if (extractMediaDetails) {
        const findIndexOfTrailer = extractMediaDetails?.results?.findIndex(
          (item) => item.type === "Trailer"
        );
        const findIndexOfClip = extractMediaDetails?.results?.findIndex(
          (item) => item.type === "Clip"
        );

        setMediaDetails(extractMediaDetails);
        setKey(
          findIndexOfTrailer !== -1
            ? extractMediaDetails.results[findIndexOfTrailer]?.key
            : findIndexOfClip !== -1
            ? extractMediaDetails.results[findIndexOfClip]?.key
            : "wYmtRhKvmVE"
        );
        setPageLoader(false);
      }
    }

    getMediaDetails();
  }, [params]);

  if (pageLoader && mediaDetails === null) return <CircleLoader />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <ReactPlayer
        url={YOUTUBE_BASE_URL+key}
        width={"100%"}
        height={"100%"}
        style={{ position: "absolute", top: "0", left: "0" }}
        playing
        controls
      />
    </motion.div>
  );
}
