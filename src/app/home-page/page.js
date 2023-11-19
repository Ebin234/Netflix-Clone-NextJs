"use client";

import CircleLoader from "@/components/circle-loader";
import Common from "@/components/common";
import ManageAccounts from "@/components/manage-accounts";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import {
  getAllFavorites,
  getPopularMedias,
  getTopratedMedias,
  getTrendingMedias,
} from "@/utils";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";

export default function HomePage() {
  const {
    loggedInAccount,
    mediaData,
    setMediaData,
    pageLoader,
    setPageLoader,
  } = useContext(GlobalContext);
  const { data: session } = useSession();

  useEffect(() => {
    async function getAllMedias() {
      const trendingTvShows = await getTrendingMedias("tv");
      const popularTvShows = await getPopularMedias("tv");
      const topratedTvShows = await getTopratedMedias("tv");

      const trendingMovies = await getTrendingMedias("movie");
      const popularMovies = await getPopularMedias("movie");
      const topratedMovies = await getTopratedMedias("movie");
      const favorites = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );
      setMediaData([
        ...[
          {
            title: "Trending TV Shows",
            medias: trendingTvShows,
          },
          {
            title: "Popular TV Shows",
            medias: popularTvShows,
          },
          {
            title: "Top rated TV Shows",
            medias: topratedTvShows,
          },
        ].map((item) => ({
          ...item,
          medias: item?.medias?.map((mediaItem) => ({
            ...mediaItem,
            type: "tv",
            addedToFavorites:
              favorites?.length > 0
                ? favorites.map((fav) => fav.movieID).indexOf(mediaItem.id) >
                  -1
                : false,
          })),
        })),
        ...[
          {
            title: "Trending Movies",
            medias: trendingMovies,
          },
          {
            title: "Popular Movies",
            medias: popularMovies,
          },
          {
            title: "Top rated Movies",
            medias: topratedMovies,
          },
        ].map((item) => ({
          ...item,
          medias: item?.medias?.map((mediaItem) => ({
            ...mediaItem,
            type: "movie",
            addedToFavorites:
              favorites?.length > 0
                ? favorites.map((fav) => fav.movieID).indexOf(mediaItem.id) >
                  -1
                : false,
          })),
        })),
      ]);

      setPageLoader(false);
    }

    getAllMedias();
  }, []);

  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  return (
    <main className="flex min-h-screen flex-col">
      <Common mediaData={mediaData} />
    </main>
  );
}
