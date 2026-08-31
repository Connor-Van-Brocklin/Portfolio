document.addEventListener("DOMContentLoaded", () => {

    const galleries = document.querySelectorAll("[data-gallery]");

    galleries.forEach((gallery) => {

        const viewer = gallery.querySelector(".gallery-viewer");
        const image = gallery.querySelector(".gallery-image");

        const previousButton =
            gallery.querySelector(".previous-button");

        const nextButton =
            gallery.querySelector(".next-button");

        const fullscreenButton =
            gallery.querySelector(".fullscreen-button");

        const dotsContainer =
            gallery.querySelector(".gallery-dots");

        const caption =
            gallery.querySelector(".gallery-caption");


        // Stop if required gallery elements are missing
        if (!viewer || !image) {
            return;
        }


        // Read image information from HTML
        let images;

        try {
            images = JSON.parse(gallery.dataset.images);
        } catch (error) {
            console.error("Invalid gallery image data:", error);
            return;
        }


        if (!Array.isArray(images) || images.length === 0) {
            return;
        }


        let currentIndex = 0;
        let slideshowTimer = null;


        // Optional HTML settings
        const autoplay =
            gallery.dataset.autoplay !== "false";

        const interval =
            Number(gallery.dataset.interval) || 5000;


        function getImageSource(imageData) {

            if (typeof imageData === "string") {
                return imageData;
            }

            return imageData.src;

        }


        function getImageAlt(imageData) {

            if (typeof imageData === "string") {
                return "Project image";
            }

            return imageData.alt || "Project image";

        }


        function getImageCaption(imageData) {

            if (typeof imageData === "string") {
                return "";
            }

            return imageData.caption || "";

        }


        function showImage(index) {

            currentIndex =
                (index + images.length) % images.length;

            const imageData = images[currentIndex];

            image.src = getImageSource(imageData);
            image.alt = getImageAlt(imageData);


            if (caption) {

                const captionText =
                    getImageCaption(imageData);

                caption.textContent = captionText;

                caption.hidden =
                    captionText.length === 0;

            }


            updateDots();

        }


        function nextImage() {

            showImage(currentIndex + 1);

        }


        function previousImage() {

            showImage(currentIndex - 1);

        }


        function stopSlideshow() {

            if (slideshowTimer) {

                clearInterval(slideshowTimer);
                slideshowTimer = null;

            }

        }


        function startSlideshow() {

            stopSlideshow();


            if (!autoplay) {
                return;
            }


            if (images.length <= 1) {
                return;
            }


            if (document.hidden) {
                return;
            }


            if (document.fullscreenElement === viewer) {
                return;
            }


            slideshowTimer = setInterval(() => {

                nextImage();

            }, interval);

        }


        function resetSlideshow() {

            stopSlideshow();
            startSlideshow();

        }


        function updateDots() {

            if (!dotsContainer) {
                return;
            }

            const dots =
                dotsContainer.querySelectorAll(".gallery-dot");

            dots.forEach((dot, index) => {

                const isActive =
                    index === currentIndex;

                dot.classList.toggle(
                    "active",
                    isActive
                );

                dot.setAttribute(
                    "aria-current",
                    isActive ? "true" : "false"
                );

            });

        }


        function createDots() {

            if (!dotsContainer) {
                return;
            }

            dotsContainer.innerHTML = "";


            images.forEach((_, index) => {

                const dot =
                    document.createElement("button");

                dot.type = "button";
                dot.className = "gallery-dot";

                dot.setAttribute(
                    "aria-label",
                    `View image ${index + 1}`
                );


                dot.addEventListener("click", () => {

                    showImage(index);

                    if (!document.fullscreenElement) {
                        resetSlideshow();
                    }

                });


                dotsContainer.appendChild(dot);

            });

        }


        function updateControls() {

            const multipleImages =
                images.length > 1;


            if (previousButton) {
                previousButton.hidden =
                    !multipleImages;
            }


            if (nextButton) {
                nextButton.hidden =
                    !multipleImages;
            }


            if (dotsContainer) {
                dotsContainer.hidden =
                    !multipleImages;
            }

        }


        previousButton?.addEventListener(
            "click",
            () => {

                previousImage();

                if (!document.fullscreenElement) {
                    resetSlideshow();
                }

            }
        );


        nextButton?.addEventListener(
            "click",
            () => {

                nextImage();

                if (!document.fullscreenElement) {
                    resetSlideshow();
                }

            }
        );


        fullscreenButton?.addEventListener(
            "click",
            async () => {

                try {

                    if (
                        document.fullscreenElement === viewer
                    ) {

                        await document.exitFullscreen();

                    } else {

                        await viewer.requestFullscreen();

                    }

                } catch (error) {

                    console.error(
                        "Fullscreen failed:",
                        error
                    );

                }

            }
        );


        document.addEventListener(
            "fullscreenchange",
            () => {

                if (
                    document.fullscreenElement === viewer
                ) {

                    stopSlideshow();

                } else if (
                    !document.fullscreenElement
                ) {

                    startSlideshow();

                }

            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    document.fullscreenElement !== viewer
                ) {
                    return;
                }


                if (event.key === "ArrowRight") {

                    nextImage();

                }


                if (event.key === "ArrowLeft") {

                    previousImage();

                }

            }
        );


        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {

                    stopSlideshow();

                } else {

                    startSlideshow();

                }

            }
        );


        createDots();

        updateControls();

        showImage(0);

        startSlideshow();

    });

});