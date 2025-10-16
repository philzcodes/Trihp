export const calculateDropOffTime = (durationInMinutes) => {
  const now = new Date();
  const dropOffTime = new Date(now.getTime() + durationInMinutes * 60000);
  
  return dropOffTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
