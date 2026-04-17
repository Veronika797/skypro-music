export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const inputSecond = Math.floor(time % 60);
  const outputSecond = inputSecond < 10 ? `0${inputSecond}` : `${inputSecond}`;

  return `${minutes}:${outputSecond}`;
}

export const getTimePanel = ({
  currentTime,
  duration,
}: {
  currentTime: number;
  duration: number | undefined;
}) => {
  if (duration) {
    return `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }

  return formatTime(currentTime);
};

export function getUniqueValuesByKey<T, K extends keyof T>(
  array: T[] | undefined,
  key: K,
): T[K][] {
  if (!array || !Array.isArray(array)) return [];
  const values = array.map((item) => item[key]);
  return Array.from(new Set(values));
}

export function getUniqueYears(
  tracks: { release_date: string }[] | undefined,
): number[] {
  if (!tracks || !Array.isArray(tracks)) return [];
  const years = tracks
    .map((track) => {
      const year = new Date(track.release_date).getFullYear();
      return isNaN(year) ? null : year;
    })
    .filter((year): year is number => year !== null);
  return Array.from(new Set(years)).sort((a, b) => b - a);
}
