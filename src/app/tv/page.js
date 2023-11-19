"use client";

import CircleLoader from "@/components/circle-loader";
import Common from "@/components/common";
import ManageAccounts from "@/components/manage-accounts";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllFavorites, getTvorMoviesByGenre } from "@/utils";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";

export default function Tv() {
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
      const actionAdventure = await getTvorMoviesByGenre("tv", 10759);
      const crime = await getTvorMoviesByGenre("tv", 80);
      const comedy = await getTvorMoviesByGenre("tv", 35);
      const family = await getTvorMoviesByGenre("tv", 10751);
      const mystery = await getTvorMoviesByGenre("tv", 9648);
      const reality = await getTvorMoviesByGenre("tv", 10764);
      const scifiAndFantasy = await getTvorMoviesByGenre("tv", 10765);
      const war = await getTvorMoviesByGenre("tv", 10768);
      const western = await getTvorMoviesByGenre("tv", 37);
      const dramaMovies = await getTvorMoviesByGenre("tv", 18);
      const favorites = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );

      setMediaData(
        [
          {
            title: "Action and Adventure",
            medias: actionAdventure,
          },
          {
            title: "Crime",
            medias: crime,
          },
          {
            title: "Comedy",
            medias: comedy,
          },
          {
            title: "Family",
            medias: family,
          },
          {
            title: "Mystery",
            medias: mystery,
          },
          {
            title: "Reality",
            medias: reality,
          },
          {
            title: "Sci-Fi and Fantasy",
            medias: scifiAndFantasy,
          },
          {
            title: "Western",
            medias: western,
          },
          {
            title: "War",
            medias: war,
          },
          {
            title: "Dramas",
            medias: dramaMovies,
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
        }))
      );
      setPageLoader(false);
    }
    getAllMedias();
  }, [loggedInAccount]);

  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  return (
    <main className="flex min-h-screen flex-col">
      <Common mediaData={mediaData} />
    </main>
  );
}
