const wrapper = document.querySelector(".infinite-3dslider")
const items = [...document.querySelectorAll(".slider-item")]

// let offset = 0
// let speed = 0.01
// const radius = 350
// wrapper.style.width = radius/4 + "rem"
// wrapper.style.height = radius/4 + "rem"

// function setPositions() {

//     offset += speed

//     const centerX = wrapper.clientWidth / 2;
//     const centerY = wrapper.clientHeight / 2;

//     items.forEach((item, i) => {

//         const angle = i / items.length * Math.PI * 2 + offset;

//         const x = centerX + Math.cos(angle) * radius;
//         const y = centerY + Math.sin(angle) * radius;
        
//         const rotation = angle * 180 / Math.PI + 90;
        
//         item.style.left = `${x - item.offsetWidth / 2}px`;
//         item.style.top = `${y - item.offsetHeight / 2}px`;

//         item.style.transform = `
//             rotate(${rotation}deg)
//         `;
//     });
//     requestAnimationFrame(setPositions)
// }

// setPositions()