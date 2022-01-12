pn.api={
  host:      'https://prod-k8s.treetracker.org'
  base:      'https://prod-k8s.treetracker.org/wallet',
  wallet:    'PhilNorcross',
  pass:      '7nEhLFdd6PfH8ktt',
  key:       'ShByogKbGUDyv9vHx0CWaFSOI6k7YsR4',
  headers:    {'Content-Type':'application/json',
               'TREETRACKER-API-KEY':this.key,
               'Authorization':'Bearer '},
  options:    {method:'GET',
               headers:this.headers,
               redirect:'follow'},
  tokenID:   '2976363c-3bc6-4b07-94f1-c575eda5aecd'
}

pn.api.setAuth=function(btkn){pn.api.headers.Authorization='Bearer '+btkn;}
pn.api.setKey=function(key){pn.api.headers.TREETRACKER-API-KEY=key;}
 
pn.api.Fetch=async function(path,method){
  if(!method)method='GET';
  pn.api.options.method=method;
  let url=pn.api.base+path;
  fetch(url,pn.api.options)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

pn.api.parseResponse=function(resp){
  document.getElementById('resp').innerHTML=resp;
}