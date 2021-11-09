function getWrappedOffset(a, b, wrapAmount) {
    a = a % wrapAmount;
    b = b % wrapAmount;
    let minDistance = Number.POSITIVE_INFINITY;
    let minOffset = 0;
    for (let i = -1; i < 2; i++) {
        const offset = b - (a + i * wrapAmount);
        if (abs(offset) < minDistance) {
            minOffset = offset;
            minDistance = abs(offset);
        }
    }
    return minOffset;
}
