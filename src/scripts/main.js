function fooTest(o){
  console.log(o);

  axios.post(`${app.endpoint}api/ai/foo=${o}`,null,null)
  .then(resp=>console.log(resp));
}
