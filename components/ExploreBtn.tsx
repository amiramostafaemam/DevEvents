"use client";

import Image from "next/image";
import Link from "next/link";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto">
      <Link href="/events">
        Explore Events
        <Image
          src="/icons/arrow-diagonalup.svg"
          alt="Arrow Up Icon"
          width={24}
          height={24}
        />
      </Link>
    </button>
  );
};

export default ExploreBtn;
