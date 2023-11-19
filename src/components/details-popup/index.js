"use client";

import { motion } from "framer-motion";
import MuiModal from "@mui/material/Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "@/context";
import {
  getAllFavorites,
  getSimilarTvorMovies,
  getTvorMoviesDetailsByID,
} from "@/utils";
import ReactPlayer from "react-player";
import MediaItem from "../media-item";
import { AiFillPlayCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { YOUTUBE_BASE_URL } from "@/utils/constants";

export default function DetailsPopup({ show, setShow }) {
  const {
    mediaDetails,
    setMediaDetails,
    similarMedias,
    setSimilarMedias,
    currentMediaInfoIdAndType,
    setCurrentMediaInfoIdAndType,
    loggedInAccount,
  } = useContext(GlobalContext);

  const router = useRouter();
  const { data: session } = useSession();
  const [key, setKey] = useState("");

  function handleClose() {
    setShow(close);
    setCurrentMediaInfoIdAndType(null);
  }

  useEffect(() => {
    if (currentMediaInfoIdAndType !== null) {
      async function getMediaDetails() {
        const extractMediaDetails = await getTvorMoviesDetailsByID(
          currentMediaInfoIdAndType?.type,
          currentMediaInfoIdAndType?.id
        );
        const extractSimilarMovies = await getSimilarTvorMovies(
          currentMediaInfoIdAndType?.type,
          currentMediaInfoIdAndType?.id
        );

        const favorites = await getAllFavorites(
          session?.user?.uid,
          loggedInAccount?._id
        );

        const findIndexOfTrailer =
          // extractMediaDetails &&
          // extractMediaDetails.videos &&
          // extractMediaDetails?.videos?.results &&
          extractMediaDetails?.videos?.results?.findIndex(
            (item) => item.type === "Trailer"
          );
        const findIndexOfClip =
          // extractMediaDetails &&
          // extractMediaDetails.videos &&
          // extractMediaDetails?.videos?.results &&
          extractMediaDetails?.videos?.results?.findIndex(
            (item) => item.type === "Clip"
          );

        setMediaDetails(extractMediaDetails);
        setKey(
          findIndexOfTrailer !== -1
            ? extractMediaDetails.videos?.results[findIndexOfTrailer]?.key
            : findIndexOfClip !== -1
            ? extractMediaDetails.videos?.results[findIndexOfClip]?.key
            : "wYmtRhKvmVE"
        );
        setSimilarMedias(
          extractSimilarMovies.map((item) => ({
            ...item,
            type: currentMediaInfoIdAndType?.type === "movie" ? "movie" : "tv",
            addedToFavorites:
              favorites?.length > 0
                ? favorites.map((fav) => fav.movieID).indexOf(item.id) > -1
                : false,
          }))
        );
      }
      getMediaDetails();
    }
  }, [currentMediaInfoIdAndType, loggedInAccount]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <MuiModal
        open={show}
        onClose={handleClose}
        className="fixed !top-7 left-0 right-0 z-50 w-full mx-auto max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <div>
          <button
            onClick={handleClose}
            className="modalButton flex items-center justify-center absolute top-5 right-5 bg-[#181818] hover:bg-[#181818] !z-40 border-none h-9 w-9"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              url={YOUTUBE_BASE_URL + key}
              width={"100%"}
              height={"100%"}
              style={{ position: "absolute", top: "0", left: "0" }}
              playing
              controls
            />
            <div className="absolute bottom-[4.25rem] flex w-full items-center justify-between pl-[1.5rem]">
              <div>
                <button
                  onClick={() =>
                    router.push(
                      `/watch/${currentMediaInfoIdAndType?.type}/${currentMediaInfoIdAndType?.id}`
                    )
                  }
                  className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black"
                >
                  <AiFillPlayCircle className="h-4 w-4 text-black md:h-7 md:w-7 cursor-pointer" />
                  play
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-b-md bg-[#181818] p-8">
            <div className="space-x-2 pb-4 flex gap-4">
              <div className="text-green-400 font-semibold flex gap-2">
                <span>
                  {mediaDetails?.release_date
                    ? mediaDetails?.release_date.split("-")[0]
                    : "2023"}
                </span>
                <div className="inline-flex border-2 border-white/40 rounded px-2">
                  HD
                </div>
              </div>
            </div>
            <h2 className=" mt-10 mb-6 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white  md:text-2xl">
              More Like This
            </h2>
            <div className="grid grid-col-5 gap-3 items-center scrollbar-hide md:p-2">
              {similarMedias?.length > 0
                ? similarMedias
                    .filter(
                      (item) =>
                        item.backdrop_path !== null && item.poster_path !== null
                    )
                    .map((mediaItem) => (
                      <MediaItem
                        key={mediaItem.id}
                        media={mediaItem}
                        similarMediaViews={true}
                      />
                    ))
                : null}
            </div>
          </div>
        </div>
      </MuiModal>
    </motion.div>
  );
}
