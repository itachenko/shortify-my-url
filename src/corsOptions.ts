var allowlist = [process.env.SITE_URL, process.env.CLIENT_URL_LOCAL];

export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowlist.includes(origin)) {
      return callback(null, true);
    } else {
      const msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
  },
};
