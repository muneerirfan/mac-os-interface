document.addEventListener("DOMContentLoaded", function () {
    const launchpad = document.getElementById("launchpad");
    const launchpadIcon = document.querySelector(".dock-item[data-app='launchpad']");
    const closeButton = document.querySelector(".launchpad-close");

    // Show Launchpad when clicked
    launchpadIcon.addEventListener("click", function () {
        launchpad.classList.add("show");
    });

    // Close Launchpad when close button is clicked
    closeButton.addEventListener("click", function () {
        launchpad.classList.remove("show");
    });

});
