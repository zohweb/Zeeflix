// src/app/home/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Navbar1 from "@/components/ui/nav-bar";
import Link from "next/link";
import AuthModal from "@/components/ui/auth-modal";

const OMDB_API_KEY = "71ba95f";

const SAMPLE_MOVIES = [
  { id: 1, title: "3 Idiots", year: 2009, rating: 8.4 },
  { id: 2, title: "Dangal", year: 2016, rating: 8.3 },
  { id: 3, title: "Gully Boy", year: 2019, rating: 7.9 },
  { id: 4, title: "Lagaan", year: 2001, rating: 8.1 },
  { id: 5, title: "Zindagi Na Milegi Dobara", year: 2011, rating: 8.2 },
  { id: 6, title: "Chak De! India", year: 2007, rating: 8.2 },
  { id: 7, title: "Barfi!", year: 2012, rating: 8.1 },
  { id: 8, title: "Swades", year: 2004, rating: 8.2 },
  { id: 9, title: "Queen", year: 2013, rating: 8.1 },
  { id: 10, title: "Andhadhun", year: 2018, rating: 8.2 },
  { id: 11, title: "Drishyam", year: 2015, rating: 8.2 },
  { id: 12, title: "Article 15", year: 2019, rating: 8.0 },
  { id: 13, title: "Piku", year: 2015, rating: 7.6 },
  { id: 14, title: "Masaan", year: 2015, rating: 8.1 },
  { id: 15, title: "Pink", year: 2016, rating: 8.1 },
  { id: 16, title: "Bajrangi Bhaijaan", year: 2015, rating: 8.0 },
  { id: 17, title: "My Name Is Khan", year: 2010, rating: 7.9 },
  { id: 18, title: "Haider", year: 2014, rating: 7.4 },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState(SAMPLE_MOVIES);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");

   <div className="flex justify-end p-4">
        <AuthModal />
      </div>

  // enable mount animations
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  // fetch all posters in parallel (fast)
  useEffect(() => {
    async function fetchPosters() {
      try {
        const promises = SAMPLE_MOVIES.map(async (m) => {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
              m.title
            )}&y=${m.year}`
          );
          const data = await res.json();
          return {
            ...m,
            Poster: data?.Poster && data.Poster !== "N/A" ? data.Poster : null,
            imdbID: data?.imdbID || null,
          };
        });

        const enriched = await Promise.all(promises);
        setMovies(enriched);
      } catch (err) {
        console.error("Poster fetch failed:", err);
      }
    }

    fetchPosters();
  }, []);

  // handle search
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setSearchResults(data.Search);
      } else {
        setSearchResults([]);
        setError("No results found.");
      }
    } catch {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setSearchResults([]);
    setError("");
  }

  const anim = (i = 0) =>
    `${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} transition-all duration-300 ease-out`;

  const displayMovies = searchResults.length > 0 ? searchResults : movies;

  return (
    <>
      <Navbar1
        domainName="Zeeflix"
        navLinks={[
          { name: "Home", href: "/home" },
          { name: "Top List", href: "/top-list" },
          { name: "Popular", href: "/popular" },
        ]}
        authLinks={{ login: { text: "Login", href: "/login" } }}
      />

      <main className="pt-28 min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-800/20 via-cyan-700/10 to-purple-900/10 border border-white/10 backdrop-blur-md p-10 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Left */}
                <div className="flex-1">
                  <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300">
                      Zeeflix
                    </span>
                    <span className="ml-3 text-white/90">—</span>{" "}
                    <span className="ml-2 text-white">Find your next favorite movie</span>
                  </h1>
                  <p className="mt-4 text-lg text-neutral-300 max-w-2xl">
                    Discover and explore{" "}
                    <span className="text-cyan-300 font-semibold">Bollywood classics</span> and{" "}
                    <span className="text-cyan-300 font-semibold">new hits</span>.
                  </p>

                  {/* Search */}
                  <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-xl">
                    <div className="relative flex-1">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                      </svg>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search movies (e.g. Dangal)"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 placeholder:text-neutral-400 focus:ring-2 focus:ring-cyan-400 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-5 py-3 text-sm font-semibold shadow"
                      disabled={loading}
                    >
                      {loading ? "Searching..." : "Search"}
                    </button>
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-200 hover:bg-white/10"
                    >
                      Clear
                    </button>
                  </form>

                  {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                </div>

                {/* Right Tip */}
                <div className="w-full lg:w-72">
                  <div className="rounded-xl bg-gradient-to-br from-teal-700/20 to-purple-800/18 border border-white/10 p-4 shadow-md">
                    <h4 className="text-sm text-neutral-200 font-semibold">Pro Tip</h4>
                    <p className="mt-2 text-sm text-neutral-300">
                      Try searching for <span className="text-cyan-300 font-medium">Dangal</span> or{" "}
                      <span className="text-cyan-300 font-medium">3 Idiots</span>.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/popular"
                        className="inline-block rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
                      >
                        See Popular →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Movie Grid */}
        <section className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {displayMovies.map((m, i) => (
            <article
              key={m.imdbID ?? m.id}
              style={{ transitionDelay: `${i * 50}ms` }}
              className={`${anim(i)} bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:scale-[1.02] transition-transform`}
            >
              {m.Poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.Poster} alt={m.title || m.Title} className="w-full h-52 object-cover rounded-md mb-3" />
              ) : (
                <div className="w-full h-52 bg-neutral-800 flex items-center justify-center text-neutral-400 rounded-md mb-3">
                  <div className="text-center">
                    <div className="font-semibold text-white">{m.title || m.Title}</div>
                    <div className="text-sm">{m.year || m.Year}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white truncate">{m.title || m.Title}</h3>
                  <p className="text-sm text-neutral-400">{m.year || m.Year}</p>
                </div>
                <div className="text-cyan-300 font-semibold">⭐ {m.rating || ""}</div>
              </div>

              {m.imdbID && (
                <div className="mt-3">
                  <Link
                    href={`https://www.imdb.com/title/${m.imdbID}`}
                    target="_blank"
                    className="text-xs text-indigo-300 hover:text-indigo-200"
                  >
                    IMDb
                  </Link>
                </div>
              )}
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
