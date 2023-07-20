import React, { useState } from "react";
import NotFound from "../component/NotFound";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../component/admin/Dashboard";
import Movies from "../component/admin/Movies";
import Actors from "../component/admin/Actors";
import Navbar from "../component/admin/Navbar";
import Header from "../component/admin/Header";
import MovieUpload from "../component/admin/MovieUpload";
import ActorUpload from "../component/modals/ActorUpload";
import SearchMovies from "../component/admin/SearchMovies";

export default function AdminNavigator() {
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
  const [showActorUploadModal, setShowActorUploadModal] = useState(false);

  const hideMovieUploadModal = () => {
    setShowMovieUploadModal(false);
  };

  const displayMovieUploadModal = () => {
    setShowMovieUploadModal(true);
  };

  const hideActorUploadModal = () => {
    setShowActorUploadModal(false);
  };

  const displayActorUploadModal = () => {
    setShowActorUploadModal(true);
  };

  return (
    <>
      <div className="flex dark:bg-primary bg-white">
        <Navbar />
        <div className="flex-1 max-w-screen-xl">
          <Header
            onAddMovieClick={displayMovieUploadModal}
            onAddActorClick={displayActorUploadModal}
          />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/search" element={<SearchMovies/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <MovieUpload
        visible={showMovieUploadModal}
        onClose={hideMovieUploadModal}
      />
      <ActorUpload
        visible={showActorUploadModal}
        onClose={hideActorUploadModal}
      />
    </>
  );
}
