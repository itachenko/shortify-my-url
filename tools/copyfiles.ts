import ncp from "ncp";
import { join } from "path";
import * as fs from "fs";

interface ICopyConfiguration {
  source: string;
  target: string;
}

const toCopy: ICopyConfiguration[] = [
  { source: "../src/views", target: "../build/views" },
  { source: "../src/public", target: "../build/public" },
];

toCopy.forEach(async (copyConf: ICopyConfiguration) => {
  try {
    await fs.promises.mkdir(join(__dirname, copyConf.target), {
      recursive: true,
    });
  } catch (error) {
    console.error(
      `Failed to create [${copyConf.target}] directory.\nReason: ${error}`
    );
  }

  ncp(
    join(__dirname, copyConf.source),
    join(__dirname, copyConf.target),
    (error) => {
      if (error) console.error(`Failed to copy.\nReason: ${error}`);
    }
  );
});
