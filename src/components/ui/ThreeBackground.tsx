'use client';

import {useEffect, useRef, useState} from 'react';

interface ThreeBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ThreeBackground({className = '', style}: ThreeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let THREE: any = null;
    let animationId: number;
    let time = 0;
    let renderer: any = null;

    const initThree = async () => {
      const threeModule = await import('three');
      THREE = threeModule;

      const canvas = canvasRef.current;
      if (!canvas || !THREE) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 50;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 2000;
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);
      const sizes = new Float32Array(particlesCount);
      const velocities = new Float32Array(particlesCount * 3);

      const color1 = new THREE.Color(0xf97316);
      const color2 = new THREE.Color(0x06b6d4);
      const color3 = new THREE.Color(0x3b82f6);

      for (let i = 0; i < particlesCount; i++) {
        const radius = 15 + Math.random() * 35;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const colorChoice = Math.random();
        let particleColor;
        if (colorChoice < 0.33) particleColor = color1;
        else if (colorChoice < 0.66) particleColor = color2;
        else particleColor = color3;

        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;

        sizes[i] = Math.random() * 2 + 0.5;

        velocities[i * 3] = (Math.random() - 0.5) * 0.002;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

      const particleMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float size;
          attribute vec3 velocity;
          varying vec3 vColor;
          uniform float uTime;
          uniform float uPixelRatio;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            pos += velocity * uTime * 100.0;
            
            pos.y += sin(uTime * 0.5 + position.x * 0.1) * 0.5;
            pos.x += cos(uTime * 0.3 + position.y * 0.1) * 0.3;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, alpha * 0.8);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uTime: {value: 0},
          uPixelRatio: {value: renderer.getPixelRatio()},
        },
      });

      const particles = new THREE.Points(particlesGeometry, particleMaterial);
      scene.add(particles);

      const shapesGroup = new THREE.Group();

      const createShape = (geometry: any, color: number, position: any, scale: number) => {
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.1,
          wireframe: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.scale.setScalar(scale);
        shapesGroup.add(mesh);
        return mesh;
      };

      const shapes: any[] = [
        createShape(new THREE.IcosahedronGeometry(3, 0), 0xf97316, new THREE.Vector3(-20, 10, -10), 1),
        createShape(new THREE.TorusGeometry(4, 1, 8, 16), 0x06b6d4, new THREE.Vector3(20, -5, -15), 1),
        createShape(new THREE.OctahedronGeometry(2.5, 0), 0x3b82f6, new THREE.Vector3(0, -15, -20), 1),
        createShape(new THREE.DodecahedronGeometry(2, 0), 0xf97316, new THREE.Vector3(-15, -10, 10), 1),
        createShape(new THREE.TetrahedronGeometry(3, 0), 0x06b6d4, new THREE.Vector3(15, 15, -5), 1),
      ];

      scene.add(shapesGroup);

      const glowGeometry = new THREE.SphereGeometry(1, 32, 32);
      const glowMaterial1 = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(uColor, intensity * 0.3);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: {
          uColor: {value: new THREE.Color(0xf97316)},
        },
        depthWrite: false,
      });

      const glowMaterial2 = glowMaterial1.clone();
      glowMaterial2.uniforms.uColor.value = new THREE.Color(0x06b6d4);

      const glow1 = new THREE.Mesh(glowGeometry, glowMaterial1);
      glow1.scale.setScalar(15);
      glow1.position.set(-15, 10, -10);
      scene.add(glow1);

      const glow2 = new THREE.Mesh(glowGeometry, glowMaterial2);
      glow2.scale.setScalar(12);
      glow2.position.set(15, -5, -15);
      scene.add(glow2);

      const mouse = new THREE.Vector2(0, 0);
      const targetRotation = new THREE.Vector2(0, 0);

      const handleMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        targetRotation.x = mouse.y * 0.1;
        targetRotation.y = mouse.x * 0.1;
      };

      window.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.016;

        particleMaterial.uniforms.uTime.value = time;

        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
        particles.rotation.z += 0.00005;

        shapes.forEach((shape, index) => {
          shape.rotation.x += 0.002 * (index + 1);
          shape.rotation.y += 0.003 * (index + 1);

          shape.position.y += Math.sin(time * 0.5 + index) * 0.01;
          shape.position.x += Math.cos(time * 0.3 + index) * 0.01;
        });

        camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.05;
        camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.05;

        const pulse = Math.sin(time * 2) * 0.5 + 0.5;
        glow1.scale.setScalar(15 + pulse * 3);
        glow2.scale.setScalar(12 + pulse * 2.5);

        renderer.render(scene, camera);
      };

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        particleMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      };

      window.addEventListener('resize', handleResize);

      setIsLoaded(true);

      animate();

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);

        particlesGeometry.dispose();
        particleMaterial.dispose();
        shapes.forEach((shape: any) => {
          shape.geometry.dispose();
          (shape.material as any).dispose();
        });
        glowGeometry.dispose();
        glowMaterial1.dispose();
        glowMaterial2.dispose();
        renderer.dispose();
      };
    };

    initThree().catch(console.error);
  }, []);

  return (
    <div aria-hidden="true" className={`fixed inset-0 z-0 ${className}`} style={style}>
      <canvas className="w-full h-full" ref={canvasRef} style={{display: 'block'}} />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-cyan-500/20" />
      )}
    </div>
  );
}
