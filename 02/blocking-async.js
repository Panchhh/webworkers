async function computeFibonacciAsync(n) {
    const fib = (n) => {
        if (n <= 2) {
            return 1;
        }
        return fib(n - 1) + fib(n - 2)
    }

    return fib(n);
}


let count = 0;
document.getElementById('counterButton').addEventListener('click', () => {
    count++;
    document.getElementById('counter').textContent = count;
});


document.getElementById('fibonacciButton').addEventListener('click', async () => {
    const n = parseInt(document.getElementById('fibInput').value);
    console.log(n);
    const start = performance.now();

    const result = await computeFibonacciNonBlocking(n);

    const end = performance.now();
    const timeElapsed = (end - start).toFixed(2);

    console.log(result);
    console.log(`Time elapsed: ${timeElapsed}ms`);
    alert(`ComputeFibonacci completed!\nInput: ${n}\nResult: ${result}\nTime: ${timeElapsed}ms`);
});



async function computeFibonacciNonBlocking(n) {
    async function fib(current) {
        if (current <= 2) {
            return 1;
        }

        // Cediamo il controllo prima di ogni chiamata ricorsiva
        await new Promise(resolve => setTimeout(resolve, 0));

        const [a, b] = await Promise.all([
            computeFibonacciNonBlocking(current - 1),
            computeFibonacciNonBlocking(current - 2)
        ]);

        return a + b;
    }

    return await fib(n);
}