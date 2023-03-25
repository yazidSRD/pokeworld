window.addEventListener('load',async function () {
    await chunkGeneration(player['chunk']['x'],player['chunk']['y']);
    await loadTheChunk()
    player["état"] = "statique"
})