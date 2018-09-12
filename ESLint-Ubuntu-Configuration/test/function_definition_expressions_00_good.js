function count_buttons(garment) {
    return accumulate((sleaves, total) => sleaves + total,
        0,
        map(jacket =>
            is_checkered(jacket)
                ? count_buttons(jacket)
                : 1,
                garment));
}

count_buttons(jacket => is_checkered(jacket) ? count_buttons(jacket) : 1,
        garment);