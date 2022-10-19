const {  Worker, isMainThread, parentPort } = require('worker_threads');

if(isMainThread){ // 메인스레드
  const worker = new Worker(__filename);
  worker.postMessage('ping');
  worker.on('message',(value)=>{
    console.log(value);
  })
  worker.on('exit',()=>console.log('워커스레드 끝'));
}else{ //워커스레드
  parentPort.on('message',(value)=>{
    console.log(value);
    parentPort.postMessage('pong');
    parentPort.close();
  })
}