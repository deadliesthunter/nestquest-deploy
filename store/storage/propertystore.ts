import {zustand} from 'zustand';

const usePropertyStore = zustand((set) => ({
  properties: [],
  addProperty: (property) => set((state) => ({properties: [...state.properties, property]})),
  removeProperty: (property) => set((state) => ({properties: state.properties.filter((p) => p !== property)})),
}));