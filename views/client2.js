const button = document.getElementById("btn");
button.addEventListener('click', function(e){
    console.log("button was clicked");
fetch('/clicked',{method : 'POST'})
    .then(function(response){
    if(response.ok){
        console.log("Click was recorded");
        return;
    }
    })
    .catch(function(error){
        console.log(error);
    });
});
setInterval(function() {
    fetch('/clicks', {method: 'GET'})
      .then(function(response) {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
      })
      .then(function(data) {
        document.getElementById('btn').innerHTML = `Button was clicked ${data.length} times`;
      })
      .catch(function(error) {
        console.log(error);
      });
  }, 1000);


  const submit = document.getElementById('submit-btn');
  submit.addEventListener('click', function(e){
    const username = document.getElementById('Username');
    const otp = document.getElementById('OTP');
    sendDataToServer(username,otp);
  });
  function sendDataToServer(username, otp){
    
  }