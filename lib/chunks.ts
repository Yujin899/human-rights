// Chunk configuration - grouping lectures together
export const CHUNKS = [
    { id: 1, name: "الجزء الأول", lectures: [1, 2, 3] },
    { id: 2, name: "الجزء الثاني", lectures: [4, 5, 6] },
    { id: 3, name: "الجزء الثالث", lectures: [7, 8, 9] },
] as const;

export type ChunkId = (typeof CHUNKS)[number]["id"];

/**
 * Get chunk by ID
 */
export function getChunkById(id: number) {
    return CHUNKS.find((chunk) => chunk.id === id);
}

/**
 * Get all lectures in a chunk
 */
export function getChunkLectures(chunkId: number): readonly number[] {
    const chunk = getChunkById(chunkId);
    return chunk ? chunk.lectures : [];
}
