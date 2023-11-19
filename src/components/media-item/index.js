"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/context";
import { useSession } from "next-auth/react";
import { getAllFavorites } from "@/utils";
import {TMDB_IMAGE_BASE_URL} from "@/utils/constants"

export default function MediaItem({
  media,
  searchView = false,
  similarMediaViews = false,
  listView = false,
  title,
}) {
  const {
    setShowDetailsPopup,
    setCurrentMediaInfoIdAndType,
    loggedInAccount,
    setFavorites,
    similarMedias,
    setSimilarMedias,
    searchResults,
    setSearchResults,
    mediaData,
    setMediaData,
  } = useContext(GlobalContext);
  const router = useRouter();
  const pathName = usePathname();

  const { data: session } = useSession();

  async function updateFavorites() {
    const res = await getAllFavorites(session?.user?.uid, loggedInAccount?._id);
    
    if (res)
      setFavorites(
        res.map((item) => ({
          ...item,
          addedToFavorites: true,
        }))
      );
  }

  async function handleAddToFavorites(item) {
    const { backdrop_path, poster_path, id, type } = item;
    const res = await fetch("/api/favorites/add-favorites", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        backdrop_path,
        poster_path,
        movieID: id,
        type,
        uid: session?.user?.uid,
        accountID: loggedInAccount?._id,
      }),
    });
    const data = await res.json();

    if (data?.success) {
      if (pathName.includes("my-list")) updateFavorites();
      if (searchView) {
        let updatedSearchResults = [...searchResults];
        const indexOfCurrentAddedMedia = updatedSearchResults.findIndex(
          (item) => item.id === id
        );

        updatedSearchResults[indexOfCurrentAddedMedia] = {
          ...updatedSearchResults[indexOfCurrentAddedMedia],
          addedToFavorites: true,
        };

        setSearchResults(updatedSearchResults);
      } else if (similarMediaViews) {
        let updatedSimilarMedias = [...similarMedias];
        const indexOfCurrentAddedMedia = updatedSimilarMedias.findIndex(
          (item) => item.id === id
        );

        updatedSimilarMedias[indexOfCurrentAddedMedia] = {
          ...updatedSimilarMedias[indexOfCurrentAddedMedia],
          addedToFavorites: true,
        };

        setSimilarMedias(updatedSimilarMedias);
      } else {
        let updatedMediaData = [...mediaData];
        const findIndexOfRowItem = updatedMediaData.findIndex(
          (item) => item.title === title
        );

        let currentMovieArrayFromRowItem =
          updatedMediaData[findIndexOfRowItem]?.medias;
        const findIndexOfCurrentMovie = currentMovieArrayFromRowItem.findIndex(
          (item) => item.id === id
        );

        currentMovieArrayFromRowItem[findIndexOfCurrentMovie] = {
          ...currentMovieArrayFromRowItem[findIndexOfCurrentMovie],
          addedToFavorites: true,
        };
        setMediaData(updatedMediaData);
      }
    }
  }
  async function handleRemoveFavorites(item) {
    const res = await fetch(`/api/favorites/remove-favorite?id=${item._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) updateFavorites();
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <div className="relative cardWrapper h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[260px] transform transition duration-500 hover:scale-110 hover:z-[999]">
        <Image
          src={`${TMDB_IMAGE_BASE_URL}w500${media.backdrop_path || media?.poster_path}`}
          alt="Media"
          layout="fill"
          className="rounded sm object-cover hover:rounded-sm"
          onClick={() => {
            router.push(`/watch/${media?.type}/${listView ? media?.movieID : media?.id}`);
          }}
        />
        <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
          <button
            onClick={
              media?.addedToFavorites
                ? listView
                  ? () => handleRemoveFavorites(media)
                  : null
                : () => handleAddToFavorites(media)
            }
            className={`${
              media?.addedToFavorites && !listView && "cursor-not-allowed"
            } cursor-pointer border flex p-2 items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75 text-black`}
          >
            {media?.addedToFavorites ? (
              <CheckIcon color="#ffffff" className="h-7 w-7" />
            ) : (
              <PlusIcon color="#ffffff" className="h-7 w-7" />
            )}
          </button>
          <button
            onClick={() => {
              setShowDetailsPopup(true);
              setCurrentMediaInfoIdAndType({
                type: media?.type,
                id: listView ? media?.movieID : media?.id,
              });
            }}
            className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75"
          >
            <ChevronDownIcon color="#ffffff" className="h-7 w-7" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
