const test=require('node:test'); const assert=require('node:assert/strict'); const {loadPage}=require('./signalbound-browser.js');
test('platform: DOM initialization against supplied market data',async()=>{const page=await loadPage({root:__dirname,live:null});try{page.assertHealthy();}finally{page.close()}});
