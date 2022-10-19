const { exec } = require('child_process');

const process = exec('dir');
//cmd /c chcp 65001>nul && dir

process.stdout.on('data', (data)=>{
  console.log(data.toString());
})

process.stderr.on('data', (data)=>{
  console.error(data.toString());
})