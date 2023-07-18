import create from 'zustand';
import { StoryBaseline } from '../helper/types';

// Define the store shape
type StoryStore = {
  baseline: StoryBaseline;
  setBaseline: (v: StoryBaseline) => void;
};

// Create the store
const useStoryStore = create<StoryStore>((set) => ({
  baseline: {
    title: '',
    message: '',
    summary: ''
  },
  setBaseline: (v) => set({ baseline: v }),
}));

export default useStoryStore;
