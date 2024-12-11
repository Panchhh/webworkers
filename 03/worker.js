self.onmessage = e => {
    if (e.data != null) {
        console.log(`Computation started for ${e.data}`)
        const result = computeFibonacci(e.data);
        self.postMessage(result);
    }
};

function computeFibonacci(n) {
    const fib = (n) => {
        if (n <= 2) {
            return 1;
        }
        return fib(n - 1) + fib(n - 2)
    }
    return fib(n);
}