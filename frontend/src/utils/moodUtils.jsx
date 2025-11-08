export const MOOD_OPTIONS = [
  { mood: 'Happy', color: '#FFFF00', icon: '😄' },
  { mood: 'Calm', color: '#93ebebff', icon: '😌' },
  { mood: 'Angry', color: '#FF4500', icon: '😡'},
  { mood: 'Sad', color: '#f3d7a7ff', icon: '😣' },
  { mood: 'Neutral', color: '#a5de7fff', icon: '🙂' },
];

export const getMoodColor = (mood) => {
  const option = MOOD_OPTIONS.find(o => o.mood.toLowerCase() === mood.toLowerCase()) || MOOD_OPTIONS.find(o => o.mood === 'Neutral');
  return { color: option.color, icon: option.icon };
};
