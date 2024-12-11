const worker = new Worker('worker.js');

let start;
let n;

worker.onmessage = e => {
    console.log(e)
    const end = performance.now();
    const timeElapsed = (end - start).toFixed(2);
    const result = e.data;

    console.log(`Time elapsed: ${timeElapsed}ms`);
    alert(`ComputeFibonacci completed!\nInput: ${n}\nResult: ${result}\nTime: ${timeElapsed}ms`);
};

document.getElementById('fibonacciButton').addEventListener('click', () => {
    n = parseInt(document.getElementById('fibInput').value);
    console.log(n);
    start = performance.now();
    worker.postMessage(n);
});

let count = 0;
document.getElementById('counterButton').addEventListener('click', () => {
    count++;
    document.getElementById('counter').textContent = count;
});

