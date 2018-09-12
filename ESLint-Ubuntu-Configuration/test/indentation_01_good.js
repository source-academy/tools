function frac_sum(a, b) {
    return (a > b)
        ? 0
        : 1 / (a * (a + 2))
            + frac_sum(a + 4, b);
}
