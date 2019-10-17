import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AR } from 'expo';
import ExpoTHREE, { THREE, AR as ThreeAR } from 'expo-three';
import { GraphicsView } from 'expo-graphics';
import { Vector2 } from 'three';

export default class App extends React.Component{
  render() {
    console.log(Vector2);
    return (
      <GraphicsView
        isArEnabled
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
      />
    );
  }
  onContextCreate = ({
    // Web: const gl = canvas.getContext('webgl')
    gl,
    width,
    height,
    scale,
  }) => {
    AR.setPlaneDetection(AR.PlaneDetection.Horizontal);

    // Renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      width,
      height,
      pixelRatio: scale,
    });

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);

    // Camera
    this.camera = new ThreeAR.Camera(width, height, 0.1, 1000);
    console.log(this.camera.position);

    // Cube
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });
    this.cube = new THREE.Mesh(geometry, material);

    this.magnetic = new ThreeAR.MagneticObject();
    this.magnetic.add(this.cube);
    console.log(this.magnetic.position);
    this.scene.add(this.magnetic);

    // Light
    this.scene.add(new THREE.AmbientLight(0x404040));
    this.scene.add(new THREE.DirectionalLight(0xffffff, 0.6));
  };

  onRender = () => {
    const screenCenter = new THREE.Vector2(0.5, 0.5);
    this.magnetic.update(this.camera, screenCenter);

    this.renderer.render(this.scene, this.camera);
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
