var a = 0;
function my_function(b) {
    b = b + 1;
}

if (a < 0) {
    a = a - 1;
} else if (a > 5) {
    a = a * 10;
} else {
    a = 5;
}

if (a < 0) {
    a = a - 1;
    if (a > 6) {
        a = a * 10;
    }
    a = a * 8;
}