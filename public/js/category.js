 const filterContainer = document.getElementById("filters");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");

    function updateArrows() {
      leftArrow.style.display = filterContainer.scrollLeft > 0 ? "block" : "none";
      rightArrow.style.display = filterContainer.scrollLeft + filterContainer.offsetWidth < filterContainer.scrollWidth ? "block" : "none";
    }

    function scrollLeftFunc() {
      if (filterContainer.scrollLeft > 0) {
        filterContainer.scrollBy({ left: -200, behavior: 'smooth' });
      }
    }

    function scrollRightFunc() {
      filterContainer.scrollBy({ left: 200, behavior: 'smooth' });
    }



    filterContainer.addEventListener("scroll", updateArrows);
    window.addEventListener("load", updateArrows);
    window.addEventListener("resize", updateArrows);

    // let taxSwitch = document.getElementById("switchCheckDefault");
    // taxSwitch.addEventListener("click", () => {
    //   let taxInfo = document.getElementsByClassName("tax-info");
    //   for (info of taxInfo) {
    //     if (info.style.display != "inline") {
    //       info.style.display = "inline"
    //     } else {
    //       info.style.display = "none";
    //     }
    //   }
    // });
