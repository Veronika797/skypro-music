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
