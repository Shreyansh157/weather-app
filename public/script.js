// Update current time
function updateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const timeElement = document.getElementById("currentTime");
  if (timeElement) {
    timeElement.textContent = now.toLocaleDateString("en-US", options);
  }
}

// Add loading state to search button
function addLoadingState() {
  const form = document.querySelector("form");
  const submitBtn = document.querySelector(".search-btn");

  if (form && submitBtn) {
    form.addEventListener("submit", function () {
      submitBtn.innerHTML = '<div class="loading"></div> Loading...';
      submitBtn.disabled = true;
    });
  }
}

// Add fade-in animation to weather cards
function animateCards() {
  const cards = document.querySelectorAll(".detail-card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Add enter key support for search
function addEnterKeySupport() {
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        this.closest("form").submit();
      }
    });
  }
}

// Add focus styles
function addFocusStyles() {
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("focus", function () {
      this.closest(".search-card").style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.15)";
      this.closest(".search-card").style.transform = "translateY(-2px)";
    });

    searchInput.addEventListener("blur", function () {
      this.closest(".search-card").style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
      this.closest(".search-card").style.transform = "translateY(0)";
    });
  }
}

// Add smooth scroll effect
function addSmoothScroll() {
  const weatherCard = document.querySelector(".weather-card");
  if (weatherCard) {
    setTimeout(() => {
      weatherCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  }
}

// Add weather icon animation
function animateWeatherIcon() {
  const weatherIcon = document.querySelector(".weather-icon");
  if (weatherIcon) {
    weatherIcon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(5deg)";
      this.style.transition = "transform 0.3s ease";
    });

    weatherIcon.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)";
    });
  }
}

// Add typing effect for city names
function addTypingEffect() {
  const cityName = document.querySelector(".city-name");
  if (cityName && cityName.textContent) {
    const text = cityName.textContent;
    cityName.textContent = "";
    cityName.style.borderRight = "2px solid #2b6cb0";

    let index = 0;
    const timer = setInterval(() => {
      cityName.textContent += text[index];
      index++;

      if (index >= text.length) {
        clearInterval(timer);
        setTimeout(() => {
          cityName.style.borderRight = "none";
        }, 500);
      }
    }, 50);
  }
}

// Add temperature counter animation
function animateTemperature() {
  const tempElement = document.querySelector(".temperature");
  if (tempElement) {
    const finalTemp = parseInt(tempElement.textContent);
    tempElement.textContent = "0°C";

    let currentTemp = 0;
    const increment = finalTemp > 0 ? 1 : -1;
    const speed = Math.abs(finalTemp) > 50 ? 20 : 50;

    const counter = setInterval(() => {
      currentTemp += increment;
      tempElement.textContent = currentTemp + "°C";

      if ((increment > 0 && currentTemp >= finalTemp) || (increment < 0 && currentTemp <= finalTemp)) {
        clearInterval(counter);
        tempElement.textContent = finalTemp + "°C";
      }
    }, speed);
  }
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", function () {
  updateTime();
  addLoadingState();
  addEnterKeySupport();
  addFocusStyles();
  addSmoothScroll();
  animateWeatherIcon();

  // Run animations with delay for better UX
  setTimeout(() => {
    animateCards();
    animateTemperature();
  }, 500);

  // Update time every minute
  setInterval(updateTime, 60000);
});

// Add geolocation support (optional enhancement)
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // You can extend this to reverse geocode and auto-fill the city
      console.log("User location:", lat, lon);
    });
  }
}

// Add weather background based on conditions
function updateBackgroundBasedOnWeather() {
  const weatherIcon = document.querySelector(".weather-icon");
  if (weatherIcon && weatherIcon.src) {
    const iconCode = weatherIcon.src.match(/(\d{2}[dn])@/);
    if (iconCode) {
      const body = document.body;
      const code = iconCode[1];

      // Different gradients based on weather conditions
      const weatherGradients = {
        "01d": "linear-gradient(135deg, #ffeaa7, #fdcb6e)", // Clear day
        "01n": "linear-gradient(135deg, #2d3561, #c05c7e)", // Clear night
        "02d": "linear-gradient(135deg, #74b9ff, #0984e3)", // Few clouds day
        "02n": "linear-gradient(135deg, #2d3561, #6c5ce7)", // Few clouds night
        "03d": "linear-gradient(135deg, #a8e6cf, #3d9970)", // Scattered clouds
        "04d": "linear-gradient(135deg, #95a5a6, #7f8c8d)", // Broken clouds
        "09d": "linear-gradient(135deg, #74b9ff, #0984e3)", // Shower rain
        "10d": "linear-gradient(135deg, #81ecec, #00b894)", // Rain day
        "11d": "linear-gradient(135deg, #636e72, #2d3436)", // Thunderstorm
        "13d": "linear-gradient(135deg, #ddd6fe, #a78bfa)", // Snow
        "50d": "linear-gradient(135deg, #b2bec3, #636e72)", // Mist
      };

      const gradient = weatherGradients[code] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      body.style.background = gradient;
    }
  }
}
