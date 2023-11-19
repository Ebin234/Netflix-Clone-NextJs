"use client";

import CircleLoader from "@/components/circle-loader";
import ManageAccounts from "@/components/manage-accounts";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllFavorites, getTvorMovieSearchResults } from "@/utils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/navbar";
import MediaItem from "@/components/media-item";

export default function Search() {
  const {
    loggedInAccount,
    searchResults,
    setSearchResults,
    pageLoader,
    setPageLoader,
  } = useContext(GlobalContext);

  const { data: session } = useSession();
  const params = useParams();

  useEffect(() => {
    async function getSearchResults() {
      const tvShows = await getTvorMovieSearchResults("tv", params.query);
      const movies = await getTvorMovieSearchResults("movie", params.query);
      const favorites = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );

      setSearchResults([
        ...tvShows
          .filter(
            (item) => item.backdrop_path !== null && item.poster_path !== null
          )
          .map((tvShowItem) => ({
            ...tvShowItem,
            type: "tv",
            addedToFavorites:
              favorites?.length > 0
                ? favorites.map((fav) => fav.movieID).indexOf(tvShowItem.id) >
                  -1
                : false,
          })),
        ...movies
          .filter(
            (item) => item.backdrop_path !== null && item.poster_path !== null
          )
          .map((movieItem) => ({
            ...movieItem,
            type: "movie",
            addedToFavorites:
              favorites?.length > 0
                ? favorites.map((fav) => fav.movieID).indexOf(movieItem.id) > 
                  -1
                : false,
          })),
      ]);

      setPageLoader(false);
    }
    getSearchResults();
  }, [loggedInAccount]);

  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <NavBar />
      <div className="mt-[100px] space-y-0.5 md:space-y-2 px-4">
        <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white  md:text-2xl">
          Showing Results for {decodeURI(params.query)}
        </h2>
        <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
          {searchResults?.length > 0 
            ? searchResults.map((item) => (
                <MediaItem key={item._id} media={item} searchView={true} />
              ))
            : null}
        </div>
      </div>
    </motion.div>
  );
}
