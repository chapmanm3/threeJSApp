import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0,0,0)
controls.update()

let cubes:Array<Mesh> = []

function createCube() {
  let randomHeight = Math.random() * 3
  const geometry = new BoxGeometry(0.25, randomHeight, 0.25)
  const material = new MeshBasicMaterial({color: 0xff00ff})
  const cube = new Mesh(geometry, material)
  cube.position.y = randomHeight / 2
  if(cubes.length > 0){
    cube.position.x = cubes.length 
  }
  cubes.push(cube)
  scene.add(cube)
}

function registerFormListener() {
  document.getElementById("updateNumCubes")?.addEventListener('click', (event) => updateAnimation(event))
}

function registerSwapElementsButtonListener() {
  document.getElementById("swapElementsBtn")?.addEventListener('click', (event) => swapElements(event))
}

function registerSortElementsButtonListener() {
  document.getElementById("sortElementsBtn")?.addEventListener('click', (event) => sortElements(event))
}

function swapElements(event: MouseEvent){
  const idx1 = document.getElementById("firstCubeIdx")?.valueAsNumber - 1;
  const idx2 = document.getElementById("secondCubeIdx")?.valueAsNumber - 1;
  event.preventDefault()
  if((idx1 != undefined && idx2 != undefined) && (idx1 >= 0 && idx2 <= cubes.length)){
    let cube1 = cubes[idx1]
    let cube2 = cubes[idx2]
    let tempCube = cube1
    cubes[idx1] = cube2
    cubes[idx2] = tempCube
  }

}

function sortElements(event: MouseEvent) {
  event.preventDefault()
  cubes.sort((a,b) => a.position.y - b.position.y)
}

function updateAnimation(e: MouseEvent) {
  e.preventDefault()
  const cubesElm = document.getElementById("numCubes")
  const numCubes = cubesElm.valueAsNumber
  const cubesToBeAdded = numCubes - cubes.length
  if(cubesToBeAdded >= 1){
    for(let i = 0; i < cubesToBeAdded; i++){
      console.log("Create Cube")
      createCube()
    }
  }else{
    while(numCubes < cubes.length){
      console.log("deleting cube")
      let cube = cubes.pop()
      console.log(cube)
      cube?.removeFromParent()
    }
  }
  const midCameraPosition = cubes.length / 2
  controls.target.set(midCameraPosition, 0, 0)
}

export function threeJSCube(){
  registerFormListener()
  registerSwapElementsButtonListener()
  registerSortElementsButtonListener()

  camera.position.z = 5
  camera.position.y = 5


  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    cubes.forEach((cube, idx) => {
      let position = idx
      let diff = cube.position.x - position
      diff *= 100
      diff = Math.round(diff)
      diff /= 100
      if(diff > 0){
        cube.position.x -= 0.05
      } else if ( diff < 0){
        cube.position.x += 0.05
      }
    })
  }

  animate()

  //controls.addEventListener('change', animate)

}
