export const validateMovie = (movieInfo) => {
    const {
      title,
      storyLine,
      language,
      releseDate,
      status,
      type,
      genres,
      tags,
      cast,
    } = movieInfo;
  
    if (!title.trim()) return { error: "Title is missing!" };
    if (!storyLine.trim()) return { error: "Story line is missing!" };
    if (!language.trim()) return { error: "Language is missing!" };
    if (!releseDate.trim()) return { error: "Relese date is missing!" };
    if (!status.trim()) return { error: "Status is missing!" };
    if (!type.trim()) return { error: "Type is missing!" };
  
    // validation for genres , we are checking if genres is an or array or not
    // if(!genres.length) return {error:"Genres are missing!"}
    if (!genres.length) return { error: "Genres are missing!" };
    // here we are checking genres is a string field
    for (let gen of genres) {
      // if(typeof gen !== 'string') return {error: "Invalid genres!"}
      if (!gen.trim()) return { error: "Invalid genres!" };
    }
  
    // validation for tags, we are checking if genres is an or array or not
    if (!tags.length) return { error: "Tags are missing!" };
    // here we are checking tags is a string field
    for (let tag of tags) {
      if (!tag.trim()) return { error: "Invalid tags!" };
    }
  
    // validation for cast, we are checking if genres is an or array or not
    if (!cast.length) return { error: "Cast and crew are missing!" };
    // here we are checking cast is a string field
    for (let c of cast) {
      if (typeof c !== "object") return { error: "Invalid cast!" };
    }
  
    return { error: null };
  };