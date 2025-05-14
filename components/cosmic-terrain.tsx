"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"

export default function CosmicTerrain() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 5, 15)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create terrain mesh
    const geometry = new THREE.PlaneGeometry(30, 30, 100, 100)
    geometry.rotateX(-Math.PI / 2)

    // Apply noise to the terrain
    const simplex = new SimplexNoise()
    const positions = geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]
      positions[i + 1] = simplex.noise(x * 0.1, z * 0.1) * 3
    }
    geometry.computeVertexNormals()

    // Create wireframe material with glow effect
    const material = new THREE.MeshBasicMaterial({
      color: 0xd400ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })

    const terrain = new THREE.Mesh(geometry, material)
    scene.add(terrain)

    // Add particles for the cosmic background
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 2000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xd400ff,
      transparent: true,
      opacity: 0.8,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Add fog for depth
    scene.fog = new THREE.FogExp2(0x110022, 0.035)
    renderer.setClearColor(0x000814, 1)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xd400ff, 0.5)
    scene.add(ambientLight)

    // Animation
    let frame = 0
    const animate = () => {
      requestAnimationFrame(animate)

      frame += 0.01

      // Animate terrain
      const positions = geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const x = geometry.attributes.position.getX(i / 3)
        const z = geometry.attributes.position.getZ(i / 3)
        positions[i + 1] = simplex.noise(x * 0.1 + frame * 0.05, z * 0.1) * 3
      }
      geometry.attributes.position.needsUpdate = true
      geometry.computeVertexNormals()

      // Rotate particles slightly
      particlesMesh.rotation.y += 0.0005

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
