"use client";

import { Character, Memory, TimelineEvent } from "./types";

const STORAGE_KEY = "soulbond_characters";

export function getCharacters(): Character[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getCharacter(id: string): Character | undefined {
  return getCharacters().find((c) => c.id === id);
}

export function saveCharacter(character: Character): void {
  const chars = getCharacters();
  const idx = chars.findIndex((c) => c.id === character.id);
  if (idx >= 0) {
    chars[idx] = character;
  } else {
    chars.push(character);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
}

export function deleteCharacter(id: string): void {
  const chars = getCharacters().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
}

export function addMemory(characterId: string, fact: string, category: Memory["category"], source: string): void {
  const char = getCharacter(characterId);
  if (!char) return;

  char.memories.push({
    id: crypto.randomUUID(),
    fact,
    category,
    learnedAt: new Date().toISOString(),
    source,
  });
  saveCharacter(char);
}

export function addTimelineEvent(characterId: string, title: string, description: string, bondXp: number): void {
  const char = getCharacter(characterId);
  if (!char) return;

  char.timeline.push({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    title,
    description,
    bondXp,
  });
  saveCharacter(char);
}

export function addBondXp(characterId: string, xp: number): void {
  const char = getCharacter(characterId);
  if (!char) return;

  char.bond.xp += xp;
  char.bond.lastInteraction = new Date().toISOString();
  char.bond.totalMessages += 1;

  const today = new Date().toDateString();
  const lastDate = char.bond.lastInteraction
    ? new Date(char.bond.lastInteraction).toDateString()
    : "";

  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate === yesterday.toDateString()) {
      char.bond.streak += 1;
    } else if (lastDate !== today) {
      char.bond.streak = 1;
    }
  }

  saveCharacter(char);
}

export function exportSoulFile(characterId: string): string {
  const char = getCharacter(characterId);
  if (!char) return "";

  const soulFile = {
    format: "soulbond_v1",
    exported: new Date().toISOString(),
    identity: {
      name: char.name,
      role: char.role,
      personality: char.personality,
      values: char.values,
      backstory: char.backstory,
      appearance: char.appearance,
    },
    bond: char.bond,
    memories: char.memories,
    timeline: char.timeline,
  };

  return JSON.stringify(soulFile, null, 2);
}
