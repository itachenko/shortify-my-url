export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (origin === process.env.SITE_URL) {
      return callback(null, true);
    } else {
      const msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
  },
};
