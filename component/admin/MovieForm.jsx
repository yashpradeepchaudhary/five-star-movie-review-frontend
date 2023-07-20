import React, { useEffect, useState } from "react";
import TagsInput from "../TagsInput";
import { commonInputClasses } from "../../utils/theme";

import Submit from "../form/Submit";
import { useNotification } from "../../hooks";

import WritersModal from "../modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
import { resetPassword } from "../../api/auth";
import DirectorSelector from "../DirectorSelector";
import Label from "../Label";
import WriterSelector from "../WriterSelector";
import ViewAllBtn from "../ViewAllButton";
import LabelWithBadge from "../LabelWithBadge";
import { validateMovie } from "../../utils/validator";

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

export default function MovieForm({ busy, btnTitle, initialState, onSubmit }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");
  const [showGenresModal, setShowGenresModal] = useState(false);

  const { updateNotification } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification("error", error);

    // cast, tags, genres, writers
    const { tags, genres, cast, writers, director, poster } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,
    };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    // {
    //   actor: { type: mongoose.Schema.Types.ObjectId, ref: "Actor" },
    //   roleAs: String,
    //   leadActor: Boolean,
    // },

    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    if (director.id) finalMovieInfo.director = director.id;
    if (poster) finalMovieInfo.poster = poster;

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === "poster") {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };

  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is already selected!"
        );
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter(({ id }) => id !== profileId);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        releseDate: initialState.releseDate.split("T")[0],
        poster: null,
      });
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState]);

  const {
    title,
    storyLine,
    writers,
    cast,
    tags,
    releseDate,
    genres,
    type,
    language,
    status,
  } = movieInfo;

  return (
    <>
      <div onSubmit={handleSubmit} className="flex space-x-3">
        <div className="w-[70%] space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              value={title}
              onChange={handleChange}
              name="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
              placeholder="Titanic"
            />
          </div>

          <div>
            <Label htmlFor="storyLine">Story line</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              className={commonInputClasses + " border-b-2 resize-none h-24"}
              placeholder="Movie storyline..."
            ></textarea>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>

          <DirectorSelector onSelect={updateDirector} />

          <div className="">
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>
            <WriterSelector onSelect={updateWriters} />
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>

          <input
            type="date"
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
            onChange={handleChange}
            name="releseDate"
            value={releseDate}
          />

          <Submit
            busy={busy}
            value={btnTitle}
            onClick={handleSubmit}
            type="button"
          />
        </div>
        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            lable="Select poster"
            accept="image/jpg, image/jpeg, image/png"
          />
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />

          <Selector
            onChange={handleChange}
            name="type"
            value={type}
            options={typeOptions}
            label="Type"
          />
          <Selector
            onChange={handleChange}
            name="language"
            value={language}
            options={languageOptions}
            label="Language"
          />
          <Selector
            onChange={handleChange}
            name="status"
            value={status}
            options={statusOptions}
            label="Status"
          />
        </div>
      </div>

      <WritersModal
        onClose={hideWritersModal}
        visible={showWritersModal}
        profiles={writers}
        onRemoveClick={handleWriterRemove}
      />

      <CastModal
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
        onRemoveClick={handleCastRemove}
      />
      <GenresModal
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
        previousSelection={genres}
      />
    </>
  );
}  









// const defaultMovieInfo = {
//   title: "",
//   storyLine: "",
//   tags: [],
//   cast: [],
//   director: {},
//   writers: [],
//   releseDate: "",
//   poster: null,
//   genres: [],
//   type: "",
//   language: "",
//   status: "",
// };

// export default function MovieForm({onSubmit ,btnTitle, initialState, busy }) {
//   const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
//   const [showWritersModal, setShowWritersModal] = useState(false);
//   const [showCastModal, setShowCastModal] = useState(false);
//   const [selectedPosterForUI, setSelectedPosterForUI] = useState("");
//   const [showGenresModal, setShowGenresModal] = useState(false);

//   const { updateNotification } = useNotification();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { error } = validateMovie(movieInfo);
//     if (error) return updateNotification("error", error);

//     // cast, tags, genres, writers
//     const { tags, genres, cast, writers, director, poster } = movieInfo;

//     const formData = new FormData();
//     const finalMovieInfo = {
//       ...movieInfo,
//     };

//     finalMovieInfo.tags = JSON.stringify(tags);
//     finalMovieInfo.genres = JSON.stringify(genres);

//     // {
//     //   actor: { type: mongoose.Schema.Types.ObjectId, ref: "Actor" },
//     //   roleAs: String,
//     //   leadActor: Boolean,
//     // },

//     const finalCast = cast.map((c) => ({
//       actor: c.profile.id,
//       roleAs: c.roleAs,
//       leadActor: c.leadActor,
//     }));
//     finalMovieInfo.cast = JSON.stringify(finalCast);

//     if (writers.length) {
//       const finalWriters = writers.map((w) => w.id);
//       finalMovieInfo.writers = JSON.stringify(finalWriters);
//     }

//     if (director.id) finalMovieInfo.director = director.id;
//     if (poster) finalMovieInfo.poster = poster;

//     for (let key in finalMovieInfo) {
//       formData.append(key, finalMovieInfo[key]);
//     }

//     onSubmit(formData);
//   };

//   const updatePosterForUI = (file) => {
//     const url = URL.createObjectURL(file);
//     setSelectedPosterForUI(url);
//   };

//   const handleChange = ({ target }) => {
//     const { value, name, files } = target;
//     if (name === "poster") {
//       const poster = files[0];
//       updatePosterForUI(poster);
//       return setMovieInfo({ ...movieInfo, poster });
//     }

//     setMovieInfo({ ...movieInfo, [name]: value });
//   };

//   const updateTags = (tags) => {
//     setMovieInfo({ ...movieInfo, tags });
//   };

//   const updateDirector = (profile) => {
//     setMovieInfo({ ...movieInfo, director: profile });
//   };

//   const updateCast = (castInfo) => {
//     const { cast } = movieInfo;
//     setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
//   };

//   const updateGenres = (genres) => {
//     setMovieInfo({ ...movieInfo, genres });
//   };

//   const updateWriters = (profile) => {
//     const { writers } = movieInfo;
//     for (let writer of writers) {
//       if (writer.id === profile.id) {
//         return updateNotification(
//           "warning",
//           "This profile is already selected!"
//         );
//       }
//     }
//     setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
//   };

//   const hideWritersModal = () => {
//     setShowWritersModal(false);
//   };

//   const displayWritersModal = () => {
//     setShowWritersModal(true);
//   };

//   const hideCastModal = () => {
//     setShowCastModal(false);
//   };

//   const displayCastModal = () => {
//     setShowCastModal(true);
//   };

//   const hideGenresModal = () => {
//     setShowGenresModal(false);
//   };

//   const displayGenresModal = () => {
//     setShowGenresModal(true);
//   };

//   const handleWriterRemove = (profileId) => {
//     const { writers } = movieInfo;
//     const newWriters = writers.filter(({ id }) => id !== profileId);
//     if (!newWriters.length) hideWritersModal();
//     setMovieInfo({ ...movieInfo, writers: [...newWriters] });
//   };

//   const handleCastRemove = (profileId) => {
//     const { cast } = movieInfo;
//     const newCast = cast.filter(({ profile }) => profile.id !== profileId);
//     if (!newCast.length) hideCastModal();
//     setMovieInfo({ ...movieInfo, cast: [...newCast] });
//   };

//   useEffect(() => {
//     if (initialState) {
//       setMovieInfo({
//         ...initialState,
//         releseDate: initialState.releseDate.split("T")[0],
//         poster: null,
//       });
//       setSelectedPosterForUI(initialState.poster);
//     }
//   }, [initialState]);

//   const {
//     title,
//     storyLine,
//     writers,
//     cast,
//     tags,
//     genres,
//     type,
//     language,
//     status,
//     releseDate,
//   } = movieInfo;

//   return (
//     <>
//       <div onSubmit={handleSubmit} className="flex space-x-3">
//         <div className="w-[70%] space-y-5">
//           <div>
//             <Label htmlFor="title">Title</Label>
//             <input
//               id="title"
//               value={title}
//               onChange={handleChange}
//               name="title"
//               type="text"
//               className={
//                 commonInputClasses + " border-b-2 font-semibold text-xl"
//               }
//               placeholder="Titanic"
//             />
//           </div>

//           <div>
//             <Label htmlFor="storyLine">Story line</Label>
//             <textarea
//               value={storyLine}
//               onChange={handleChange}
//               name="storyLine"
//               id="storyLine"
//               className={commonInputClasses + " border-b-2 resize-none h-24"}
//               placeholder="Movie storyline..."
//             ></textarea>
//           </div>

//           <div>
//             <Label htmlFor="tags">Tags</Label>
//             <TagsInput value={tags} name="tags" onChange={updateTags} />
//           </div>

//           <DirectorSelector onSelect={updateDirector} />

//           <div className="">
//             <div className="flex justify-between">
//               <LabelWithBadge badge={writers.length} htmlFor="writers">
//                 Writers
//               </LabelWithBadge>
//               <ViewAllBtn
//                 onClick={displayWritersModal}
//                 visible={writers.length}
//               >
//                 View All
//               </ViewAllBtn>
//             </div>
//             <WriterSelector onSelect={updateWriters} />
//           </div>

//           <div>
//             <div className="flex justify-between">
//               <LabelWithBadge badge={cast.length}>
//                 Add Cast & Crew
//               </LabelWithBadge>
//               <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
//                 View All
//               </ViewAllBtn>
//             </div>
//             <CastForm onSubmit={updateCast} />
//           </div>

//           <input
//             type="date"
//             className={commonInputClasses + " border-2 rounded p-1 w-auto"}
//             onChange={handleChange}
//             name="releseDate"
//             value={releseDate}
//           />

//           <Submit
//             busy={busy}
//             value={btnTitle}
//             onClick={handleSubmit}
//             type="button"
//           />
//         </div>
//         <div className="w-[30%] space-y-5">
//           <PosterSelector
//             name="poster"
//             onChange={handleChange}
//             selectedPoster={selectedPosterForUI}
//             lable="Select poster"
//             accept="image/jpg, image/jpeg, image/png"
//           />
//           <GenresSelector badge={genres.length} onClick={displayGenresModal} />

//           <Selector
//             onChange={handleChange}
//             name="type"
//             value={type}
//             options={typeOptions}
//             label="Type"
//           />
//           <Selector
//             onChange={handleChange}
//             name="language"
//             value={language}
//             options={languageOptions}
//             label="Language"
//           />
//           <Selector
//             onChange={handleChange}
//             name="status"
//             value={status}
//             options={statusOptions}
//             label="Status"
//           />
//         </div>
//       </div>

//       <WritersModal
//         onClose={hideWritersModal}
//         visible={showWritersModal}
//         profiles={writers}
//         onRemoveClick={handleWriterRemove}
//       />

//       <CastModal
//         onClose={hideCastModal}
//         casts={cast}
//         visible={showCastModal}
//         onRemoveClick={handleCastRemove}
//       />
//       <GenresModal
//         onSubmit={updateGenres}
//         visible={showGenresModal}
//         onClose={hideGenresModal}
//         previousSelection={genres}
//       />
//     </>
//   );
// }














// exports.userValidtor = [
//   check("name").trim().not().isEmpty().withMessage("Name is missing!"),
//   check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
//   check("password")
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage("Password is missing!")
//     .isLength({ min: 8, max: 20 })
//     .withMessage("Password must be 8 to 20 characters long!"),
// ];

// exports.validatePassword = [
//   check("newPassword")
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage("Password is missing!")
//     .isLength({ min: 8, max: 20 })
//     .withMessage("Password must be 8 to 20 characters long!"),
// ];

// exports.signInValidator = [
//   check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
//   check("password").trim().not().isEmpty().withMessage("Password is missing!"),
// ];

// exports.actorInfoValidator = [
//   check("name").trim().not().isEmpty().withMessage("Actor name is missing!"),
//   check("about")
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage("About is a required field!"),
//   check("gender")
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage("Gender is a required field!"),
// ];

// exports.validateMovie = [
//   check("title").trim().not().isEmpty().withMessage("Movie title is missing!"),
//   check("storyLine")
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage("Storyline is important!"),
//   check("language").trim().not().isEmpty().withMessage("Language is missing!"),
//   check("releseDate").isDate().withMessage("Relese date is missing!"),
//   check("status")
//     .isIn(["public", "private"])
//     .withMessage("Movie status must be public or private!"),
//   check("type").trim().not().isEmpty().withMessage("Movie type is missing!"),
//   check("genres")
//     .isArray()
//     .withMessage("Genres must be an array of strings!")
//     .custom((value) => {
//       for (let g of value) {
//         if (!genres.includes(g)) throw Error("Invalid genres!");
//       }

//       return true;
//     }),
//   check("tags")
//     .isArray({ min: 1 })
//     .withMessage("Tags must be an array of strings!")
//     .custom((tags) => {
//       for (let tag of tags) {
//         if (typeof tag !== "string")
//           throw Error("Tags must be an array of strings!");
//       }

//       return true;
//     }),
//   check("cast")
//     .isArray()
//     .withMessage("Cast must be an array of objects!")
//     .custom((cast) => {
//       for (let c of cast) {
//         if (!isValidObjectId(c.actor))
//           throw Error("Invalid cast id inside cast!");
//         if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast!");
//         if (typeof c.leadActor !== "boolean")
//           throw Error(
//             "Only accepted boolean value inside leadActor inside cast!"
//           );
//       }

//       return true;
//     }),

//   // check("poster").custom((_, { req }) => {
//   //   if (!req.file) throw Error("Poster file is missing!");

//   //   return true;
//   // }),
// ];

// exports.validateTrailer = check("trailer")
//   .isObject()
//   .withMessage("trailer must be an object with url and public_id")
//   .custom(({ url, public_id }) => {
//     try {
//       const result = new URL(url);
//       if (!result.protocol.includes("http"))
//         throw Error("Trailer url is invalid!");

//       const arr = url.split("/");
//       const publicId = arr[arr.length - 1].split(".")[0];

//       if (public_id !== publicId) throw Error("Trailer public_id is invalid!");

//       return true;
//     } catch (error) {
//       throw Error("Trailer url is invalid!");
//     }
//   });

// exports.validate = (req, res, next) => {
//   const error = validationResult(req).array();
//   if (error.length) {
//     return res.json({ error: error[0].msg });
//   }

//   next();
// };


