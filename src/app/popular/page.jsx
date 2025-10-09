// src/app/popular/page.jsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Navbar1 from "@/components/ui/nav-bar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AuthModal from "@/components/ui/auth-modal";

const POPULAR_MOVIES = [
  { id: 101, title: "Oppenheimer", year: 2023, rating: 9.0 },
  { id: 102, title: "Barbie", year: 2023, rating: 7.5 },
  { id: 103, title: "Avatar: The Way of Water", year: 2022, rating: 8.1 },
  { id: 303, title: "Mission: Impossible — Dead Reckoning Part One", year: 2023, rating: 7.9 },
  { id: 304, title: "Spider‑Man: Across the Spider‑Verse", year: 2023, rating: 8.4 },
  { id: 305, title: "Guardians of the Galaxy Vol. 3", year: 2023, rating: 8.0 },
  { id: 401, title: "Joker", year: 2019, rating: 8.4 },
  { id: 402, title: "Dune", year: 2021, rating: 8.1 },
  { id: 403, title: "Her", year: 2013, rating: 8.0 },
  { id: 404, title: "Soul", year: 2020, rating: 8.1 },
  { id: 405, title: "Nope", year: 2022, rating: 7.0 },
  { id: 406, title: "Lucy", year: 2014, rating: 6.4 },
  { id: 407, title: "Moon", year: 2009, rating: 7.8 },
  { id: 408, title: "X", year: 2022, rating: 6.6 },
  { id: 409, title: "Beau", year: 2023, rating: 7.1 },
  { id: 410, title: "Tusk", year: 2014, rating: 5.3 },


];

const OMDB_API_KEY = "71ba95f";

export default function PopularPage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [visible, setVisible] = useState(false);


  <div className="flex justify-end p-4">
        <AuthModal />
      </div>
  // Enrich movie posters on mount
  useEffect(() => {
    async function fetchPosters() {
      const enriched = await Promise.all(
        POPULAR_MOVIES.map(async (movie) => {
          try {
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
                movie.title
              )}&y=${movie.year}&type=movie`
            );
            const data = await res.json();
            return {
              ...movie,
              Poster: data.Poster !== "N/A" ? data.Poster : null,
              imdbID: data.imdbID || null,
              imdbRating: data.imdbRating || movie.rating,
            };
          } catch {
            return { ...movie, Poster: null };
          }
        })
      );

      setMovies(enriched);
      setVisible(true);
    }

    fetchPosters();
  }, []);

  // Handle movie search
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`
      );
      const data = await res.json();

      if (data.Response === "True") {
        const searchWithPosters = await Promise.all(
          data.Search.map(async (item) => {
            if (item.Poster !== "N/A") return item;

            const detailRes = await fetch(
              `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${item.imdbID}`
            );
            const detailData = await detailRes.json();
            return {
              ...item,
              Poster: detailData.Poster !== "N/A" ? detailData.Poster : null,
              imdbRating: detailData.imdbRating || null,
            };
          })
        );
        setSearchResults(searchWithPosters);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const moviesToShow = useMemo(() => {
    return searchResults.length > 0 ? searchResults : movies;
  }, [searchResults, movies]);

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

      <main className="pt-28 min-h-screen bg-gradient-to-b from-gray-400 via-gray-900 to-gray-800 text-slate-900">
        <section className="max-w-6xl mx-auto px-6 text-center py-10">
          <h1 className="text-5xl font-extrabold mb-3 text-white">Popular Movies 🍿</h1>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              className="w-full sm:w-80 bg-white text-slate-900"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isSearching} className="bg-indigo-600 text-white">
                {isSearching ? "Searching..." : "Search"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setSearchResults([])}>
                Clear
              </Button>
            </div>
          </form>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {moviesToShow.map((movie, idx) => {
              const title = movie.Title ?? movie.title;
              const year = movie.Year ?? movie.year;
              const rating = movie.imdbRating ?? movie.rating;
              const poster = movie.Poster;

              return (
                <Card key={movie.imdbID ?? movie.id} className={`transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                  <div className="h-44 bg-slate-100 flex items-center justify-center">
                    {poster ? (
                      <img src={poster} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm">{year}</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm text-slate-600">{year} {rating ? `• ⭐ ${rating}` : ""}</p>
                    <div className="mt-4 flex">
                      {movie.imdbID ? (
                        <a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noreferrer" className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white text-center">
                          Watch (IMDB)
                        </a>
                      ) : (
                        <Link href={`/movie/${movie.id}?from=popular`} className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white text-center">
                          Watch
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {moviesToShow.length === 0 && <div className="mt-8 text-center text-white">No movies found.</div>}
        </section>
      </main>
    </>
  );
}
