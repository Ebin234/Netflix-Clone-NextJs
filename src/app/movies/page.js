"use client";

import CircleLoader from "@/components/circle-loader";
import ManageAccounts from "@/components/manage-accounts";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllFavorites } from "@/utils";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import {getTvorMoviesByGenre} from "@/utils/index"
import Common from "@/components/common";

export default function Movies() {
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
      const action = await getTvorMoviesByGenre("movie", 28);
      const adventure = await getTvorMoviesByGenre("movie", 12);
      const crime = await getTvorMoviesByGenre("movie", 80);
      const comedy = await getTvorMoviesByGenre("movie", 35);
      const family = await getTvorMoviesByGenre("movie", 10751);
      const mystery = await getTvorMoviesByGenre("movie", 9648);
      const romance = await getTvorMoviesByGenre("movie", 10749);
      const scifiAndFantasy = await getTvorMoviesByGenre("movie", 878);
      const war = await getTvorMoviesByGenre("movie", 10752);
      const history = await getTvorMoviesByGenre("movie", 36);
      const drama = await getTvorMoviesByGenre("movie", 18);
      const thriller = await getTvorMoviesByGenre("movie", 53);
      const horror = await getTvorMoviesByGenre("movie", 27);
      const favorites = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );

      setMediaData(
        [
          {
            title: "Action",
            medias: action,
          },
          {
            title: "Adventure",
            medias: adventure,
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
            title: "Romance",
            medias: romance,
          },
          {
            title: "Sci-Fi and Fantasy",
            medias: scifiAndFantasy,
          },
          {
            title: "History",
            medias: history,
          },
          {
            title: "War",
            medias: war,
          },
          {
            title: "Dramas",
            medias: drama,
          },
          {
            title: "Thriller",
            medias: thriller,
          },
          {
            title: "Horror",
            medias: horror,
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
