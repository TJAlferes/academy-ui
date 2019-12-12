//import React, { Component } from 'react';
import React, { createRef, useEffect } from 'react';
import * as THREE from 'three';

import './app.css';

const App = props => {
  const appRef = createRef();
  
  useEffect(() => {
    setUp();
    start();
    return () => {
      stop();
      appRef.current.removeChild(renderer.domElement);
    };
  }, []);

  let frameId;
  let camera;
  const renderer = new THREE.WebGLRenderer({antialias: true});
  const geometry = new THREE.CubeGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: '#C16000'});
  const mesh = new THREE.Mesh(geometry, material);
  const scene = new THREE.Scene();

  const setUp = () => {
    const width = appRef.current.clientWidth;
    const height = appRef.current.clientHeight;
    camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 4;
    renderer.setClearColor('#000000');
    renderer.setSize(width, height);
    appRef.current.appendChild(renderer.domElement);
    scene.add(mesh);
  };

  const start = () => {
    if (!frameId) frameId = requestAnimationFrame(animate);
  };

  const stop = () => cancelAnimationFrame(frameId);

  const animate = () => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderScene();
    frameId = window.requestAnimationFrame(animate);
  };

  const renderScene = () => renderer.render(scene, camera);

  return <div className="app" ref={appRef} />;
};

/*class App extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 4;
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: '#C16000'});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.start();
  }
  
  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  
  start = () => {
    if (!this.frameId) this.frameId = requestAnimationFrame(this.animate);
  }

  stop = () => cancelAnimationFrame(this.frameId);
  
  animate = () => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }
 
  renderScene = () => this.renderer.render(this.scene, this.camera);

  render() {
    return(
      <div
        className="app"
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}*/

export default App;