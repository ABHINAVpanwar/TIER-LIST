setTimeout(() => {
  alert(
    "PLEASE ENSURE THE SERVER IS ACTIVE TO ACCESS ALL SITE FEATURES. IF IT IS NOT RUNNING, KINDLY START THE SERVER."
  );
}, 3000);

document.addEventListener("DOMContentLoaded", () => {
  // Check screen width on window resize
  window.onresize = function (event) {
    checkScreenWidth();
  };
  // Initial check on page load
  checkScreenWidth();

  function checkScreenWidth() {
    // Get the current screen width
    var screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // If the screen width is less than 700 pixels, show the alert
    if (screenWidth < 700) {
      alert("MINIMUM SCREEN WIDTH REQUIRED : 700 PIXELS");
    }
  }
  const ImageContainer = document.getElementById("ImageContainer");
  const Tiers = document.querySelectorAll(".Tier");
  const Heading = document.getElementById("Title");
  let previousTier = null;

  fetch("http://localhost:5000/data")
    .then((response) => response.json())
    .then((data) => {
      const { images, title } = data;
      images.forEach((src) => {
        const img = document.createElement("img");
        img.src = `http://localhost:5000/images/${src}`;
        img.draggable = true;
        img.addEventListener("dragstart", dragStart);
        ImageContainer.appendChild(img);
      });
      document.title = title;
      Heading.innerHTML = title.toUpperCase();
    });

  Tiers.forEach((tier) => {
    tier.addEventListener("dragover", dragOver);
    tier.addEventListener("drop", drop);
    tier.addEventListener("dragstart", setPreviousTier);
    tier.addEventListener("click", removeImage);
  });

  function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.src);
  }

  function dragOver(event) {
    event.preventDefault();
  }

  function drop(event) {
    event.preventDefault();
    const src = event.dataTransfer.getData("text/plain");
    const target = event.target;

    // Check if the target is a tier and it's different from the previous tier
    if (target.classList.contains("Tier") && target !== previousTier) {
      // Check if the target tier doesn't already contain an image with the same source URL
      if (!target.querySelector(`img[src='${src}']`)) {
        const img = document.createElement("img");
        img.src = src;
        img.draggable = true;
        img.addEventListener("dragstart", dragStart);
        target.appendChild(img);

        // Remove the image from other tiers
        Tiers.forEach((tier) => {
          if (tier !== target) {
            const originalImg = tier.querySelector(`img[src='${src}']`);
            if (originalImg) {
              originalImg.remove();
            }
          }
        });

        // Remove the image from the ImageContainer if it was there
        const originalImg = ImageContainer.querySelector(`img[src='${src}']`);
        if (originalImg) {
          originalImg.remove();
        }
      }
    }
  }

  function setPreviousTier(event) {
    previousTier = event.currentTarget;
  }

  function removeImage(event) {
    if (event.target.tagName === "IMG") {
      event.target.remove();
      const img = document.createElement("img");
      img.src = event.target.src;
      img.draggable = true;
      img.addEventListener("dragstart", dragStart);
      ImageContainer.appendChild(img);
    }
  }
});
