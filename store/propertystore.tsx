import {create} from 'zustand';

const usePropertyStore = create((set, get) => ({
  property:""
  getProperty: () => get().property,

  setProperty: (property) => set({property}),
}));