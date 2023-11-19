"use client";

import { motion } from "framer-motion";
import Head from "next/head";
import NavBar from "../navbar";
import MediaRow from "../media-row";
import Banner from "../banner";

export default function Common({ mediaData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>Netflix Clone</title>
      </Head>
      <>
        <NavBar />
        <div className="relative pl-4 pb-24 lg:space-y-24">
          <Banner medias={mediaData?.length > 0 ? mediaData[0].medias : []} />
          <section className="md:space-y-16">
            {mediaData?.length > 0
              ? mediaData.map((item) => (
                  <MediaRow title={item.title} medias={item.medias} />
                ))
              : null}
          </section>
        </div>
      </>
    </motion.div>
  );
}
