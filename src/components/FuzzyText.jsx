import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as BAS from 'three-bas';
import { TimelineMax, Power1, Power2 } from 'gsap';
import './FuzzyText.css';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

// -----------------------------------------------------------------------------
// FuzzyMesh: builds animated hair on given sample points
// -----------------------------------------------------------------------------
class FuzzyMesh extends THREE.Mesh {
  constructor(params) {
    const config = {
      recursiveRotation: true,
      hairLength: 0.25,
      hairRadialSegments: 4,
      hairHeightSegments: 20,
      hairRadiusTop: 0.0,
      hairRadiusBase: 0.05,
      fuzz: 0.3,
      gravity: 1.5,
      centrifugalForceFactor: 1,
      centrifugalDecay: 0.8,
      movementForceFactor: 0.75,
      movementDecay: 0.7,
      settleDecay: 0.97,
      ...params.config
    };

    // hair prefab
    const prefab = new THREE.ConeGeometry(
      config.hairRadiusBase,
      config.hairLength,
      config.hairRadialSegments,
      config.hairHeightSegments,
      true
    );
    prefab.translate(0, config.hairLength * 0.5, 0);

    // sample data
    const { positions, normals } = params.samplePoints;
    const count = positions.length / 3;

    // build instanced hair geometry
    const hairGeo = new BAS.PrefabBufferGeometry(prefab, count);
    hairGeo.createAttribute('forceFactor', 1, data => {
      data[0] = THREE.MathUtils.randFloat(
        config.movementForceFactor,
        config.centrifugalForceFactor
      );
    });
    hairGeo.createAttribute('settleOffset', 1, data => {
      data[0] = THREE.MathUtils.randFloat(0, Math.PI * 2);
    });
    hairGeo.createAttribute('hairPosition', 3, (data, i) => {
      data[0] = positions[i * 3 + 0];
      data[1] = positions[i * 3 + 1];
      data[2] = positions[i * 3 + 2];
    });
    hairGeo.createAttribute('baseDirection', 3, (data, i) => {
      const nx = normals[i * 3 + 0];
      const ny = normals[i * 3 + 1];
      const nz = normals[i * 3 + 2];
      new THREE.Vector3(
        nx + THREE.MathUtils.randFloatSpread(config.fuzz),
        ny + THREE.MathUtils.randFloatSpread(config.fuzz),
        nz + THREE.MathUtils.randFloatSpread(config.fuzz)
      )
        .normalize()
        .toArray(data);
    });

    // material: green albedo + proximity + wind uniforms
    const material = new BAS.StandardAnimationMaterial({
      flatShading: true,
      wireframe: false,
      uniformValues: {
        diffuse:         new THREE.Color(0x14C47E), // hair albedo
        roughness:       1.0,
        metalness:       0.0
      },
      uniforms: {
        hairLength:        { value: config.hairLength },
        settleTime:        { value: 0.0 },
        settleScale:       { value: 1.0 },
        globalForce:       { value: new THREE.Vector3(0, -config.gravity, 0) },
        centrifugalForce:  { value: 0.0 },
        centrifugalDirection:{ value: new THREE.Vector3(1, 0, 1).normalize() },
        mousePos:          { value: new THREE.Vector3(0, 0, 0) },
        influenceRadius:   { value: 2.5 },   // smaller radius
        windStrength:      { value: 5.0 }
      },
      defines: {
        HAIR_LENGTH:   config.hairLength.toFixed(2),
        SEGMENT_STEP:  (config.hairLength / config.hairHeightSegments).toFixed(2),
        FORCE_STEP:    (1.0 / config.hairLength).toFixed(2)
      },
      vertexParameters: vertexParams(),
      vertexFunctions:  [ BAS.ShaderChunk.quaternion_rotation, quatFunc() ],
      vertexPosition:   config.recursiveRotation ? recursiveShader() : simpleShader()
    });

    super(hairGeo, material);
    this.config = config;
    this.frustumCulled = false;
    this._quat = new THREE.Quaternion();
    this.conjugate = new THREE.Quaternion();
    this.rotationAxis = new THREE.Vector3(0, 1, 0);
    this.angle = 0;
    this.prevAngle = 0;
    this.prevPos = new THREE.Vector3();
    this.moveForce = new THREE.Vector3();
  }

  setPosition(pos) {
    this.prevPos.copy(this.position);
    this.position.copy(pos);
  }

  setRotationAngle(a) {
    this.prevAngle = this.angle;
    this.angle = a;
  }

  setRotationAxis(axis) {
    this.setRotationAngle(0);
    this.rotationAxis.copy(axis);
    this.material.uniforms.centrifugalDirection.value.copy(axis).normalize();
  }

  update() {
    const delta = this.prevPos.clone().sub(this.position);
    this.moveForce.multiplyScalar(this.config.movementDecay);
    this.moveForce.addScaledVector(delta, this.config.movementForceFactor);
    this.material.uniforms.globalForce.value.set(
      this.moveForce.x,
      this.moveForce.y - this.config.gravity,
      this.moveForce.z
    );
    this.prevPos.copy(this.position);

    const rotSpd = Math.abs(this.prevAngle - this.angle);
    this.material.uniforms.centrifugalForce.value *= this.config.centrifugalDecay;
    this.material.uniforms.centrifugalForce.value += rotSpd * this.config.centrifugalForceFactor;
    this.prevAngle = this.angle;

    this.material.uniforms.globalForce.value.applyQuaternion(
      this.quaternion.clone().conjugate()
    );
    this.quaternion.setFromAxisAngle(this.rotationAxis, this.angle);

    const u = this.material.uniforms;
    u.settleTime.value += 0.1;
    u.settleScale.value = Math.min(
      1.0,
      u.settleScale.value * this.config.settleDecay + (this.moveForce.length() + rotSpd) * 0.1
    );
  }
}

// -----------------------------------------------------------------------------
// Shader helpers (with proximity + wind logic)
// -----------------------------------------------------------------------------
function vertexParams() {
  return `
    uniform float hairLength;
    uniform vec3 globalForce;
    uniform float centrifugalForce;
    uniform vec3 centrifugalDirection;
    uniform float settleTime;
    uniform float settleScale;
    uniform vec3 mousePos;
    uniform float influenceRadius;
    uniform float windStrength;
    attribute float forceFactor;
    attribute float settleOffset;
    attribute vec3 hairPosition;
    attribute vec3 baseDirection;
    vec3 UP = vec3(0.0, 1.0, 0.0);
  `;
}

function simpleShader() {
  return `
    // proximity factor with smooth falloff
    vec2 diff = hairPosition.xy - mousePos.xy;
    float d = length(diff);
    float prox = smoothstep(influenceRadius, 0.0, d);
    // direction away from cursor
    vec2 dir2d = normalize(diff);
    vec3 windForce = vec3(dir2d, 0.0) * windStrength * prox;
    float f = position.y / HAIR_LENGTH;
    // apply physics + wind
    vec3 total = globalForce + windForce;
    total *= 1.0 - (sin(settleTime + settleOffset) * 0.05 * settleScale);
    total += hairPosition * centrifugalDirection * centrifugalForce;
    total *= forceFactor;
    vec3 to = normalize(baseDirection + total * f);
    vec4 q = quatFromUnitVectors(UP, to);
    transformed = rotateVector(q, transformed) + hairPosition;
  `;
}

function recursiveShader() {
  return `
    vec2 diff = hairPosition.xy - mousePos.xy;
    float d = length(diff);
    float prox = smoothstep(influenceRadius, 0.0, d);
    vec2 dir2d = normalize(diff);
    vec3 windForce = vec3(dir2d, 0.0) * windStrength * prox;
    vec3 total = globalForce + windForce;
    total *= 1.0 - (sin(settleTime + settleOffset) * 0.05 * settleScale);
    total += hairPosition * centrifugalDirection * centrifugalForce;
    total *= forceFactor;
    vec3 final = vec3(0.0);
    float f = position.y / HAIR_LENGTH;
    vec3 to = normalize(baseDirection + total * f);
    vec4 q = quatFromUnitVectors(UP, to);
    vec3 v = vec3(position.x, 0.0, position.z);
    final += rotateVector(q, v);
    for (float i = 0.0; i < HAIR_LENGTH; i += SEGMENT_STEP) {
      if (position.y <= i) break;
      float ff = i * FORCE_STEP;
      vec3 tn = normalize(baseDirection + total * ff);
      vec4 qn = quatFromUnitVectors(UP, tn);
      vec3 sv = vec3(0.0, SEGMENT_STEP, 0.0);
      final += rotateVector(qn, sv);
    }
    transformed = final + hairPosition;
  `;
}

function quatFunc() {
  return `
    vec4 quatFromUnitVectors(vec3 from, vec3 to) {
      vec3 v;
      float r = dot(from, to) + 1.0;
      if (r < 0.00001) {
        r = 0.0;
        if (abs(from.x) > abs(from.z)) { v.x = -from.y; v.y = from.x; v.z = 0.0; }
        else { v.x = 0.0; v.y = -from.z; v.z = from.y; }
      } else { v = cross(from, to); }
      return normalize(vec4(v.xyz, r));
    }
  `;
}

// -----------------------------------------------------------------------------
// React component: mount scene, sample letters, build fuzzy with proximity + wind
// -----------------------------------------------------------------------------
export default function FuzzyText() {
  const mountRef = useRef();
  useEffect(() => {
    const mount = mountRef.current;
    mount.style.position = 'absolute';
    mount.style.top = '0';
    mount.style.left = '0';
    const w = window.innerWidth;
    const h = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.01, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    renderer.shadowMap.enabled = true;
    [0x47debd, 0xfff95d].forEach((col, i) => {
      const light = new THREE.DirectionalLight(col);
      light.position.set(i ? -0.125 : 0.125, i ? -1 : 1, 0);
      scene.add(light);
    });
    scene.add(new THREE.AmbientLight(0x7821ec));

    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/Milkyway.json', font => {
      const txtGeo = new TextGeometry('S U B H A S H   P R A S A D', {
        font,
        size: 1.5,
        height: 0.2,
        curveSegments: 6
      });
      txtGeo.computeBoundingBox();
      const off = new THREE.Vector3();
      txtGeo.boundingBox.getCenter(off).negate();
      txtGeo.translate(off.x, off.y, off.z);
      const baseMesh = new THREE.Mesh(
        txtGeo,
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0x14C47E) })
      );
      scene.add(baseMesh);

      const sampler = new MeshSurfaceSampler(baseMesh).build();
      const N = 20000; // reduced for performance
      const posArr = new Float32Array(N * 3);
      const normArr = new Float32Array(N * 3);
      const p = new THREE.Vector3();
      const nVec = new THREE.Vector3();
      for (let i = 0; i < N; i++) {
        sampler.sample(p, nVec);
        posArr.set([p.x, p.y, p.z], i * 3);
        normArr.set([nVec.x, nVec.y, nVec.z], i * 3);
      }

      const fuzzy = new FuzzyMesh({
        samplePoints: { positions: posArr, normals: normArr },
        config: {},
        materialUniformValues: { roughness: 1.0 }
      });
      scene.add(fuzzy);

      // track mouse world pos at Z=0
      const dist = camera.position.z;
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const halfH = dist * Math.tan(vFOV / 2);
      const halfW = halfH * camera.aspect;
      // cache target mouse world position to avoid uniform thrashing
const mouseTarget = new THREE.Vector3();
window.addEventListener('pointermove', e => {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = -(e.clientY / window.innerHeight) * 2 + 1;
  const wx = nx * halfW;
  const wy = ny * halfH;
  mouseTarget.set(wx, wy, 0);
});

      // animate
      const animate = () => {
        requestAnimationFrame(animate);
        // update the uniform once per frame
        fuzzy.material.uniforms.mousePos.value.copy(mouseTarget);
        fuzzy.update();
        renderer.render(scene, camera);
      };
      animate();
    });

    return () => {
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, []);
  return <div ref={mountRef} id="three-container" />;
}
