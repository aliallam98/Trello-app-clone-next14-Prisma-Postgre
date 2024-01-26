import { createApi } from "unsplash-js";


const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY ! || "dufx_PzyvEGTKGAqhk_ieYh5OE_z_rXn0ut20bZCivA",
  fetch: fetch,
});

export default unsplash