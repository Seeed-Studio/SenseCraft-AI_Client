
export const useQuitApp = async () => {
  window.close()
}

export const useReloadApp = () => {
  location.reload()
}

export const getCurrentTime = (): { date: string; time: string } => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time
  }
  return {
    date: `${year}-${formatTime(month)}-${formatTime(day)}`,
    time: `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
  }
}
