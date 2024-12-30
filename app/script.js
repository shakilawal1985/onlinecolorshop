document.addEventListener("DOMContentLoaded", () => {
    const userCountElement = document.getElementById("user-count");
  
    fetch('/api/user-count')
      .then(response => response.json())
      .then(data => {
        userCountElement.innerHTML = `Users on this page: ${data.count}`;
      })
      .catch(err => console.error("Error fetching user count:", err));
  });
  