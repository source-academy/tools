function make_abs_adder(x) {
    function the_adder(y) {
        if (x >= 0) {
            return x + y;
        } else {
            return -x + y;
        }
    }
    return the_adder;
}
