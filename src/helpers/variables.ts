export function check(toChek: string[]):void {
  const missing: string[] = toChek
    .filter((value: string) => {
      if (!process.env[value]) return value;
    });

  const count = missing.length;
  if (count > 0)
    throw new Error(`Required ENV ${count > 1 ? "variables" : "variable"} ${missing} ${count > 1 ? "are" : "is"} not set.`);
}
