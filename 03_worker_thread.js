const { Worker, isMainThread, parentPort, workerData} = require('worker_threads')

const min = 2;
let primes = [];

if (isMainThread){
  const max = 10_000_000;
  const threadCount = 8;
  const threads = new Set();
  const range = Math.ceil((max - min) / threadCount);
  let start = min;

  console.time('prime');
  for( let i = 0; i < threadCount -1; i++ ){
    const wStart = start;
    console.log(start);
    console.log(range);
    threads.add(new Worker(__filename, {
      workerData : { start : wStart, range }
    }));
    if(i===0){
      start -= 1;
    }
    start += range;
  }
  threads.add(new Worker(__filename, {
    workerData : { start, range }
  }))
  console.log(start);
  console.log(range);
  for (let worker of threads){
    worker.on('exit', ()=>{
      threads.delete(worker);
      if(threads.size === 0){
        console.timeEnd('prime');
        console.log(primes.length);
      }
    });
    worker.on('message', (msg)=> {
      primes = primes.concat(msg);
    })
  }
}else{
  findPrimes(workerData.start, workerData.range);
  parentPort.postMessage(primes);
}



function findPrimes(start, range){
  let isPrime = true;
  const end = start + range;
  for( let i = start; i < end; i++ ){
    for( let j = min; j < Math.sqrt(end); j++){
      if( i !== j && i % j === 0 ){
        isPrime = false;
        break;
      }
    }
    if(isPrime){
      primes.push(i);
    }
    isPrime = true;
  }
}