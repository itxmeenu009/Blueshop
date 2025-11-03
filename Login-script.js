function validateForm() {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorMsg = document.getElementById("error-msg");

      if (!username || !password) {
        errorMsg.textContent = "Please enter both username and password.";
        errorMsg.style.display = "block";
        return false;
      }

      errorMsg.style.display = "none";
      alert("Login successful!");
      return true;
    }

    function togglePassword() {
      const passwordInput = document.getElementById("password");
      const toggleIcon = document.querySelector(".toggle-password");
      const isVisible = passwordInput.type === "text";

      passwordInput.type = isVisible ? "password" : "text";
      toggleIcon.classList.toggle("fa-eye");
      toggleIcon.classList.toggle("fa-eye-slash");
    }