import { useFormContext, useFieldArray } from "react-hook-form";
import type { TeamFormData, TeamFormPokemon } from "../types";
import { findIndexBy, findItemBy } from "@poke-playbook/libs";

export function usePokemonSlots() {
  const { control, watch } = useFormContext<TeamFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "selectedPokemon",
  });

  const selectedPokemon = watch("selectedPokemon");

  const getPokemonAtPosition = (position: number) =>
    findItemBy(selectedPokemon, "position", position);

  const getIndexByPosition = (position: number) =>
    findIndexBy(selectedPokemon, "position", position);

  const getEmptySlots = (): number[] => {
    const occupiedPositions = new Set(
      selectedPokemon.map((pokemon) => pokemon.position),
    );

    return [1, 2, 3, 4, 5, 6].filter((pos) => !occupiedPositions.has(pos));
  };

  const addPokemon = (
    pokemon: Omit<TeamFormPokemon, "position">,
    position: number,
  ) => {
    const existingIndex = getIndexByPosition(position);

    if (existingIndex !== -1) {
      remove(existingIndex);
    }

    append({
      ...pokemon,
      position,
    });
  };

  const removePokemon = (position: number) => {
    const index = getIndexByPosition(position);

    if (index !== -1) {
      remove(index);
    }
  };

  const updateNickname = (position: number, nickname: string) => {
    const index = getIndexByPosition(position);

    if (index !== -1) {
      update(index, {
        ...selectedPokemon[index],
        nickname,
      });
    }
  };

  const reorderPokemon = (fromPosition: number, toPosition: number) => {
    const fromIndex = getIndexByPosition(fromPosition);
    const toIndex = getIndexByPosition(toPosition);

    if (fromIndex === -1) {
      return;
    }

    const pokemonToMove = selectedPokemon[fromIndex];

    if (toIndex === -1) {
      update(fromIndex, {
        ...pokemonToMove,
        position: toPosition,
      });

      return;
    }

    const pokemonAtTarget = selectedPokemon[toIndex];

    update(fromIndex, {
      ...pokemonToMove,
      position: toPosition,
    });

    update(toIndex, {
      ...pokemonAtTarget,
      position: fromPosition,
    });
  };

  return {
    selectedPokemon,
    addPokemon,
    removePokemon,
    updateNickname,
    reorderPokemon,
    getPokemonAtPosition,
    getEmptySlots,
    fields,
  };
}
