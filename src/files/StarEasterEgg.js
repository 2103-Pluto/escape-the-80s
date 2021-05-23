
const createStarsEasterEgg = (scene, distanceToOriginX, distanceToOriginY) => {
  const centeringShift = 23;
  const pluto = [
    { x: 0, y: 510 },
    { x: 0, y: 530 },
    { x: 0, y: 490 },
    { x: 0, y: 470 },
    { x: 20, y: 470 },
    { x: 20, y: 510 },
    { x: 30, y: 490 },
    { x: 60, y: 470 },
    { x: 60, y: 490 },
    { x: 60, y: 510 },
    { x: 60, y: 530 },
    { x: 80, y: 530 },
    { x: 110, y: 470 },
    { x: 110, y: 490 },
    { x: 110, y: 510 },
    { x: 110, y: 530 },
    { x: 130, y: 530 },
    { x: 150, y: 530 },
    { x: 150, y: 510 },
    { x: 150, y: 490 },
    { x: 150, y: 470 },
    { x: 180, y: 470 },
    { x: 220, y: 470 },
    { x: 200, y: 470 },
    { x: 200, y: 490 },
    { x: 200, y: 510 },
    { x: 200, y: 530 },
    { x: 250, y: 530 },
    { x: 250, y: 510 },
    { x: 250, y: 490 },
    { x: 250, y: 470 },
    { x: 270, y: 530 },
    { x: 270, y: 470 },
    { x: 290, y: 530 },
    { x: 290, y: 510 },
    { x: 290, y: 490 },
    { x: 290, y: 470 }
  ];
  const team = [
    { x: 20, y: 430},
    { x: 20, y: 410},
    { x: 20, y: 390},
    { x: 20, y: 370},
    { x: 0, y: 370},
    { x: 40, y: 370},
    { x: 70, y: 430},
    { x: 70, y: 410},
    { x: 70, y: 390},
    { x: 70, y: 370},
    { x: 90, y: 430},
    { x: 90, y: 400},
    { x: 90, y: 370},
    { x: 117, y: 430},
    { x: 123, y: 410},
    { x: 128, y: 390},
    { x: 140, y: 370},
    { x: 163, y: 430},
    { x: 157, y: 410},
    { x: 152, y: 390},
    { x: 140, y: 410},
    { x: 190, y: 430},
    { x: 190, y: 410},
    { x: 190, y: 390},
    { x: 190, y: 370},
    { x: 235, y: 430},
    { x: 235, y: 410},
    { x: 235, y: 390},
    { x: 235, y: 370},
    { x: 222, y: 385},
    { x: 202, y: 385},
    { x: 212, y: 400}
  ]
  pluto.forEach((positions) => {
    const {x, y} = positions;
    scene.createAnimatedStar(distanceToOriginX + 340 + x, distanceToOriginY + y - 100, scene)
  })
  team.forEach((positions) => {
    const {x, y} = positions;
    scene.createAnimatedStar(distanceToOriginX + centeringShift + x, distanceToOriginY + y, scene)
  })
}

export default createStarsEasterEgg;
